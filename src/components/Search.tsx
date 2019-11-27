import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import MatchedCompanies from "./MatchedCompanies";
import RequestControls from "./RequestControls";
import RangeSlider from "./RangeSlider";

const stockHistoryRanges = {
  "3 Months": "3m",
  "6 Months": "6m",
  "Year to Date": "YTD",
  "1 Years": "1y",
  "2 Years": "2y",
  "5 Years": "5y"
};

const Search = () => {
  const [companyList, setCompanyList] = useState(null);
  const [searchMatches, setSearchMatches] = useState([]);
  const [currentSearch, setCurrentSearch] = useState([]);
  const [stockHistory, setStockHistory] = useState(null);
  const [timeseriesData, setTimeseriesData] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const searchInputEl = useRef(null);

  // Base IEX Stock API config variables - public facing
  const iexBase = "https://cloud.iexapis.com/v1";
  const iexPublicKey = "pk_5f23b767a4374ec393a736d3f05fe351";

  const webhookUrl = "https://835fc26c.ngrok.io/forecast";

  // Fetch full list of available companies on mount
  useEffect(() => {
    const fetchCompanyList = async () => {
      try {
        const fetchedCompanyListResponse = await axios.get(
          `${iexBase}/ref-data/symbols/?token=${iexPublicKey}`
        );
        if (fetchedCompanyListResponse.status !== 200) {
          throw Error("no bueno");
        }

        setCompanyList(fetchedCompanyListResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompanyList();
  }, []);

  useEffect(() => {
    if (!!stockHistory) {
      const formattedTimeseries = JSON.stringify({
        data: stockHistory.data.map(pointInTime => ({
          timestamp: timestampToUnix(pointInTime.date),
          value: pointInTime.close
        })),
        callback: webhookUrl
      });
      setTimeseriesData(formattedTimeseries);
      requestForecast(formattedTimeseries);
    }
  }, [stockHistory]);

  const timestampToUnix = (timestamp: string) =>
    parseInt((new Date(timestamp).getTime() / 1000).toFixed(0));

  // Filter total list of companies by name/symbol based on search input
  const changeHandler = e => {
    const { value } = e.target;
    const formattedValue = value.toLowerCase();

    const matches = companyList.filter(
      company =>
        company.name.toLowerCase().includes(formattedValue) ||
        company.symbol.toLowerCase().includes(formattedValue)
    );

    setCurrentSearch(formattedValue);
    setSearchMatches(matches.slice(0, 10));
  };

  const symbolHistoryGetRequest = (symbol, range) => {
    return axios.get(
      `${iexBase}/stock/${symbol}/chart/${range}/?token=${iexPublicKey}`
    );
  };

  // Get Historical stock prices, given a symbol
  const getSymbolHistory = async e => {
    e.preventDefault();
    try {
      console.log("selectedRange", selectedRange);
      const response = await symbolHistoryGetRequest(
        currentSearch,
        selectedRange
      );
      setStockHistory(response);
    } catch (error) {
      !!searchMatches && retrySymbolHistory(searchMatches[0]);
      console.error(error);
    }
  };

  const retrySymbolHistory = async firstMatch => {
    try {
      setCurrentSearch(firstMatch.symbol);
      const response = await symbolHistoryGetRequest(currentSearch, "2y");
      setStockHistory(response);
    } catch (error) {
      console.error(error);
    }
  };

  const requestForecast = async data => {
    const response = await axios({
      method: "post",
      url: "https://api.unplu.gg/forecast",
      headers: {
        "x-access-token":
          "c676b91f56bda95b6001d6f2da3a38d9fc222185a16f191362a1b111d524b0a1",
        "Content-Type": "application/json"
      },
      data
    });
    return response;
  };

  // Select company from <MatchedCompanies /> and set it as the current search.
  const selectCompany = company => {
    setCurrentSearch(company.symbol);
    searchInputEl.current.focus();
  };

  return (
    <>
      <RequestControls>
        <RangeSlider
          options={stockHistoryRanges}
          emitCurrentOption={setSelectedRange}
        />
      </RequestControls>
      <form onSubmit={getSymbolHistory}>
        <input
          ref={searchInputEl}
          type="text"
          placeholder="search your shit"
          onChange={changeHandler}
          value={currentSearch}
        />
      </form>
      <MatchedCompanies matches={searchMatches} selectCompany={selectCompany} />
    </>
  );
};

export default Search;
