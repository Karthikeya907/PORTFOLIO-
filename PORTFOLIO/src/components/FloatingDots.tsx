import React from 'react';
import { motion } from 'framer-motion';

export const FloatingDots: React.FC = () => {
  // Generate a random array of 60 dots
  const dots = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100, // starting position percentage
    duration: Math.random() * 30 + 20, // 20s to 50s float time
    delay: Math.random() * -20, // negative delay so they are already on screen
    color: ['#00ffff', '#00ffaa', '#ff0055', '#ffffff', '#0055ff'][Math.floor(Math.random() * 5)],
    opacity: Math.random() * 0.5 + 0.1
  }));

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            backgroundColor: dot.color,
            opacity: dot.opacity,
            boxShadow: `0 0 ${dot.size * 2}px ${dot.color}`
          }}
          animate={{
            y: ['0vh', '-110vh'],
            x: ['0vw', `${(Math.random() - 0.5) * 20}vw`]
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: "linear",
            delay: dot.delay
          }}
        />
      ))}
    </div>
  );
};
