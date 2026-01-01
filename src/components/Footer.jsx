import Logo from "../assets/Logo lateral.png";
import QR from "../assets/Qr/Numero.jpg";
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Share2 } from 'lucide-react';
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";


export const Footer = () => {
  const shareQR = () => {
    if (navigator.share) {
      navigator.share({
        title: "Contacto WhatsApp",
        text: "Comparte el WhatsApp de RUX Construcciones",
        url: "https://wa.me/523314143835",
      });
    } else {
      alert("La función de compartir no es compatible con este dispositivo.");
    }
  };

  const [inmoEnabled, setInmoEnabled] = useState(false);

useEffect(() => {
  axios
    .get(`${API_BASE}/api/settings/site`)
    .then(res => setInmoEnabled(res.data.inmobiliariaEnabled))
    .catch(() => setInmoEnabled(false));
}, []);


  return (
    <footer className="relative bg-black border-t border-[#D4AF37]/20">
      {/* Contact Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-6" />
            <h2 className="text-5xl md:text-6xl font-light text-white mb-4">
              Contáctanos
            </h2>
          </div>

          {/* ---- GRID DE 3 COLUMNAS ---- */}
          <div className="grid md:grid-cols-2 gap-0 items-start">

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
                  <MapPin className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-light mb-1">Ubicación</h3>
                  <p className="text-gray-400">Guadalajara, Jalisco, México</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
                  <Phone className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-light mb-1">WhatsApp</h3>
                  <a
                    href="https://wa.me/523314143835"
                    target="_blank"
                    className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    +52 33 1414 3835
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
                  <Mail className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-light mb-1">Correo</h3>
                  <a
                    href="mailto:ruxconstrucciones@gmail.com"
                    className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    ruxconstrucciones@gmail.com
                  </a>
                </div>
              </div>

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="pt-0 border-t border-[#D4AF37]/20"
              >
                <img
                  src={Logo}
                  alt="RUX Construcciones"
                  className="h-32 object-contain"
                />
              </motion.div>
            </motion.div>

            {/* QR + COMPARTIR */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center gap-4"
            >
              <h3 className="text-white text-lg font-light">WhatsApp QR</h3>

              <img
                src={QR}
                alt="Escanea para escribir"
                className="w-48 h-48 rounded-sm border border-[#D4AF37]/30 shadow-lg"
              />

              {/* Botón para compartir */}
              <button
  onClick={shareQR}
  className="mt-2 px-6 py-2 flex items-center gap-2 border border-[#D4AF37] text-[#D4AF37] rounded-lg 
             transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-[#f7d97c]"
>
  <Share2 className="w-5 h-5" />
  Compartir QR
</button>

            </motion.div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#D4AF37]/20 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 
                items-center justify-between text-center md:text-left">

  <p className="text-gray-500 text-sm">
    © 2025 RUX Construcciones. Todos los derechos reservados.
  </p>

  <div className="flex gap-6 text-sm">
    <a
      href="/projects"
      className="text-gray-400 hover:text-[#D4AF37] transition-colors"
    >
      Proyectos
    </a>

    <a
      href="/planes"
      className="text-gray-400 hover:text-[#D4AF37] transition-colors"
    >
      Planes
    </a>

    {/* 🔐 INMOBILIARIA CONDICIONAL */}
    {inmoEnabled && (
      <a
        href="/properties"
        className="text-gray-400 hover:text-[#D4AF37] transition-colors"
      >
        Inmobiliaria
      </a>
    )}
  </div>
</div>
      </div>
    </footer>
  );
};
