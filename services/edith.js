const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.SECRET_KEY,
});

module.exports.index = async (req, res) => {
  const data = req.body;
  const currentPosition = await getCurrentPosition();
  if (currentPosition) closeCurrentOrder(currentPosition);

  result = await placeNewOrder(data);
  console.log(result);
	res.send("OK");
};

const getCurrentPosition = async (data) => {
  console.log("check Current Order");
  const positions = await binance.futuresPositionRisk();
  const currentPositions = positions.filter((object) => object.entryPrice > 0);
  console.log(currentPositions);
  if ((currentPositions.length = 1)) return currentPositions[0];
  return false;
};

const closeCurrentOrder = async (data) => {
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
  return true;
};

const placeNewOrder = async (data) => {
  console.log("Place new order");
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
