const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.SECRET_KEY,
});

module.exports.balance = async (req, res) => {
  const accounts = await binance.futuresBalance();
  const balance = await accounts.filter((item) => item.asset === "USDT");
  console.log(balance);
  console.log(parseInt(balance[0].balance), parseInt(balance[0].crossUnPnl));

  const profit = parseInt(balance[0].balance) + parseInt(balance[0].crossUnPnl);

  const result = Math.round(profit);
  res.send(`result ${result}`);
};

module.exports.positions = async (req, res) => {
  const positions = await binance.futuresPositionRisk();
  const currentPositions = positions.filter((object) => object.entryPrice > 0);
  if ((currentPositions.length = 1)) {
    console.log(currentPositions[0]);
  }
};
