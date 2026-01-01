import React, { useRef } from "react";
import { motion } from "framer-motion";
import Foto from "D:/10. Pagina web/rux-construcciones/src/assets/Principal 1.png";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export const Hero = () => {
  const containerRef = useRef(null);

  const handleMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) / 40;
    const y = (e.clientY - rect.top - rect.height / 2) / 60;
    containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleLeave = () => {
    if (containerRef.current) containerRef.current.style.transform = `translate(0px, 0px)`;
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background image with slow scale */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="h-full w-full"
        >
          <img src={Foto} alt="Hero" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </motion.div>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center hero-content"
      >
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-6xl md:text-8xl font-light text-white mb-6 tracking-tight">
          Creamos espacios
          <br />
          <span className="text-[#D4AF37] font-extralight italic">que inspiran</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8 }} className="text-xl md:text-2xl text-gray-300 font-light mb-12 max-w-3xl">
          Diseño, construcción y remodelación de alto nivel
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="flex flex-col md:flex-row gap-6">
          <Button
            onClick={() => document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium px-10 py-7 text-lg rounded-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/50"
          >
            Cotiza tu proyecto
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-transparent border-2 border-[#D4AF37] hover:bg-[#D4AF37]/10 text-[#D4AF37] font-medium px-10 py-7 text-lg rounded-sm transition-all duration-300 hover:scale-105"
          >
            Ver nuestros servicios
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
