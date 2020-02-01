import React, { useState, useEffect, useRef, useContext } from "react";

// Packages
import { useDispatch } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import RangeSlider from "../RangeSlider";

// Utils
import {
  getSymbolHistory,
  getClosestMatchesFromInput,
  getTechnicalAnalysisFromSymbol
} from "../../utils/searchStocks";

import {
  timestampToUnix,
  timestampToNumberedDate
} from "../../utils/formatTime";

// Constants
import { LOAD_STATE, SEARCH_RANGE } from "../../constants";
const { loading } = LOAD_STATE;

// Redux Actions
import { dispatchLoadState } from "../../store/actions";

// Styles
import { StyledTextInput, SearchContainer, SearchForm } from "./SearchStyles";

const Search = ({
  emitChartData,
  emitJobId,
  emitSearchDetails,
  webhookUrl
}) => {
  const dispatch = useDispatch();

  const [searchSymbol, setSearchSymbol] = useState("");
  const [stockHistory, setStockHistory] = useState([]);
  const [selectedRange, setSelectedRange] = useState(SEARCH_RANGE["1m"]);
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
    dispatchLoadState(dispatch, loading);
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

    const searchRangeLabel = SEARCH_RANGE[selectedRange];
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
        options={SEARCH_RANGE}
        emitCurrentOption={setSelectedRange}
      />
    </SearchContainer>
  );
};

export default Search;
