// src/pages/admin/AdminBroadcast.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function AdminBroadcast() {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get(`${API_BASE}/api/admin/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data.clients || []);
    }
    load();
  }, []);

  function toggle(uid) {
    setSelected((prev) =>
      prev.includes(uid) ? prev.filter((x) => x !== uid) : [...prev, uid]
    );
  }

  function toggleAll() {
    if (selected.length === clients.length) {
      setSelected([]);
    } else {
      setSelected(clients.map((c) => c.uid));
    }
  }

  async function send() {
    if (!message || selected.length === 0) return;
    setSending(true);

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `${API_BASE}/api/admin/broadcast`,
        { uids: selected, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Mensaje enviado");
      setMessage("");
      setSelected([]);
    } catch {
      alert("Error enviando mensaje");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ padding: 30, color: "white" }}>
      <h1 style={{ color: "#D4AF37" }}>Broadcast WhatsApp</h1>

      <textarea
        placeholder="Mensaje a enviar"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 20,
          background: "black",
          color: "white",
        }}
      />

      <button onClick={toggleAll}>
        {selected.length === clients.length
          ? "Deseleccionar todos"
          : "Seleccionar todos"}
      </button>

      <ul style={{ marginTop: 20 }}>
        {clients.map((c) => (
          <li key={c.uid}>
            <input
              type="checkbox"
              checked={selected.includes(c.uid)}
              onChange={() => toggle(c.uid)}
            />
            {c.email} ({c.phone || "sin teléfono"})
          </li>
        ))}
      </ul>

      <button
        onClick={send}
        disabled={sending}
        style={{
          marginTop: 20,
          background: "#D4AF37",
          color: "black",
          padding: "10px 20px",
        }}
      >
        {sending ? "Enviando..." : "Enviar WhatsApp"}
      </button>
    </div>
  );
}
