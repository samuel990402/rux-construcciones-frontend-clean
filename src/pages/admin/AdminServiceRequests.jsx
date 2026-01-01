import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";


export default function AdminServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selected, setSelected] = useState(null);

  async function load() {
    const token = await auth.currentUser.getIdToken();
    const res = await axios.get(`${API_BASE}/api/admin/service-events`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests(res.data.events || []);
  }

  async function loadLogs(id) {
    const token = await auth.currentUser.getIdToken();
    const res = await axios.get(
      `${API_BASE}/api/admin/service-events/${id}/logs`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLogs(res.data.logs || []);
  }

  async function update(id, data) {
    const token = await auth.currentUser.getIdToken();
    await axios.put(`${API_BASE}/api/admin/service-events/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 30, color: "white" }}>
      <h1 style={{ color: "#D4AF37" }}>Solicitudes</h1>

      <table>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.email}</td>
              <td>{r.type}</td>
              <td>{r.status}</td>
              <td>
                <button
                  onClick={() => {
                    setSelected(r);
                    loadLogs(r.id);
                  }}
                >
                  Historial
                </button>
                <button
                  onClick={() =>
                    update(r.id, { status: "completed", note: "Finalizado" })
                  }
                >
                  Completar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div>
          <h3>Historial</h3>
          {logs.map((l) => (
            <div key={l.id}>
              <strong>{l.action}</strong> — {l.note}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
