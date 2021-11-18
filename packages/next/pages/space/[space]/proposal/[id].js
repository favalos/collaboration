import Layout from "components/layout";
import Nav from "components/nav";
import PostDetail from "@/components/postDetail/index";
import { useEncodedAddress, useSpace } from "frontedUtils/hooks";
import { SPACE_ITEMS } from "frontedUtils/constants";
import { ssrNextApi } from "services/nextApi";
import nextApi from "services/nextApi";
import { EmptyQuery } from "frontedUtils/constants";
import { to404 } from "../../../../frontedUtils/serverSideUtil";
import { encodeAddress } from "@polkadot/util-crypto";
import { useState, useEffect } from "react";

export default function Index({
  detail,
  network,
  votes,
  voteStatus,
  comments,
  defaultPage,
  myVote,
}) {
  const space = useSpace();
  const item = SPACE_ITEMS.find((item) => item.value === space);
  const [savedMyVote, setSavedMyVote] = useState(myVote);
  const encodedAddress = useEncodedAddress(network);

  useEffect(() => {
    if (encodedAddress) {
      nextApi
        .fetch(`${space}/proposals/${detail?._id}/votes/${encodedAddress}`)
        .then((result) => {
          if (result?.result) {
            if (result?.result?._id !== myVote?._id) {
              setSavedMyVote(result.result);
            }
          } else {
            setSavedMyVote(null);
          }
        })
        .catch(() => {
          setSavedMyVote(null);
        });
    }
  }, [encodedAddress, detail._id, space, myVote]);

  return (
    <Layout bgHeight="183px" network={network}>
      {item && (
        <Nav
          data={[
            { name: "Home", link: "/" },
            { name: item?.name, link: `/space/${item?.value}`, back: true },
            { name: "Proposal" },
          ]}
        />
      )}
      <PostDetail
        data={detail}
        network={network}
        votes={votes}
        voteStatus={voteStatus}
        comments={comments}
        defaultPage={defaultPage}
        myVote={savedMyVote}
      />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id, space: spaceName } = context.params;
  const { page, tab } = context.query;

  const nPage = page === "last" ? "last" : parseInt(page) || 1;
  const activeTab = tab ?? "votes";
  const pageSize = 5;

  const { result: detail } = await ssrNextApi.fetch(
    `${spaceName}/proposals/${id}`
  );

  if (!detail) {
    to404(context);
  }

  const [
    { result: network },
    { result: votes },
    { result: voteStatus },
    { result: comments },
  ] = await Promise.all([
    ssrNextApi.fetch(`spaces/${spaceName}`),
    ssrNextApi.fetch(`${spaceName}/proposals/${detail?._id}/votes`, {
      page: activeTab === "votes" ? nPage : 1,
      pageSize,
    }),
    ssrNextApi.fetch(`${spaceName}/proposals/${detail?._id}/stats`),
    ssrNextApi.fetch(`${spaceName}/proposals/${detail?._id}/comments`, {
      page: activeTab === "discussion" ? nPage : 1,
      pageSize,
    }),
  ]);

  const address = context.req.cookies.address;
  let myVote;
  if (address) {
    const encodedAddress = encodeAddress(address, network.ss58Format);
    const result = await ssrNextApi.fetch(
      `${spaceName}/proposals/${detail?._id}/votes/${encodedAddress}`
    );
    myVote = result.result ?? null;
  }

  return {
    props: {
      detail: detail ?? null,
      network: network ?? null,
      votes: votes ?? EmptyQuery,
      voteStatus: voteStatus ?? [],
      comments: comments ?? EmptyQuery,
      defaultPage: { tab: activeTab ?? null, page: nPage },
      myVote: myVote ?? null,
    },
  };
}
