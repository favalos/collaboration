import styled from "styled-components";

import Space from "./space";
import PostList from "./postList";
import { POST_ITEMS } from "utils/constants";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 40px;
  }
`;

export default function Home({ spaces }) {
  return (
    <Wrapper>
      <Space spaces={spaces} />
      <PostList title="Hotest Proposals" posts={POST_ITEMS} />
    </Wrapper>
  );
}
