// src/pages/Success.jsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { auth } from "@/firebase";

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        // si no hay usuario autenticado
        window.location.href = "/login";
        return;
      }

      const token = await user.getIdToken();

      await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/confirm-details`,
        { sessionId, name, phone, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Datos enviados correctamente. ¡Gracias!");
    } catch (err) {
      console.error("❌ Error enviando datos:", err);
      alert("No se pudieron enviar los datos. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: 30,
        maxWidth: 700,
        margin: "0 auto",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <h1>¡Gracias por tu pago!</h1>

      <p style={{ marginTop: 10 }}>
        Tu número de orden es:
        <br />
        <b>{sessionId || "N/A"}</b>
      </p>

      <h2 style={{ marginTop: 30 }}>Completa tus datos</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        <label>
          Nombre completo:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              borderRadius: 8,
              border: "none",
            }}
          />
        </label>

        <label>
          Teléfono (incluye +52):
          <input
            type="text"
            placeholder="+52..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              borderRadius: 8,
              border: "none",
            }}
          />
        </label>

        <label>
          Dirección (opcional):
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              borderRadius: 8,
              border: "none",
            }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          {loading ? "Enviando..." : "Enviar mis datos"}
        </button>
      </form>
    </div>
  );
}
