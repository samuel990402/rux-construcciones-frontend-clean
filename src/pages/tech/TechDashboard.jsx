import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";


export default function TechDashboard() {
  const [events, setEvents] = useState([]);
  const [file, setFile] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [loading, setLoading] = useState(true);

  async function getToken() {
    const user = auth.currentUser;
    if (!user) throw new Error("No autenticado");
    return await user.getIdToken();
  }

  async function loadEvents() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/tech/service-events`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setEvents(res.data.events || []);
    } catch (e) {
      console.error("Error cargando eventos tech:", e);
      alert("No se pudieron cargar los servicios asignados");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await axios.put(
        `${API_BASE}/api/tech/service-events/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      loadEvents();
    } catch (e) {
      console.error("Error actualizando estado:", e);
      alert("No se pudo actualizar el estado");
    }
  }

  async function uploadEvidence(id) {
    if (!file) {
      alert("Selecciona un archivo primero");
      return;
    }

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("stage", "work_progress");

      await axios.post(`${API_BASE}/api/service-events/${id}/upload`, form, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFile(null);
      alert("Evidencia subida correctamente");
    } catch (e) {
      console.error("Error subiendo evidencia:", e);
      alert("No se pudo subir la evidencia");
    }
  }

  async function sendDispute() {
    if (!disputeReason.trim()) {
      alert("Describe el motivo de la disputa");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/api/tech/dispute`,
        { reason: disputeReason },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      setDisputeReason("");
      alert("Disputa enviada al super admin");
    } catch (e) {
      console.error("Error enviando disputa:", e);
      alert("No se pudo enviar la disputa");
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40, color: "white" }}>
        Cargando servicios asignados...
      </div>
    );
  }

  return (
    <div style={{ padding: 30, color: "white", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ color: "#D4AF37", marginBottom: 20 }}>
        Panel del Técnico
      </h1>

      {events.length === 0 && (
        <div style={{ color: "#aaa" }}>
          No tienes servicios asignados actualmente.
        </div>
      )}

      {events.map((e) => (
        <div
          key={e.id}
          style={{
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            background: "#0b0b0b",
          }}
        >
          <div><strong>Cliente:</strong> {e.email}</div>
          <div><strong>Tipo:</strong> {e.type}</div>
          <div>
            <strong>Estado:</strong>{" "}
            <span style={{ color: "#D4AF37" }}>{e.status}</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {e.status === "assigned" && (
              <button onClick={() => updateStatus(e.id, "in_progress")}>
                Iniciar servicio
              </button>
            )}

            {e.status === "in_progress" && (
              <button onClick={() => updateStatus(e.id, "completed")}>
                Finalizar servicio
              </button>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <input
              type="file"
              onChange={(ev) => setFile(ev.target.files[0])}
            />
            <button
              style={{ marginLeft: 8 }}
              onClick={() => uploadEvidence(e.id)}
            >
              Subir evidencia
            </button>
          </div>
        </div>
      ))}

      <hr style={{ margin: "30px 0", borderColor: "#333" }} />

      <h3 style={{ color: "#D4AF37" }}>Solicitar revisión / disputa</h3>

      <textarea
        style={{
          width: "100%",
          minHeight: 90,
          marginBottom: 10,
          background: "#111",
          color: "white",
          border: "1px solid #444",
          borderRadius: 6,
          padding: 8,
        }}
        placeholder="Explica claramente la situación"
        value={disputeReason}
        onChange={(e) => setDisputeReason(e.target.value)}
      />

      <button onClick={sendDispute}>Enviar disputa</button>
    </div>
  );
}
