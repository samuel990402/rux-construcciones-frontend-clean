// src/components/AdminRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function AdminRoute({ children }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setRole("guest");
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
        console.error("Error validando AdminRoute:", err);
        setRole("user");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Cargando…</div>;
  }

  if (role !== "admin" && role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
