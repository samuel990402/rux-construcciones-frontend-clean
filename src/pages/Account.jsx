// src/pages/Account.jsx
import React from "react";
import { auth } from "@/firebase";

export default function Account() {
  const user = auth.currentUser;

  return (
    <div style={{ padding: 30, color: "white" }}>
      <h1 style={{ color: "#D4AF37" }}>Mi Cuenta</h1>

      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>UID:</strong> {user?.uid}</p>
    </div>
  );
}
