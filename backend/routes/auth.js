// backend/routes/auth.js

const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// ----------------------------
// 📌 Ruta: Registrar usuario
// ----------------------------
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Faltan datos" });

  try {
    // Crear usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Obtener token
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.json({
      message: "Usuario registrado correctamente",
      uid: userRecord.uid,
      token,
    });
  } catch (err) {
    console.log("❌ Error en /register:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// 📌 Ruta: Login usuario
// ----------------------------
router.post("/login", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Falta email" });

  try {
    const user = await admin.auth().getUserByEmail(email);

    // Generar token de sesión
    const token = await admin.auth().createCustomToken(user.uid);

    res.json({
      message: "Login correcto",
      uid: user.uid,
      token,
    });
  } catch (err) {
    console.log("❌ Error en /login:", err.message);
    res.status(500).json({ error: "Usuario no encontrado" });
  }
});

// ----------------------------
// 📌 Ruta: Obtener usuario actual desde token
// ----------------------------
router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Falta token" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    res.json({
      uid: decoded.uid,
      email: decoded.email,
    });
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
});

module.exports = router;
