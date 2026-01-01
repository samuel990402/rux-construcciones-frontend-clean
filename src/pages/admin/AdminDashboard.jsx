import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";


export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("No autenticado");

        const token = await user.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [servicesRes, techsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/admin/service-events`, { headers }),
          axios.get(`${API_BASE}/api/admin/techs`, { headers }),
        ]);

        if (mounted) {
          setServices(servicesRes.data.events || []);
          setTechs(techsRes.data.techs || []);
        }
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el panel");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    return () => (mounted = false);
  }, []);

  async function assignTech(serviceId, techUid) {
    const user = auth.currentUser;
    const token = await user.getIdToken();

    await axios.post(
      `${API_BASE}/api/admin/service-events/${serviceId}/assign`,
      { techUid },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setServices(prev =>
      prev.map(s =>
        s.id === serviceId
          ? { ...s, status: "assigned", assignedTo: techUid }
          : s
      )
    );
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Cargando panel administrativo…</div>;
  }

  return (
    <div style={{ padding: 30, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ color: "#D4AF37" }}>Panel Administrativo</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={card}>
        <h2 style={gold}>Solicitudes de Servicio</h2>

        <table style={{ width: "100%", marginTop: 16 }}>
          <thead>
            <tr style={{ color: "#D4AF37", textAlign: "left" }}>
              <th>Email</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Asignar</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td>{s.email}</td>
                <td>{s.type}</td>
                <td>{s.status}</td>
                <td>
                  {s.status === "open" && (
                    <select
                      defaultValue=""
                      onChange={e => assignTech(s.id, e.target.value)}
                    >
                      <option value="" disabled>
                        Asignar técnico
                      </option>
                      {techs.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.email}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  {s.createdAt?.seconds
                    ? new Date(s.createdAt.seconds * 1000).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

const card = {
  padding: 20,
  borderRadius: 10,
  background: "#0b0b0b",
  marginTop: 20,
};

const gold = { color: "#D4AF37" };
