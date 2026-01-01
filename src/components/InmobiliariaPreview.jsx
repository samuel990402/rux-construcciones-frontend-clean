import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const InmobiliariaPreview = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/settings/site`)
      .then(res => setEnabled(res.data.inmobiliariaEnabled))
      .catch(() => setEnabled(false));
  }, []);

  if (!enabled) return null; // ⬅️ CLAVE: si está apagado, no existe

  return (
    <section className="relative py-32 px-6 bg-gradient-to-b from-black to-zinc-950">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-6" />
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
            Inmobiliaria <span className="text-[#D4AF37] italic">RUX</span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            Propiedades seleccionadas con el estándar de calidad, diseño
            y confianza de RUX Construcciones.
          </p>

          <Link
            to="/properties"
            className="inline-block border-2 border-[#D4AF37] text-[#D4AF37]
                       px-10 py-5 text-lg rounded-sm
                       transition-all duration-300
                       hover:bg-[#D4AF37]/10 hover:scale-105"
          >
            Ver propiedades
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
