import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import axios from "axios";
// Si quieres el botón flotante solo en esta página, importalo aquí.
// Si prefieres que aparezca en todo el sitio, ponlo en App.js.
import { WhatsAppFloating } from "../components/WhatsAppFloating"; // crea este componente si no existe
import proyecto1 from "../assets/Proyectos/17.png";
import proyecto2 from "../assets/Proyectos/18.png";
import proyecto3 from "../assets/Proyectos/19.png";
import proyecto4 from "../assets/Proyectos/21.png";
import proyecto5 from "../assets/Proyectos/22.png";
import proyecto6 from "../assets/Proyectos/1.png";
import proyecto7 from "../assets/Proyectos/2.png";
import proyecto8 from "../assets/Proyectos/3.png";
import proyecto9 from "../assets/Proyectos/4.png";
import proyecto10 from "../assets/Proyectos/5.png";
import proyecto11 from "../assets/Proyectos/6.png";
import proyecto12 from "../assets/Proyectos/7.png";
import proyecto13 from "../assets/Proyectos/8.png";
import proyecto14 from "../assets/Proyectos/9.png";
import proyecto15 from "../assets/Proyectos/10.png";
import proyecto16 from "../src/assets/Proyectos/11.png";
import proyecto17 from "../assets/Proyectos/12.png";
import proyecto18 from "../assets/Proyectos/13.png";
import proyecto19 from "../assets/Proyectos/14.png";
import proyecto20 from "../assets/Proyectos/15.png";
import proyecto21 from "../assets/Proyectos/20.png";
import Herrería1 from "../assets/Escaleras/DESCANSO.png";
import Herrería2 from "../assets/Escaleras/IMG_0494.png";
import Herrería3 from "../assets/Escaleras/IMG_1092.png";
import Herrería4 from "../assets/Escaleras/IMG_1094.png";
import Escalera1 from "../assets/Escaleras/ERPAE1942.png";
import Escalera2 from "../assets/Escaleras/IMG_0884.png";
import Escalera3 from "../assets/Escaleras/IMG_0954.png";
import Escalera4 from "../assets/Escaleras/IMG_1003.png";
import Bar from "../assets/Bar/IMG_0480.png";
import Closet1 from "../assets/closets/IMG_0411.JPG"
import Closet2 from "../assets/closets/IMG_0446.JPG"
import Closet3 from "../assets/closets/IMG_1304.JPG"
import Closet4 from "../assets/closets/IMG_1394.JPG"
import Closet5 from "../assets/closets/IMG_1405.JPG"
import Closet6 from "../assets/closets/IMG_1423.JPG"
import Closet7 from "../assets/closets/IMG_1422.JPG"
import Closet8 from "../assets/closets/IMG_1225.JPG"
import Closet9 from "../assets/closets/IMG_0522.JPG"
import Closet10 from "../assets/closets/IMG_1225.JPG"
import Closet11 from "../assets/closets/1cls.JPG"
import Cocina1 from "../assets/cocinas/CMCJ0195.JPG"
import Cocina2 from "../assets/cocinas/CNTJ2616.JPG"
import Cocina3 from "../assets/cocinas/IMG_0386.JPG"
import Cocina4 from "../assets/cocinas/IMG_0389.JPG"
import Cocina5 from "../assets/cocinas/IMG_0459.JPG"
import Cocina6 from "../assets/cocinas/IMG_0472.JPG"
import Cocina7 from "../assets/cocinas/IMG_0576.JPG"
import Cocina8 from "../assets/cocinas/IMG_0927.JPG"
import Cocina9 from "../assets/cocinas/IMG_1197.JPG"
import Cocina10 from "../assets/cocinas/IMG_1275.JPG"
import Muebles1 from "../assets/Muebles/CQIV3868.JPG"
import Muebles2 from "../assets/Muebles/HHHR6079.JPG"
import Muebles3 from "../assets/Muebles/IMG_0240.JPG"
import Muebles4 from "../assets/Muebles/IMG_0740.JPG"
import Muebles5 from "../assets/Muebles/IMG_0745.JPG"
import Muebles6 from "../assets/Muebles/IMG_0981.JPG"
import Muebles7 from "../assets/Muebles/IMG_1291.JPG"
import Muebles8 from "../assets/Muebles/IMG_1404.JPG"
import Muebles9 from "../assets/Muebles/IMG_1412.JPG"
import Muebles10 from "../assets/Muebles/XRDT4350.JPG"
import Puertas1 from "../assets/Puertas/DFIV3595.JPG"
import Puertas2 from "../assets/Puertas/ELVI5952.JPG"
import Puertas3 from "../assets/Puertas/EUBB0824.JPG"
import Puertas4 from "../assets/Puertas/IMG_0339.JPG"
import Puertas5 from "../assets/Puertas/IMG_0327.JPG"
import Puertas6 from "../assets/Puertas/IMG_0453.JPG"
import Puertas7 from "../assets/Puertas/IMG_0512.JPG"
import Puertas8 from "../assets/Puertas/IMG_0560.JPG"
import Puertas9 from "../assets/Puertas/IMG_0606.JPG"
import Puertas10 from "../assets/Puertas/IMG_1052.JPG"
import Puertas11 from "../assets/Puertas/IMG_1608.JPG"
import Puertas12 from "../assets/Puertas/WBMH8734.JPG"
import Puertas13 from "../assets/Puertas/IMG_1414.JPG"
import Puertas14 from "../assets/Puertas/IMG_1608.JPG"
import Puertas15 from "../assets/Puertas/IMG_1231.JPG"
import Obra1 from "../assets/Obras/eb68541f-ed29-45cf-bb05-f3aa27a483be.jpg"
import Obra2 from "../assets/Obras/36c00236-4fc3-4909-ab6d-40bf98ebfc71.jpg"
import Obra3 from "../assets/Obras/38b6f74f-4a86-459f-a8e7-1a55f67579f5.jpg"
import Obra4 from "../assets/Obras/c7897203-a69d-4894-a1d5-ab2f8e60d39f.jpg"

/* ===========================
   INSTRUCCIONES RÁPIDAS:
   - Pon tus imágenes en: src/assets/proyectos/
   - En "projects" abajo reemplaza las rutas (image:) por tus imports o rutas relativas.
   - Para agregar categorías: agrega strings al array `initialCategories` o añade category a cada proyecto.
   =========================== */

export default function ProjectsPage() {
  // --- Lista de proyectos (edítala con tus imágenes/títulos/ubicaciones y categorías) ---
  // Puedes usar imports locales: import p1 from '../assets/proyectos/p1.jpg' y luego image: p1
  const localProjects = [
    {
      id: .1,
      image:
        Obra1,
      title: "Bodegas",
      location: "Zapopan, Jalisco",
      category: "Obra",
    },
    {
      id: .2,
      image:
        Obra2,
      title: "Bodegas proceso",
      location: "Zapopan, Jalisco",
      category: "Obra",
    },
    {
      id: .3,
      image:
        Obra3,
      title: "Bodegas Construccion",
      location: "Zapopan, Jalisco",
      category: "Obra",
    },
    {
      id: .4,
      image:
        Obra4,
      title: "Bodegas industriales",
      location: "Zapopan, Jalisco",
      category: "Obra",
    },
    {
      id: 1,
      image:
        proyecto1,
      title: "Residencia Moderna",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
    {
      id: 2,
      image:
        proyecto2,
      title: "Sala Encinos",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
    {
      id: 3,
      image:
        proyecto3,
      title: "Pasillo Encinos",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
    {
      id: 4,
      image:
        proyecto4,
      title: "Clóset Residencial",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
    {
      id: 5,
      image:
        proyecto5,
      title: "Sala segundo nivel",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
    {
      id: 6,
      image:
        proyecto6,
      title: "Casa de campo",
      location: "Mazamitla, Jalisco",
      category: "Casas",
    },
    {
      id: 7,
      image:
        proyecto7,
      title: "Casa residencial",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
    {
      id: 8,
      image:
        proyecto8,
      title: "Casa la rioja",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
    {
      id: 9,
      image:
        proyecto9,
      title: "Oficinas corporativas",
      location: "Guadalajara, Jalisco",
      category: "Casas",
    },
     {
      id: 10,
      image:
        proyecto10,
      title: "Casa de campo",
      location: "Mazamitla, Jalisco",
      category: "Casas",
    },
     {
      id: 11,
      image:
        proyecto11,
      title: "Casa El palomar",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
      {
      id: 12,
      image:
        proyecto12,
      title: "Casa contemporánea",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
     {
      id: 13,
      image:
        proyecto13,
      title: "Casa villa verdia",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
    {
      id: 14,
      image:
        proyecto14,
      title: "Casa puerto azul",
      location: "Puerto Vallarta, Jalisco",
      category: "Casas",
    },
    {
      id: 15,
      image:
        proyecto15,
      title: "Casa los fresnos",
      location: "Bucerías, Nayarit",
      category: "Casas",
    },
    {
      id: 16,
      image:
        proyecto16,
      title: "Casa bosques",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
    {
      id: 17,
      image:
        proyecto17,
      title: "Casa Del valle",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
    {
      id: 18,
      image:
        proyecto18,
      title: "Casa Plata",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
    {
      id: 19,
      image:
        proyecto19,
      title: "Casa real",
      location: "Zapopan, Jalisco",
      category: "Casas",
    },
    {
      id: 20,
      image:
        proyecto20,
      title: "Casa rioja",
      location: "Tlajomulco, Jalisco",
      category: "Casas",
    },
    {
      id: 21,
      image:
        proyecto21,
      title: "Escalera moderna",
      location: "Tlajomulco, Jalisco",
      category: "Carpintería",
    },
    {
      id: 22,
      image:
        Herrería1,
      title: "Descanso de escalera",
      location: "Zapopan, Jalisco",
      category: "Herrería",
    },
    {
      id: 23,
      image:
        Herrería2,
      title: "Escalera residencial",
      location: "Zapopan, Jalisco",
      category: "Herrería",
    },
    {
      id: 24,
      image:
        Herrería3,
      title: "Escalera De Madera y Herrería",
      location: "Zapopan, Jalisco",
      category: "Herrería",
    },
    {
      id: 25,
      image:
        Herrería4,
      title: "Escalera De Madera y Herrería",
      location: "Zapopan, Jalisco",
      category: "Herrería",
    },
    {
      id: 26,
      image:
        Escalera1,
      title: "Escalera De Madera Lujosa",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 27,
      image:
        Escalera2,
      title: "Escalera De Madera Moderna",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 28,
      image:
        Escalera3,
      title: "Escalera Moderna",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 29,
      image:
        Escalera4,
      title: "Escalera Forrrada De Madera",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 30,
      image:
        Bar,
      title: "Bar Moderno",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 30.5,
      image:
        Closet11,
      title: "Closet De Lujo",
      location: "Zapopan, Jalisco",
      category: "Closet",
    },
    {
      id: 31,
      image:
        Closet1,
      title: "Closet Moderno",
      location: "Zapopan, Jalisco",
      category: "Closet",
    },
    {
      id: 32,
      image:
        Closet2,
      title: "Closet",
      location: "Zapopan, Jalisco",
      category: "Closet",
    },
    {
      id: 33,
      image:
        Closet3,
      title: "Closet",
      location: "Zapopan, Jalisco",
      category: "Closet",
    },
    {
      id: 34,
      image:
        Closet4,
      title: "Closet",
      location: "Zapopan, Jalisco",
      category: "Closet",
    },
    {
      id: 35,
      image:
        Closet5,
      title: "Closet Moderno",
      location: "Zapopan, Jalisco",
      category: "Closet",
    },
    {
      id: 36,
      image:
        Closet6,
      title: "Closet Moderno",
      location: "Zapopan, Jalisco",
      category: "Closet",
    },
    {
      id: 37,
      image:
        Closet7,
      title: "Closet Moderno",
      location: "Zapopan, Jalisco",
      category: "Closet",
    },
    {
      id: 38,
      image:
        Closet8,
      title: "Closet Moderno",
      location: "Zapopan, Jalisco",
      category: "Closet",
    },
    {
      id: 39,
      image:
        Closet9,
      title: "Closet Moderno",
      location: "Zapopan, Jalisco",
      category: "Closet",
    },
    {
      id: 40,
      image:
        Closet10,
      title: "Closet Moderno",
      location: "Zapopan, Jalisco",
      category: "Closet",
    },
    {
      id: 41,
      image:
        Cocina1,
      title: "Cocina Moderna",
      location: "Zapopan, Jalisco",
      category: "Cocinas",
    },
    {
      id: 42,
      image:
        Cocina2,
      title: "Cocina de Lujo",
      location: "Zapopan, Jalisco",
      category: "Cocinas",
    },
    {
      id: 43,
      image:
        Cocina3,
      title: "Cocina open concept",
      location: "Zapopan, Jalisco",
      category: "Cocinas",
    },
    {
      id: 44,
      image:
        Cocina4,
      title: "Cocina contemporánea",
      location: "Zapopan, Jalisco",
      category: "Cocinas",
    },
    {
      id: 45,
      image:
        Cocina5,
      title: "Cocina elegante",
      location: "Zapopan, Jalisco",
      category: "Cocinas",
    },
    {
      id: 46,
      image:
        Cocina6,
      title: "Cocina especial",
      location: "Zapopan, Jalisco",
      category: "Cocinas",
    },
    {
      id: 47,
      image:
        Cocina7,
      title: "Cocina estilo moderno",
      location: "Zapopan, Jalisco",
      category: "Cocinas",
    },
    {
      id: 48,
      image:
        Cocina8,
      title: "Cocina que enamora",
      location: "Zapopan, Jalisco",
      category: "Cocinas",
    },
    {
      id: 49,
      image:
        Cocina9,
      title: "Cocina avanzada",
      location: "Zapopan, Jalisco",
      category: "Cocinas",
    },
    {
      id: 50,
      image:
        Cocina10,
      title: "Cocina sofisticada",
      location: "Zapopan, Jalisco",
      category: "Cocinas",
    },
    {
      id: 51,
      image:
        Muebles1,
      title: "Muebles de Lujo",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 52,
      image:
        Muebles2,
      title: "Muebles Quality",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 53,
      image:
        Muebles3,
      title: "Muebles Avanzados",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 54,
      image:
        Muebles4,
      title: "Muebles sofisticados",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 55,
      image:
        Muebles5,
      title: "Muebles Elegantes",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 56,
      image:
        Muebles6,
      title: "Muebles Residenciales",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 57,
      image:
        Muebles7,
      title: "Muebles TRENDY",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 58,
      image:
        Muebles8,
      title: "Muebles Design",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 59,
      image:
        Muebles9,
      title: "Muebles Designer",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 60,
      image:
        Muebles10,
      title: "Muebles funcionales",
      location: "Zapopan, Jalisco",
      category: "Carpintería",
    },
    {
      id: 61,
      image:
        Puertas1,
      title: "Puertas de Lujo",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
    {
      id: 62,
      image:
        Puertas2,
      title: "Puertas de Seguridad",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
    {
      id: 63,
      image:
        Puertas3,
      title: "Puertas de Madera",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
    {
      id: 64,
      image:
        Puertas4,
      title: "Puertas de Hierro",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
    {
      id: 65,
      image:
        Puertas5,
      title: "Puertas de Vidrio",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
    {
      id: 66,
      image:
        Puertas6,
      title: "Puertas de Acero Inoxidable",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
    {
      id: 67,
      image:
        Puertas7,
      title: "Puerta de Seguridad Residencial",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
     {
      id: 68,
      image:
        Puertas8,
      title: "Puerta Giratoria de Lujo",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
     {
      id: 69,
      image:
        Puertas9,
      title: "Puerta de Entrada Principal",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
     {
      id: 70,
      image:
        Puertas10,
      title: "Puerta Hecha a Medida",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
     {
      id: 71,
      image:
        Puertas11,
      title: "Puerta Moderna",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
     {
      id: 72,
      image:
        Puertas12,
      title: "Puerta Contemporánea",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
     {
      id: 73,
      image:
        Puertas13,
      title: "Puerta Sofisticada",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
     {
      id: 74,
      image:
        Puertas14,
      title: "Puerta Funcional",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
     {
      id: 75,
      image:
        Puertas15,
      title: "Puerta Wood Design",
      location: "Zapopan, Jalisco",
      category: "Puertas",
    },
    
    // Agrega más proyectos aquí...
  ];

  // --- Fetch de proyectos remotos desde el backend ---
  const [remoteProjects, setRemoteProjects] = useState([]);
  useEffect(() => {
  axios
    .get(`${API}/api/projects`)
    .then(res => {
      setRemoteProjects(res.data || []);
    })
    .catch(() => {
      setRemoteProjects([]);
    });
}, []);
;

const projects = useMemo(() => {
  return [...localProjects, ...remoteProjects];
}, [localProjects, remoteProjects]);



  // --- Categorías iniciales: puedes añadir/editar aquí ---
  // "Todos" se añade automáticamente.
  const initialCategories = [
    "Casas",
    "Cocinas",
    "Remodelaciones",
    "Exteriores",
    "Comerciales",
    "Pintura",
    "Carpintería",
    "Herrería",
    "Pisos",
    "Tablaroca",
  ];

  // Construimos la lista final de categorías basada en proyectos + initialCategories (evita duplicados)
  const categories = useMemo(() => {
    const fromProjects = Array.from(new Set(projects.map((p) => p.category))).filter(Boolean);
    const combined = Array.from(new Set([...initialCategories, ...fromProjects]));
    return ["Todos", ...combined];
  }, [projects]);

  const [selected, setSelected] = useState("Todos");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const API = process.env.REACT_APP_API_URL;


  // Filtrado
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const byCategory = selected === "Todos" ? true : p.category === selected;
      const text = (p.title + " " + p.location + " " + p.category).toLowerCase();
      const bySearch = search.trim() === "" ? true : text.includes(search.toLowerCase());
      return byCategory && bySearch;
    });
  }, [projects, selected, search]);

  // Animaciones variants
  const listItem = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

  return (
    <div className="pt-32 pb-20 px-6 text-white bg-black min-h-screen">
      {/* Header / Title */}
      <div className="max-w-7xl mx-auto text-center mb-10">
        <div className="group mx-auto mb-6 flex justify-center">
  <div className="w-20 group-hover:w-80 h-[2px] bg-[#D4AF37] transition-all duration-500"></div>
</div>
        <h1 className="group-hover:text-[#D4AF37] text-5xl font-light mb-4">
          Todos nuestros <span className="text-[#D4AF37] italic">proyectos</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-6">
          Filtra por categoría o busca por nombre/ubicación. Las tarjetas muestran título y ubicación al pasar el cursor.
        </p>

        {/* Controls: Dropdown + Search */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown((s) => !s)}
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-black font-medium px-4 py-3 rounded-sm text-base shadow hover:scale-105 transition-transform duration-200"
            >
              {selected}
              <ChevronDown className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {openDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute mt-2 right-0 z-40 w-56 bg-black border border-[#ffffff10] rounded-md shadow-lg overflow-hidden"
                >
                  <div className="p-2 max-h-60 overflow-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelected(cat);
                          setOpenDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-sm text-sm ${
                          selected === cat ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "text-gray-300 hover:bg-white/5"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search */}
          <div className="w-full max-w-md">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar proyectos..."
              className="w-full px-4 py-3 rounded-sm bg-[#0b0b0b] border border-[#ffffff10] placeholder:text-gray-500 text-white"
            />
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filtered.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center text-gray-500 py-20"
              >
                No se encontraron proyectos.
              </motion.div>
            )}

            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                variants={listItem}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                className="group relative overflow-hidden rounded-sm h-80 cursor-pointer 
transition-shadow duration-500 hover:shadow-[0_0_25px_rgba(212,175,55,0.35)]"

              >
                <motion.img
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6 }}
                  src={
    project.image.startsWith("http")
      ? project.image
      : project.image.startsWith("/") 
        ? project.image
        : `${process.env.REACT_APP_API_URL}/${project.image}`
  }
                  alt={project.title}
                  className="w-full h-full object-cover"
                  style={{ imageOrientation: "from-image" }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  className="absolute bottom-0 left-0 right-0 p-6"
                >
                  <div className="border-l-2 border-[#D4AF37] pl-4">
                    <h3 className="text-2xl font-light text-white mb-1">{project.title}</h3>
                    <p className="text-gray-400 text-sm">{project.location}</p>
                    <p className="text-gray-500 text-xs mt-2">{project.category}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* WhatsApp Floating (elegant icon-only pulsing) */}
      {/* Si prefieres usar el global, elimina esta línea y pon <WhatsAppFloating/> en App.js */}
      <WhatsAppFloating />
    </div>
  );
}
