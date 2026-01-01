import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const projects = [
    {
      id: 1,
      image: 'https://customer-assets.emergentagent.com/job_diseno-mexicano/artifacts/u89woc65_WhatsApp%20Image%202025-10-29%20at%202.31.35%20PM%20%283%29.jpeg',
      title: 'Residencia Moderna',
      location: 'Zapopan, Jalisco'
    },
    {
      id: 2,
      image: 'https://customer-assets.emergentagent.com/job_diseno-mexicano/artifacts/pz6fm2zx_WhatsApp%20Image%202025-10-29%20at%202.31.34%20PM%20%286%29.jpeg',
      title: 'Cocina Premium',
      location: 'Guadalajara, Jalisco'
    },
    {
      id: 3,
      image: 'https://customer-assets.emergentagent.com/job_diseno-mexicano/artifacts/684d69ga_WhatsApp%20Image%202025-10-29%20at%202.31.34%20PM%20%285%29.jpeg',
      title: 'Remodelación Integral',
      location: 'Tlaquepaque, Jalisco'
    },
    {
      id: 4,
      image: 'https://customer-assets.emergentagent.com/job_diseno-mexicano/artifacts/isrklfg2_WhatsApp%20Image%202025-10-29%20at%202.31.34%20PM%20%284%29.jpeg',
      title: 'Casa Contemporánea',
      location: 'Zapopan, Jalisco'
    }
  ];

  return (
    <section ref={ref} className="relative py-32 px-6 bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-6" />
          <h2 className="text-5xl md:text-6xl font-light text-white mb-4">
            Proyectos <span className="text-[#D4AF37] italic">destacados</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              className="group relative overflow-hidden rounded-sm h-80 cursor-pointer 
transition-shadow duration-500 hover:shadow-[0_0_25px_rgba(212,175,55,0.35)]"

            >
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                className="absolute bottom-0 left-0 right-0 p-8"
              >
                <div className="border-l-2 border-[#D4AF37] pl-4">
                  <h3 className="text-2xl font-light text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm">{project.location}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center"
        >
          <a href="/projects">
  <Button className="bg-transparent border-2 border-[#D4AF37] hover:bg-[#D4AF37]/10 text-[#D4AF37] font-medium px-10 py-6 text-lg rounded-sm transition-all duration-300 hover:scale-105">
    Ver más proyectos
    <ArrowRight className="ml-2 w-5 h-5" />
  </Button>
</a>
        </motion.div>
      </div>

      {/* Redes Sociales */}
<section className="w-full py-20 px-6 bg-black text-center">
  <h2 className="text-4xl md:text-5xl font-light text-white mb-12 tracking-tight">
    Síguenos en <span className="text-[#D4AF37] italic">redes sociales</span>
  </h2>

  <div className="flex flex-col md:flex-row justify-center gap-6">

  {/* Facebook */}
  <a
    href="https://www.facebook.com/people/RUX-Construcciones/100084725971181/"
    target="_blank"
    className="inline-flex items-center justify-center 
               bg-[#D4AF37] text-black font-medium px-10 py-6 rounded-sm text-lg
               transition-all duration-300 hover:bg-[#b9932b] hover:scale-105"
  >
    Facebook
  </a>

  {/* Instagram */}
  <a
    href="https://www.instagram.com/ruxconstrucciones?igsh=MXd0a2cxeGxvdjZ5Ng=="
    target="_blank"
    className="inline-flex items-center justify-center 
               bg-[#D4AF37] text-black font-medium px-10 py-6 rounded-sm text-lg
               transition-all duration-300 hover:bg-[#b9932b] hover:scale-105"
  >
    Instagram
  </a>

  {/* TikTok */}
  <a
    href="https://www.tiktok.com/@rux.construccione?_r=1&_t=ZS-91ve5yUGp0e"
    target="_blank"
    className="inline-flex items-center justify-center 
               bg-[#D4AF37] text-black font-medium px-10 py-6 rounded-sm text-lg
               transition-all duration-300 hover:bg-[#b9932b] hover:scale-105"
  >
    TikTok
  </a>

</div>
</section>

    </section>
    
  );
};