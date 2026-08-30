import { useEffect, useState } from 'react';

export const GlobalCircuits = () => {
  const [docHeight, setDocHeight] = useState(6000);
  const [startY, setStartY] = useState(350);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      // Allow DOM to settle before reading scrollHeight
      setTimeout(() => {
        setDocHeight(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
        setStartY(window.innerHeight / 2);
      }, 100);
    };
    updateDimensions();
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('resize', updateDimensions);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full z-0 pointer-events-none opacity-25" style={{ height: `${docHeight}px` }}>
      {/* Flashlight contrast effect */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none mix-blend-overlay opacity-15"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,240,255,0.15), transparent 40%)`
        }}
      />
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))' }}>
        <defs>
          <linearGradient id="neonBlueV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0055ff" stopOpacity="0" />
            <stop offset="10%" stopColor="#00d8ff" stopOpacity="0.4" />
            <stop offset="90%" stopColor="#0055ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00d8ff" stopOpacity="0" />
          </linearGradient>
          <filter id="glowV">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g fill="none" strokeWidth="1">
          
          {/* Circuits originating from the center eye (50%, 50vh) and going down */}
          
          {/* Center-Left Branch */}
          {/* Base Traces */}
          <line x1="50%" y1={startY} x2="20%" y2="600" stroke="#00d8ff" strokeWidth="1" opacity="0.2" />
          <line x1="20%" y1="600" x2="20%" y2="100%" stroke="#00d8ff" strokeWidth="1" opacity="0.2" />
          {/* Energy Pulses */}
          <line x1="50%" y1={startY} x2="20%" y2="600" stroke="#00ffff" strokeWidth="1.5" strokeDasharray="30 400" className="animate-[dash_12s_linear_infinite]" opacity="0.6" />
          <line x1="20%" y1="600" x2="20%" y2="100%" stroke="#00ffff" strokeWidth="1.5" strokeDasharray="50 500" className="animate-[dash_18s_linear_infinite]" opacity="0.6" />
          
          <line x1="50%" y1={startY} x2="10%" y2="800" stroke="#0055ff" strokeWidth="1" opacity="0.2" />
          <line x1="10%" y1="800" x2="10%" y2="100%" stroke="#0055ff" strokeWidth="1" opacity="0.2" />
          <line x1="50%" y1={startY} x2="10%" y2="800" stroke="#00aaff" strokeWidth="1.5" strokeDasharray="40 500" className="animate-[dash_14s_linear_infinite]" opacity="0.5" />
          <line x1="10%" y1="800" x2="10%" y2="100%" stroke="#00aaff" strokeWidth="1.5" strokeDasharray="60 600" className="animate-[dash_22s_linear_infinite]" opacity="0.5" />

          <line x1="50%" y1={startY} x2="30%" y2="1000" stroke="#00d8ff" strokeWidth="1" opacity="0.2" />
          <line x1="30%" y1="1000" x2="30%" y2="100%" stroke="#00d8ff" strokeWidth="1" opacity="0.2" />
          <line x1="50%" y1={startY} x2="30%" y2="1000" stroke="#00ffff" strokeWidth="1.5" strokeDasharray="35 600" className="animate-[dash_16s_linear_infinite]" opacity="0.5" />
          <line x1="30%" y1="1000" x2="30%" y2="100%" stroke="#00ffff" strokeWidth="1.5" strokeDasharray="70 700" className="animate-[dash_28s_linear_infinite]" opacity="0.5" />
          
          {/* Center-Right Branch */}
          <line x1="50%" y1={startY} x2="80%" y2="600" stroke="#00d8ff" strokeWidth="1" opacity="0.2" />
          <line x1="80%" y1="600" x2="80%" y2="100%" stroke="#00d8ff" strokeWidth="1" opacity="0.2" />
          <line x1="50%" y1={startY} x2="80%" y2="600" stroke="#00ffff" strokeWidth="1.5" strokeDasharray="30 400" className="animate-[dash_13s_linear_infinite]" opacity="0.6" />
          <line x1="80%" y1="600" x2="80%" y2="100%" stroke="#00ffff" strokeWidth="1.5" strokeDasharray="50 500" className="animate-[dash_19s_linear_infinite]" opacity="0.6" />
          
          <line x1="50%" y1={startY} x2="90%" y2="800" stroke="#0055ff" strokeWidth="1" opacity="0.2" />
          <line x1="90%" y1="800" x2="90%" y2="100%" stroke="#0055ff" strokeWidth="1" opacity="0.2" />
          <line x1="50%" y1={startY} x2="90%" y2="800" stroke="#00aaff" strokeWidth="1.5" strokeDasharray="40 500" className="animate-[dash_15s_linear_infinite]" opacity="0.5" />
          <line x1="90%" y1="800" x2="90%" y2="100%" stroke="#00aaff" strokeWidth="1.5" strokeDasharray="60 600" className="animate-[dash_21s_linear_infinite]" opacity="0.5" />

          <line x1="50%" y1={startY} x2="70%" y2="1000" stroke="#00d8ff" strokeWidth="1" opacity="0.2" />
          <line x1="70%" y1="1000" x2="70%" y2="100%" stroke="#00d8ff" strokeWidth="1" opacity="0.2" />
          <line x1="50%" y1={startY} x2="70%" y2="1000" stroke="#00ffff" strokeWidth="1.5" strokeDasharray="35 600" className="animate-[dash_17s_linear_infinite]" opacity="0.5" />
          <line x1="70%" y1="1000" x2="70%" y2="100%" stroke="#00ffff" strokeWidth="1.5" strokeDasharray="70 700" className="animate-[dash_26s_linear_infinite]" opacity="0.5" />

          {/* Direct Downward Branch */}
          <line x1="50%" y1={startY} x2="50%" y2="100%" stroke="#00aaff" strokeWidth="1" opacity="0.3" />
          <line x1="50%" y1={startY} x2="50%" y2="100%" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="20 400" className="animate-[dash_10s_linear_infinite]" opacity="0.5" />
          
          {/* Horizontal branching connectors all the way down */}
          {Array.from({ length: 15 }).map((_, i) => {
            const y = 800 + i * 400; // Spread down the page every 400px
            return (
              <g key={i}>
                <line x1="20%" y1={y} x2="30%" y2={y} stroke="#00d8ff" strokeWidth="1" opacity="0.2" />
                <line x1="70%" y1={y + 150} x2="80%" y2={y + 150} stroke="#0055ff" strokeWidth="1" opacity="0.2" />
                
                {/* Horizontal Pulses */}
                <line x1="20%" y1={y} x2="30%" y2={y} stroke="#00ffff" strokeWidth="1" strokeDasharray="10 100" className="animate-[dash_5s_linear_infinite]" opacity="0.5" />
                <line x1="70%" y1={y + 150} x2="80%" y2={y + 150} stroke="#00aaff" strokeWidth="1" strokeDasharray="10 100" className="animate-[dash_6s_linear_infinite]" opacity="0.5" />

                <circle cx="20%" cy={y} r="2" fill="#00ffff" opacity="0.6" />
                <circle cx="80%" cy={y + 150} r="2" fill="#00aaff" opacity="0.6" />
              </g>
            );
          })}
        </g>
      </svg>
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -2000;
          }
        }
      `}</style>
    </div>
  );
};
