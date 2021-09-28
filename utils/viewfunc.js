import nextApi from "../services/nextApi";
import { signApiData } from "../services/chainApi";

export async function createPost(space, title, content, contentType) {
  const signedData = await signApiData({
    space,
    title,
    content,
    contentType,
    version: "1",
  });

  return await nextApi.post(`${chain}/proposals`, signedData);
}

export async function addComment(proposalCid, content, contentType) {
  const signedData = await signApiData({
    proposalCid,
    content,
    contentType,
    version: "1",
  });

  return await nextApi.post(`${chain}/comments`, signedData);
}
