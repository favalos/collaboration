import React, { useState, useEffect } from "react";
import styled from "styled-components";
import StyledDropdown from "@/components/styled/dropdown";

import AccountItem from "./accountItem";

const Wrapper = styled.div``;

const DropdownWrapper = styled.div`
  position: relative;
  z-index: 9;
  height: 64px;
`;

const AccountSelector = ({ accounts, onSelect = () => {} }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    onSelect(accounts[selectedIndex]);
  }, [accounts, onSelect, selectedIndex]);
  const options = accounts.map((item, index) => ({
    key: index,
    value: index,
    content: (
      <AccountItem accountName={item.name} accountAddress={item.address} />
    ),
  }));
  return (
    <Wrapper>
      <DropdownWrapper>
        <StyledDropdown
          selection
          options={options}
          onChange={(_, { value }) => {
            setSelectedIndex(value);
          }}
        />
        <AccountItem
          accountName={accounts?.[selectedIndex]?.name}
          accountAddress={accounts?.[selectedIndex]?.address}
          header
        />
      </DropdownWrapper>
    </Wrapper>
  );
};

export default AccountSelector;
