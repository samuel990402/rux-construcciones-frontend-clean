import axios from "axios";
import { auth } from "@/firebase";

// 🔥 Llamar al backend para crear una sesión de pago
export async function createCheckoutSession(planId) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Necesitas iniciar sesión para continuar");
  }

  const token = await user.getIdToken();

  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/checkout`,
    { plan: planId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data; // devuelve { url: "https://checkout.stripe.com/xxx" }
}
