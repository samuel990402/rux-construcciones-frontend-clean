import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../firebase";

// ================= FIREBASE STORAGE (PREPARADO) =================
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { v4 as uuid } from "uuid";
// const storage = getStorage();
// ⛔ Firebase Storage desactivado temporalmente


const API = process.env.REACT_APP_API_URL;
//const storage = getStorage(); // ⛔ Firebase Storage desactivado temporalmente


export default function SuperAdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  // Archivos locales (Firebase futuro)
const [files, setFiles] = useState([]);


  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    imageUrls: "",
    //images: [], // ⛔ Firebase Storage desactivado temporalmente
    order: "",
  });

  const [editingId, setEditingId] = useState(null);

  async function authHeader() {
    const token = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }

  async function loadProjects() {
    const res = await axios.get(`${API}/api/projects/admin`, {
      headers: await authHeader(),
    });
    setProjects(res.data);
    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({
      title: "",
      category: "",
      description: "",
      imageUrls: "",
      //images: "", // ⛔ Firebase Storage desactivado temporalmente
      order: "",
    });
    setFiles([]);
  }

async function uploadImages() {
  const urlsFromInput = form.imageUrls
    .split("\n")
    .map(u => u.trim())
    .filter(Boolean);

  // ================= FIREBASE STORAGE (PREPARADO) =================
  // if (files.length) {
  //   for (const file of files) {
  //     const fileRef = ref(storage, `projects/${uuid()}-${file.name}`);
  //     await uploadBytes(fileRef, file);
  //     const url = await getDownloadURL(fileRef);
  //     urlsFromInput.push(url);
  //   }
  // }

  return urlsFromInput;
}



async function saveProject() {
  const images = await uploadImages();

  const payload = {
    title: form.title,
    category: form.category,
    description: form.description,
    images,
    order: Number(form.order),
  };

  if (editingId) {
    await axios.put(
      `${API}/api/projects/admin/${editingId}`,
      payload,
      { headers: await authHeader() }
    );
  } else {
    await axios.post(
      `${API}/api/projects/admin`,
      payload,
      { headers: await authHeader() }
    );
  }

  resetForm();
  setFiles([]);
  loadProjects();
}


async function saveProject() {
  if (files.length > 0) {
    alert(
      "La subida desde dispositivo estará disponible próximamente. Usa URLs por ahora."
    );
    return;
  }

  const images = form.imageUrls
    ? form.imageUrls
        .split("\n")
        .map(u => u.trim())
        .filter(Boolean)
    : [];

  const payload = {
    title: form.title,
    category: form.category,
    description: form.description,
    images,
    order: Number(form.order),
  };

  if (editingId) {
    await axios.put(
      `${API}/api/projects/admin/${editingId}`,
      payload,
      { headers: await authHeader() }
    );
  } else {
    await axios.post(
      `${API}/api/projects/admin`,
      payload,
      { headers: await authHeader() }
    );
  }

  resetForm();
  loadProjects();
}


  function editProject(p) {
    setEditingId(p.id);
    setForm({
      title: p.title || "",
      category: p.category || "",
      description: p.description || "",
      imageUrls: (p.images || []).join("\n"),
      //images: (p.images || []).join("\n"), // ⛔ Firebase Storage desactivado temporalmente
      order: p.order || "",
    });
    setFiles([]);
  }

  async function toggleProject(id, active) {
    await axios.put(
      `${API}/api/projects/admin/${id}`,
      { active: !active },
      { headers: await authHeader() }
    );
    loadProjects();
  }

  async function deleteProject(id) {
    if (!window.confirm("¿Eliminar proyecto?")) return;
    await axios.delete(
      `${API}/api/projects/admin/${id}`,
      { headers: await authHeader() }
    );
    loadProjects();
  }

  async function uploadImages() {
  if (!files.length) return [];

  const uploaded = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      `${API}/api/projects/upload`,
      formData,
      {
        headers: {
          ...(await authHeader()),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    uploaded.push(res.data.url);
  }

  return uploaded;
}


  if (loading) return <div style={{ padding: 40 }}>Cargando…</div>;

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <h1>SuperAdmin — Proyectos</h1>

      <h2>{editingId ? "Editar proyecto" : "Crear proyecto"}</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 500 }}>
        <input
          placeholder="Título"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Categoría"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />

        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <textarea
          placeholder="URLs de imágenes (una por línea)"
          value={form.imageUrls}
          onChange={e => setForm({ ...form, imageUrls: e.target.value })}
        />

        {/* ================= FIREBASE STORAGE (PREPARADO) ================= */}
{/* SUBIR IMAGEN A CLOUDFLARE */}
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "projects");

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
          placeholder="Orden"
          value={form.order}
          onChange={e => setForm({ ...form, order: e.target.value })}
        />

        <button onClick={saveProject}>
          {editingId ? "Guardar cambios" : "Crear proyecto"}
        </button>

        {editingId && (
          <button onClick={resetForm}>Cancelar</button>
        )}
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h2>Proyectos existentes</h2>

      {projects.map(p => (
        <div
          key={p.id}
          style={{
            border: "1px solid #444",
            padding: 12,
            marginBottom: 12,
          }}
        >
          <strong>{p.title}</strong>
          <div>{p.category}</div>
          <div>Estado: {p.active ? "🟢 Activo" : "🔴 Inactivo"}</div>

          <button onClick={() => editProject(p)}>Editar</button>
          <button onClick={() => toggleProject(p.id, p.active)}>
            Activar / Desactivar
          </button>
          <button onClick={() => deleteProject(p.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
