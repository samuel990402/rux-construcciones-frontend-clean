import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../firebase";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function PropertiesAdmin() {
  const [properties, setProperties] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [enabled, setEnabled] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    images: "",
    order: 0,
  });

  async function authHeader() {
    const token = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }

  async function loadProperties() {
    const res = await axios.get(`${API}/api/properties/admin`, {
      headers: await authHeader(),
    });
    setProperties(res.data);
  }

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
  axios.get("http://localhost:4000/api/settings/site")
    .then(res => setEnabled(res.data.inmobiliariaEnabled));
}, []);


  function resetForm() {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      price: "",
      location: "",
      images: "",
      order: 0,
    });
  }

  async function saveProperty() {
    const payload = {
      title: form.title,
      description: form.description,
      price: form.price,
      location: form.location,
      images: form.images
        .split("\n")
        .map(i => i.trim())
        .filter(Boolean),
      order: Number(form.order),
    };

    if (editingId) {
      await axios.put(
        `${API}/api/properties/admin/${editingId}`,
        payload,
        { headers: await authHeader() }
      );
    } else {
      await axios.post(
        `${API}/api/properties/admin`,
        payload,
        { headers: await authHeader() }
      );
    }

    resetForm();
    loadProperties();
  }

  function editProperty(p) {
    setEditingId(p.id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      price: p.price || "",
      location: p.location || "",
      images: (p.images || []).join("\n"),
      order: p.order || 0,
    });
  }

  async function toggleActive(p) {
    await axios.put(
      `${API}/api/properties/admin/${p.id}`,
      { active: !p.active },
      { headers: await authHeader() }
    );
    loadProperties();
  }

  async function removeProperty(id) {
    if (!window.confirm("¿Eliminar propiedad?")) return;
    await axios.delete(
      `${API}/api/properties/admin/${id}`,
      { headers: await authHeader() }
    );
    loadProperties();
  }

  async function toggleInmobiliaria() {
  const token = await auth.currentUser.getIdToken();

  await axios.put(
    `${API}/api/settings/site`,
    { inmobiliariaEnabled: !enabled },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  setEnabled(!enabled);
}


  return (
    
    <div style={{ padding: 40, maxWidth: 900 }}>
      <h1>Super Admin — Inmobiliaria</h1>
      <div style={{ marginBottom: 30 }}>
  <h2>Estado de la Inmobiliaria</h2>

  <button
    onClick={toggleInmobiliaria}
    style={{
      padding: "12px 20px",
      background: enabled ? "green" : "red",
      color: "white",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    {enabled ? "🟢 Inmobiliaria ACTIVADA" : "🔴 Inmobiliaria DESACTIVADA"}
  </button>
</div>


      <h2>{editingId ? "Editar propiedad" : "Crear propiedad"}</h2>

      <div style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Título"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Precio"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />

        <input
          placeholder="Ubicación"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />

        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        {/* OPCIÓN 1 — URL MANUAL */}
<textarea
  placeholder="Imágenes (URLs opcionales, una por línea)"
  value={form.images}
  onChange={e => setForm({ ...form, images: e.target.value })}
/>

{/* OPCIÓN 2 — SUBIR IMAGEN DIRECTA */}
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "inmobiliaria");

    const res = await axios.post(
  `${API}/api/upload`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

const data = res.data;


    // 🔥 AQUÍ ESTÁ LA CLAVE
    setForm(prev => ({
      ...prev,
      images: prev.images
        ? prev.images + "\n" + data.url
        : data.url,
    }));
  }}
/>


        <input
          type="number"
          placeholder="Orden"
          value={form.order}
          onChange={e => setForm({ ...form, order: e.target.value })}
        />

        <button onClick={saveProperty}>
          {editingId ? "Guardar cambios" : "Crear propiedad"}
        </button>

        {editingId && <button onClick={resetForm}>Cancelar</button>}
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h2>Propiedades existentes</h2>

      {properties.map(p => (
        <div
          key={p.id}
          style={{
            border: "1px solid #444",
            padding: 12,
            marginBottom: 12,
          }}
        >
          <b>{p.title}</b>
          <div>{p.location}</div>
          <div>{p.price}</div>
          <div>Estado: {p.active ? "🟢 Activa" : "🔴 Inactiva"}</div>

          <button onClick={() => editProperty(p)}>Editar</button>
          <button onClick={() => toggleActive(p)}>
            Activar / Desactivar
          </button>
          <button onClick={() => removeProperty(p.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
