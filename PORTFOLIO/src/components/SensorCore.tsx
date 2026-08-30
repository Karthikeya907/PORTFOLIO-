import React from 'react';
import { motion } from 'framer-motion';

export const SensorCore: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#8a2be2]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <svg viewBox="0 0 400 400" className="w-[100%] max-w-[600px] h-auto overflow-visible opacity-30" style={{ filter: 'drop-shadow(0px 0px 10px rgba(138, 43, 226, 0.2))' }}>
        <defs>
          <linearGradient id="sensorSurface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a0033" />
            <stop offset="50%" stopColor="#0d001a" />
            <stop offset="100%" stopColor="#05000a" />
          </linearGradient>
          <radialGradient id="beamLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#d400ff" />
            <stop offset="100%" stopColor="#8a2be2" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g>
          {/* Scanning Radar Beams */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ originX: "200px", originY: "200px" }}
          >
            <path d="M 200 200 L 200 50 A 150 150 0 0 1 350 200 Z" fill="url(#beamLight)" opacity="0.1" />
            <line x1="200" y1="200" x2="200" y2="50" stroke="#d400ff" strokeWidth="2" opacity="0.5" />
          </motion.g>

          {/* Concentric Sensor Rings */}
          <circle cx="200" cy="200" r="160" fill="none" stroke="#8a2be2" strokeWidth="1" strokeDasharray="5 15" opacity="0.3" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="#8a2be2" strokeWidth="2" opacity="0.4" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="#d400ff" strokeWidth="1" strokeDasharray="10 10" opacity="0.5" />

          {/* Main Sensor Body */}
          <rect x="150" y="150" width="100" height="100" rx="20" fill="url(#sensorSurface)" stroke="#8a2be2" strokeWidth="2" />
          <circle cx="200" cy="200" r="30" fill="#05000a" stroke="#d400ff" strokeWidth="3" />
          <motion.circle 
            cx="200" cy="200" r="15" fill="#d400ff"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Data Processing Nodes */}
          {[45, 135, 225, 315].map((angle, i) => (
            <g key={`node-${i}`} transform={`rotate(${angle} 200 200)`}>
              <line x1="200" y1="150" x2="200" y2="120" stroke="#8a2be2" strokeWidth="2" />
              <circle cx="200" cy="110" r="6" fill="#8a2be2" />
              <motion.circle 
                cx="200" cy="110" r="3" fill="#ffffff"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            </g>
          ))}

          {/* Target Indicators (Blips) */}
          <motion.circle cx="100" cy="100" r="4" fill="#ffffff" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 4, delay: 0.5, repeat: Infinity }} />
          <motion.circle cx="300" cy="150" r="4" fill="#ffffff" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 4, delay: 1.5, repeat: Infinity }} />
          <motion.circle cx="250" cy="300" r="4" fill="#ffffff" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 4, delay: 2.5, repeat: Infinity }} />

          {/* Angled Motherboard Traces to Global Circuit */}
          {/* Top Wires */}
          <path d="M 150 150 L 150 50 L 50 0" fill="none" stroke="#8a2be2" strokeWidth="3" opacity="0.6" />
          <path d="M 250 150 L 250 50 L 350 0" fill="none" stroke="#8a2be2" strokeWidth="3" opacity="0.6" />
          <circle cx="50" cy="0" r="4" fill="#d400ff" />
          <circle cx="350" cy="0" r="4" fill="#d400ff" />
          {/* Side Wires */}
          <path d="M 150 200 L 50 200 L 0 150" fill="none" stroke="#d400ff" strokeWidth="3" opacity="0.6" />
          <path d="M 250 200 L 350 200 L 400 150" fill="none" stroke="#d400ff" strokeWidth="3" opacity="0.6" />
          {/* Bottom Wires */}
          <path d="M 150 250 L 150 320 L 50 400" fill="none" stroke="#8a2be2" strokeWidth="3" opacity="0.6" />
          <path d="M 250 250 L 250 320 L 350 400" fill="none" stroke="#8a2be2" strokeWidth="3" opacity="0.6" />
          <path d="M 200 250 L 200 400" fill="none" stroke="#8a2be2" strokeWidth="3" opacity="0.8" strokeDasharray="10 10" className="animate-[dash_3s_linear_infinite]" />
          <circle cx="50" cy="400" r="4" fill="#d400ff" />
          <circle cx="350" cy="400" r="4" fill="#d400ff" />
        </g>
      </svg>
    </div>
  );
};
