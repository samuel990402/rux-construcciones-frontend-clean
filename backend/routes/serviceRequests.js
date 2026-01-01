// routes/serviceRequests.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

const db = admin.firestore();

router.post(
  "/request",
  verifyFirebaseToken,
  async (req, res) => {
    try {
      const uid = req.user.uid;
      const { type, notes = "" } = req.body;

      if (!["emergency", "preventive"].includes(type)) {
        return res.status(400).json({ error: "Tipo de servicio inválido" });
      }

      const subRef = db.collection("subscriptions").doc(uid);
      const subSnap = await subRef.get();

      if (!subSnap.exists) {
        return res.status(403).json({ error: "No tienes suscripción activa" });
      }

      const sub = subSnap.data();

      if (sub.status !== "active") {
        return res.status(403).json({ error: "Suscripción inactiva" });
      }

      const limits = sub.limits || {};
      const usage = sub.usage || {};

      if (
        type === "emergency" &&
        (usage.emergenciesUsed || 0) >= (limits.emergencies || 0)
      ) {
        return res
          .status(403)
          .json({ error: "Límite mensual de emergencias alcanzado" });
      }

      if (
        type === "preventive" &&
        (usage.preventiveUsed || 0) >= (limits.preventiveVisits || 0)
      ) {
        return res
          .status(403)
          .json({ error: "Límite mensual de visitas preventivas alcanzado" });
      }

      // 1️⃣ Registrar evento
      await db.collection("service_events").add({
        uid,
        type,
        notes,
        status: "completed",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 2️⃣ Incrementar contador
      const field =
        type === "emergency"
          ? "usage.emergenciesUsed"
          : "usage.preventiveUsed";

      await subRef.update({
        [field]: admin.firestore.FieldValue.increment(1),
      });

      res.json({ success: true });
    } catch (err) {
      console.error("Service request error:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

module.exports = router;
