const express = require("express");
const router = express.Router();
const admin = require("../firebase");

const db = admin.firestore();

/* ================= PUBLIC ================= */
// GET /api/settings/site
router.get("/site", async (req, res) => {
  const snap = await db.collection("settings").doc("site").get();
  if (!snap.exists) return res.json({ inmobiliariaEnabled: false });
  res.json(snap.data());
});

/* ================= SUPER ADMIN ================= */
// PUT /api/settings/site
router.put("/site", async (req, res) => {
  await db.collection("settings").doc("site").set(
    { inmobiliariaEnabled: !!req.body.inmobiliariaEnabled },
    { merge: true }
  );
  res.json({ success: true });
});

module.exports = router;
