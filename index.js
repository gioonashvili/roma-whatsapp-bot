const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ENV TOKEN
const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = "914604701726064";


// 🔐 VERIFY WEBHOOK
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "roma123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK VERIFIED ✅");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  res.send("ROMA BOT IS RUNNING");
});


// 📩 RECEIVE INCOMING MESSAGES
app.post("/webhook", (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (entry) {
      const from = entry.from;
      const text = (entry.text?.body || "").toLowerCase();

      console.log("📩 Incoming:", text);

      if (text.includes("ბუშტ")) {
        sendMessage(from, "🎈 ბუშტები:\n• ფერები ყველა\n• ფასი: 1–5₾");
      } else if (text.includes("სანთ")) {
        sendMessage(from, "🕯 სანთლები:\n• ფასი: 2–10₾");
      } else {
        sendMessage(
          from,
          "👋 მოგესალმები *ROMA* ბოტში!\n\n1️⃣ ბუშტები\n2️⃣ სანთლები\n\nან მომწერე შეკვეთის დეტალები."
        );
      }
    }
  } catch (err) {
    console.log("❌ ERROR:", err);
  }

  res.sendStatus(200);
});


// 📤 SEND MESSAGE
function sendMessage(to, text) {
  axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  )
  .then(() => console.log("📤 Sent:", text))
  .catch((err) => console.log("❌ SEND ERROR", err.response?.data));
}


// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("ROMA BOT ONLINE 🟢");
});

app.listen(3000, () => console.log("🚀 ROMA BOT RUNNING ON PORT 3000"));
