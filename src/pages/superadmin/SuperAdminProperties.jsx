import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../firebase";

const API = process.env.REACT_APP_API_URL;

export default function SuperAdminProperties() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    images: "",
    order: 999,
  });

  async function authHeader() {
    const token = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }

  async function load() {
    const res = await axios.get(`${API}/api/properties/admin`, {
      headers: await authHeader(),
    });
    setItems(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    const payload = {
      ...form,
      images: form.images.split("\n").filter(Boolean),
      order: Number(form.order),
    };

    await axios.post(`${API}/api/properties/admin`, payload, {
      headers: await authHeader(),
    });

    setForm({
      title: "",
      description: "",
      price: "",
      location: "",
      images: "",
      order: 999,
    });

    load();
  }

  async function remove(id) {
    if (!window.confirm("¿Eliminar propiedad?")) return;
    await axios.delete(`${API}/api/properties/admin/${id}`, {
      headers: await authHeader(),
    });
    load();
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>SuperAdmin — Inmobiliaria</h1>

      <input placeholder="Título" value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })} />

      <input placeholder="Ubicación" value={form.location}
        onChange={e => setForm({ ...form, location: e.target.value })} />

      <input placeholder="Precio" value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })} />

      <textarea placeholder="Descripción"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })} />

      <textarea
        placeholder="Imágenes (una URL por línea)"
        value={form.images}
        onChange={e => setForm({ ...form, images: e.target.value })}
      />

      <button onClick={save}>Guardar</button>

      <hr />

      {items.map(p => (
        <div key={p.id}>
          <strong>{p.title}</strong>
          <button onClick={() => remove(p.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
