import React from "react";
import styled from "styled-components";

interface Props {
  companyName: string;
  companySymbol: string;
  searchRange: string;
}

const DetailsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const DetailsString = styled.span`
  font-size: 20px;
  margin: 0;
`;

const SearchDetails = (props: Props) => {
  return (
    <DetailsContainer>
      {
        <DetailsString>{`Prediction for ${props.companyName} (${props.companySymbol}) from the past ${props.searchRange}`}</DetailsString>
      }
    </DetailsContainer>
  );
};

export default SearchDetails;
