import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../firebase";

const API = process.env.REACT_APP_API_URL;

export default function SuperAdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrls: "",
    price: "",
    order: "",
  });

  async function authHeader() {
    const token = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }

  async function loadServices() {
    const res = await axios.get(`${API}/api/services/admin`, {
      headers: await authHeader(),
    });
    setServices(res.data);
    setLoading(false);
  }

  useEffect(() => {
    loadServices();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      imageUrls: "",
      price: "",
      order: "",
    });
  }

  async function saveService() {
    const images = form.imageUrls
      .split("\n")
      .map(u => u.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      description: form.description,
      images,
      price: Number(form.price),
      order: Number(form.order),
    };

    if (editingId) {
      await axios.put(
        `${API}/api/services/admin/${editingId}`,
        payload,
        { headers: await authHeader() }
      );
    } else {
      await axios.post(
        `${API}/api/services/admin`,
        payload,
        { headers: await authHeader() }
      );
    }

    resetForm();
    loadServices();
  }

  async function toggleService(id, active) {
    await axios.put(
      `${API}/api/services/admin/${id}`,
      { active: !active },
      { headers: await authHeader() }
    );
    loadServices();
  }

  async function deleteService(id) {
    if (!window.confirm("¿Eliminar servicio?")) return;
    await axios.delete(
      `${API}/api/services/admin/${id}`,
      { headers: await authHeader() }
    );
    loadServices();
  }

  function editService(s) {
    setEditingId(s.id);
    setForm({
      title: s.title || "",
      description: s.description || "",
      imageUrls: (s.images || []).join("\n"),
      price: s.price || "",
      order: s.order || "",
    });
  }

  if (loading) return <div style={{ padding: 40 }}>Cargando…</div>;

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <h1>SuperAdmin — Servicios</h1>

      <h2>{editingId ? "Editar servicio" : "Crear servicio"}</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 500 }}>
        <input
          placeholder="Título"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <textarea
          placeholder="Imágenes por URL (una por línea)"
          value={form.imageUrls}
          onChange={e => setForm({ ...form, imageUrls: e.target.value })}
        />

        {/* SUBIR IMAGEN A CLOUDFLARE */}
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "services");

    const res = await axios.post(
      `${API}/api/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const data = res.data;

    setForm(prev => ({
      ...prev,
      imageUrls: prev.imageUrls
        ? prev.imageUrls + "\n" + data.url
        : data.url,
    }));
  }}
/>


        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="number"
          placeholder="Orden"
          value={form.order}
          onChange={e => setForm({ ...form, order: e.target.value })}
        />

        <button onClick={saveService}>
          {editingId ? "Guardar cambios" : "Crear servicio"}
        </button>

        {editingId && <button onClick={resetForm}>Cancelar</button>}
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h2>Servicios existentes</h2>

      {services.map(s => (
        <div
          key={s.id}
          style={{ border: "1px solid #444", padding: 12, marginBottom: 12 }}
        >
          <strong>{s.title}</strong>
          <div>Precio: ${s.price}</div>
          <div>Estado: {s.active ? "🟢 Activo" : "🔴 Inactivo"}</div>

          <button onClick={() => editService(s)}>Editar</button>
          <button onClick={() => toggleService(s.id, s.active)}>
            Activar / Desactivar
          </button>
          <button onClick={() => deleteService(s.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
