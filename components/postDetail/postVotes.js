import styled from "styled-components";

import Author from "components/author";
import Pagination from "components/pagination";
import { bigNumber2Locale, fromAssetUnit } from "utils";
import ExternalLink from "components/externalLink";
import Ellipsis from "@/components/ellipsis";
import Flex from "@/components/flex";

const Item = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #f0f3f8;
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  line-height: 24px;
`;

const Label = styled.span`
  color: #a1a8b3;
  margin-right: 8px;
`;

const ContentWrapper = styled.div`
  padding: 8px 0 0 28px;
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const Content = styled.div`
  line-height: 24px;
`;

const PaginationWrapper = styled.div`
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BalanceWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const Square = styled.div`
  cursor: pointer;
  width: 20px;
  height: 20px;
  background: url("/imgs/icons/ipfs.svg");
  :hover {
    background: url("/imgs/icons/ipfs-active.svg");
  }
`;

const EqualWrapper = styled.div`
  display: flex;
  flex: 1 1 33.3%;
  max-width: 50%;
  :last-child {
    justify-content: flex-end;
  }
`;

const NoVoteWrapper = styled.div`
  display: flex;
  height: 104px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 24px;
  color: #c0c8d5;
  border-bottom: 1px solid #f0f3f8;
`;

export default function PostVotes({ network, votes }) {
  return (
    <div>
      {(votes?.items || []).map((item, index) => (
        <Item key={index}>
          <InfoWrapper>
            <EqualWrapper>
              <Author address={item.address} size={20} />
            </EqualWrapper>
            <EqualWrapper style={{justifyContent: "center"}}>
              <Flex style={{maxWidth: "50%"}}>
                <Label>Vote</Label>
                <Ellipsis>{item.choice}</Ellipsis>
              </Flex>
            </EqualWrapper>
            <EqualWrapper>
              <BalanceWrapper>
                <div>{`${bigNumber2Locale(
                  fromAssetUnit(
                    item.weights?.balanceOf.$numberDecimal,
                    network?.decimals
                  )
                )} ${network?.symbol}`}</div>
                {item?.pinHash && (
                  <ExternalLink
                    href={`https://ipfs-hk.decoo.io/ipfs/${item.pinHash}`}
                  >
                    <Square />
                  </ExternalLink>
                )}
              </BalanceWrapper>
            </EqualWrapper>
          </InfoWrapper>
          {item.remark && (
            <ContentWrapper>
              <Content>{item.remark}</Content>
            </ContentWrapper>
          )}
        </Item>
      ))}
      {!votes?.items?.length > 0 && (
        <NoVoteWrapper>No current votes</NoVoteWrapper>
      )}
      <PaginationWrapper>
        <Pagination
          page={votes.page}
          total={votes.total}
          pageSize={votes.pageSize}
        />
      </PaginationWrapper>
    </div>
  );
}
