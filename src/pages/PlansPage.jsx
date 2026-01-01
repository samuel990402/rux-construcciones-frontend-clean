// src/pages/PlansPage.jsx
import React, { useEffect, useState } from "react";
import { auth } from "@/firebase";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

function getBillingText(plan) {
  if (plan.billingCycle === "yearly") return "Anual";
  if (plan.billingCycle === "custom") return plan.billingLabel || "Personalizado";
  return "Mensual"; // default
}



export default function PlansPage() {
  const [planes, setPlanes] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState({});
  const [selectedLevelData, setSelectedLevelData] = useState({});

  // 🔹 Cargar planes desde backend
  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch(`${API_BASE}/api/plans`);
        const data = await res.json();
        setPlanes(
  Array.isArray(data)
    ? data
        .filter(p => p.active)
        .map(p => ({
          ...p,
          interval: p.interval || "month", // 🔥 fallback
        }))
    : []
);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPlans(false);
      }
    }
    loadPlans();
  }, []);

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🔹 Contratar plan
  async function contratarPlan(plan) {
  if (!accepted) {
    alert("Debes aceptar los términos del servicio.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión para contratar un plan.");
    return;
  }

  if (plan.hasLevels && !selectedLevels[plan.key]) {
    alert("Selecciona un nivel del plan");
    return;
  }

  setLoadingCheckout(true);

  try {
    const token = await user.getIdToken();

    const res = await fetch(`${API_BASE}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        plan: plan.key,
        levelId: plan.hasLevels ? selectedLevels[plan.key] : undefined,
      }),
    });

    const data = await res.json();

    if (res.status !== 200) {
      alert(data.error || "Error conectando con el servidor.");
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("No se pudo iniciar el pago.");
    }
  } catch (err) {
    console.error(err);
    alert("Error conectando con el servidor.");
  } finally {
    setLoadingCheckout(false);
  }
}



  // 🔹 Loader general
  if (loadingPlans) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando planes…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 text-white">
      <h1 className="text-center text-4xl text-[#D4AF37] mb-8">
        Planes RUX de Mantenimiento
      </h1>

      {planes.length === 0 && (
        <p className="text-center text-gray-400">
          No hay planes disponibles por el momento.
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {planes.map(p => {
          const level = selectedLevelData[p.key];

          return (
            <div key={p.id} className="border border-[#D4AF37]/30 p-6 rounded-lg">
              <h3 className="text-xl text-[#D4AF37]">{p.name}</h3>
              <p className="italic text-sm">{p.description}</p>

              {p.hasLevels ? (
                <>
                  <select
                    className="mt-4 w-full bg-black border p-2 rounded"
                    value={selectedLevels[p.key] || ""}
                    onChange={e => {
                      const lvl = p.levels.find(l => l.id === e.target.value);
                      setSelectedLevels({ ...selectedLevels, [p.key]: e.target.value });
                      setSelectedLevelData({ ...selectedLevelData, [p.key]: lvl });
                    }}
                  >
                    <option value="">Selecciona nivel</option>
                    {p.levels.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.label} – ${l.price} MXN{" "}
<span className="text-xs text-gray-400">
  / {p.interval === "year" ? "año" : "mes"}
</span>

                        {l.unit?.limit &&
                          ` (hasta ${l.unit.limit} ${l.unit.label})`}
                      </option>
                    ))}
                  </select>

                  {level && (
                    <div className="mt-3 text-sm text-gray-300">
                      🚨 Emergencias: {level.limits?.emergencies}<br />
                      🛠 Preventivos: {level.limits?.preventives}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-2 font-semibold">
  ${p.price} MXN{" "}
  <span className="text-sm text-gray-400">
    / {p.interval === "year"
        ? "año"
        : p.interval === "custom"
        ? p.billingLabel || "servicio"
        : "mes"}
  </span>
</p>



                  {p.unit?.limit && (
                    <p className="text-sm text-gray-300">
                      📐 Hasta {p.unit.limit} {p.unit.label}
                    </p>
                  )}

                  {p.unitLimit && p.unitLabel && (
                    <p className="text-sm text-gray-300">
                      🏠 Hasta {p.unitLimit} {p.unitLabel}
                    </p>
                  )}

                  <p className="text-sm text-gray-300">
                    🚨 Emergencias: {p.limits?.emergencies} ·
                    🛠 Preventivos: {p.limits?.preventives}
                  </p>
                </>
              )}

              <h4 className="mt-4 text-sm text-gray-400">Incluye</h4>
              <ul className="text-sm">
                {Array.isArray(p.includes)
  ? p.includes.map((i, idx) => <li key={idx}>✔ {i}</li>)
  : null}

              </ul>

              <h4 className="mt-4 text-sm text-gray-400">No incluye</h4>
              <ul className="text-sm text-gray-400">
                {Array.isArray(p.excludes)
  ? p.excludes.map((i, idx) => <li key={idx}>✖ {i}</li>)
  : null}

              </ul>

              <button
                disabled={loadingCheckout}
                onClick={() => contratarPlan(p)}
                className="mt-6 w-full bg-[#D4AF37] text-black py-3 rounded font-bold"
              >
                Contratar
              </button>
            </div>
          );
        })}
      </div>

      <div className="max-w-xl mx-auto mt-10 text-center">
        <label className="flex gap-2 justify-center text-sm text-gray-400">
          <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} />
          He leido y acepto los límites del servicio
        </label>
      </div>
    </div>
  );
}
