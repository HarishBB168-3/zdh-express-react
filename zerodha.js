const axios = require("./persistentClient")();
const prompt = require("prompt-sync")({ sigint: true });

const url = "https://kite.zerodha.com/api/login";
const url2 = "https://kite.zerodha.com/api/twofa";

const kf_session = "SrDHp5lRWf7zy04TlDsUoK5bEW2FJmpE";
const public_token = "2PIKAvBdu4EvyAZKC4dkm17ab6rm4bam";
const cfduid = "dcf1eb2de63cedaec00a3abda0a3c72ba1584067336";

const userId = process.env.KITE_USER_ID;
const password = process.env.KITE_PASSWORD;

const cookieIn =
  "__cfduid=dcf1eb2de63cedaec00a3abda0a3c72ba1584067336; " +
  "_ga=GA1.2.1692021908.1584287645; " +
  "enctoken=0RoU4gI/E0/hB+VhA391BpSWPJ+LtZ7ynhSdN9pkI9mRSVKblisVu2p6CjIyzdOMRCnQBuQ8eMwj5FXSWAxBPYTl5b9QYg==;";

const headers = {
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
};

const headers2 = {
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
};

const login = async () => {
  const encodedPass = encodeURIComponent(password);
  const payload = `user_id=${userId}&password=${encodedPass}`;

  const {
    data,
    status,
    headers: mHeaders,
  } = await axios.post(url, payload, {
    headers,
  });

  if (status !== 200) {
    console.log("Unknown error with status : ", status);
    return;
  }

  const requestId = data.data.request_id;
  const cookie = mHeaders["set-cookie"][0].split(" ")[0];
  const cookieFinal = cookieIn + " " + cookie;
  return { requestId, cookieFinal };
};

const twoFa = async (requestId, twoFa, cookieFinal) => {
  const twofa_encoded = encodeURIComponent(twoFa);
  headers2["Cookie"] = cookieFinal;
  const data2 = `user_id=${userId}&request_id=${requestId}"&twofa_value=${twofa_encoded}`;

  const { data: rData2 } = await axios.post(url2, data2, {
    headers2,
  });

  console.log("rData2 :>> ", rData2);
};

module.exports = {
  login,
  twoFa,
};
