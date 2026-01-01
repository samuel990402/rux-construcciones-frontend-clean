import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Paintbrush,
  Hammer,
  Layers,
  Grid3x3,
  DoorOpen,
  DraftingCompass,
  InspectionPanel,Kanban,DiamondMinus
} from "lucide-react";


import Cocina from "../10. Pagina web/rux-construcciones/src/assets/cocinas/CNTJ2616.png";
import Nave from "../10. Pagina web/rux-construcciones/src/assets/Herreria/Nave.png";
import PLAFON from "../10. Pagina web/rux-construcciones/src/assets/Tablaroca y plafones/renders.jpeg";
import Piso from "../10. Pagina web/rux-construcciones/src/assets/Trabajos/PISO 2.JPG";
import Aluminio from "../10. Pagina web/rux-construcciones/src/assets/Aluminio/puertas.png";
import Marble from "../10. Pagina web/rux-construcciones/src/assets/cocinas/IMG_1275.JPG";
import WPC from "../10. Pagina web/rux-construcciones/src/assets/Trabajos/DECK1.jpg"

export const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  // 👇 servicios que vendrán del backend (futuro admin)
const [servicesFromApi, setServicesFromApi] = useState([]);


  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    servicio: "",
    descripcion: "",
  });
  
  useEffect(() => {
  async function loadServices() {
    try {
      const res = await axios.get(
  `${process.env.REACT_APP_API_URL}/api/services`
);
      setServicesFromApi(res.data);
    } catch (err) {
      console.log("Backend no disponible, usando servicios locales");
    }
  }

  loadServices();
}, []);



  const services = [
    {
      id: 1,
      icon: DraftingCompass,
      title: "Diseño y construcción desde cero",
      description:
        "Proyectos llave en mano: arquitectura, obra civil y acabados de lujo",
      image:
        "https://customer-assets.emergentagent.com/job_diseno-mexicano/artifacts/u89woc65_WhatsApp%20Image%202025-10-29%20at%202.31.35%20PM%20%283%29.jpeg",
    },
    {
      id: 2,
      icon: Paintbrush,
      title: "Pintura profesional",
      description:
        "Aplicación interior y exterior con materiales premium",
      image:
        "https://customer-assets.emergentagent.com/job_diseno-mexicano/artifacts/isrklfg2_WhatsApp%20Image%202025-10-29%20at%202.31.34%20PM%20%284%29.jpeg",
    },
    {
      id: 3,
      icon: Hammer,
      title: "Herrería",
      description:
        "Barandales, escaleras, portones y estructuras personalizadas",
      image: Nave,
    },
    {
      id: 4,
      icon: Layers,
      title: "Tablaroca y plafones",
      description: "Diseños modernos y soluciones decorativas",
      image: PLAFON,
    },
    {
      id: 5,
      icon: Grid3x3,
      title: "Colocación de pisos y recubrimientos",
      description:
        "Instalación de porcelanato, mármol o vinílico con precisión profesional",
      image: Piso,
    },
    {
      id: 6,
      icon: DoorOpen,
      title: "Carpintería",
      description:
        "Fabricación e instalación de carpintería premium",
      image: Cocina,
    },
    {
      id: 7,
      icon: InspectionPanel,
      title: "Aluminio y vidrio",
      description:
        "Fabricación e instalación de aluminio y vidrio",
      image: Aluminio,
    },
    {
      id: 8,
      icon: DiamondMinus,
      title: "Mármol y granito",
      description:
        "Fabricación e instalación de mármol y granito",
      image: Marble,
    },
    {
      id: 9,
      icon: Kanban,
      title: "WPC y decking",
      description:
        "Instalación de WPC y deck",
      image: WPC,
    },
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setFormData({ ...formData, servicio: service.title });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `Hola, me interesa el servicio de ${formData.servicio}.

Nombre: ${formData.nombre}
Teléfono: ${formData.telefono}
Email: ${formData.email}

Descripción:
${formData.descripcion}`;

    const whatsappUrl = `https://wa.me/523314143835?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
    setSelectedService(null);
    setFormData({
      nombre: "",
      telefono: "",
      email: "",
      servicio: "",
      descripcion: "",
    });
  };
  // 👇 servicios finales que se muestran en la página
const allServices = [
  ...services,
  ...servicesFromApi,
];


  return (
    <section id="services" ref={ref} className="relative py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-6" />
          <h2 className="text-5xl md:text-6xl font-light text-white mb-4">
            Servicios{" "}
            <span className="text-[#D4AF37] italic">especializados</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * index, duration: 0.8 }}
                className="group relative overflow-hidden rounded-sm cursor-pointer"
                whileHover={{ y: -10 }}
              >
                <div className="relative h-80 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <Icon className="w-10 h-10 text-[#D4AF37] mb-4" />
                    <h3 className="text-2xl font-light text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {service.description}
                    </p>

                    <Button
                      onClick={() => handleServiceClick(service)}
                      className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium"
                    >
                      Cotizar este servicio
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ================= CTA MEMBRESÍAS FULL WIDTH ================= */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
        className="mt-32 bg-gradient-to-r from-black via-zinc-900 to-black border-t border-b border-[#D4AF37]/30"
      >
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h3 className="text-4xl md:text-5xl font-light text-white mb-6">
            ¿Quieres mantenimiento continuo y atención prioritaria?
          </h3>
          <p className="text-gray-400 mb-10 text-lg">
            Conoce nuestras membresías y evita costos imprevistos.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/planes")}
            className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold px-14 py-5 rounded-full transition-all duration-300"
          >
            Ver Membresías
          </motion.button>
        </div>
      </motion.div>

      {/* ================= MODAL ================= */}
      <Dialog
        open={!!selectedService}
        onOpenChange={() => setSelectedService(null)}
      >
        <DialogContent className="bg-zinc-950 border border-[#D4AF37]/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light text-[#D4AF37]">
              Cotizar servicio
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label className="text-gray-400">Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-400">Teléfono / WhatsApp</Label>
              <Input
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                required
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-400">Correo electrónico</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-400">
                Descripción o metros cuadrados
              </Label>
              <Textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                rows={3}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium"
            >
              Enviar cotización
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
