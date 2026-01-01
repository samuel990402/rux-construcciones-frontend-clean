import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function AdminCreateAdmin() {
  const [uid, setUid] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  async function loadAdmins() {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get(`${API_BASE}/api/admin/list-admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data.admins || []);
    } catch (err) {
      setError("No se pudieron cargar los administradores");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function createAdmin(e) {
    e.preventDefault();
    if (!uid.trim()) return;

    try {
      setCreating(true);
      setError(null);

      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `${API_BASE}/api/admin/create-admin`,
        { uid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUid("");
      await loadAdmins();
      alert("Administrador creado correctamente");
    } catch (err) {
      setError(
        err?.response?.data?.error || "No se pudo crear el administrador"
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={{ padding: 28, color: "white", maxWidth: 800 }}>
      <h1 style={{ color: "#D4AF37", fontSize: 26, marginBottom: 20 }}>
        Administradores del sistema
      </h1>

      {error && (
        <div style={{ background: "#4b1f00", padding: 12, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={createAdmin}
        style={{ display: "flex", gap: 12, marginBottom: 30 }}
      >
        <input
          type="text"
          placeholder="UID del usuario"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            background: "#111",
            border: "1px solid #333",
            color: "white",
            borderRadius: 6,
          }}
        />
        <button
          type="submit"
          disabled={creating}
          style={{
            padding: "10px 16px",
            background: "#D4AF37",
            color: "black",
            fontWeight: 700,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {creating ? "Agregando..." : "Agregar admin"}
        </button>
      </form>

      {/* LISTA */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {admins.map((a) => (
            <li
              key={a.uid}
              style={{
                padding: 12,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                color: "#D4AF37",
                fontWeight: 600,
              }}
            >
              {a.uid}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
