import express from "express";

const app = express();
app.use(express.json());

// test homepage
app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

// nhận webhook từ TradingView
app.post("/webhook", (req, res) => {
  console.log("🔥 Webhook received!");
  console.log("Body:", JSON.stringify(req.body, null, 2));

  res.status(200).json({
    status: "received",
    data: req.body
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
