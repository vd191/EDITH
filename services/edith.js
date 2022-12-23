const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.SECRET_KEY,
});

module.exports.index = async (req, res) => {
  const data = await req.body;
  console.log(data);
  console.log(
    `RECEIVED REQUEST:${data.side} ${data.quantity} ${data.symbol} @ market price`
  );
  const currentPosition = await getCurrentPosition();

  if (currentPosition) closeCurrentOrder(currentPosition);
  await placeNewOrder({ quantity: parseInt(data.quantity), ...data });
  res.send("OK");
};

const getCurrentPosition = async () => {
  const positions = await binance.futuresPositionRisk();
  const currentPositions = positions.filter((object) => object.entryPrice > 0);
  if ((currentPositions.length = 1)) return currentPositions[0];
  return false;
};

const closeCurrentOrder = async (data) => {
  console.log(
    `CLOSING ORDER: ${data.positionAmt} ${data.symbol} @ ${data.entryPrice}`
  );
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
  console.log(result);
  console.log(
    `CLOSED ORDER: ${result.origQty} ${result.symbol} @ ${result.type}`
  );
  if ((result.length = 0)) return;
  return true;
};

const placeNewOrder = async (data) => {
  console.log(data);
  let result = false;
  if (data.side === "buy") {
    result = await binance.futuresMarketBuy(data.symbol, data.quantity);
  }
  if (data.side === "sell") {
    result = await binance.futuresMarketSell(data.symbol, data.quantity);
  }
  console.log(
    `PLACED NEW ORDER: ${result.origQty} ${result.symbol} @ ${result.type}`
  );
  return result;
};
