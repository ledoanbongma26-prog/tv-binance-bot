const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// ==== API BINANCE ====
const API_KEY = "sUBsM6KILTaSZ8qvI6cf1kOeywADTsmHPjYF7LCSfjBAr2s4DrGHnOOcxGo97VJx";
const SECRET_KEY = "u6V8pRI9dmtfMhqR3lomkv2Bx3zsPssMYQECYwezVlNptnNwlbGJgmvOYLGBVIey";

// ==== CÀI ĐẶT ====
const SYMBOL = "BTCUSDT";
const QUANTITY = 0.001;

// ==== HÀM KÝ LỆNH ====
function sign(query) {
    return crypto
        .createHmac("sha256", SECRET_KEY)
        .update(query)
        .digest("hex");
}

// ==== GỬI LỆNH BINANCE ====
async function sendOrder(side) {
    const timestamp = Date.now();

    const query = `symbol=${SYMBOL}&side=${side}&type=MARKET&quantity=${QUANTITY}&timestamp=${timestamp}`;
    const signature = sign(query);

    const url = `https://fapi.binance.com/fapi/v1/order?${query}&signature=${signature}`;

    try {
        const res = await axios.post(url, {}, {
            headers: { "X-MBX-APIKEY": API_KEY }
        });
        console.log("Đã gửi lệnh:", res.data);
    } catch (err) {
        console.log("Lỗi gửi lệnh:", err.response?.data || err.message);
    }
}

// ==== WEBHOOK ====
app.post("/webhook", async (req, res) => {

    const action = req.body.action;

    console.log("Tín hiệu nhận:", action);

    if (action === "BUY") {
        await sendOrder("BUY"); // mở LONG
    }

    if (action === "SELL") {
        await sendOrder("SELL"); // đóng LONG
    }

    res.send("OK");
});

// ==== TEST ====
app.get("/", (req, res) => {
    res.send("Bot đang chạy");
});

app.listen(3000, () => {
    console.log("Server chạy cổng 3000");
});
