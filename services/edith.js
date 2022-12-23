const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.SECRET_KEY,
});

module.exports.index = async (req, res) => {
  const data = await req.body;
  console.log("RECEIVED REQUEST: ", data);
  const currentPosition = await getCurrentPosition();

  if (currentPosition) closeCurrentOrder(currentPosition);
  await placeNewOrder(data);
  res.send("OK");
};

const getCurrentPosition = async () => {
  const positions = await binance.futuresPositionRisk();
  const currentPositions = positions.filter((object) => object.entryPrice > 0);
  if ((currentPositions.length = 1)) return currentPositions[0];
  return false;
};

const closeCurrentOrder = async (data) => {
  console.log(`CLOSING ORDER:`, data);
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
  let result = false;
  const side = data.side;
  const symbol = data.symbol;
  const quantity = data.quantity.toFixed(1);
  if (side === "buy") {
    console.log("PLACING NEW BUY ORDER", data);
    result = await binance.futuresMarketBuy(symbol, quantity);
  }
  if (data.side === "sell") {
    console.log("PLACING NEW SELL ORDER", data);
    result = await binance.futuresMarketSell(symbol, quantity);
  }
  console.log(`PLACED NEW ORDER:`, result);
  return result;
};
