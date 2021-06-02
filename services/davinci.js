const axios = require("axios");
const moment = require("moment");
const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.SECRET_KEY,
});

module.exports.reportBalance = async (req, res) => {
  const teleUsername = "edithbynvd";
  const date = moment().format("Do MMMM YYYY");
  const accounts = await binance.futuresBalance();
  const balance = await accounts.filter((item) => item.asset === "USDT");
  const message = `${date}: $${Math.round(balance[0].availableBalance)}`;
  console.log(message);
  const url = `https://api.telegram.org/bot${process.env.TELE_TOKEN}/sendMessage?chat_id=@${teleUsername}&text=${message}`;
  await axios.get(url);
};
