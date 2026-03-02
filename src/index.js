import express from "express";
import Binance from "binance-api-node";

const app = express();
app.use(express.json());

// test homepage
app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

// kết nối Binance Futures
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

    const cleanSymbol = symbol.replace(".P", "");

    // ===== MỞ LONG =====
    if (side === "buy") {
      await client.futuresOrder({
        symbol: cleanSymbol,
        side: "BUY",
        type: "MARKET",
        quantity: 1
      });

      console.log("🟢 LONG opened");
    }

    // ===== ĐÓNG FULL LONG =====
    if (side === "sell") {

      const positions = await client.futuresPositionRisk();

      const position = positions.find(p => 
        p.symbol === cleanSymbol && Number(p.positionAmt) > 0
      );

      if (!position) {
        console.log("⚠️ No LONG position to close");
        return res.status(200).send("No position");
      }

      const qty = Math.abs(Number(position.positionAmt));

      await client.futuresOrder({
        symbol: cleanSymbol,
        side: "SELL",
        type: "MARKET",
        quantity: qty,
        reduceOnly: true
      });

      console.log("🔴 FULL LONG closed:", qty);
    }

    res.status(200).send("Trade executed");

  } catch (err) {
    console.error("❌ Trade error:", err);
    res.status(500).send("Trade failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
