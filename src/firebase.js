// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { getMessaging, getToken, onMessage } from "firebase/messaging";

// -------------------------------------------------
// ⚙ CONFIGURACIÓN DESDE VARIABLES DE ENTORNO
// -------------------------------------------------
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// -------------------------------------------------
// 🟡 INICIALIZAR FIREBASE (SOLO UNA VEZ)
// -------------------------------------------------
const app = initializeApp(firebaseConfig);

// -------------------------------------------------
// 🔥 AUTHENTICATION
// -------------------------------------------------
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// -------------------------------------------------
// 🔔 FIREBASE CLOUD MESSAGING
// -------------------------------------------------
let messaging = null;

try {
  messaging = getMessaging(app);
} catch (err) {
  console.warn("⚠ Cloud Messaging no disponible en este navegador.");
}

// Solicitar permiso para notificaciones
export const solicitarPermisoNotificaciones = async () => {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("❌ Permiso de notificaciones denegado.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    });

    console.log("🔥 Token FCM:", token);
    return token;
  } catch (err) {
    console.error("❌ Error obteniendo token FCM:", err);
    return null;
  }
};

// Escuchar notificaciones en primer plano
if (messaging) {
  onMessage(messaging, (payload) => {
    console.log("🔔 Notificación recibida:", payload);
  });
}

// -------------------------------------------------
// 📤 EXPORTS
// -------------------------------------------------
export {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  messaging,
};
