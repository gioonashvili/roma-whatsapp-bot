const axios = require("axios");
const express = require("express");

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = "914604701726064";

const app = express();
app.use(express.json());

// Send message
function sendMessage(to, text) {
  axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      text: { body: text }
    },
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
}

// Webhook handler
app.post("/webhook", (req, res) => {
  const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (entry) {
    const from = entry.from;
    const text = (entry.text?.body || "").toLowerCase();

    if (text.includes("ბუშტ")) {
      sendMessage(from, "🎈 ბუშტები:\n• ფერები ყველა\n• ფასი: 1–5₾");
    } else if (text.includes("სანთ")) {
      sendMessage(from, "🕯 სანთლები:\n• ოქროს/ვერცხლის\n• ფასი: 2–10₾");
    } else {
      sendMessage(from,
`👋 მოგესალმები *ROMA* ბოტში

აირჩიე კატეგორია:
1️⃣ ბუშტები
2️⃣ სანთლები

ან მომწერე შეკვეთის დეტალები.`);
    }
  }
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("ROMA BOT IS RUNNING");
});

app.listen(3000, () => console.log("ROMA WhatsApp Bot running"));
