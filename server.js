require("dotenv").config({ path: "./.env.local" });

const express = require("express");
const cors = require("cors");
const {
  login,
  twoFaAuth,
  validateEnctoken,
  getPositions,
  getHoldings,
  getOrders,
  getHistoricalData,
  getStockDetails,
  placeOrder,
} = require("./zerodha");

const app = express();

const origins = { origin: "*" };
app.use(cors(origins));

app.use(express.json());

app.post("/login", async (req, res) => {
  const { userId, password } = req.body;
  if (userId && password) {
    try {
      const data = await login(userId, password);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else res.send("Invalid credentials.");
});

app.post("/twofa", async (req, res) => {
  const { userId, requestId, cookieFinal, twoFa } = req.body;
  if (userId && requestId && cookieFinal && twoFa) {
    try {
      const data = await twoFaAuth(userId, requestId, cookieFinal, twoFa);
      res.json(data);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else res.status(400).send("Invalid data.");
});

app.post("/validateEnctoken", async (req, res) => {
  const { enctoken } = req.body;
  if (enctoken) {
    try {
      const data = await validateEnctoken(enctoken);
      res.json(data);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else res.status(400).send("Invalid data.");
});

app.post("/positions", async (req, res) => {
  const { enctoken } = req.body;
  if (enctoken) {
    try {
      const data = await getPositions(enctoken);
      res.json(data);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else res.status(400).send("Invalid data.");
});

app.post("/holdings", async (req, res) => {
  const { enctoken } = req.body;
  if (enctoken) {
    try {
      const data = await getHoldings(enctoken);
      res.json(data);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else res.status(400).send("Invalid data.");
});

app.post("/orders", async (req, res) => {
  const { enctoken } = req.body;
  if (enctoken) {
    try {
      const data = await getOrders(enctoken);
      res.json(data);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else res.status(400).send("Invalid data.");
});

app.post("/historicalData", async (req, res) => {
  const { enctoken, stockId, fromDate, toDate } = req.body;
  if (enctoken && stockId && fromDate && toDate) {
    try {
      const data = await getHistoricalData(enctoken, stockId, fromDate, toDate);
      res.json(data);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else res.status(400).send("Invalid data.");
});

app.get("/stockDetailsFromIdOrName", async (req, res) => {
  try {
    const { stockId, stockName } = req.query;
    const stockDetails = getStockDetails(stockId, stockName);
    if (stockDetails) res.json(stockDetails);
    else res.status(404).json({ message: "Not found" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

app.post("/placeOrder", async (req, res) => {
  try {
    const data = req.body;
    const result = await placeOrder(data);
    res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

app.use(express.static("public"));

app.listen(8000);

console.log("Working");
