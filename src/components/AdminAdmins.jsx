import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";

const API = process.env.REACT_APP_API_URL;

export default function AdminAdmins({ role }) {
  const [admins, setAdmins] = useState([]);
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState("admin");

  if (role !== "superadmin") {
    return (
      <div style={{ padding: 40 }}>
        <h2>Acceso restringido</h2>
        <p>Solo Super Administradores pueden gestionar administradores.</p>
      </div>
    );
  }

  async function authHeader() {
    const token = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }

  async function loadAdmins() {
    const res = await axios.get(`${API}/api/admin/list-admins`, {
      headers: await authHeader(),
    });
    setAdmins(res.data);
  }

  async function createAdmin() {
    await axios.post(
      `${API}/api/admin/create-admin`,
      { uid, email, role: newRole },
      { headers: await authHeader() }
    );

    setUid("");
    setEmail("");
    setNewRole("admin");
    loadAdmins();
  }

  async function deleteAdmin(id) {
    if (!window.confirm("¿Eliminar administrador?")) return;
    await axios.delete(`${API}/api/admin/admins/${id}`, {
      headers: await authHeader(),
    });
    loadAdmins();
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>SuperAdmin — Administradores</h1>

      <h3>Crear administrador</h3>
      <input
        placeholder="UID del usuario"
        value={uid}
        onChange={e => setUid(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <select value={newRole} onChange={e => setNewRole(e.target.value)}>
        <option value="admin">Admin</option>
        <option value="superadmin">SuperAdmin</option>
      </select>
      <button onClick={createAdmin}>Crear</button>

      <h3 style={{ marginTop: 30 }}>Admins existentes</h3>

      {admins.map(a => (
        <div key={a.id} style={{ border: "1px solid #333", padding: 10 }}>
          <strong>{a.email}</strong>
          <div>UID: {a.id}</div>
          <div>Rol: {a.role}</div>
          <button onClick={() => deleteAdmin(a.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
