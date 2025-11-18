const axios = require("axios");
const express = require("express");

const app = express();
app.use(express.json());

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = "914604701726064";

// 🔐 VERIFY WEBHOOK (WhatsApp → Webhooks)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "roma123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  res.send("ROMA BOT WEBHOOK");
});

// მომხმარებლის შეტყობინებების დამუშავება
app.post("/webhook", (req, res) => {
  const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (entry) {
    const from = entry.from; // მომხმარებლის ნომერი
    const text = (entry.text?.body || "").toLowerCase();

    if (text.includes("ბუშტ")) {
      sendMessage(
        from,
        "🎈 ბუშტები:\n• ფერები: სხვადასხვა\n• ფასი: 1–5₾\n\nმომწერე რაოდენობა 🛒"
      );
    } else if (text.includes("სანთ")) {
      sendMessage(
        from,
        "🕯 სანთლები:\n• დაბადების დღე\n• ოქროს/ვერცხლის\n• ფასი: 2–10₾\n\nრამდენი გინდა?"
      );
    } else {
      sendMessage(
        from,
        "👋 მოგესალმები *ROMA* ბოტში!\n\nდამიწერე:\n• „ბუშტები“ – ბუშტების სანახავად\n• „სანთლები“ – სანთლების სანახავად\n\nან უბრალოდ მომწერე შეკვეთის დეტალები 🛍"
      );
    }
  }

  res.sendStatus(200);
});

// მესიჯის გაგზავნა
function sendMessage(to, text) {
  return axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      text: { body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );
}

// Health check
app.get("/", (req, res) => {
  res.send("ROMA BOT IS RUNNING ✅");
});

app.listen(3000, () => {
  console.log("ROMA WhatsApp Bot running on port 3000");
});
