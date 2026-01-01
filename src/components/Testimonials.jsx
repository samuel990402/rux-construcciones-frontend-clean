import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Award, Shield } from 'lucide-react';

export const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      text: 'Excelente atención y acabados impecables. Cada detalle fue cuidado con profesionalismo.',
      author: 'Familia Ramírez',
      location: 'Zapopan'
    },
    {
      text: 'Superaron nuestras expectativas. Puntuales, profesionales y con una calidad excepcional.',
      author: 'Alejandro R.',
      location: 'Guadalajara'
    },
    {
      text: 'La mejor decisión fue contratar a RUX. Nuestro hogar quedó espectacular.',
      author: 'María G.',
      location: 'Tlaquepaque'
    }
  ];

  const badges = [
    { icon: Shield, text: 'Garantía de calidad' },
    { icon: Award, text: 'Obras certificadas' },
    { icon: Star, text: 'Atención 24/7' }
  ];

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://customer-assets.emergentagent.com/job_diseno-mexicano/artifacts/pz6fm2zx_WhatsApp%20Image%202025-10-29%20at%202.31.34%20PM%20%286%29.jpeg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-6" />
          <h2 className="text-5xl md:text-6xl font-light text-white mb-4">
            Lo que opinan <span className="text-[#D4AF37] italic">nuestros clientes</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 * index, duration: 0.8 }}
              className="backdrop-blur-md bg-zinc-950/50 border border-[#D4AF37]/20 rounded-sm p-8 hover:border-[#D4AF37]/50 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">"{testimonial.text}"</p>
              <div className="border-t border-[#D4AF37]/20 pt-4">
                <p className="text-white font-medium">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-8"
        >
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="flex items-center gap-3 backdrop-blur-md bg-zinc-950/50 border border-[#D4AF37]/30 rounded-full px-6 py-3">
                <Icon className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-white font-light">{badge.text}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};