// src/api/payments.js
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export async function subscribeToPlan(planId) {
  try {
    const user = auth.currentUser;

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const token = await user.getIdToken();

    const res = await axios.post(
      `${API_BASE}/api/checkout`,
      { plan: planId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res?.data?.url) {
      window.location.href = res.data.url;
    } else {
      alert("Error: respuesta inválida del servidor.");
    }
  } catch (err) {
    console.error("Error creando sesión de pago:", err);
    alert("No se pudo iniciar el pago. Revisa consola.");
  }
}
