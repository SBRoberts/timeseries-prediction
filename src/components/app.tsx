import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import Search from "./Search";
import LineChart from "./LineChart";
import SearchDetails from "./SearchDetails";
import CrystalBallLoader, { loadStateTypes } from "./CrystalBallLoader";

import { timestampToNumberedDate } from "../utils/formatTime";

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

socket.on("connection", (data: any) => {
  console.log("connection", data);
});

const Wrapper = styled.div`
  width: 90vw;
  margin: 0 auto;
`;

const App = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [currentSearchId, setCurrentSearchId] = useState("");
  const [chartStockData, setChartStockData] = useState([]);
  const [loadState, setLoadState] = useState<loadStateTypes>("idle");
  const [searchDetails, setSearchDetails] = useState({
    companyName: "",
    companySymbol: "",
    searchRange: ""
  });

  useEffect(() => {
    welcomeMessage();
  }, []);

  useEffect(() => {
    socket.on("forecast", parseForecast);
    socket.on("connection", (data: any) => {
      console.log("connection", data);
      setWebhookUrl(data.url);
    });
    return () => {
      socket.off("forecast");
      socket.off("connection");
    };
  }, [currentSearchId, chartStockData]);

  const parseForecast = (data: any) => {
    if (data && !data.error && currentSearchId === data.job_id) {
      const formattedForecast = data.forecast.map(({ timestamp, value }) => ({
        forecast: value,
        timestamp: timestampToNumberedDate(timestamp * 1000)
      }));
      setChartStockData([...chartStockData, ...formattedForecast]);
      setLoadState("loaded");
    }
  };

  return (
    <Wrapper>
      <Search
        emitChartData={setChartStockData}
        emitJobId={setCurrentSearchId}
        emitLoadState={setLoadState}
        emitSearchDetails={setSearchDetails}
        webhookUrl={webhookUrl}
      />
      <CrystalBallLoader loadState={loadState} emitLoadState={setLoadState} />
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
