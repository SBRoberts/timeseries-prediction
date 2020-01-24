import axios from "axios";

const iexBase = "https://cloud.iexapis.com/v1";
const iexPublicKey = "pk_5f23b767a4374ec393a736d3f05fe351";

const alphavantageKey = "DG54ZMLI7P5LGR24";

// export const fetchEntireCompanyList = async setCompanyList => {
//   try {
//     const fetchedCompanyListResponse = await axios.get(
//       `${iexBase}/ref-data/symbols/?token=${iexPublicKey}`
//     );
//     setCompanyList(fetchedCompanyListResponse.data);
//   } catch (error) {
//     console.error(error);
//   }
// };

const formatAlphaVantageArray = objectArray => {
  return objectArray.map(object => {
    const tempObj = {};
    for (const key in object) {
      const newKey = key.replace(/[0-9]\./, "").trim();
      tempObj[newKey] = object[key];
    }
    return tempObj;
  });
};

export const getClosestMatchesFromInput = async keyword => {
  try {
    const {
      data: { bestMatches }
    } = await axios.get(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=DG54ZMLI7P5LGR24`
    );
    const matches = formatAlphaVantageArray(await bestMatches);
    return matches;
  } catch (error) {
    console.error(error);
  }
};

export const getTechnicalAnalysisFromSymbol = async (
  symbol,
  indicatorType = "WMA"
) => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=${indicatorType}&symbol=${symbol}&interval=weekly&time_period=4&series_type=close&apikey=DG54ZMLI7P5LGR24`
    );

    if (response.data.Note) return new Error(response.data.Note);

    const emaData = response.data[`Technical Analysis: ${indicatorType}`];

    const forecastPayload = [];
    for (const date in emaData) {
      forecastPayload.unshift({
        timestamp: Date.parse(date) / 1000,
        value: parseFloat(emaData[date][indicatorType])
      });
    }
    return forecastPayload;
  } catch (error) {
    console.error(error);
  }
};

export const symbolHistoryGetRequest = (symbol, range) => {
  return axios.get(
    `${iexBase}/stock/${symbol}/chart/${range}/?token=${iexPublicKey}`
  );
};

// Get Historical stock prices, given a symbol
export const getSymbolHistory = async (selectedRange, currentSearch) => {
  try {
    const { data } = await symbolHistoryGetRequest(
      currentSearch,
      selectedRange
    );
    return data;
  } catch (error) {
    console.warn(`Whoops! No stock found for the ticker: ${currentSearch}.`);
  }
};
