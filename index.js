import Binance from "binance-api-node";

// kết nối Binance
const client = Binance.default({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_SECRET_KEY,
  futures: true
});

// nhận tín hiệu TradingView
app.post("/webhook", async (req, res) => {
  try {
    const { side, symbol } = req.body;

    console.log("📩 Signal:", req.body);

    if (!side || !symbol) {
      return res.status(400).send("Invalid signal");
    }

    let orderSide = side === "buy" ? "BUY" : "SELL";

    await client.futuresOrder({
      symbol: symbol.replace(".P", ""),
      side: orderSide,
      type: "MARKET",
      quantity: 1
    });

    console.log("✅ Order sent to Binance");

    res.status(200).send("Trade executed");

  } catch (err) {
    console.error("❌ Trade error:", err);
    res.status(500).send("Trade failed");
  }
});
