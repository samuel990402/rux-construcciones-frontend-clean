import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/firebase";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";


const API = process.env.REACT_APP_API_URL;

function SortablePlanItem({ plan, onEdit, onToggle, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: plan.id });

  const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  border: "1px solid #333",
  padding: 14,
  marginBottom: 12,
  background: "#0f0f0f",
  borderRadius: 8,
  position: "relative",
};


  return (
    <div
  ref={setNodeRef}
  style={style}
  {...attributes}
  onMouseEnter={e => {
    const handle = e.currentTarget.querySelector(".drag-handle");
    if (handle) handle.style.opacity = 1;
  }}
  onMouseLeave={e => {
    const handle = e.currentTarget.querySelector(".drag-handle");
    if (handle) handle.style.opacity = 0;
  }}
>

      
      {/* 🔹 DRAG HANDLE */}
      <div
  {...listeners}
  className="drag-handle"
  style={{
    position: "absolute",
    top: 8,
    right: 10,
    cursor: "grab",
    opacity: 0,
    transition: "opacity 0.2s ease",
    fontSize: 14,
    color: "#888",
  }}
>
  ☰
</div>


      {/* 🔹 HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong style={{ fontSize: 16 }}>{plan.name}</strong>
        <span style={{ fontSize: 12 }}>
          {plan.active ? "🟢 Activo" : "🔴 Inactivo"}
        </span>
      </div>

      <div style={{ fontSize: 12, color: "#777" }}>
        Key: {plan.key}
      </div>

      {/* 🔹 PRECIO */}
      {!plan.hasLevels && (
        <div style={{ marginTop: 6 }}>
          💰 <strong>${plan.price} MXN</strong> · {plan.billingCycle || "monthly"}
        </div>
      )}

      {/* 🔹 NIVELES */}
      {plan.hasLevels && Array.isArray(plan.levels) && (
        <div style={{ marginTop: 8 }}>
          <strong>Niveles:</strong>
          <ul style={{ marginTop: 4, paddingLeft: 16 }}>
            {plan.levels.map(l => (
              <li key={l.id}>
                {l.label}: <strong>${l.price} MXN</strong>
                {l.unit?.label && l.unit?.limit && (
                  <> · {l.unit.limit} {l.unit.label}</>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔹 BOTONES */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <button type="button" onClick={() => onEdit(plan)}>
          ✏️ Editar
        </button>

        <button type="button" onClick={() => onToggle(plan.id)}>
          🔁 Activar / Desactivar
        </button>

        <button type="button" onClick={() => onDelete(plan.id)}>
          🗑 Eliminar
        </button>
      </div>
    </div>
  );
}


export default function SuperAdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [useLevels, setUseLevels] = useState(false);
  const [levels, setLevels] = useState([]);
  const [billingCycle, setBillingCycle] = useState("monthly");
const [billingLabel, setBillingLabel] = useState("");


  const [form, setForm] = useState({
  key: "",
  name: "",
  description: "",
  price: "",
  interval: "month",
  stripePriceId: "",
  emergencies: 0,
  preventives: 0,
  unitLabel: "",
  unitLimit: "",
  includes: "",
  excludes: "",
  order: "",
});

  async function authHeader() {
    const token = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }

  async function loadPlans() {
    try {
      const res = await axios.get(`${API}/api/admin/plans`, {
        headers: await authHeader(),
      });
      setPlans(res.data);
    } catch {
      alert("Error cargando planes");
    } finally {
      setLoading(false);
    }
  }

  async function handleDragEnd(event) {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const oldIndex = plans.findIndex(p => p.id === active.id);
  const newIndex = plans.findIndex(p => p.id === over.id);

  const reordered = [...plans];
  const [moved] = reordered.splice(oldIndex, 1);
  reordered.splice(newIndex, 0, moved);

  setPlans(reordered);

  // Guardar nuevo orden en backend
  for (let i = 0; i < reordered.length; i++) {
    await axios.put(
      `${API}/api/admin/plans/${reordered[i].id}`,
      { order: i + 1 },
      { headers: await authHeader() }
    );
  }
}


  function resetForm() {
    setEditingId(null);
    setUseLevels(false);
    setLevels([]);
    setForm({
  key: "",
  name: "",
  description: "",
  price: "",
  interval: "month",
  stripePriceId: "",
  emergencies: 0,
  preventives: 0,
  unitLabel: "",
  unitLimit: "",
  includes: "",
  excludes: "",
});
  }

  async function savePlan() {
    if (!form.key || !form.name) {
      return alert("Key y nombre son obligatorios");
    }

    const payload = {
  key: form.key,
  name: form.name,
  description: form.description,
  billingCycle,
billingLabel: billingCycle === "custom" ? billingLabel : null,
  interval: form.interval,
  order: Number(form.order) || 999,
  includes: form.includes.split("\n").filter(Boolean),
  excludes: form.excludes.split("\n").filter(Boolean),
  hasLevels: useLevels,
  unit: form.unitLabel
  ? {
      label: form.unitLabel,
      limit: Number(form.unitLimit) || null,
    }
  : null,


  ...(useLevels
    ? {
        levels: levels.map(l => ({
  id: l.id,
  label: l.label,
  price: Number(l.price),
  stripePriceId: l.stripePriceId,
  unit: l.unit?.label
    ? {
        label: l.unit.label,
        limit: Number(l.unit.limit) || null,
      }
    : null,
  limits: {
    emergencies: Number(l.emergencies),
    preventives: Number(l.preventives),
  },
}))
      }
    : {
        price: Number(form.price),
        stripePriceId: form.stripePriceId,

        unitLabel: form.unitLabel || null,
        unitLimit: form.unitLimit ? Number(form.unitLimit) : null,

        limits: {
          emergencies: Number(form.emergencies),
          preventives: Number(form.preventives),
        },
      }),
};


    if (editingId) {
      await axios.put(`${API}/api/admin/plans/${editingId}`, payload, {
        headers: await authHeader(),
      });
    } else {
      await axios.post(`${API}/api/admin/plans`, payload, {
        headers: await authHeader(),
      });
    }

    resetForm();
    loadPlans();
  }

  function editPlan(plan) {
  setEditingId(plan.id);
  setBillingCycle(plan.billingCycle || "monthly");
setBillingLabel(plan.billingLabel || "");
  setUseLevels(!!plan.hasLevels);

  // 🔹 Si el plan tiene niveles
  if (plan.hasLevels) {
    setLevels(
      (plan.levels || []).map(l => ({
        id: l.id,
        label: l.label || "",
        price: l.price || "",
        stripePriceId: l.stripePriceId || "",
        unit: l.unit
          ? {
              label: l.unit.label || "",
              limit: l.unit.limit || "",
            }
          : {
              label: "",
              limit: "",
            },
        emergencies: l.limits?.emergencies || 0,
        preventives: l.limits?.preventives || 0,
      }))
    );
  } else {
    setLevels([]);
  }

  // 🔹 Form base (para ambos tipos)
  setForm({
    key: plan.key || "",
    name: plan.name || "",
    order: plan.order || "",
    description: plan.description || "",
    price: plan.price || "",
    interval: plan.interval || "month",
    stripePriceId: plan.stripePriceId || "",
    emergencies: plan.limits?.emergencies || 0,
    preventives: plan.limits?.preventives || 0,

    // 🔹 UNIDAD (solo aplica a planes simples)
    unitLabel: plan.unit?.label || plan.unitLabel || "",
    unitLimit: plan.unit?.limit || plan.unitLimit || "",

    includes: (plan.includes || []).join("\n"),
    excludes: (plan.excludes || []).join("\n"),
  });
}


  async function togglePlan(id) {
    await axios.patch(
      `${API}/api/admin/plans/${id}/toggle`,
      {},
      { headers: await authHeader() }
    );
    loadPlans();
  }

  async function deletePlan(id) {
    if (!window.confirm("¿Eliminar plan definitivamente?")) return;
    await axios.delete(`${API}/api/admin/plans/${id}`, {
      headers: await authHeader(),
    });
    loadPlans();
  }

  useEffect(() => {
    loadPlans();
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Cargando planes…</div>;

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <h1>SuperAdmin — Gestión de Planes</h1>

      <section style={{ marginBottom: 40 }}>
        <h2>{editingId ? "Editar plan" : "Crear plan"}</h2>

        <div style={{ display: "grid", gap: 10, maxWidth: 500 }}>
          <input placeholder="Key única (ej: impermeabilizacion_anual)"
            value={form.key}
            onChange={e => setForm({ ...form, key: e.target.value })} />

          <input placeholder="Nombre"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
          
          <select
  value={form.interval}
  onChange={(e) =>
    setForm({ ...form, interval: e.target.value })
  }
>
  <option value="month">Mensual</option>
  <option value="year">Anual</option>
  <option value="custom">Personalizado</option>
</select>


            {billingCycle === "custom" && (
  <input
    type="text"
    placeholder="Ej: Precio por proyecto"
    value={billingLabel}
    onChange={(e) => setBillingLabel(e.target.value)}
    className="input mt-2"
  />
)}       

          <input
  type="number"
  placeholder="Orden de visualización (1 = primero)"
  value={form.order}
  onChange={e => setForm({ ...form, order: e.target.value })}
/>

          <textarea placeholder="Descripción"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />

          <label>
            <input
              type="checkbox"
              checked={useLevels}
              onChange={e => setUseLevels(e.target.checked)}
            />
            Este plan tiene niveles
          </label>

          {!useLevels && (
            <>
              <input type="number" placeholder="Precio MXN"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })} />

              <input
  placeholder="Etiqueta de límite (ej: m², piezas, servicios)"
  value={form.unitLabel}
  onChange={e => setForm({ ...form, unitLabel: e.target.value })}
/>

<input
  type="number"
  placeholder="Cantidad máxima (opcional)"
  value={form.unitLimit}
  onChange={e => setForm({ ...form, unitLimit: e.target.value })}
/>

              <input placeholder="Stripe Price ID"
                value={form.stripePriceId}
                onChange={e => setForm({ ...form, stripePriceId: e.target.value })} />

              <input type="number" placeholder="Emergencias / mes"
                value={form.emergencies}
                onChange={e => setForm({ ...form, emergencies: e.target.value })} />

              <input type="number" placeholder="Preventivos / mes"
                value={form.preventives}
                onChange={e => setForm({ ...form, preventives: e.target.value })} />
            </>
          )}

          {useLevels && (
  <>
    {levels.map((l, i) => (
      <div
        key={l.id}
        style={{
          border: "1px solid #444",
          padding: 12,
          borderRadius: 6,
          marginBottom: 12,
        }}
      >
        {/* 🔹 TÍTULO DEL NIVEL (TIP PRO) */}
        <h4 style={{ marginBottom: 8 }}>
          Nivel: {l.label || "Sin nombre"}
        </h4>

        <input
          placeholder="Nombre del nivel (Base / Plus / Premium)"
          value={l.label}
          onChange={e => {
            const copy = [...levels];
            copy[i].label = e.target.value;
            setLevels(copy);
          }}
        />

        <input
          type="number"
          placeholder="Precio MXN"
          value={l.price}
          onChange={e => {
            const copy = [...levels];
            copy[i].price = e.target.value;
            setLevels(copy);
          }}
        />

        <input
  placeholder="Etiqueta de límite (ej: m², puertas, piezas)"
  value={l.unit?.label || ""}
  onChange={e => {
    const copy = [...levels];
    copy[i].unit = {
      ...copy[i].unit,
      label: e.target.value,
    };
    setLevels(copy);
  }}
/>

<input
  type="number"
  placeholder="Cantidad máxima"
  value={l.unit?.limit || ""}
  onChange={e => {
    const copy = [...levels];
    copy[i].unit = {
      ...copy[i].unit,
      limit: e.target.value,
    };
    setLevels(copy);
  }}
/>


        <input
          placeholder="Stripe Price ID"
          value={l.stripePriceId}
          onChange={e => {
            const copy = [...levels];
            copy[i].stripePriceId = e.target.value;
            setLevels(copy);
          }}
        />

        {/* 🔹 EMERGENCIAS */}
        <label>Emergencias incluidas por mes</label>
        <input
          type="number"
          min="0"
          value={l.emergencies}
          onChange={e => {
            const copy = [...levels];
            copy[i].emergencies = e.target.value;
            setLevels(copy);
          }}
        />

        {/* 🔹 PREVENTIVOS */}
        <label>Servicios preventivos incluidos por mes</label>
        <input
          type="number"
          min="0"
          value={l.preventives}
          onChange={e => {
            const copy = [...levels];
            copy[i].preventives = e.target.value;
            setLevels(copy);
          }}
        />
      </div>
    ))}

    <button
  onClick={() =>
    setLevels([
      ...levels,
      {
        id: crypto.randomUUID(),
        label: "",
        price: "",
        stripePriceId: "",
        unit: {
          label: "",
          limit: "",
        },
        emergencies: 0,
        preventives: 0,
      },
    ])
  }
>
  ➕ Agregar nivel
</button>


  </>
)}


          <textarea placeholder="Incluye (una línea por punto)"
            value={form.includes}
            onChange={e => setForm({ ...form, includes: e.target.value })} />

          <textarea placeholder="No incluye"
            value={form.excludes}
            onChange={e => setForm({ ...form, excludes: e.target.value })} />

          <button onClick={savePlan}>
            {editingId ? "Guardar cambios" : "Crear plan"}
          </button>

          {editingId && (
            <button onClick={resetForm} style={{ background: "#444" }}>
              Cancelar
            </button>
          )}
        </div>
      </section>

      <section>
  <h2>Planes existentes (arrastrar para ordenar)</h2>

  <DndContext
    collisionDetection={closestCenter}
    onDragEnd={handleDragEnd}
  >
    <SortableContext
      items={plans.map(p => p.id)}
      strategy={verticalListSortingStrategy}
    >
      {plans.map(plan => (
        <SortablePlanItem
          key={plan.id}
          plan={plan}
          onEdit={editPlan}
          onToggle={togglePlan}
          onDelete={deletePlan}
        />
      ))}
    </SortableContext>
  </DndContext>
</section>
    </div>
  );
}
