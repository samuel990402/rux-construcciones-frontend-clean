import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Send } from "lucide-react";

export const QuoteForm = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    tipoProyecto: "",
    presupuesto: "",
    descripcion: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `Hola, me gustaría cotizar un proyecto:

Nombre: ${formData.nombre}
Teléfono: ${formData.telefono}
Email: ${formData.email}
Tipo de proyecto: ${formData.tipoProyecto}
Presupuesto estimado: ${formData.presupuesto}
Descripción: ${formData.descripcion}`;

    const whatsappUrl = `https://wa.me/523314143835?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");

    setFormData({
      nombre: "",
      telefono: "",
      email: "",
      tipoProyecto: "",
      presupuesto: "",
      descripcion: "",
    });
  };

  return (
    <section
      id="quote-form"
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://customer-assets.emergentagent.com/job_diseno-mexicano/artifacts/u89woc65_WhatsApp%20Image%202025-10-29%20at%202.31.35%20PM%20%283%29.jpeg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-6" />
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
            ¿Listo para{" "}
            <span className="text-[#D4AF37] italic">construir?</span>
          </h2>
          <p className="text-xl text-gray-400 font-light">
            Recibe asesoría y una propuesta personalizada en menos de 1 hora
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="backdrop-blur-md bg-zinc-950/80 border border-[#D4AF37]/30 rounded-sm p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="nombre"
                  className="text-gray-400 mb-2 block"
                >
                  Nombre completo
                </Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                  placeholder="Juan Pérez"
                  className="bg-zinc-900/50 border-zinc-800 text-white h-12
                             focus:border-[#D4AF37] transition-colors duration-300
                             placeholder:text-gray-500/50"
                />
              </div>

              <div>
                <Label
                  htmlFor="telefono"
                  className="text-gray-400 mb-2 block"
                >
                  Teléfono / WhatsApp
                </Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  required
                  placeholder="33 1234 5678"
                  className="bg-zinc-900/50 border-zinc-800 text-white h-12
                             focus:border-[#D4AF37] transition-colors duration-300
                             placeholder:text-gray-500/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-400 mb-2 block">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="correo@ejemplo.com"
                className="bg-zinc-900/50 border-zinc-800 text-white h-12
                           focus:border-[#D4AF37] transition-colors duration-300
                           placeholder:text-gray-500/50"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="tipoProyecto"
                  className="text-gray-400 mb-2 block"
                >
                  Tipo de proyecto
                </Label>
                <Select
                  value={formData.tipoProyecto}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipoProyecto: value })
                  }
                >
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-white h-12 focus:border-[#D4AF37]">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="construccion">
                      Construcción nueva
                    </SelectItem>
                    <SelectItem value="remodelacion">
                      Remodelación
                    </SelectItem>
                    <SelectItem value="pintura">Pintura</SelectItem>
                    <SelectItem value="herreria">Herrería</SelectItem>
                    <SelectItem value="pisos">
                      Pisos y recubrimientos
                    </SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="presupuesto"
                  className="text-gray-400 mb-2 block"
                >
                  Presupuesto estimado
                </Label>
                <Input
                  id="presupuesto"
                  value={formData.presupuesto}
                  onChange={(e) =>
                    setFormData({ ...formData, presupuesto: e.target.value })
                  }
                  placeholder="$100,000 - $20,000,000"
                  className="bg-zinc-900/50 border-zinc-800 text-white h-12
                             focus:border-[#D4AF37] transition-colors duration-300
                             placeholder:text-gray-500/50"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="descripcion"
                className="text-gray-400 mb-2 block"
              >
                Descripción breve del proyecto
              </Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                rows={4}
                placeholder="Cuéntanos sobre tu proyecto..."
                className="bg-zinc-900/50 border-zinc-800 text-white
                           focus:border-[#D4AF37] transition-colors duration-300
                           placeholder:text-gray-500/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D4AF37] hover:bg-[#B8941F]
                         text-black font-medium py-6 text-lg rounded-sm
                         transition-all duration-300 hover:scale-105
                         hover:shadow-2xl hover:shadow-[#D4AF37]/50"
            >
              <Send className="mr-2 w-5 h-5" />
              Solicitar cotización ahora
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
