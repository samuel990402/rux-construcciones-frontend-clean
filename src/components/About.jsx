import FOTO from "../assets/Gym.jpg";
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const counters = [
    { value: '+5', label: 'años de experiencia' },
    { value: '+20', label: 'proyectos entregados' },
    { value: '100%', label: 'satisfacción del cliente' }
  ];

  return (
    <section ref={ref} className="relative py-32 px-6 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <div className="w-20 h-[2px] bg-[#D4AF37] mb-6" />
              <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
                RUX Construcciones:
                <br />
                <span className="text-[#D4AF37] italic">Excelencia en cada detalle</span>
              </h2>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Somos una constructora premium con enfoque en calidad, diseño arquitectónico y atención personalizada. 
              Convertimos ideas en proyectos funcionales y estéticos, cuidando cada etapa del proceso.
            </p>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              {counters.map((counter, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 * index, duration: 0.8 }}
                  className="text-center"
                >
                  <div className="text-4xl font-light text-[#D4AF37] mb-2">{counter.value}</div>
                  <div className="text-sm text-gray-500 leading-tight">{counter.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                src={FOTO}
                alt="Interior de lujo RUX"
                className="relative z-10 w-full h-[500px] object-cover rounded-sm shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-[#D4AF37]/30 rounded-sm" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};