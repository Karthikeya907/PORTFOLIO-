import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 800px (approx height of hero section)
      if (window.scrollY > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
          <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
        >
          <button
            onClick={scrollToTop}
            className="group relative flex flex-col items-center justify-center p-2 rounded-full hover:bg-black/20 transition-colors"
            aria-label="Scroll to top"
          >
            {/* The circular button */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#0a0a0a] border border-cyan-main/30 hover:border-cyan-main/80 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <div className="absolute inset-0 rounded-full bg-cyan-main/5 group-hover:bg-cyan-main/10 transition-colors" />
              <ChevronUp size={20} className="text-cyan-main group-hover:-translate-y-1 transition-all duration-300" />
            </div>
            {/* Text label */}
            <span className="text-[10px] tracking-widest text-text-muted mt-2 group-hover:text-cyan-main transition-colors font-bold uppercase">
              Back to Top
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
