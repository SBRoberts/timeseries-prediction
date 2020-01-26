import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";

import {
  getSymbolHistory,
  getClosestMatchesFromInput,
  getTechnicalAnalysisFromSymbol
} from "../utils/searchStocks";

import {
  timestampToHumanDate,
  timestampToUnix,
  timestampToNumberedDate
} from "../utils/formatTime";

import MatchedCompanies from "./DropdownList";
import RangeSlider from "./RangeSlider";
import DropdownList from "./DropdownList";

// Types
interface stockHistoryInterface {
  [index: number]: any;
}

type Props = {
  emitChartData: Function;
  emitJobId: Function;
  emitLoadState: Function;
  emitSearchDetails: Function;
  webhookUrl: string;
};

// Constants
// const webhookUrl = "https://e5da19c9.ngrok.io/forecast";
const stockHistoryRanges = {
  "1 Month": "1m",
  "3 Months": "3m",
  "6 Months": "6m"
};

// Styled Components
const StyledTextInput = styled.input.attrs(props => ({
  ref: props.ref,
  type: "text",
  list: props.list,
  placeholder: "Predict future stock prices for...",
  onChange: props.onChange,
  value: props.value
}))`
  width: 100%;
  border: none;
  border-bottom: 2px solid black;
  font-size: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  width: 100%;
`;

const SearchForm = styled.form.attrs(props => ({
  onSubmit: props.onSubmit
}))`
  display: flex;
  flex-basis: 0;
  background: #000;
  flex-grow: 2;
`;

const Search = ({
  emitChartData,
  emitJobId,
  emitLoadState,
  emitSearchDetails,
  webhookUrl
}: Props) => {
  // const [searchMatches, setSearchMatches] = useState([]);

  const [searchSymbol, setSearchSymbol] = useState("");
  const [stockHistory, setStockHistory] = useState<stockHistoryInterface[any]>(
    []
  );
  const [selectedRange, setSelectedRange] = useState("3m");
  const searchInputEl = useRef(null);
  const datalistId = "_stockDatalistId";

  useEffect(() => {
    if (stockHistory && stockHistory.length > 0) {
      const chartData = stockHistory.map(pointInTime => ({
        timestamp: timestampToNumberedDate(pointInTime.date),
        history: pointInTime.close
      }));

      const forecastPayload = JSON.stringify({
        data: stockHistory.map(pointInTime => ({
          timestamp: timestampToUnix(pointInTime.date),
          value: pointInTime.close
        })),
        callback: webhookUrl + "/forecast"
      });

      emitChartData(chartData);
      requestForecast(forecastPayload);
    }

    return () => {};
  }, [stockHistory]);

  // Filter total list of companies by name/symbol based on search input
  const changeHandler = e => {
    const { value } = e.target;
    setSearchSymbol(value);
  };

  const requestForecast = async forecastPayload => {
    const response = await axios({
      method: "post",
      url: "https://api.unplu.gg/forecast",
      headers: {
        "x-access-token":
          "c676b91f56bda95b6001d6f2da3a38d9fc222185a16f191362a1b111d524b0a1",
        "Content-Type": "application/json"
      },
      data: forecastPayload
    });
    emitJobId(response.data.job_id);
    emitLoadState("loading");
  };

  const selectCompany = company => {
    setSearchSymbol(company.symbol);
    searchInputEl.current.focus();
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const [matchedCompany] = await getClosestMatchesFromInput(searchSymbol);
    const stockHistory = await getSymbolHistory(
      selectedRange,
      matchedCompany.symbol
    );

    setSearchSymbol(matchedCompany.symbol);
    setStockHistory(stockHistory);
    const searchRangeLabel = Object.keys(stockHistoryRanges)[
      Object.values(stockHistoryRanges).indexOf(selectedRange)
    ];
    emitSearchDetails({
      companyName: matchedCompany.name,
      companySymbol: matchedCompany.symbol,
      searchRange: searchRangeLabel
    });
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={e => handleSubmit(e)}>
        <StyledTextInput
          ref={searchInputEl}
          list={datalistId}
          onChange={changeHandler}
          value={searchSymbol}
        />
      </SearchForm>
      <RangeSlider
        options={stockHistoryRanges}
        emitCurrentOption={setSelectedRange}
      />
    </SearchContainer>
  );
};

export default Search;
