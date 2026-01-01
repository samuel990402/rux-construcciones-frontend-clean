import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";


export default function AdminTechManager() {
  const [techs, setTechs] = useState([]);
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");

  async function token() {
    return await auth.currentUser.getIdToken();
  }

  async function loadTechs() {
    const res = await axios.get(`${API_BASE}/api/admin/techs`, {
      headers: { Authorization: `Bearer ${await token()}` },
    });
    setTechs(res.data.techs || []);
  }

  async function addTech() {
    await axios.post(
      `${API_BASE}/api/admin/techs`,
      { techUid: uid, email },
      { headers: { Authorization: `Bearer ${await token()}` } }
    );
    setEmail("");
    setUid("");
    loadTechs();
  }

  async function disableTech(id) {
    await axios.put(
      `${API_BASE}/api/super/techs/${id}/disable`,
      {},
      { headers: { Authorization: `Bearer ${await token()}` } }
    );
    loadTechs();
  }

  useEffect(() => {
    loadTechs();
  }, []);

  return (
    <div style={{ padding: 30, color: "white" }}>
      <h1 style={{ color: "#D4AF37" }}>Gestión de Técnicos</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="UID del técnico"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={addTech}>Autorizar técnico</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Activo</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {techs.map((t) => (
            <tr key={t.id}>
              <td>{t.email}</td>
              <td>{t.active ? "Sí" : "No"}</td>
              <td>
                {t.active && (
                  <button onClick={() => disableTech(t.id)}>
                    Desactivar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
