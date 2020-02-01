import React, { useEffect, useState } from "react";

// Packages
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import styled from "styled-components";

// Components
import Search from "../Search";
import LineChart from "../LineChart";
import SearchDetails from "../SearchDetails";
import CrystalBallLoader from "../CrystalBallLoader";

// Utils
import { timestampToNumberedDate } from "../../utils/formatTime";

// Constants
import { LOAD_STATE } from "../../constants";

// Redux Actions
import { dispatchLoadState } from "../../store/actions";

// Styles
import { Wrapper } from "./AppStyles";

export const welcomeMessage = () => {
  console.info(
    "%cspen.io%c✌️",
    `font-size: 30px; color: white; background: mediumspringgreen; padding: 10px; text-align: center; width: 100%;  line-height: 100px; padding-bottom: 5px;
    font-family: 'Bungee Shade', helvetica, sans-serif; @font-face {
      font-family: 'Bungee Shade';
      url('https://fonts.googleapis.com/css?family=Bungee+Shade') format('woff2'), /* Super Modern Browsers */
      url('https://fonts.googleapis.com/css?family=Bungee+Shade') format('woff'), /* Pretty Modern Browsers */
      url('https://fonts.googleapis.com/css?family=Bungee+Shade')  format('truetype'), /* Safari, Android, iOS */
    };`,
    "font-size: 40px; color: white; background: mediumspringgreen; padding: 10px; text-align: center; width: 100%; line-height: 95px; margin: 20px 0;"
  );
};

const socket = io.connect("http://localhost:5000/");

socket.on("connection", data => {
  console.log("connection", data);
});

const App = () => {
  const dispatch = useDispatch();
  const loadState = useSelector(state => state.loadState, shallowEqual);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [currentSearchId, setCurrentSearchId] = useState("");
  const [chartStockData, setChartStockData] = useState([]);
  const [searchDetails, setSearchDetails] = useState({
    companyName: "",
    companySymbol: "",
    searchRange: ""
  });

  useEffect(() => {
    welcomeMessage();
    socket.on("connection", data => {
      console.log("connection", data);
      setWebhookUrl(data.url);
    });
  }, []);

  useEffect(() => {
    socket.on("forecast", parseForecast);
    return () => {
      socket.off("forecast");
    };
  }, [currentSearchId, chartStockData]);

  const parseForecast = data => {
    if (data && !data.error && currentSearchId === data.job_id) {
      const formattedForecast = data.forecast.map(({ timestamp, value }) => ({
        forecast: value,
        timestamp: timestampToNumberedDate(timestamp * 1000)
      }));
      setChartStockData([...chartStockData, ...formattedForecast]);
      dispatchLoadState(dispatch, LOAD_STATE.loaded);
    }
  };

  return (
    <Wrapper>
      <Search
        emitChartData={setChartStockData}
        emitJobId={setCurrentSearchId}
        emitSearchDetails={setSearchDetails}
        webhookUrl={webhookUrl}
      />
      <CrystalBallLoader />
      {chartStockData.length > 0 && (
        <>
          <SearchDetails
            companyName={searchDetails.companyName}
            companySymbol={searchDetails.companySymbol}
            searchRange={searchDetails.searchRange}
          ></SearchDetails>
          <LineChart chartData={chartStockData}></LineChart>
        </>
      )}
    </Wrapper>
  );
};

export default App;
