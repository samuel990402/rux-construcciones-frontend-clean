import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";


export default function SuperAdminDisputes() {
  const [disputes, setDisputes] = useState([]);

  async function token() {
    return await auth.currentUser.getIdToken();
  }

  async function loadDisputes() {
    const res = await axios.get(`${API_BASE}/api/super/tech-disputes`, {
      headers: { Authorization: `Bearer ${await token()}` },
    });
    setDisputes(res.data.disputes || []);
  }

  async function resolveDispute(id, action) {
    await axios.put(
      `${API_BASE}/api/super/tech-disputes/${id}/resolve`,
      { action }, // approve | reject
      { headers: { Authorization: `Bearer ${await token()}` } }
    );
    loadDisputes();
  }

  useEffect(() => {
    loadDisputes();
  }, []);

  return (
    <div style={{ padding: 30, color: "white" }}>
      <h1 style={{ color: "#D4AF37" }}>Disputas de Técnicos</h1>

      {disputes.length === 0 && <p>No hay disputas pendientes</p>}

      {disputes.map((d) => (
        <div
          key={d.id}
          style={{
            border: "1px solid #444",
            padding: 15,
            marginBottom: 15,
          }}
        >
          <p><strong>Técnico UID:</strong> {d.techUid}</p>
          <p><strong>Motivo:</strong> {d.reason}</p>
          <p><strong>Estado:</strong> {d.status}</p>

          {d.status === "open" && (
            <>
              <button
                onClick={() => resolveDispute(d.id, "approve")}
                style={{ marginRight: 10 }}
              >
                Aprobar (Reactivar técnico)
              </button>

              <button onClick={() => resolveDispute(d.id, "reject")}>
                Rechazar
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
