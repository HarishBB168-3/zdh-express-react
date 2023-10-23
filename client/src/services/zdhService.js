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
