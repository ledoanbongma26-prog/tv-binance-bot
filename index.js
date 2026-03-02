import express from "express";

const app = express();
app.use(express.json());

// test homepage
app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

// 👇 QUAN TRỌNG - nhận webhook từ TradingView
app.post("/webhook", (req, res) => {
  console.log("📩 Received signal:", req.body);
  res.status(200).send("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
