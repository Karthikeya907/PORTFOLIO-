import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, Bot } from 'lucide-react';
import { MicrocontrollerCore } from './MicrocontrollerCore';
import { AudioEngine } from '../utils/AudioEngine';
import { ResumeModal } from './ResumeModal';
import { usePortfolio } from '../context/PortfolioContext';

// Symmetrical Full-Screen Radial Circuit Pattern
const RadialCircuits = ({ stage }: { stage: number }) => {
  const draw: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.8,
      transition: {
        pathLength: { duration: 3, ease: "easeInOut" as any },
        opacity: { duration: 0.5 }
      }
    }
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="neonBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#999999" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="neonRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bbbbbb" />
          <stop offset="100%" stopColor="#555555" />
        </linearGradient>
      </defs>

      <g fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* We map multiple lines radiating outward */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const isRed = i % 4 === 0;
          return (
            <motion.g key={angle} stroke={isRed ? "url(#neonRed)" : "url(#neonBlue)"} style={{ transformOrigin: '500px 500px', transform: `rotate(${angle}deg)` }}>
              <motion.path
                d="M 500 400 L 500 200 L 600 100 L 600 0"
                variants={draw}
                initial="hidden"
                animate={stage >= 2 ? "visible" : "hidden"}
              />
              <motion.path
                d="M 520 400 L 520 250 L 700 70 L 800 70"
                variants={draw}
                initial="hidden"
                animate={stage >= 2 ? "visible" : "hidden"}
              />
              <motion.path
                d="M 480 400 L 480 280 L 350 150 L 350 0"
                variants={draw}
                initial="hidden"
                animate={stage >= 2 ? "visible" : "hidden"}
              />
              <motion.circle
                cx="600" cy="100" r="4" fill={isRed ? "#888888" : "#ffffff"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: stage >= 2 ? 1 : 0, scale: stage >= 2 ? 1 : 0 }}
                transition={{ delay: 2 }}
              />
              <motion.circle
                cx="700" cy="70" r="6" fill={isRed ? "#888888" : "#ffffff"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: stage >= 2 ? 1 : 0, scale: stage >= 2 ? 1 : 0 }}
                transition={{ delay: 2.2 }}
              />
              <motion.circle
                cx="350" cy="150" r="5" fill={isRed ? "#888888" : "#ffffff"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: stage >= 2 ? 1 : 0, scale: stage >= 2 ? 1 : 0 }}
                transition={{ delay: 2.1 }}
              />
            </motion.g>
          );
        })}
      </g>

      {/* Tiny particles/sparks */}
      {stage >= 2 && Array.from({ length: 5 }).map((_, i) => (
        <motion.circle
          key={`spark-${i}`}
          r="1.5"
          fill="#ffffff"
          initial={{
            x: 500,
            y: 500,
            opacity: 1
          }}
          animate={{
            x: 500 + (Math.random() - 0.5) * 800,
            y: 500 + (Math.random() - 0.5) * 800,
            opacity: [1, 0.5, 0],
            scale: [1, 1.5, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
        />
      ))}
    </svg>
  );
};

export const Identity: React.FC = () => {
  const { profile } = usePortfolio();
  const [bootStage, setBootStage] = useState(0);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [btnGlitch, setBtnGlitch] = useState(false);
  const [soundEnabled] = useState(true);
  const containerRef = useRef<HTMLElement>(null);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    const interval = setInterval(() => {
      setBtnGlitch(true);
      setTimeout(() => setBtnGlitch(false), 220);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // const toggleSound = () => {
  //   const nextState = !soundEnabled;
  //   setSoundEnabled(nextState);
  //   AudioEngine.init();
  //   AudioEngine.setMuted(!nextState);
  //   if (nextState) {
  //     AudioEngine.startContinuousAtmosphere();
  //   }
  // };

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Zoom core out as we scroll down
  // const coreScale = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  // Rotate core as we scroll down
  // const coreRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  // Fade out text as we scroll down
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    // Attempt audio init on mount (browser will require click to unlock if not already)
    AudioEngine.init();
    
    // Background drone
    const s0 = setTimeout(() => {
      if (soundEnabledRef.current) {
        AudioEngine.startContinuousAtmosphere();
        AudioEngine.playWireMovement();
      }
    }, 50);

    const s1 = setTimeout(() => {
      setBootStage(1);
      if (soundEnabledRef.current) {
        AudioEngine.playComponentActivation('processor');
      }
    }, 1000); // 1s: Ignite processor
    
    const s2 = setTimeout(() => {
      setBootStage(2);
      if (soundEnabledRef.current) {
        AudioEngine.playSignalRun();
        setTimeout(() => AudioEngine.playWireConnection(40), 500);
        AudioEngine.playRoboticVoice("Welcome to the digital workspace of");
      }
    }, 2500); // 2.5s: Flow circuits
    
    const s3 = setTimeout(() => {
      setBootStage(3);
      if (soundEnabledRef.current) {
        AudioEngine.playFinalInitialization();
        AudioEngine.playCinematicLowResonance();
        setTimeout(() => AudioEngine.playIdentitySound(), 800);
      }
    }, 5500); // 5.5s: Reveal text

    return () => { 
      clearTimeout(s0); clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); 
      // Do not stopAll here, let atmosphere run across site
    };
  }, []);


  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen bg-transparent flex flex-col items-center justify-center overflow-hidden"
    >

      {/* Dynamic Circuit Background with Mouse Parallax & Smooth Fade Edges */}
      <motion.div
        className="absolute inset-0 z-0"
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        style={{
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      >
        <RadialCircuits stage={bootStage} />
      </motion.div>

      <div className="relative z-10 w-full h-screen flex flex-col items-center justify-center pointer-events-none">

        {/* Central 3D Processor Core with Scroll Effects & Mouse Parallax */}
        <motion.div
          className="w-full h-[600px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{
              opacity: bootStage >= 1 ? 1 : 0,
              scale: bootStage >= 1 ? 1 : 0,
              rotate: bootStage >= 1 ? 0 : -45
            }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
            className="w-full h-full flex items-center justify-center"
          >
            <MicrocontrollerCore />
          </motion.div>
        </motion.div>

        {/* Cinematic Typography Reveal with Scroll Fade & Mouse Parallax */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full z-20 -mt-[70px] px-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: bootStage >= 2 ? 1 : 0
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center px-4 py-6"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 80%)' }}
          >
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: bootStage >= 2 ? 1 : 0, y: bootStage >= 2 ? 0 : -10 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-cyan-400 text-xs sm:text-sm tracking-[0.3em] font-bold mb-2 uppercase"
            >
              Welcome to the digital workspace of
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)', scale: 0.95 }}
              animate={{ 
                opacity: bootStage >= 3 ? 1 : 0, 
                y: bootStage >= 3 ? 0 : 30,
                filter: bootStage >= 3 ? 'blur(0px)' : 'blur(10px)',
                scale: bootStage >= 3 ? 1 : 0.95
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="font-syncopate uppercase text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] mb-2 text-3d transition-all duration-300 cursor-default text-center break-words max-w-full px-2"
            >
              {(profile?.name || 'NAGA KARTHIKEYA GUTHI').toUpperCase()}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: bootStage >= 3 ? 1 : 0, width: bootStage >= 3 ? '100%' : '0%' }}
              transition={{ duration: 1.0, delay: 0.5, ease: "easeInOut" as any }}
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
                  animate={{ opacity: bootStage >= 3 ? 1 : 0 }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
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
        </motion.div>

      </div>

      {/* Centered Resume Button */}
      {bootStage >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.5, ease: "easeOut" }}
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
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </section>
  );
};
