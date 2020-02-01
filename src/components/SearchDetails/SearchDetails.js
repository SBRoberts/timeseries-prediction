import React from "react";

// Styles
import { DetailsContainer, DetailsString } from "./SearchDetailsStyles";

const SearchDetails = props => {
  return (
    <DetailsContainer>
      {
        <DetailsString>{`Prediction for ${props.companyName} (${props.companySymbol}) from the past ${props.searchRange}`}</DetailsString>
      }
    </DetailsContainer>
  );
};

export default SearchDetails;
