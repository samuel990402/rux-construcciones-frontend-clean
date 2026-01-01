// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";
const PAGE_SIZE = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(`${API_BASE}/api/admin/admins`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data.admins || []);
        setFiltered(res.data.admins || []);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            "No se pudieron cargar los administradores"
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const t = search.toLowerCase();
    const f = users.filter(
      (u) =>
        u.email?.toLowerCase().includes(t) ||
        u.uid?.toLowerCase().includes(t)
    );
    setFiltered(f);
    setPage(1);
  }, [search, users]);

  const start = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  if (loading) {
    return <div style={{ padding: 40, color: "white" }}>Cargando...</div>;
  }

  return (
    <div style={{ padding: 30, color: "white", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ color: "#D4AF37", marginBottom: 20 }}>
        Administradores del sistema
      </h1>

      {error && (
        <div style={{ background: "#4b1f00", padding: 12, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <input
        placeholder="Buscar por email o UID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 20,
          background: "black",
          color: "white",
          border: "1px solid rgba(212,175,55,.3)",
          borderRadius: 8,
        }}
      />

      <table style={{ width: "100%", background: "#0b0b0b" }}>
        <thead>
          <tr style={{ color: "#D4AF37" }}>
            <th>UID</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((u) => (
            <tr key={u.uid}>
              <td>{u.uid}</td>
              <td style={{ color: "#D4AF37" }}>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
