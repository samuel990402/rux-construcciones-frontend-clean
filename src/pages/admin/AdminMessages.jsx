// src/pages/admin/AdminMessages.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/admin/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Error cargando mensajes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id) {
    try {
      setProcessing(id);

      const user = auth.currentUser;
      const token = await user.getIdToken();

      await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/admin/messages/mark-read`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, read: true } : msg
        )
      );
    } catch (err) {
      console.error(err);
      alert("No se pudo marcar como leído");
    } finally {
      setProcessing(null);
    }
  }

  async function deleteMessage(id) {
    if (!window.confirm("¿Eliminar este mensaje permanentemente?")) return;

    try {
      setProcessing(id);

      const user = auth.currentUser;
      const token = await user.getIdToken();

      await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/admin/messages/delete`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el mensaje");
    } finally {
      setProcessing(null);
    }
  }

  if (loading) return <p style={{ padding: 20 }}>Cargando mensajes...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "#D4AF37", marginBottom: 20 }}>Mensajes de Contacto</h1>

      {messages.length === 0 && <p>No hay mensajes registrados.</p>}

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Nombre</th>
            <th style={th}>Email</th>
            <th style={th}>Teléfono</th>
            <th style={th}>Mensaje</th>
            <th style={th}>Fecha</th>
            <th style={th}>Estado</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {messages.map((m) => (
            <tr key={m.id} style={row}>
              <td style={td}>{m.name}</td>
              <td style={td}>{m.email}</td>
              <td style={td}>{m.phone || "N/A"}</td>
              <td style={{ ...td, maxWidth: 300 }}>{m.message}</td>
              <td style={td}>
                {new Date(m.createdAt).toLocaleDateString()}
              </td>

              <td style={td}>
                {m.read ? (
                  <span style={{ color: "#4caf50" }}>Leído</span>
                ) : (
                  <span style={{ color: "#ff9800" }}>Pendiente</span>
                )}
              </td>

              <td style={td}>
                {!m.read && (
                  <button
                    disabled={processing === m.id}
                    onClick={() => markRead(m.id)}
                    style={btnSmallGreen}
                  >
                    {processing === m.id ? "..." : "Marcar leído"}
                  </button>
                )}
                <button
                  disabled={processing === m.id}
                  onClick={() => deleteMessage(m.id)}
                  style={btnSmallRed}
                >
                  {processing === m.id ? "..." : "Eliminar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 20,
  backgroundColor: "#111",
};

const th = {
  padding: "12px",
  background: "#222",
  color: "#D4AF37",
  fontWeight: "bold",
  borderBottom: "1px solid #333",
};

const row = {
  borderBottom: "1px solid #222",
};

const td = {
  padding: "10px",
  color: "white",
};

const btnSmallGreen = {
  padding: "6px 10px",
  background: "#4caf50",
  color: "white",
  border: "none",
  marginRight: 6,
  cursor: "pointer",
  borderRadius: 4,
};

const btnSmallRed = {
  padding: "6px 10px",
  background: "#b71c1c",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: 4,
};
