app.post("/webhook", (req, res) => {
  console.log("🔥 Webhook received!");
  console.log("Body:", JSON.stringify(req.body, null, 2));

  res.status(200).json({
    status: "received",
    data: req.body
  });
});
