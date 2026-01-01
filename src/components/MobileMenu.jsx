import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export const MobileMenu = ({
  open,
  onClose,
  onNavigate,
  user,
  handleLogout,
  inmoEnabled,
}) => {
  if (!open) return null;

  const doNavigate = (section) => {
    if (onNavigate) {
      onNavigate(section);
    }
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.35 }}
        className="fixed top-0 right-0 w-72 h-full bg-black/95 z-50 border-l border-[#D4AF37]/20 p-6"
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="text-[#D4AF37] p-2">
            <X size={28} />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-6 text-right">
          {/* INICIO */}
          <Link
            to="/"
            onClick={onClose}
            className="text-white text-lg hover:text-[#D4AF37]"
          >
            Inicio
          </Link>

          {/* SERVICIOS */}
          <button
            onClick={() => doNavigate("services")}
            className="text-white text-lg hover:text-[#D4AF37] text-right"
          >
            Servicios
          </button>

          {/* PROYECTOS */}
          <Link
            to="/projects"
            onClick={onClose}
            className="text-white text-lg hover:text-[#D4AF37]"
          >
            Proyectos
          </Link>


          {/*inmobiliaria*/}
          {inmoEnabled && (
  <Link
    to="/properties"
    onClick={onClose}
    className="text-white text-lg hover:text-[#D4AF37]"
  >
    Inmobiliaria
  </Link>
)}


          {/* COTIZAR */}
          <button
            onClick={() => doNavigate("quote-form")}
            className="text-white text-lg hover:text-[#D4AF37] text-right"
          >
            Cotizar
          </button>

          {/* PLANES */}
          <Link
            to="/planes"
            onClick={onClose}
            className="text-white text-lg hover:text-[#D4AF37]"
          >
            Planes
          </Link>

          {/* LOGIN / LOGOUT */}
          {!user ? (
            <Link
              to="/login"
              onClick={onClose}
              className="text-white text-lg hover:text-[#D4AF37]"
            >
              Iniciar sesión
            </Link>
          ) : (
            <>
              <button
                className="text-white text-lg hover:text-[#D4AF37] text-right"
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
              >
                Cerrar sesión
              </button>

              <Link
                to="/admin"
                onClick={onClose}
                className="text-white text-lg hover:text-[#D4AF37]"
              >
                Panel Admin
              </Link>
            </>
          )}

          {/* CONTACTO */}
          <a
            href="https://wa.me/523314143835"
            target="_blank"
            rel="noreferrer"
            className="mt-6 px-4 py-2 bg-[#D4AF37] text-black rounded-sm text-center hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all"
          >
            Contacto
          </a>
        </nav>
      </motion.div>
    </>
  );
};
