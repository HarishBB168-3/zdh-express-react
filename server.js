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

app.use(express.static("public"));

app.listen(8000);

console.log("Working");
