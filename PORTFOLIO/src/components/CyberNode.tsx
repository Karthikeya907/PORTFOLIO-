import React from 'react';
import { motion } from 'framer-motion';

const CircuitBackground = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M 0 50 L 50 0 L 100 50 L 50 100 Z" fill="none" stroke="#00d8ff" strokeWidth="0.5" strokeDasharray="2,2" />
  </svg>
);

interface CyberNodeProps {
  title: string;
  subtitle: string;
  icon: any;
  href: string;
  align: 'left' | 'right';
  delay?: number;
}

export const CyberNode: React.FC<CyberNodeProps> = ({ title, subtitle, icon: Icon, href, align, delay = 0 }) => {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={`group relative flex items-center gap-4 cursor-pointer p-4 transition-all duration-300 w-full sm:w-[280px] hover:bg-black/40 border border-transparent hover:border-[#0055ff]/30 rounded-xl overflow-hidden ${align === 'right' ? 'flex-row-reverse' : ''}`}
    >
      {/* Circuit Background on hover */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <CircuitBackground />
      </div>

      {/* Icon Hex Container */}
      <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center z-10">
        {/* Outer Glow */}
        <div className="absolute inset-0 border border-[#00d8ff]/30 rounded-lg group-hover:border-[#00d8ff] transition-colors shadow-[0_0_15px_rgba(0,216,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,216,255,0.4)]" />
        {/* Inner Tech Border */}
        <div className="absolute inset-[2px] border border-[#ff0033]/20 rounded-md" />
        <Icon className="text-[#00d8ff] w-5 h-5 group-hover:text-white transition-colors relative z-10" />
        
        {/* Connection node point */}
        <div className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#ff0033] shadow-[0_0_8px_#ff0033] ${align === 'left' ? '-right-2' : '-left-2'}`} />
      </div>

      {/* Text Content */}
      <div className={`flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
        <span className="text-white font-bold tracking-widest text-sm transition-colors group-hover:text-[#00d8ff]">
          {title}
        </span>
        <span className="text-xs text-gray-400 tracking-[0.2em] group-hover:text-gray-300 transition-colors">
          {subtitle}
        </span>
      </div>

      {/* Animated underline */}
      <div className={`absolute bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#00d8ff]/50 to-transparent w-0 group-hover:w-full transition-all duration-500 ${align === 'left' ? 'left-0' : 'right-0'}`} />
    </motion.a>
  );
};
