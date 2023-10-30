import http from "./httpService";

export const login = async (userId, password) => {
  const result = await http.post("/login", { userId, password });
  return result.data;
};

export const twoFaAuth = async (userId, requestId, cookieFinal, twoFa) => {
  const result = await http.post("/twofa", {
    userId,
    requestId,
    cookieFinal,
    twoFa,
  });
  return result.data.enctoken;
};

export const validateEnctoken = async (enctoken) => {
  const result = await http.post("/validateEnctoken", {
    enctoken,
  });
  return result.data;
};

export const getPositions = async (enctoken) => {
  const result = await http.post("/positions", {
    enctoken,
  });
  return result.data;
};

export const getHoldings = async (enctoken) => {
  const result = await http.post("/holdings", {
    enctoken,
  });
  return result.data;
};

export const getOrders = async (enctoken) => {
  const { data } = await http.post("/orders", {
    enctoken,
  });
  return data;
};

export const getStockIdFromName = async (stockName) => {
  try {
    const { data } = await http.get("/stockDetailsFromIdOrName", {
      params: {
        stockName,
      },
    });
    return data.stock_id;
  } catch (err) {
    throw new Error(`Error in getting stockId for id : `, err.message);
  }
};

const getTodaysDate = () => {
  let today = new Date();
  const offset = today.getTimezoneOffset();
  today = new Date(today.getTime() - offset * 60 * 1000);
  return today.toISOString().split("T")[0];
};

export const getLatestPriceForStockName = async (enctoken, stockName) => {
  try {
    const stockId = await getStockIdFromName(stockName);
    const today = getTodaysDate();
    const { data } = await http.post("/historicalData", {
      enctoken,
      stockId,
      fromDate: today,
      toDate: today,
    });
    if (data.data) {
      const candles = data.data.candles;
      const latestDataPoint = candles[candles.length - 1];
      const closePrice = latestDataPoint[4];
      return closePrice;
    } else {
      return -1;
    }
  } catch (err) {
    return -1;
  }
};
