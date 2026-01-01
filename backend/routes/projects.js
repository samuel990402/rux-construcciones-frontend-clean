const express = require("express");
const router = express.Router();
const admin = require("../firebase");

const db = admin.firestore();

/**
 * GET /api/projects
 * Proyectos públicos ordenados
 */
router.get("/", async (req, res) => {
  try {
    const snapshot = await db
      .collection("projects")
      .where("active", "==", true)
      .orderBy("order", "asc")
      .get();

    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(projects);
  } catch (error) {
    console.error("Error cargando proyectos públicos:", error);
    res.status(500).json({ error: "Error cargando proyectos" });
  }
});

/* ======================== ADMIN PROJECTS ======================== */
// GET /api/projects/admin → listar TODOS (activos e inactivos)
router.get("/admin", async (req, res) => {
  try {
    const snapshot = await db
      .collection("projects")
      .orderBy("order", "asc")
      .get();

    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(projects);
  } catch (error) {
    console.error("Error cargando proyectos admin:", error);
    res.status(500).json({ error: "Error cargando proyectos" });
  }
});

// POST /api/projects/admin → crear proyecto
router.post("/admin", async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      images: req.body.images || [],
      order: req.body.order ?? 999,
      active: true,
      createdAt: new Date(),
    };

    const ref = await db.collection("projects").add(data);
    res.json({ id: ref.id });
  } catch (error) {
    console.error("Error creando proyecto:", error);
    res.status(500).json({ error: "Error creando proyecto" });
  }
});

// PUT /api/projects/admin/:id → editar / activar / desactivar
router.put("/admin/:id", async (req, res) => {
  try {
    await db
      .collection("projects")
      .doc(req.params.id)
      .update(req.body);

    res.json({ ok: true });
  } catch (error) {
    console.error("Error actualizando proyecto:", error);
    res.status(500).json({ error: "Error actualizando proyecto" });
  }
});

// DELETE /api/projects/admin/:id → eliminar
router.delete("/admin/:id", async (req, res) => {
  try {
    await db.collection("projects").doc(req.params.id).delete();
    res.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando proyecto:", error);
    res.status(500).json({ error: "Error eliminando proyecto" });
  }
});

module.exports = router;
