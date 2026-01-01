// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [canceling, setCanceling] = useState(false);

  async function loadClient() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error();

      const token = await user.getIdToken();
      const res = await axios.get(`${API_BASE}/api/client/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClient(res.data);
    } catch {
      setError("No se pudo cargar tu información.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClient();
  }, []);

  const openModal = (type) => {
    setServiceType(type);
    setNotes("");
    setModalOpen(true);
  };

  const sendRequest = async () => {
    try {
      setSending(true);
      const token = await auth.currentUser.getIdToken();

      await axios.post(
        `${API_BASE}/api/service/request`,
        { type: serviceType, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalOpen(false);
      await loadClient();
      alert("Solicitud enviada correctamente");
    } catch (err) {
      alert(err?.response?.data?.error || "Error enviando solicitud");
    } finally {
      setSending(false);
    }
  };

  const cancelSubscription = async () => {
    if (!window.confirm("¿Seguro que deseas cancelar tu suscripción?"))
      return;

    try {
      setCanceling(true);
      const token = await auth.currentUser.getIdToken();

      await axios.post(
        `${API_BASE}/api/subscription/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Tu suscripción se cancelará al final del periodo.");
      await loadClient();
    } catch {
      alert("No se pudo cancelar la suscripción.");
    } finally {
      setCanceling(false);
    }
  };

  if (loading) return <div style={box}>Cargando tu cuenta...</div>;
  if (error) return <div style={box}>{error}</div>;

  const emergenciesLeft =
    (client.limits?.emergencies || 0) -
    (client.usage?.emergenciesUsed || 0);

  const preventiveLeft =
    (client.limits?.preventiveVisits || 0) -
    (client.usage?.preventiveUsed || 0);

  return (
    <div style={container}>
      <h1 style={title}>Mi Membresía</h1>

      <div style={card}>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Plan:</strong> {client.plan}</p>
        <p>
          <strong>Estado:</strong>{" "}
          <span style={{ color: statusColor(client.status) }}>
            {client.status}
          </span>
        </p>

        {client.status === "canceling" && (
          <p style={{ color: "#ff9800" }}>
            ⚠ Tu suscripción se cancelará al final del periodo.
          </p>
        )}

        {client.status === "suspended" && (
          <p style={{ color: "#f44336" }}>
            ❌ Pago fallido. Actualiza tu método de pago.
          </p>
        )}
      </div>

      <div style={card}>
        <h3>Incluye</h3>
        <ul>{client.includes.map((i, idx) => <li key={idx}>✔ {i}</li>)}</ul>
      </div>

      <div style={card}>
        <h3>No incluye</h3>
        <ul>{client.excludes.map((i, idx) => <li key={idx}>✖ {i}</li>)}</ul>
      </div>

      <div style={card}>
        <h3>Uso del plan</h3>
        <p>🚨 Emergencias disponibles: {emergenciesLeft}</p>
        <p>🧰 Preventivos disponibles: {preventiveLeft}</p>
      </div>

      {client.status === "active" && (
        <div style={actions}>
          <button
            style={{ ...btnPrimary, opacity: emergenciesLeft <= 0 ? 0.5 : 1 }}
            disabled={emergenciesLeft <= 0}
            onClick={() => openModal("emergency")}
          >
            Solicitar emergencia
          </button>

          <button
            style={{ ...btnSecondary, opacity: preventiveLeft <= 0 ? 0.5 : 1 }}
            disabled={preventiveLeft <= 0}
            onClick={() => openModal("preventive")}
          >
            Solicitar visita preventiva
          </button>
        </div>
      )}

      {client.status === "active" && (
        <button
          style={{ ...btnDanger, marginTop: 20 }}
          onClick={cancelSubscription}
          disabled={canceling}
        >
          {canceling ? "Cancelando..." : "Cancelar suscripción"}
        </button>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div style={modalBackdrop}>
          <div style={modal}>
            <h3 style={{ color: "#D4AF37" }}>
              {serviceType === "emergency" ? "Emergencia" : "Servicio preventivo"}
            </h3>

            <textarea
              placeholder="Describe el problema o detalles del servicio..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={textarea}
            />

            <div style={{ display: "flex", gap: 12 }}>
              <button
                style={btnPrimary}
                disabled={sending}
                onClick={sendRequest}
              >
                {sending ? "Enviando..." : "Confirmar solicitud"}
              </button>
              <button
                style={btnSecondary}
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function statusColor(status) {
  if (status === "active") return "#4caf50";
  if (status === "canceling") return "#ff9800";
  return "#f44336";
}

/* ================= STYLES ================= */

const container = { maxWidth: 900, margin: "0 auto", padding: 30, color: "white" };
const title = { color: "#D4AF37", fontSize: 28, marginBottom: 20 };
const card = {
  background: "#0b0b0b",
  border: "1px solid rgba(212,175,55,0.25)",
  borderRadius: 10,
  padding: 20,
  marginBottom: 20,
};
const actions = { display: "flex", gap: 16 };
const btnPrimary = {
  flex: 1,
  padding: 14,
  background: "#D4AF37",
  color: "black",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
};
const btnSecondary = {
  flex: 1,
  padding: 14,
  background: "#222",
  color: "white",
  border: "1px solid #555",
  borderRadius: 8,
};
const btnDanger = {
  width: "100%",
  padding: 14,
  background: "#b71c1c",
  color: "white",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
};
const box = { padding: 40, color: "white" };
const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const modal = {
  background: "#0b0b0b",
  padding: 24,
  borderRadius: 12,
  maxWidth: 420,
  border: "1px solid rgba(212,175,55,0.3)",
};
const textarea = {
  width: "100%",
  minHeight: 100,
  marginBottom: 16,
  background: "#111",
  color: "white",
  border: "1px solid #444",
  borderRadius: 8,
  padding: 10,
};
