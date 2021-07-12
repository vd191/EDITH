const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.SECRET_KEY,
});

module.exports.testFunction = async (req, res) => {
  console.log("test");
  const accounts = await binance.futuresBalance();
  const balance = await accounts.filter((item) => item.asset === "USDT");
  console.log(balance);
  console.log(parseInt(balance[0].balance), parseInt(balance[0].crossUnPnl));

  const profit = parseInt(balance[0].balance) + parseInt(balance[0].crossUnPnl);

  console.log(Math.round(profit));
};

module.exports.index = async (req, res) => {
  const data = await req.body;
  console.log("Signal Received", data);
  // Check any current positions
  const currentPosition = await getCurrentPosition();
  // If there are any current position then close it first.
  if (currentPosition) closeCurrentOrder(currentPosition);

  result = await placeNewOrder(data);
  console.log("DONE");
  res.send("OK");
};

const getCurrentPosition = async () => {
  console.log("Checking current position");
  const positions = await binance.futuresPositionRisk();
  const currentPositions = positions.filter((object) => object.entryPrice > 0);
  console.log(currentPositions);
  if ((currentPositions.length = 1)) return currentPositions[0];
  return false;
};

// CLOSE the current position with CORRECT POSITION AMOUNT
const closeCurrentOrder = async (data) => {
  console.log("Closing current position");
  let result = true;
  if (data.positionAmt < 0) {
    result = await binance.futuresMarketBuy(
      data.symbol,
      Math.abs(data.positionAmt)
    );
  }
  if (data.positionAmt > 0) {
    result = await binance.futuresMarketSell(data.symbol, data.positionAmt);
  }

  if ((result.length = 0)) return;
  console.log("Finished close order");
  return true;
};

const placeNewOrder = async (data) => {
  console.log("Placing new order");
  console.log(data);
  let result = false;
  if (data.side === "buy") {
    result = await binance.futuresMarketBuy(data.symbol, data.quantity);
  }
  if (data.side === "sell") {
    result = await binance.futuresMarketSell(data.symbol, data.quantity);
  }

  return result;
};
