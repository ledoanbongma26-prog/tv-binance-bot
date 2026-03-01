const express = require("express");
const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
    console.log("Signal received:", req.body);
    res.send("OK");
});

app.get("/", (req, res) => {
    res.send("Bot is running");
});

app.listen(3000, () => {
    console.log("Server started");
});
