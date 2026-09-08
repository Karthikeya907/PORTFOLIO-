import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scaleOnHover?: number;
  style?: React.CSSProperties;
}

export const TiltCard: React.FC<TiltCardProps> = ({ 
  children, 
  className = '', 
  maxTilt = 4,
  scaleOnHover = 1.02,
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track pointer coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the coordinates with spring physics
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Map coordinates to rotation (-0.5 to 0.5) => (-maxTilt to maxTilt)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${maxTilt}deg`, `-${maxTilt}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${maxTilt}deg`, `${maxTilt}deg`]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleTouchStart = () => {
    setIsHovered(prev => !prev);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        ...style
      }}
      animate={{
        scale: isHovered ? scaleOnHover : 1,
      }}
      transition={{
        scale: { duration: 0.15, ease: 'easeOut' }
      }}
      className={`will-change-transform cursor-pointer transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};
