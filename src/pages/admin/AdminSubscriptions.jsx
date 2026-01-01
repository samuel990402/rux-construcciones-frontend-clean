// src/pages/admin/AdminSubscriptions.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { auth } from "@/firebase";

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null);

  // Filtros y búsqueda
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortNewest, setSortNewest] = useState(true);

  async function loadSubscriptions() {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/admin/subscriptions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubs(res.data.subscriptions || []);
      setFiltered(res.data.subscriptions || []);
    } catch (err) {
      console.error("Error cargando suscripciones:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscriptions();
  }, []);

  // Aplicar filtros, búsqueda y ordenamiento
  useEffect(() => {
    let data = [...subs];

    // Buscar por email o ID
    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter(
        (x) =>
          x.email.toLowerCase().includes(s) ||
          x.id.toLowerCase().includes(s)
      );
    }

    // Filtro por estado
    if (statusFilter !== "all") {
      data = data.filter((x) => x.status === statusFilter);
    }

    // Ordenamiento por fecha (desc/asc)
    data.sort((a, b) =>
      sortNewest
        ? b.created - a.created
        : a.created - b.created
    );

    setFiltered(data);
  }, [search, statusFilter, sortNewest, subs]);

  async function cancelSubscription(id) {
    if (!window.confirm("¿Seguro que deseas cancelar esta suscripción?")) return;

    try {
      setCanceling(id);

      const user = auth.currentUser;
      const token = await user.getIdToken();

      await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/admin/cancel-subscription`,
        { subscriptionId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Suscripción marcada para cancelar.");

      setSubs((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: "canceled" } : s
        )
      );
    } catch (err) {
      alert("Error cancelando suscripción");
      console.error(err);
    } finally {
      setCanceling(null);
    }
  }

  if (loading) return <p style={{ padding: 20 }}>Cargando suscripciones...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "#D4AF37", marginBottom: 12, fontSize: 28 }}>
        Suscripciones
      </h1>

      {/* ----- FILTROS Y BUSCADOR ----- */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Buscar por email o ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="canceled">Cancelados</option>
        </select>

        <button
          onClick={() => setSortNewest(!sortNewest)}
          style={buttonSmall}
        >
          {sortNewest ? "Más recientes primero" : "Más antiguos primero"}
        </button>
      </div>

      {/* ----- TABLA ----- */}
      {filtered.length === 0 ? (
        <p>No hay suscripciones para mostrar.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#222" }}>
              <th style={th}>ID</th>
              <th style={th}>Email</th>
              <th style={th}>Plan</th>
              <th style={th}>Estado</th>
              <th style={th}>Inicio</th>
              <th style={th}>Fin</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} style={rowStyle}>
                <td style={td}>{s.id}</td>
                <td style={td}>{s.email}</td>
                <td style={td}>{s.plan}</td>

                {/* BADGE DE ESTADO */}
                <td style={td}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      fontSize: 12,
                      background:
                        s.status === "active"
                          ? "rgba(0,200,0,0.2)"
                          : "rgba(200,0,0,0.2)",
                      color:
                        s.status === "active"
                          ? "#4CAF50"
                          : "#FF5252",
                    }}
                  >
                    {s.status}
                  </span>
                </td>

                <td style={td}>
                  {new Date(s.created * 1000).toLocaleDateString()}
                </td>

                <td style={td}>
                  {new Date(s.current_period_end * 1000).toLocaleDateString()}
                </td>

                {/* ACCIONES */}
                <td style={td}>
                  {s.status === "active" ? (
                    <button
                      onClick={() => cancelSubscription(s.id)}
                      disabled={canceling === s.id}
                      style={{
                        ...cancelBtn,
                        opacity: canceling === s.id ? 0.6 : 1,
                      }}
                    >
                      {canceling === s.id ? "Cancelando..." : "Cancelar"}
                    </button>
                  ) : (
                    <span style={{ opacity: 0.4 }}>No disponible</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ---------------------------------------- */
/* Estilos                                 */
/* ---------------------------------------- */

const inputStyle = {
  padding: "10px 12px",
  background: "#111",
  border: "1px solid #333",
  color: "#fff",
  borderRadius: 6,
  minWidth: 200,
};

const buttonSmall = {
  padding: "10px 14px",
  background: "#333",
  color: "#D4AF37",
  border: "1px solid #444",
  borderRadius: 6,
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#0A0A0A",
  borderRadius: 8,
  overflow: "hidden",
};

const th = {
  padding: "12px",
  borderBottom: "1px solid #333",
  fontWeight: "bold",
  textAlign: "left",
  color: "#D4AF37",
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #1a1a1a",
};

const rowStyle = {
  background: "#0F0F0F",
};

const cancelBtn = {
  padding: "6px 12px",
  background: "#b71c1c",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};
