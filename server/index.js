const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

// REPLACE WITH YOUR API SECRET KEY HERE
const API_SECRET_KEY = "64d5051c-43cd-4d4e-9298-03bf76868f80";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Take authorization code and exchange for permanent user token
app.post("/api/user-token", async function (req, res) {
  const response = await axios({
    method: "POST",
    url: "https://connect.inloop.to/api/v1/oauth/token",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_SECRET_KEY}`,
    },
    data: {
      code: req.body.code,
    },
  });
  return res.status(200).json(response.data);
});

// Fetch the list of ERC-20 tokens or NFTs for a user
app.post("/api/list-tokens", async function (req, res) {
  const response = await axios({
    method: "GET",
    url: `https://connect.inloop.to/api/v1/users/${req.body.user_token}/tokens`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_SECRET_KEY}`,
    },
  });
  return res.status(200).json(response.data);
});
