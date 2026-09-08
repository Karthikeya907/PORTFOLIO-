import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Bot } from 'lucide-react';
import { InterlockingGearsCore } from './InterlockingGearsCore';
import { AudioEngine } from '../utils/AudioEngine';
import { ResumeModal } from './ResumeModal';
import { usePortfolio } from '../context/PortfolioContext';

// Symmetrical Full-Screen Radial Circuit Pattern (With Slow Spreading Side Wires)
const RadialCircuits = () => {
  const draw: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.8,
      transition: {
        pathLength: { duration: 3.5, ease: "easeInOut" as any },
        opacity: { duration: 0.8 }
      }
    }
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="cyanWire" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#0066ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="purpleWire" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <g fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const isPurple = i % 2 === 1;
          const strokeUrl = isPurple ? "url(#purpleWire)" : "url(#cyanWire)";

          return (
            <g key={angle} stroke={strokeUrl} style={{ transformOrigin: '500px 500px', transform: `rotate(${angle}deg)` }}>
              {/* Circuit Bus Side Wires Drawing Inward */}
              <motion.path
                d="M 500 400 L 500 200 L 600 100 L 600 0"
                variants={draw}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M 520 400 L 520 250 L 700 70 L 800 70"
                strokeWidth="1.5"
                variants={draw}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M 480 400 L 480 280 L 350 150 L 350 0"
                strokeWidth="1.5"
                variants={draw}
                initial="hidden"
                animate="visible"
              />

              {/* Glowing LED Nodes */}
              <circle cx="600" cy="100" r="4" fill={isPurple ? "#a855f7" : "#00f0ff"} className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
              <circle cx="700" cy="70" r="5" fill={isPurple ? "#c084fc" : "#00f0ff"} className="drop-shadow-[0_0_10px_rgba(0,240,255,0.9)]" />
              <circle cx="350" cy="150" r="4" fill={isPurple ? "#a855f7" : "#0066ff"} className="drop-shadow-[0_0_8px_rgba(0,102,255,0.8)]" />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export const Identity: React.FC = () => {
  const { profile } = usePortfolio();
  const [bootStage, setBootStage] = useState(3);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [btnGlitch, setBtnGlitch] = useState(false);
  const [soundEnabled] = useState(true);
  const containerRef = useRef<HTMLElement>(null);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    const interval = setInterval(() => {
      setBtnGlitch(true);
      setTimeout(() => setBtnGlitch(false), 220);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    // Attempt audio init on mount
    AudioEngine.init();
    
    if (soundEnabledRef.current) {
      AudioEngine.startContinuousAtmosphere();
    }
  }, []);


  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen bg-transparent flex flex-col items-center justify-center overflow-hidden"
    >

      {/* Dynamic Circuit Background with Side Wires Spreading Inward */}
      <div
        className="absolute inset-0 z-0"
        style={{
          maskImage: 'radial-gradient(circle at center, black 55%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 55%, transparent 100%)'
        }}
      >
        <RadialCircuits />
      </div>

      <div className="relative z-10 w-full h-screen flex flex-col items-center justify-center pointer-events-none">

        {/* Circular Rotating Gear Core with Center Glowing Light (Appears First) */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] flex items-center justify-center -mt-[60px]"
        >
          {/* Ambient Center Glow */}
          <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none animate-pulse" />
          
          {/* Interlocking Mechanical Gear Core with Center Glowing Light */}
          <div className="w-full h-full flex items-center justify-center">
            <InterlockingGearsCore />
          </div>
        </motion.div>

        {/* Cinematic Typography Reveal (Letters appear AFTER gears assemble & wires spread) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full z-20 -mt-[70px] px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 2.3, ease: "easeOut" }}
            className="flex flex-col items-center px-4 py-6"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 80%)' }}
          >
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 2.5, ease: "easeOut" }}
              className="text-cyan-400 text-xs sm:text-sm tracking-[0.3em] font-bold mb-2 uppercase"
            >
              Welcome to the digital workspace of
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 2.8, ease: "easeOut" }}
              className="font-syncopate uppercase text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] mb-2 text-3d transition-all duration-300 cursor-default text-center break-words max-w-full px-2"
            >
              {(profile?.name || 'NAGA KARTHIKEYA GUTHI').toUpperCase()}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ duration: 1.0, delay: 3.1, ease: "easeInOut" as any }}
              className="h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent max-w-[800px] w-full mt-3 mb-4"
            />

            {(() => {
              const rawTitle = profile?.title || 'CSE GRADUATE • ROBOTICS & EMBEDDED SYSTEMS ENGINEER';
              const titleParts = rawTitle.includes('•') 
                ? rawTitle.split('•').map(s => s.trim()) 
                : [rawTitle, 'ROBOTICS & EMBEDDED SYSTEMS ENGINEER'];
              const titleLine1 = titleParts[0] || 'CSE GRADUATE';
              const titleLine2 = titleParts[1] || 'ROBOTICS & EMBEDDED SYSTEMS ENGINEER';

              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 3.4, ease: "easeOut" }}
                  className="flex flex-col items-center gap-2 text-center max-w-3xl px-3 w-full"
                >
                  {/* Line 1 */}
                  <p className="text-xs sm:text-base md:text-xl font-bold uppercase tracking-wider sm:tracking-[0.25em] text-white drop-shadow-sm break-words">
                    {titleLine1}
                  </p>
                  {/* Line 2 */}
                  <p className="text-xs sm:text-sm md:text-lg text-white font-bold uppercase tracking-wider sm:tracking-[0.2em] mt-1 drop-shadow-sm break-words">
                    {titleLine2}
                  </p>
                  {/* Line 3: Short Introduction */}
                  {profile?.shortIntro && (
                    <p className="text-xs sm:text-base md:text-lg font-mono text-gray-200 font-medium max-w-3xl text-center mt-3 leading-relaxed tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] break-words">
                      {profile.shortIntro}
                    </p>
                  )}
                </motion.div>
              );
            })()}
            

          </motion.div>
        </div>

      </div>

      {/* Centered Resume Button */}
      {bootStage >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 3.7, ease: "easeOut" }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
        >
          <button 
            onClick={() => setIsResumeOpen(true)}
            className={`group relative px-10 py-4 bg-black/90 backdrop-blur-md font-mono font-bold text-xs sm:text-sm tracking-[0.25em] uppercase border-2 transition-all duration-300 flex items-center gap-3 cursor-pointer hover:scale-[1.07] hover:-translate-y-1 ${
              btnGlitch 
                ? 'border-fuchsia-500 text-fuchsia-400 translate-x-[2px] shadow-[0_0_25px_rgba(236,72,153,0.9)]' 
                : 'border-cyan-500/80 text-cyan-300 hover:border-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.9),0_0_20px_rgba(236,72,153,0.6)]'
            }`}
            style={{
              clipPath: 'polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)'
            }}
          >
            {/* Robotics Joint Rivet Bolts */}
            <span className="absolute top-2 left-4 w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_5px_#00f0ff]" />
            <span className="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_5px_#00f0ff]" />
            <span className="absolute bottom-2 left-4 w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_5px_#00f0ff]" />
            <span className="absolute bottom-2 right-4 w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_5px_#00f0ff]" />

            {/* Outer Corner Target Brackets */}
            <span className={`absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 transition-all duration-300 ${btnGlitch ? 'border-fuchsia-500' : 'border-cyan-400 group-hover:scale-125 group-hover:border-white'}`} />
            <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 transition-all duration-300 ${btnGlitch ? 'border-fuchsia-500' : 'border-cyan-400 group-hover:scale-125 group-hover:border-white'}`} />
            
            <Bot size={18} className={`transition-all duration-300 ${btnGlitch ? 'text-fuchsia-400' : 'text-cyan-400 group-hover:text-white group-hover:rotate-12 group-hover:scale-110'}`} />
            <span className="relative z-10 font-bold">VIEW RESUME</span>
            <FileText size={15} className="text-cyan-400/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        </motion.div>
      )}

      {/* Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </section>
  );
};
