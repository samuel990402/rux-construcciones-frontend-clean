require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const Stripe = require("stripe");
const nodemailer = require("nodemailer");
const admin = require("./firebase");
const db = admin.firestore();
const bucket = admin.storage().bucket();
const servicesRoutes = require("./routes/services");
const propertiesRoutes = require("./routes/properties");
const settingsRoutes = require("./routes/settings");




const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ======================== GLOBAL ======================== */
app.use(cors());
app.use(express.json());
app.use("/webhook", bodyParser.raw({ type: "application/json" }));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/services", servicesRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", require("./routes/uploads"));


/* ======================== EMAIL ======================== */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

/* ======================== AUTH ======================== */
async function verifyUser(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No autenticado" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    req.email = decoded.email;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

async function verifyAdmin(req, res, next) {
  const snap = await db.collection("admins").doc(req.uid).get();
  if (!snap.exists) {
    return res.status(403).json({ error: "No autorizado" });
  }
  next();
}

/* ======================== RESET MENSUAL ======================== */
async function resetUsageIfNeeded(uid) {
  const ref = db.collection("usage").doc(uid);
  const snap = await ref.get();
  if (!snap.exists) return;

  const { lastReset } = snap.data();
  if (!lastReset) return;

  const last = lastReset.toDate();
  const now = new Date();

  if (last.getMonth() !== now.getMonth() || last.getFullYear() !== now.getFullYear()) {
    await ref.update({
      emergenciesUsed: 0,
      preventiveUsed: 0,
      lastReset: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

/* ======================== CLIENT PROFILE ======================== */
app.get("/api/client/me", verifyUser, async (req, res) => {
  await resetUsageIfNeeded(req.uid);

  const clientSnap = await db.collection("clients").doc(req.uid).get();
  if (!clientSnap.exists)
    return res.status(403).json({ error: "Cliente no encontrado" });

  const usageSnap = await db.collection("usage").doc(req.uid).get();

  const planSnap = await db
    .collection("plans")
    .where("key", "==", clientSnap.data().plan)
    .where("active", "==", true)
    .limit(1)
    .get();

  const plan = planSnap.empty ? {} : planSnap.docs[0].data();

  res.json({
    email: clientSnap.data().email,
    plan: clientSnap.data().plan,
    status: clientSnap.data().status,
    includes: plan.includes || [],
    excludes: plan.excludes || [],
    limits: plan.limits || {},
    usage: usageSnap.exists ? usageSnap.data() : {},
  });
});

/* ======================== ADMIN CHECK ======================== */
app.get("/api/admin/check", verifyUser, async (req, res) => {
  const snap = await db.collection("admins").doc(req.uid).get();
  if (!snap.exists) return res.json({ role: "user" });
  res.json({ role: snap.data().role });
});

/* ======================== VERIFY SUPERADMIN ======================== */
async function verifySuperAdmin(req, res, next) {
  const snap = await db.collection("admins").doc(req.uid).get();
  if (!snap.exists || snap.data().role !== "superadmin") {
    return res.status(403).json({ error: "Acceso restringido" });
  }
  next();
}


/* ======================== PUBLIC PLANS ======================== */
app.get("/api/plans", async (req, res) => {
  try {
    const snap = await db
  .collection("plans")
  .where("active", "==", true)
  .orderBy("order", "asc")
  .get();


    const projects = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(projects);
  } catch (err) {
    console.error("Error cargando planes públicos:", err);
    res.status(500).json([]);
  }
});

/* ======================== GET PLANS ======================== */
app.get("/api/admin/plans", verifyUser, verifySuperAdmin, async (req, res) => {
  const snap = await db
    .collection("plans")
    .orderBy("order", "asc")
    .get();

  const plans = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.json(plans);
});


/* ======================== CREATE PLAN ======================== */
app.post("/api/admin/plans", verifyUser, verifySuperAdmin, async (req, res) => {
  try {
    const {
      key,
      name,
      description,
      interval = "month",
      includes = [],
      excludes = [],
      hasLevels = false,
      price,
      stripePriceId,
      limits,
      levels = [],
    } = req.body;

    if (!key || !name) {
      return res.status(400).json({ error: "Key y nombre son obligatorios" });
    }

    const planData = {
      key,
      name,
      description,
      interval,
      includes,
      excludes,
      active: true,
      hasLevels: !!hasLevels,
      order: Number(req.body.order) || 999, // 👈 IMPORTANTE
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (hasLevels) {
      if (!Array.isArray(levels) || levels.length === 0) {
        return res.status(400).json({ error: "El plan con niveles requiere niveles" });
      }

      planData.levels = levels.map(l => ({
  id: l.id,
  label: l.label,
  price: Number(l.price),
  stripePriceId: l.stripePriceId,
  unit: l.unit?.label
    ? {
        label: l.unit.label,
        limit: Number(l.unit.limit) || null,
      }
    : null,
  limits: {
    emergencies: Number(l.limits?.emergencies || l.emergencies || 0),
    preventives: Number(l.limits?.preventives || l.preventives || 0),
  },
}));

    } else {
      if (!price || !stripePriceId) {
        return res.status(400).json({ error: "Precio y Stripe ID requeridos" });
      }

      planData.price = Number(price);
      planData.stripePriceId = stripePriceId;
      planData.limits = {
        emergencies: Number(limits?.emergencies || 0),
        preventives: Number(limits?.preventives || 0),
      };
    }

    await db.collection("plans").add(planData);
    res.json({ success: true });
  } catch (err) {
    console.error("Error creando plan:", err);
    res.status(500).json({ error: "Error creando plan" });
  }
});


/* ======================== TOGGLE PLAN ACTIVE ======================== */
app.patch(
  "/api/admin/plans/:id/toggle",
  verifyUser,
  verifySuperAdmin,
  async (req, res) => {
    const ref = db.collection("plans").doc(req.params.id);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Plan no encontrado" });
    }

    await ref.update({
      active: !snap.data().active,
    });

    res.json({ success: true });
  }
);

/* ======================== DELETE PLAN ======================== */
app.delete(
  "/api/admin/plans/:id",
  verifyUser,
  verifySuperAdmin,
  async (req, res) => {
    await db.collection("plans").doc(req.params.id).delete();
    res.json({ success: true });
  }
);


/* ======================== ADMIN DASHBOARD ======================== */
app.get("/api/admin/dashboard", verifyUser, verifyAdmin, async (req, res) => {
  const users = await db.collection("clients").get();
  const subs = await db.collection("subscriptions").get();
  const requests = await db.collection("service_events").get();

  res.json({
    users: users.size,
    subscriptions: subs.size,
    serviceRequests: requests.size,
  });
});

/* ======================== ADMINS ======================== */
app.get("/api/admin/admins", verifyUser, verifyAdmin, async (req, res) => {
  const snap = await db.collection("admins").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

app.post("/api/admin/admins", verifyUser, verifySuperAdmin, async (req, res) => {
  const { uid, email, role } = req.body;
  await db.collection("admins").doc(uid).set({ email, role });
  res.json({ success: true });
});

/* ======================== USERS ======================== */
app.get("/api/admin/users", verifyUser, verifyAdmin, async (req, res) => {
  const snap = await db.collection("clients").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

/* ======================== TECHNICIANS ======================== */
app.get("/api/admin/technicians", verifyUser, verifyAdmin, async (req, res) => {
  const snap = await db.collection("technicians").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

/* ======================== SERVICE REQUESTS ======================== */
app.get("/api/admin/service-requests", verifyUser, verifyAdmin, async (req, res) => {
  const snap = await db.collection("service_events").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

/* ======================== WHATSAPP BROADCAST ======================== */
app.post("/api/admin/broadcast", verifyUser, verifyAdmin, async (req, res) => {
  const { message } = req.body;

  const users = await db.collection("clients").get();
  users.forEach(doc => {
    console.log(`📲 WhatsApp a ${doc.data().email}: ${message}`);
  });

  res.json({ success: true });
});

/* ======================== STRIPE CHECKOUT ======================== */
app.post("/api/checkout", verifyUser, async (req, res) => {
  try {
    const { plan: planKey, levelId } = req.body;

    const snap = await db
      .collection("plans")
      .where("key", "==", planKey)
      .where("active", "==", true)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(400).json({ error: "Plan no disponible" });
    }

    const plan = snap.docs[0].data();

    let priceId;

    if (plan.hasLevels) {
      const level = plan.levels.find(l => l.id === levelId);
      if (!level) {
        return res.status(400).json({ error: "Nivel inválido" });
      }
      priceId = level.stripePriceId;
    } else {
      priceId = plan.stripePriceId;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: req.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/planes?payment=cancel`,
      metadata: {
        uid: req.uid,
        plan: plan.key,
        level: levelId || null,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Error en checkout:", err);
    res.status(500).json({ error: "Error en checkout" });
  }
});


/* ======================== STRIPE WEBHOOK ======================== */
app.post("/webhook", async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return res.status(400).send("Webhook error");
  }

  const data = event.data.object;

  /* === SUSCRIPCIÓN ACTIVADA === */
  if (event.type === "checkout.session.completed") {
    const uid = data.metadata.uid;

    await db.collection("clients").doc(uid).set(
      {
        email: data.customer_email,
        plan: data.metadata.plan,
        status: "active",
      },
      { merge: true }
    );

    await db.collection("subscriptions").doc(uid).set({
      stripeSubscriptionId: data.subscription,
      status: "active",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("usage").doc(uid).set({
      emergenciesUsed: 0,
      preventiveUsed: 0,
      lastReset: admin.firestore.FieldValue.serverTimestamp(),
    });

    await sendEmail({
      to: data.customer_email,
      subject: "✅ Tu membresía RUX está activa",
      html: `
        <h2>Bienvenido a RUX</h2>
        <p>Tu membresía <strong>${data.metadata.plan}</strong> fue activada correctamente.</p>
        <p>Ya puedes solicitar servicios desde tu dashboard.</p>
      `,
    });
  }

  /* === PAGO FALLIDO === */
  if (event.type === "invoice.payment_failed") {
    const snap = await db
      .collection("subscriptions")
      .where("stripeSubscriptionId", "==", data.subscription)
      .limit(1)
      .get();

    if (!snap.empty) {
      const uid = snap.docs[0].id;
      const client = await db.collection("clients").doc(uid).get();

      await db.collection("clients").doc(uid).update({ status: "suspended" });

      await sendEmail({
        to: client.data().email,
        subject: "❌ Problema con tu pago",
        html: `
          <h2>Pago rechazado</h2>
          <p>No pudimos procesar tu pago.</p>
          <p>Actualiza tu método de pago para evitar suspensión.</p>
        `,
      });
    }
  }

  /* === SUSCRIPCIÓN CANCELADA === */
  if (event.type === "customer.subscription.deleted") {
    const snap = await db
      .collection("subscriptions")
      .where("stripeSubscriptionId", "==", data.id)
      .limit(1)
      .get();

    if (!snap.empty) {
      const uid = snap.docs[0].id;
      const client = await db.collection("clients").doc(uid).get();

      await db.collection("subscriptions").doc(uid).update({
        status: "canceled",
        endedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await db.collection("clients").doc(uid).update({ status: "inactive" });

      await sendEmail({
        to: client.data().email,
        subject: "🛑 Tu membresía fue cancelada",
        html: `
          <h2>Membresía cancelada</h2>
          <p>Tu suscripción ha finalizado.</p>
          <p>Si deseas volver, puedes contratar un plan en cualquier momento.</p>
        `,
      });
    }
  }

  res.json({ received: true });
});

/* ======================== STORAGE ======================== */

app.post(
  "/api/admin/projects/upload",
  verifyUser,
  verifySuperAdmin,
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: "No file" });

      const fileName = `projects/${Date.now()}_${file.originalname}`;
      const blob = bucket.file(fileName);

      await blob.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      const [url] = await blob.getSignedUrl({
        action: "read",
        expires: "03-01-2035",
      });

      res.json({ url });
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      res.status(500).json({ error: "Upload error" });
    }
  }
);

app.post(
  "/api/service-events/:id/upload",
  verifyUser,
  upload.single("file"),
  async (req, res) => {
    const path = `projects/${projectId}/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(path);

    await file.save(req.file.buffer);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2035",
    });

    await db
      .collection("service_events")
      .doc(req.params.id)
      .collection("evidence")
      .add({ url });

    res.json({ success: true, url });
  }
);

/* ======================== PROJECT IMAGE UPLOAD ======================== */
app.post(
  "/api/projects/upload",
  verifyUser,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileName = `projects/${Date.now()}_${req.file.originalname}`;
      const file = bucket.file(fileName);

      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2035",
      });

      res.json({ url });
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      res.status(500).json({ error: "Error subiendo imagen" });
    }
  }
);


/* ======================== ADMIN LIST ======================== */
app.get("/api/admin/list-admins", verifyUser, verifySuperAdmin, async (req, res) => {
  const snap = await db.collection("admins").get();

  const admins = snap.docs.map(d => ({
    uid: d.id,
    ...d.data(),
  }));

  res.json(admins);
});

/* ======================== CREATE ADMIN ======================== */
app.post("/api/admin/create-admin",
  verifyUser,
  verifySuperAdmin,
  async (req, res) => {
    const { uid, email, role } = req.body;

    if (!uid || !email || !role) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    await db.collection("admins").doc(uid).set({
      email,
      role, // "admin" | "superadmin"
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true });
  }
);

/* ======================== REMOVE ADMIN ======================== */
app.delete(
  "/api/admin/remove-admin/:uid",
  verifyUser,
  verifySuperAdmin,
  async (req, res) => {
    await db.collection("admins").doc(req.params.uid).delete();
    res.json({ success: true });
  }
);


/* ======================== SERVICE EVENTS LIST ======================== */
app.get("/api/admin/service-events", verifyUser, verifyAdmin, async (req, res) => {
  const snap = await db.collection("service_events").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

/* ======================== TECHNICIANS LIST ======================== */
app.get("/api/admin/techs", verifyUser, verifyAdmin, async (req, res) => {
  const snap = await db.collection("technicians").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

/* ======================== ADMIN DASHBOARD V2 ======================== */
app.get("/api/admin/dashboard", verifyUser, verifyAdmin, async (req, res) => {
  const users = await db.collection("clients").get();
  const admins = await db.collection("admins").get();
  const techs = await db.collection("technicians").get();
  const requests = await db.collection("service_events").get();

  res.json({
    users: users.size,
    admins: admins.size,
    techs: techs.size,
    serviceRequests: requests.size,
  });
});

/* ======================== UPDATE PLAN ======================== */
app.put("/api/admin/plans/:id", verifyUser, verifySuperAdmin, async (req, res) => {
  try {
    const data = req.body;

    if (data.hasLevels && Array.isArray(data.levels)) {
      data.price = admin.firestore.FieldValue.delete();
      data.stripePriceId = admin.firestore.FieldValue.delete();
      data.limits = admin.firestore.FieldValue.delete();
    }

    await db.collection("plans").doc(req.params.id).update(data);
    res.json({ success: true });
  } catch (err) {
    console.error("Error actualizando plan:", err);
    res.status(500).json({ error: "Error actualizando plan" });
  }
});




/* ======================== SERVER ======================== */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Backend listo en http://localhost:${PORT}`)
);
