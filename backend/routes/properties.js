const express = require("express");
const router = express.Router();
const admin = require("../firebase");

const db = admin.firestore();

/* ======================== PUBLIC ======================== */
// GET /api/properties → públicas
router.get("/", async (req, res) => {
  try {
    const snap = await db
      .collection("properties")
      .where("active", "==", true)
      .orderBy("order", "asc")
      .get();

    const properties = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(properties);
  } catch (err) {
    console.error("Error cargando propiedades:", err);
    res.status(500).json([]);
  }
});


// obtener UNA propiedad por ID (publica)
router.get("/:id", async (req, res) => {
  try {
    const doc = await db
      .collection("properties")
      .doc(req.params.id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    const data = doc.data();

    if (!data.active) {
      return res.status(404).json({ error: "Propiedad no activa" });
    }

    res.json({
      id: doc.id,
      ...data,
    });
  } catch (err) {
    console.error("Error cargando propiedad:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});


/* ======================== SUPER ADMIN ======================== */

// GET /api/properties/admin
router.get("/admin", async (req, res) => {
  const snap = await db
    .collection("properties")
    .orderBy("order", "asc")
    .get();

  res.json(
    snap.docs.map(d => ({ id: d.id, ...d.data() }))
  );
});

// POST /api/properties/admin
router.post("/admin", async (req, res) => {
  const data = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price || "",
    location: req.body.location || "",
    images: req.body.images || [], // URLs
    order: Number(req.body.order) || 999,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const ref = await db.collection("properties").add(data);
  res.json({ id: ref.id });
});

// PUT /api/properties/admin/:id
router.put("/admin/:id", async (req, res) => {
  await db.collection("properties").doc(req.params.id).update(req.body);
  res.json({ success: true });
});

// DELETE /api/properties/admin/:id
router.delete("/admin/:id", async (req, res) => {
  await db.collection("properties").doc(req.params.id).delete();
  res.json({ success: true });
});

module.exports = router;
