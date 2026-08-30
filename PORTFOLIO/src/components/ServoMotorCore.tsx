import React from 'react';
import { motion } from 'framer-motion';

export const ServoMotorCore: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      <svg
        className="w-[480px] h-[480px] md:w-[600px] md:h-[600px] opacity-25"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="servoCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c8e6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0044aa" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="servoPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00c8e6" stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="motorCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00c8e6" stopOpacity="0.15" />
            <stop offset="70%" stopColor="#7e22ce" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Radial Core Glow */}
        <circle cx="250" cy="250" r="220" fill="url(#motorCoreGlow)" />

        {/* Outer Stator Casing & Mounting Ears */}
        <g stroke="rgba(0, 240, 255, 0.3)" strokeWidth="2">
          {/* Main Rectangular Servo Body Outline */}
          <rect x="150" y="150" width="200" height="200" rx="16" fill="rgba(10, 15, 25, 0.85)" stroke="url(#servoCyan)" strokeWidth="3" />
          
          {/* Servo Mounting Brackets */}
          <rect x="110" y="170" width="40" height="30" rx="4" fill="rgba(15, 25, 40, 0.9)" stroke="rgba(0, 240, 255, 0.5)" />
          <rect x="110" y="300" width="40" height="30" rx="4" fill="rgba(15, 25, 40, 0.9)" stroke="rgba(0, 240, 255, 0.5)" />
          <rect x="350" y="170" width="40" height="30" rx="4" fill="rgba(15, 25, 40, 0.9)" stroke="rgba(0, 240, 255, 0.5)" />
          <rect x="350" y="300" width="40" height="30" rx="4" fill="rgba(15, 25, 40, 0.9)" stroke="rgba(0, 240, 255, 0.5)" />

          {/* Mounting Screw Holes */}
          <circle cx="125" cy="185" r="5" fill="#000" stroke="#00f0ff" strokeWidth="1.5" />
          <circle cx="125" cy="315" r="5" fill="#000" stroke="#00f0ff" strokeWidth="1.5" />
          <circle cx="375" cy="185" r="5" fill="#000" stroke="#00f0ff" strokeWidth="1.5" />
          <circle cx="375" cy="315" r="5" fill="#000" stroke="#00f0ff" strokeWidth="1.5" />
        </g>

        {/* Outer Circular Bearing Race */}
        <circle cx="250" cy="250" r="110" stroke="rgba(147, 51, 234, 0.4)" strokeWidth="2" strokeDasharray="6 6" />

        {/* Counter-rotating Internal Gear Ring */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '250px 250px' }}
        >
          <circle cx="250" cy="250" r="85" stroke="url(#servoPurple)" strokeWidth="2.5" strokeDasharray="12 8" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="250"
              y1="165"
              x2="250"
              y2="173"
              stroke="#00f0ff"
              strokeWidth="2"
              transform={`rotate(${deg} 250 250)`}
            />
          ))}
        </motion.g>

        {/* Main Servo Shaft Hub */}
        <circle cx="250" cy="250" r="45" fill="rgba(5, 10, 20, 0.95)" stroke="url(#servoCyan)" strokeWidth="3" />
        <circle cx="250" cy="250" r="18" fill="rgba(0, 240, 255, 0.2)" stroke="#00f0ff" strokeWidth="2" />

        {/* REAL-TIME SWEEPING SERVO HORN (ACTUATOR ARM MOVEMENT - 0° to 180° Sweep) */}
        <motion.g
          animate={{ rotate: [-90, 90, -90] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '250px 250px' }}
        >
          {/* Dual Cross Servo Horn Arm */}
          <path
            d="M 250 110 L 265 235 L 390 250 L 265 265 L 250 390 L 235 265 L 110 250 L 235 235 Z"
            fill="rgba(0, 240, 255, 0.15)"
            stroke="url(#servoCyan)"
            strokeWidth="3"
          />

          {/* Servo Horn Holes */}
          {[135, 160, 185, 210, 290, 315, 340, 365].map((_, idx) => {
            const isVertical = idx < 4;
            const offset = (idx % 4) * 25 + 130;
            return (
              <circle
                key={idx}
                cx={isVertical ? 250 : offset}
                cy={isVertical ? offset : 250}
                r="4"
                fill="#000"
                stroke="#00f0ff"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Center Shaft Screw */}
          <circle cx="250" cy="250" r="10" fill="#00f0ff" />
          <line x1="244" y1="250" x2="256" y2="250" stroke="#000" strokeWidth="2" />
          <line x1="250" y1="244" x2="250" y2="256" stroke="#000" strokeWidth="2" />
        </motion.g>

        {/* Oscillating Angle Sweep Indicator Arc */}
        <motion.path
          d="M 140 250 A 110 110 0 0 1 360 250"
          stroke="rgba(0, 240, 255, 0.6)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="8 6"
        />

        {/* Pulse Indicator Text */}
        <text x="250" y="420" textAnchor="middle" fill="#00f0ff" fontSize="11" fontFamily="monospace" letterSpacing="3">
          PWM 50Hz • SERVO ACTUATOR ACTIVE
        </text>
      </svg>
    </div>
  );
};
