const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.SECRET_KEY,
});

module.exports.index = async (req, res) => {
  const { symbol, quantity, side, price, message } = req.body;
  console.log("Signal Received");
  console.log(symbol, quantity, side, price, message);
  const currentPosition = await getCurrentPosition();
  if (currentPosition) closeCurrentOrder(currentPosition);

  result = await placeNewOrder(symbol, side, quantity);
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

const placeNewOrder = async (symbol, side, quantity) => {
  console.log("Placing new order");
  console.log(symbol, side, quantity);
  let result = false;
  if (side === "buy") {
    result = await binance.futuresMarketBuy(symbol, quantity);
  }
  if (side === "sell") {
    result = await binance.futuresMarketSell(symbol, quantity);
  }

  return result;
};
