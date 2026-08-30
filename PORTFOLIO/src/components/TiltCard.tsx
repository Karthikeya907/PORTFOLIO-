import React, { useRef, useState, useEffect } from 'react';
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
  scaleOnHover = 1,
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

  // Handle scaling and shadow on hover safely across devices
  const [isHovered, setIsHovered] = useState(false);
  const [hasHoverSupport, setHasHoverSupport] = useState(true);

  useEffect(() => {
    // Disable hover effects on touch devices
    setHasHoverSupport(window.matchMedia('(hover: hover)').matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasHoverSupport || !ref.current) return;
    
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
    if (hasHoverSupport) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hasHoverSupport) {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: hasHoverSupport ? rotateX : 0,
        rotateY: hasHoverSupport ? rotateY : 0,
        transformStyle: 'preserve-3d',
        ...style
      }}
      animate={{
        scale: isHovered ? scaleOnHover : 1,
        y: isHovered ? -2 : 0,
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0,0,0,0.4)' 
          : '0 0 0 rgba(0,0,0,0)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`relative will-change-transform ${className}`}
    >
      <div 
        style={{ transform: 'translateZ(10px)' }}
        className="w-full h-full relative"
      >
        {children}
      </div>
    </motion.div>
  );
};
