import { useEffect, useState } from "react";
import axios from "axios";

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    order: 0,
  });

  const API = "http://localhost:4000/api/services/admin";

  async function load() {
    const res = await axios.get(API);
    setServices(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createService() {
    await axios.post(API, form);
    setForm({ title: "", description: "", image: "", order: 0 });
    load();
  }

  async function remove(id) {
    await axios.delete(`${API}/${id}`);
    load();
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Servicios (Super Admin)</h2>

      <input
        placeholder="Título"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Descripción"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      <input
        placeholder="URL Imagen"
        value={form.image}
        onChange={e => setForm({ ...form, image: e.target.value })}
      />
      <input
        type="number"
        placeholder="Orden"
        value={form.order}
        onChange={e => setForm({ ...form, order: Number(e.target.value) })}
      />

      <button onClick={createService}>Crear servicio</button>

      <hr />

      {services.map(s => (
        <div key={s.id} style={{ marginBottom: 10 }}>
          <b>{s.title}</b>
          <button onClick={() => remove(s.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
