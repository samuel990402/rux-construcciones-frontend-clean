import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleClick = () => {
    const message = "¡Hola! Me gustaría contratar sus servicios.";
    const whatsappUrl = `https://wa.me/523314143835?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#D4AF37] hover:bg-[#b9972f] 
          rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 
          hover:shadow-[#D4AF37]/40"
          aria-label="Contactar por WhatsApp"
        >
          {/* Icono negro como pediste */}
          <MessageCircle className="w-8 h-8 text-black" />

          {/* Efecto pulsación */}
          <span className="absolute inset-0 rounded-full bg-[#D4AF37] animate-ping opacity-20" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
