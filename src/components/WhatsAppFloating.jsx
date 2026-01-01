import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloating = () => {
  const [isVisible, setIsVisible] = useState(true); // siempre visible según tu pedido

  const handleClick = () => {
    const message = '¡Hola! Me gustaría contratar sus servicios.';
    const whatsappUrl = `https://wa.me/523314143835?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleClick}
          className="
            fixed bottom-8 right-8 
            w-16 h-16 
            rounded-full 
            bg-[#D4AF37] 
            shadow-2xl 
            flex items-center justify-center 
            z-50 
            transition-all duration-300 
            hover:shadow-[#D4AF37]/50
          "
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="w-8 h-8 text-black" />

          {/* Pulsing ring */}
          <span className="absolute inset-0 rounded-full bg-[#D4AF37] animate-ping opacity-20" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
