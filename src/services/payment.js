// src/services/payment.js

export async function createCheckoutSession(plan, token) {
  const res = await fetch("http://localhost:4000/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // token de Firebase
    },
    body: JSON.stringify({ plan }),
  });

  const data = await res.json();
  return data.url; // URL de Stripe Checkout
}
