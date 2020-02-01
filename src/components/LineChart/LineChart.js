import React, { useState, useLayoutEffect } from "react";

import {
  LineChart as ReLineChart,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

import COLORS from "../../utils/colors";

import { ChartContainer } from "./LineChartStyles";

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export default function LineChart({ chartData }) {
  const [width, height] = useWindowSize();

  const baseTextStyle = {
    fontSize: 14
  };

  const tickStyle = {
    ...baseTextStyle,
    stroke: COLORS.fontGrey,
    strokeWidth: 0
  };

  const tooltipLabelStyle = {
    ...baseTextStyle,
    fontSize: 18
  };
  const tooltipContentStyle = {
    ...baseTextStyle,
    fontSize: 18
  };

  const formatTooltip = (value, name, props) => {
    const formattedValue = Math.round(value * 100) / 100;
    const formattedName =
      name === "history" ? "Historic Price" : "Predicted Price";
    return [formattedValue, formattedName];
  };

  return (
    <ChartContainer>
      <ResponsiveContainer
        width="100%"
        height={500}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <ReLineChart data={chartData}>
          <XAxis dataKey="timestamp" tick={tickStyle} />
          <YAxis tick={tickStyle} />
          <Tooltip
            label="Price"
            labelStyle={tooltipLabelStyle}
            contentStyle={tooltipContentStyle}
            formatter={formatTooltip}
          />
          <Line
            type="monotone"
            strokeWidth={4}
            dot={false}
            dataKey="history"
            stroke={COLORS.chartPink}
          />
          <Line
            type="monotone"
            strokeWidth={4}
            dot={false}
            dataKey="forecast"
            stroke={COLORS.chartBlue}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
