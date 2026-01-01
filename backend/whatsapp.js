// backend/whatsapp.js
const axios = require("axios");

async function sendWhatsAppMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    };

    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    };

    const res = await axios.post(url, payload, { headers });

    console.log("✅ WhatsApp enviado:", res.data);
    return true;
  } catch (err) {
    console.error("❌ Error enviando WhatsApp:", err.response?.data || err);
    return false;
  }
}

module.exports = { sendWhatsAppMessage };
