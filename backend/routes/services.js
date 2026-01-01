const express = require("express");
const router = express.Router();
const admin = require("../firebase");

const db = admin.firestore();

/* ================= PUBLIC SERVICES ================= */
// GET /api/services
router.get("/", async (req, res) => {
  const snap = await db
    .collection("services")
    .where("active", "==", true)
    .orderBy("order", "asc")
    .get();

  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

/* ================= ADMIN SERVICES ================= */
// GET /api/services/admin
router.get("/admin", async (req, res) => {
  const snap = await db
    .collection("services")
    .orderBy("order", "asc")
    .get();

  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// POST /api/services/admin
router.post("/admin", async (req, res) => {
  await db.collection("services").add({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image || "",
    icon: req.body.icon || "Hammer",
    order: Number(req.body.order) || 999,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const ref = await db.collection("services").add(data);
  res.json({ id: ref.id });
});

// PUT
router.put("/admin/:id", async (req, res) => {
  await db.collection("services").doc(req.params.id).update(req.body);
  res.json({ success: true });
});

// DELETE
router.delete("/admin/:id", async (req, res) => {
  await db.collection("services").doc(req.params.id).delete();
  res.json({ success: true });
});

module.exports = router;

