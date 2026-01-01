// firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

// Configuración EXACTA de tu proyecto
firebase.initializeApp({
  apiKey: "AIzaSyANh0cHpv2h_uB0mdIiQaZLyXbsmUEixa0",
  authDomain: "rux-construcciones.firebaseapp.com",
  projectId: "rux-construcciones",
  appId: "1:483200307988:web:c863a2af980f0cc5cde801",
  messagingSenderId: "483200307988",
});

// Inicializar Messaging
const messaging = firebase.messaging();

// Notificación en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Mensaje recibido:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/icon-192x192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
