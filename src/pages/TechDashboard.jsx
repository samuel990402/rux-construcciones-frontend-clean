import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";


export default function TechDashboard() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  async function getToken() {
    const user = auth.currentUser;
    return user ? await user.getIdToken() : null;
  }

  async function loadServices() {
    try {
      const token = await getToken();
      const res = await axios.get(`${API_BASE}/api/tech/service-events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data.events || []);
    } catch (e) {
      setError("Error cargando servicios");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function uploadEvidence() {
    if (!file || !selected) return;

    const token = await getToken();
    const form = new FormData();
    form.append("file", file);

    await axios.post(
      `${API_BASE}/api/service-events/${selected.id}/upload`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Evidencia subida");
    setFile(null);
  }

  async function closeService() {
    const token = await getToken();
    await axios.post(
      `${API_BASE}/api/tech/service-events/${selected.id}/close`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Servicio cerrado");
    setSelected(null);
    loadServices();
  }

  if (loading) {
    return <div style={{ padding: 40, color: "white" }}>Cargando…</div>;
  }

  return (
    <div style={{ padding: 30, color: "white", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ color: "#D4AF37" }}>Panel Técnico</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <table style={{ width: "100%", marginBottom: 24 }}>
        <thead>
          <tr style={{ color: "#D4AF37" }}>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>{s.email}</td>
              <td>{s.type}</td>
              <td>{s.status}</td>
              <td>
                <button onClick={() => setSelected(s)}>Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div style={card}>
          <h2 style={{ color: "#D4AF37" }}>Detalle del servicio</h2>

          <p><strong>Cliente:</strong> {selected.email}</p>
          <p><strong>Tipo:</strong> {selected.type}</p>
          <p><strong>Estado:</strong> {selected.status}</p>

          <div style={{ marginTop: 16 }}>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={uploadEvidence}>Subir evidencia</button>
          </div>

          <div style={{ marginTop: 16 }}>
            <button
              onClick={closeService}
              style={{ background: "#D4AF37", color: "#000" }}
            >
              Cerrar servicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const card = {
  background: "#0b0b0b",
  padding: 20,
  borderRadius: 10,
};
