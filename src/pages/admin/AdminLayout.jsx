// src/pages/admin/AdminLayout.jsx
import { Link, Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";
import "./admin.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function AdminLayout() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCheckedAuth(true);
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();

        const res = await axios.get(`${API_BASE}/api/admin/check`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRole(res.data.role);
      } catch (err) {
        console.error("Error obteniendo rol admin:", err);
        setRole("user");
      } finally {
        setCheckedAuth(true);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ===================== LOADING ===================== */
  if (loading || !checkedAuth) {
    return (
      <div className="admin-container">
        <main className="admin-content">
          <h2>Cargando panel administrativo…</h2>
        </main>
      </div>
    );
  }

  /* ===================== SEGURIDAD ===================== */
  if (role !== "admin" && role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  /* ===================== UI ===================== */
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-title">RUX Admin</h2>

        <nav className="admin-nav">
          <Link to="/admin">Inicio</Link>
          <Link to="/admin/users">Usuarios</Link>
          <Link to="/admin/subscriptions">Suscripciones</Link>
          <Link to="/admin/service-requests">Solicitudes</Link>
          <Link to="/admin/messages">WhatsApp</Link>
          <Link to="/admin/broadcast">WhatsApp Masivo</Link>
          <Link to="/admin/techs">Técnicos</Link>

          {/* 🔐 SOLO SUPERADMIN */}
          {role === "superadmin" && (
            <>
              <hr style={{ margin: "12px 0", opacity: 0.3 }} />
              <Link to="/admin/create-admin">Crear Admin</Link>
              <Link to="/admin/planes">Membresías</Link>
              <Link to="/admin/projects">Proyectos</Link>
              <Link to="/admin/services">Servicios</Link>
              <Link to="/admin/properties">Inmobiliaria</Link>
            </>
          )}
        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
