// const axios = require("./persistentClient")();

const axios = require("axios").default;
const stockNameIdData = require("./zerodhaStockNameAndId.json");

const urlLogin = "https://kite.zerodha.com/api/login";
const urlTwoFa = "https://kite.zerodha.com/api/twofa";
const urlFullUserData = "https://kite.zerodha.com/oms/user/profile/full";
const urlPositions = "https://kite.zerodha.com/oms/portfolio/positions";
const urlHoldings = "https://kite.zerodha.com/oms/portfolio/holdings";
const urlOrders = "https://kite.zerodha.com/oms/orders";
const getUrlHistoricalData = (stockId, fromDate, toDate) =>
  `https://kite.zerodha.com/oms/instruments/historical/${stockId}/3minute?from=${fromDate}&to=${toDate}`;

const kf_session = "SrDHp5lRWf7zy04TlDsUoK5bEW2FJmpE";
const public_token = "2PIKAvBdu4EvyAZKC4dkm17ab6rm4bam";
const cfduid = "dcf1eb2de63cedaec00a3abda0a3c72ba1584067336";

const cookieIn =
  "__cfduid=dcf1eb2de63cedaec00a3abda0a3c72ba1584067336; " +
  "_ga=GA1.2.1692021908.1584287645; " +
  "enctoken=0RoU4gI/E0/hB+VhA391BpSWPJ+LtZ7ynhSdN9pkI9mRSVKblisVu2p6CjIyzdOMRCnQBuQ8eMwj5FXSWAxBPYTl5b9QYg==;";

const getHeaders = (userId) => ({
  accept: "application/json, text/plain, */*",
  "accept-encoding": "gzip, deflate",
  "accept-language": "en-US,en;q=0.9",
  "cache-control": "no-cache",
  "content-length": "37",
  "content-type": "application/x-www-form-urlencoded",
  cookie:
    "__cfduid=d909caa86fd8b81755e24b7d4d5c1c2a61586710268; _ga=GA1.2.1692021908.1584287645",
  origin: "https",
  pragma: "no-cache",
  referer: "https",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36",
  "x-csrftoken": "mguZxC0ENJ89bitPRxK5LvLGnNIOkMhZ",
  "x-kite-userid": userId,
  "x-kite-version": "2.4.0",
});

const getHeaders2 = (userId) => ({
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/x-www-form-urlencoded",
  Origin: "https",
  Referer: "https",
  "Sec-Fetch-Mode": "cors",
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36",
  "X-CSRFTOKEN": "3bUSqm6zkWCDWUZX1Col9LjGqZw4x3V8",
  "X-Kite-Userid": userId,
  "X-Kite-Version": "2.4.0",
  Cookie: cookieIn,
});

const login = async (userId, password) => {
  const encodedPass = encodeURIComponent(password);
  const payload = `user_id=${userId}&password=${encodedPass}`;

  const headers = getHeaders(userId);
  try {
    const {
      data,
      status,
      headers: newHeaders,
    } = await axios.post(urlLogin, payload, {
      headers,
    });

    console.log("data, status :>> ", data, status);

    if (status !== 200) {
      console.log("Unknown error with status : ", status);
      return { error: "Unknown error occured in login" };
    }

    const requestId = data.data.request_id;

    // Getting kf_session part from cookie
    const cookie = newHeaders["set-cookie"][0].split(" ")[0];
    const cookieFinal = cookieIn + " " + cookie;
    return { requestId, cookieFinal };
  } catch (err) {
    return { error: err.message };
  }
};

const getEnctokenFromCookie = (cookies) => {
  const newCookie = cookies.join("; ").split("; ");
  const enctoken = newCookie
    .find((item) => item.includes("enctoken"))
    ?.replace("enctoken=", "");
  return enctoken;
};

const twoFaAuth = async (userId, requestId, cookieFinal, twoFa) => {
  const twofa_encoded = encodeURIComponent(twoFa);
  const h = getHeaders2(userId);
  h["Cookie"] = cookieFinal;
  const data = `user_id=${userId}&request_id=${requestId}&twofa_value=${twofa_encoded}`;

  try {
    const { data: recData, headers: newHeaders } = await axios.post(
      urlTwoFa,
      data,
      {
        headers: h,
      }
    );
    // console.log("recData :>> ", recData);
    // console.log("newHeaders :>> ", newHeaders);
    const cookie = newHeaders["set-cookie"];
    // console.log("cookie :>> ", cookie);
    const enctoken = getEnctokenFromCookie(cookie);
    return { enctoken };
  } catch (err) {
    console.log("err.message : ", err.message);
    return { message: "Error in twoFaAuth" };
  }
};

const validateEnctoken = async (enctoken) => {
  try {
    const { data } = await axios.get(urlFullUserData, {
      headers: {
        Authorization: `enctoken ${enctoken}`,
      },
    });
    return data;
  } catch (err) {
    return { message: err.message };
  }
};

const _baseCall = async (enctoken, url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `enctoken ${enctoken}`,
      },
    });
    return data;
  } catch (err) {
    return { message: err.message };
  }
};

const getPositions = async (enctoken) => {
  return _baseCall(enctoken, urlPositions);
};

const getHoldings = async (enctoken) => {
  return _baseCall(enctoken, urlHoldings);
};

const getOrders = async (enctoken) => {
  return _baseCall(enctoken, urlOrders);
};

const getHistoricalData = async (enctoken, stockId, fromDate, toDate) => {
  const url = getUrlHistoricalData(stockId, fromDate, toDate);
  return _baseCall(enctoken, url);
};

const getStockDetails = (stockId = null, stockName = null) => {
  if (stockId == null && stockName == null)
    throw new Error("Atleast one argument is required.");
  return stockNameIdData.find(
    (item) => item.stock_id == stockId || item.stock_name == stockName
  );
};

module.exports = {
  login,
  twoFaAuth,
  validateEnctoken,
  getPositions,
  getHoldings,
  getOrders,
  getHistoricalData,
  getStockDetails,
};
