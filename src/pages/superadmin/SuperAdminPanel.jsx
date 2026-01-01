import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";


export default function SuperAdminPanel() {
  const [disputes, setDisputes] = useState([]);
  const [inmoEnabled, setInmoEnabled] = useState(false);
  const [loadingInmo, setLoadingInmo] = useState(true);

  async function toggleInmobiliaria() {
    const token = await auth.currentUser.getIdToken();

    await axios.put(
      `${API_BASE}/api/settings/site`,
      { inmobiliariaEnabled: !inmoEnabled },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setInmoEnabled(!inmoEnabled);

    await axios.put(
  `${API_BASE}/api/settings/site`,
  { inmobiliariaEnabled: !inmoEnabled },
  { headers: { Authorization: `Bearer ${token}` } }
);

setInmoEnabled(!inmoEnabled);

// 🔥 AVISAR AL HEADER
window.dispatchEvent(new Event("inmobiliaria-updated"));

  }

  useEffect(() => {
    (async () => {
      const token = await auth.currentUser.getIdToken();

      const res = await axios.get(
        `${API_BASE}/api/super/tech-disputes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDisputes(res.data.disputes);

      const settingsRes = await axios.get(
        `${API_BASE}/api/settings/site`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInmoEnabled(settingsRes.data.inmobiliariaEnabled);
      setLoadingInmo(false);
    })();
  }, []);


  return (
    <div style={{ padding: 30, color: "white" }}>
      <h1 style={{ color: "#D4AF37" }}>Disputas de Técnicos</h1>
      {true && (
  <div style={{ marginBottom: 30 }}>
  <h2 style={{ color: "#D4AF37" }}>Inmobiliaria</h2>

  <button
    onClick={toggleInmobiliaria}
    disabled={loadingInmo}
    style={{
      padding: "10px 20px",
      background: inmoEnabled ? "green" : "red",
      color: "white",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      opacity: loadingInmo ? 0.6 : 1,
    }}
  >
    {inmoEnabled ? "Desactivar Inmobiliaria" : "Activar Inmobiliaria"}
  </button>
</div>
)}
      {disputes.map(d => (
        <div key={d.id}>
          {d.reason} — {d.status}
        </div>
      ))}
      
    </div>
  );
}
