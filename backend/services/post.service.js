const { ObjectId } = require("mongodb");
const { safeHtml } = require("../utils/post");
const { PostTitleLengthLimitation } = require("../constants");
const { nextPostUid } = require("./status.service");
const {
  getProposalCollection,
  getVoteCollection,
  getCommentCollection,
  getDb,
} = require("../mongo");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");

async function createProposal(
  space,
  title,
  content,
  contentType,
  choiceType,
  choices,
  startDate,
  endDate,
  snapshotHeight,
  data,
  address,
  signature,
  cid,
  pinHash,
) {
  if (title.length > PostTitleLengthLimitation) {
    throw new HttpError(400, {
      title: [ "Title must be no more than %d characters" ],
    });
  }

  const postUid = await nextPostUid();

  const now = new Date();

  const proposalCol = await getProposalCollection();
  const result = await proposalCol.insertOne(
    {
      space,
      postUid,
      title,
      content: contentType === ContentType.Html ? safeHtml(content) : content,
      contentType,
      choiceType,
      choices,
      startDate,
      endDate,
      snapshotHeight,
      data,
      address,
      signature,
      lastActivityAt: new Date(),
      createdAt: now,
      updatedAt: now,
      cid,
      pinHash,
    }
  );

  if (!result.result.ok) {
    throw new HttpError(500, "Failed to create post");
  }

  return postUid;
}

async function getProposalBySpace(space, page, pageSize) {
  const proposalCol = await getProposalCollection();
  const total = await proposalCol.countDocuments();

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const proposals = await proposalCol.find({ space })
    .sort({ lastActivityAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const db = await getDb();
  await Promise.all([
    db.lookupCount({
      from: "comment",
      for: proposals,
      as: "commentsCount",
      localField: "_id",
      foreignField: "post",
    }),
  ]);

  return {
    items: proposals,
    total,
    page,
    pageSize,
  };
}

async function getProposalById(proposalId) {
  const q = {};
  if (ObjectId.isValid(proposalId)) {
    q._id = ObjectId(proposalId);
  } else {
    q.postUid = proposalId;
  }

  const proposalCol = await getProposalCollection();
  const proposal = await proposalCol.findOne(q);

  if (!proposal) {
    throw new HttpError(404, "Post not found");
  }

  return proposal;
}

async function postComment(
  proposalCid,
  content,
  contentType,
  data,
  address,
  signature,
  cid,
  pinHash,
) {
  const proposalCol = await getProposalCollection();
  const proposal = await proposalCol.findOne({ cid: proposalCid });
  if (!proposal) {
    throw new HttpError(400, "Proposal not found.");
  }

  const commentCol = await getCommentCollection();
  const height = await commentCol.countDocuments({ proposal: proposal._id });

  const now = new Date();

  const newComment = {
    proposal: proposal._id,
    content: contentType === ContentType.Html ? safeHtml(content) : content,
    contentType,
    data,
    address,
    signature,
    height: height + 1,
    createdAt: now,
    updatedAt: now,
    cid,
    pinHash,
  };
  const result = await commentCol.insertOne(newComment);

  if (!result.result.ok) {
    throw new HttpError(500, "Failed to create comment");
  }

  const newCommentId = result.ops[0]._id;

  const updateResult = await proposalCol.updateOne(
    { cid: proposalCid },
    {
      $set: {
        lastActivityAt: new Date()
      }
    },
  );

  if (!updateResult.result.ok) {
    throw new HttpError(500, "Unable to update proposal last activity time");
  }

  return newCommentId;
}

async function getComments(proposalId, page, pageSize) {
  const q = { proposal: ObjectId(proposalId) };

  const commentCol = await getCommentCollection();
  const total = await commentCol.count(q);

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const comments = await commentCol.find(q)
    .sort({ createdAt: 1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  return {
    items: comments,
    total,
    page,
    pageSize,
  };
}

async function vote(
  proposalCid,
  choice,
  data,
  address,
  signature,
  cid,
  pinHash,
) {
  const proposalCol = await getProposalCollection();
  const proposal = await proposalCol.findOne({ cid: proposalCid });
  if (!proposal) {
    throw new HttpError(400, "Proposal not found.");
  }

  const voteCol = await getVoteCollection();
  const height = await voteCol.countDocuments({ proposal: proposal._id });

  const now = new Date();

  const newVote = {
    proposal: proposal._id,
    choice,
    data,
    address,
    signature,
    height: height + 1,
    createdAt: now,
    updatedAt: now,
    cid,
    pinHash,
  };
  const result = await voteCol.insertOne(newVote);

  if (!result.result.ok) {
    throw new HttpError(500, "Failed to create comment");
  }

  const newVoteId = result.ops[0]._id;

  const updateResult = await proposalCol.updateOne(
    { cid: proposalCid },
    {
      $set: {
        lastActivityAt: new Date()
      }
    },
  );

  if (!updateResult.result.ok) {
    throw new HttpError(500, "Unable to update proposal last activity time");
  }

  return newVoteId;
}

module.exports = {
  createProposal,
  getProposalBySpace,
  getProposalById,
  postComment,
  getComments,
  vote,
};
