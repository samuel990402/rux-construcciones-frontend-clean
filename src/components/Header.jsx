import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Logo from "D:/10. Pagina web/rux-construcciones/src/assets/logo dorado def 3.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [inmoEnabled, setInmoEnabled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* ================= SCROLL ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= INMOBILIARIA ENABLED ================= */
useEffect(() => {
  async function loadInmobiliariaSetting() {
    try {
      const res = await axios.get(`${API_BASE}/api/settings/site`);
      setInmoEnabled(res.data.inmobiliariaEnabled);
    } catch {
      setInmoEnabled(false);
    }
  }

  loadInmobiliariaSetting();

  // 👂 escuchar cambios desde el super admin
  window.addEventListener(
    "inmobiliaria-updated",
    loadInmobiliariaSetting
  );

  return () => {
    window.removeEventListener(
      "inmobiliaria-updated",
      loadInmobiliariaSetting
    );
  };
}, []);



  /* ================= AUTH + ROLE ================= */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      try {
        const token = await currentUser.getIdToken();
        const res = await axios.get(`${API_BASE}/api/admin/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsAdmin(
          res.data.role === "admin" || res.data.role === "superadmin"
        );
      } catch (err) {
        console.error("Error verificando rol admin:", err);
        setIsAdmin(false);
      }
    });

    return () => unsub();
  }, []);

  /* ================= LOGOUT ================= */
  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  /* ================= NAV HELPERS ================= */
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goTo(sectionId) {
    if (location.pathname === "/") {
      scrollToId(sectionId);
    } else {
      navigate("/");
      setTimeout(() => scrollToId(sectionId), 300);
    }
    setMenuOpen(false);
  }

  /* ================= RENDER ================= */
  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-[#D4AF37]/20 ${
          scrolled ? "header-shrink" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <motion.img
              src={Logo}
              alt="RUX"
              className="w-16 h-16 object-contain"
              whileHover={{ scale: 1.05 }}
            />
            <div>
              <div className="text-white text-lg">RUX</div>
              <div className="text-[#D4AF37] text-xs">CONSTRUCCIONES</div>
            </div>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => goTo("services")} className="nav-link">
              Servicios
            </button>

            <button onClick={() => goTo("quote-form")} className="nav-link">
              Cotizar
            </button>

            <Link to="/planes" className="nav-link">
              Planes
            </Link>

            {inmoEnabled && (
  <Link to="/properties" className="nav-link">
    Inmobiliaria
  </Link>
)}

            {/* ================= INMOBILIARIA ENABLED ================= */}
            
            {!user && (
              <>
                <Link to="/login" className="nav-link">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="nav-link">
                  Registrarse
                </Link>
              </>
            )}

            {user && (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-[#D4AF37] font-bold">
                    Panel Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-600 text-white rounded"
                >
                  Cerrar sesión
                </button>
              </>
            )}

            <a
              href="https://wa.me/523314143835"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-[#D4AF37] text-black rounded"
            >
              Contacto
            </a>
          </nav>

          {/* MÓVIL */}
          <button onClick={() => setMenuOpen(true)} className="md:hidden">
            <Menu size={28} className="text-[#D4AF37]" />
          </button>
        </div>
      </motion.header>

      <MobileMenu
  open={menuOpen}
  onClose={() => setMenuOpen(false)}
  onNavigate={goTo}
  user={user}
  handleLogout={handleLogout}
  inmoEnabled={inmoEnabled}
/>

    </>
  );
};
