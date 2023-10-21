require("dotenv").config({ path: "./.env.local" });

const express = require("express");
const { login } = require("./zerodha");
const app = express();

app.use(express.json());

app.get("/login", async (req, res) => {
  const data = await login(process.env.KITE_USER_ID, process.env.KITE_PASSWORD);
  res.send(`Data : ${JSON.stringify(data)}`);
});

app.post("/twofa", async (req, res) => {
  console.log("req.body.twoFa :>> ", req.body.twoFa);
  res.send("Testing twofa");
});

app.use(express.static("public"));

app.listen(3000);

console.log("Working");

console.log("process.env.KITE_USER_ID :>> ", process.env.KITE_USER_ID);
