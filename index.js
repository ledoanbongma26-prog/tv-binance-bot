const express = require("express");
const app = express();

app.use(express.json());

// Route test bot sống
app.get("/", (req, res) => {
  res.send("Bot đang chạy");
});

// Webhook nhận tín hiệu
app.post("/webhook", (req, res) => {
  console.log("Tín hiệu nhận:", req.body);
  res.send("ĐÃ NHẬN");
});

app.listen(3000, () => {
  console.log("Server chạy cổng 3000");
});
