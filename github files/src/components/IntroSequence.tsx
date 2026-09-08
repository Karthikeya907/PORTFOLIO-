import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioEngine } from '../utils/AudioEngine';
import { Volume2, VolumeX } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface IntroSequenceProps {
  onComplete: () => void;
}

const RoboticEye: React.FC<{ active: boolean, reacting: boolean, direction: 'cw' | 'ccw' }> = ({ active, reacting, direction }) => {
  const rotateDir = direction === 'cw' ? 360 : -360;
  
  return (
    <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
      {/* Base background ring */}
      <div className="absolute inset-0 rounded-full border border-gray-800 bg-[#050505]" />
      
      <AnimatePresence>
        {active && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Outer rotating ring */}
            <motion.div 
              animate={{ 
                rotate: rotateDir,
                borderColor: reacting ? ['#ef4444', '#fca5a5', '#ef4444'] : '#ef4444',
                boxShadow: reacting ? '0 0 25px rgba(239, 68, 68, 0.9)' : '0 0 8px rgba(239, 68, 68, 0.3)'
              }}
              transition={{ 
                rotate: { duration: reacting ? 1.0 : 6, repeat: Infinity, ease: "linear" },
                borderColor: { duration: 0.2 },
                boxShadow: { duration: 0.2 }
              }}
              className="absolute inset-1 rounded-full border border-red-500/50 border-t-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            />
            
            {/* Middle dashed ring */}
            <motion.div 
              animate={{ rotate: -rotateDir }}
              transition={{ duration: reacting ? 2 : 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[8px] rounded-full border border-dashed border-red-500/60"
            />
            
            {/* Inner pupil/lens */}
            <div className="absolute inset-[18px] rounded-full bg-red-950/40 border border-red-500/60 shadow-[inset_0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center">
              <motion.div 
                animate={{ 
                  scale: reacting ? [1, 1.4, 1] : [1, 1.05, 1], 
                  opacity: reacting ? [1, 1, 1] : [0.6, 0.8, 0.6] 
                }}
                transition={{ duration: reacting ? 0.2 : 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444,0_0_20px_#ef4444]"
              />
            </div>
            
            {/* Scanning crosshair line */}
            <motion.div 
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center opacity-40"
            >
              <div className="w-full h-[1px] bg-red-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const { profile } = usePortfolio();
  const [phase, setPhase] = useState<number>(0);
  const [reactingLeft, setReactingLeft] = useState<boolean>(false);
  const [reactingRight, setReactingRight] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = React.useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    AudioEngine.setMuted(!nextState);
    if (nextState) {
      AudioEngine.init();
      AudioEngine.startContinuousAtmosphere();
    }
  };

  const triggerReaction = (side: 'left' | 'right' | 'both') => {
    if (side === 'left' || side === 'both') {
      setReactingLeft(true);
      setTimeout(() => setReactingLeft(false), 1200); // Glow fades around 1.2s
    }
    if (side === 'right' || side === 'both') {
      setReactingRight(true);
      setTimeout(() => setReactingRight(false), 1200);
    }
  };

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    if (soundEnabled && phase === 0) {
      AudioEngine.init();
      timeouts.push(setTimeout(() => {
        if (soundEnabledRef.current) AudioEngine.startContinuousAtmosphere();
      }, 50));

      // Wire movements
      [0, 150, 300, 450, 600].forEach(delay => {
        timeouts.push(setTimeout(() => { if (soundEnabledRef.current) AudioEngine.playWireMovement(); }, delay));
      });
      
      // Much faster 1.35s total connection timing
      const connections = [
        { time: 1000, pitch: -30, side: 'left' },
        { time: 1300, pitch: 40, side: 'right' },
        { time: 1600, pitch: -10, side: 'left' },
        { time: 1800, pitch: 20, side: 'right' },
        { time: 2000, pitch: -20, side: 'left' },
        { time: 2200, pitch: 60, side: 'right' },
        { time: 2400, pitch: 0, side: 'both' }
      ];
      
      connections.forEach(conn => {
        timeouts.push(setTimeout(() => { 
          if (soundEnabledRef.current) AudioEngine.playWireConnection(conn.pitch);
          triggerReaction(conn.side as 'left'|'right'|'both');
        }, conn.time));
      });
    }

    // Phase 1: Wires Connected
    timeouts.push(setTimeout(() => {
      setPhase(1);
      if (soundEnabledRef.current) AudioEngine.playSignalRun();
    }, 2600));

    // Phase 2: Core Base Online
    timeouts.push(setTimeout(() => {
      setPhase(2);
      if (soundEnabledRef.current) {
        AudioEngine.playComponentActivation('processor');
      }
    }, 3800));

    // Phase 3: Left Eye Online
    timeouts.push(setTimeout(() => {
      setPhase(3);
      if (soundEnabledRef.current) {
        AudioEngine.playComponentActivation('sensor');
        triggerReaction('left');
      }
    }, 5000));

    // Phase 4: Right Eye Online & Full Systems
    timeouts.push(setTimeout(() => {
      setPhase(4);
      if (soundEnabledRef.current) {
        AudioEngine.playComponentActivation('sensor');
        triggerReaction('both');
      }
    }, 6200));

    // Phase 5: Identity Reveal
    timeouts.push(setTimeout(() => {
      setPhase(5);
      if (soundEnabledRef.current) {
        AudioEngine.playFinalInitialization();
        AudioEngine.playCinematicLowResonance();
        timeouts.push(setTimeout(() => { if (soundEnabledRef.current) AudioEngine.playIdentitySound(); }, 800));
      }
    }, 7800));

    // Phase 6: Unlock
    timeouts.push(setTimeout(() => {
      handleUnlock();
    }, 9500));

    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, []);

  const handleUnlock = () => {
    if (soundEnabledRef.current) {
      AudioEngine.startContinuousAtmosphere();
    }
    onComplete();
  };

  let cameraScale = 1;
  let cameraY = 0;

  if (phase === 0 || phase === 1) {
    cameraScale = 1.3;
  } else if (phase === 2) {
    cameraScale = 1.2;
  } else if (phase === 3) {
    cameraScale = 1.1;
  } else if (phase >= 4) {
    cameraScale = 1.0;
  }

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020202] overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 1.5, ease: 'easeInOut' } }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,25,0.4)_0%,rgba(2,2,2,1)_100%)]" />

      <motion.div 
        className="relative w-full h-full flex items-center justify-center origin-center"
        animate={{ scale: cameraScale, y: cameraY }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      >
        
        {/* ==================================================== */}
        {/* CIRCUITS LAYER (SVG) */}
        {/* ==================================================== */}
        <AnimatePresence>
          {phase < 6 && (
            <motion.svg 
              className="absolute w-[2000px] h-[2000px] z-10 pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
              viewBox="0 0 2000 2000" 
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <defs>
                <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#991b1b" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* 
                Center is at 1000, 1000.
                Core is w=360, h=180.
                Core Boundaries: X: 820 to 1180. Y: 910 to 1090.
              */}

              {/* Top Left Wire -> VIOLET */}
              <motion.path d="M 0,400 L 400,400 L 600,600 L 870,600 L 870,910" fill="transparent" stroke="#8b5cf6" strokeWidth="2" opacity={reactingLeft ? 1 : 0.4}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "linear", delay: 0.2 }} />
              <motion.circle r="3" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]"
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: 1 }}
                style={{ offsetPath: "path('M 0,400 L 400,400 L 600,600 L 870,600 L 870,910')" } as any} />

              {/* Left Wire -> BLUE */}
              <motion.path d="M 0,1100 L 600,1100 L 700,1000 L 820,1000" fill="transparent" stroke="#3b82f6" strokeWidth="2" opacity={reactingLeft ? 1 : 0.4}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: "linear", delay: 0.6 }} />
              <motion.circle r="3" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]"
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear", delay: 1.3 }}
                style={{ offsetPath: "path('M 0,1100 L 600,1100 L 700,1000 L 820,1000')" } as any} />

              {/* Bottom Left Wire -> CYAN */}
              <motion.path d="M 300,2000 L 300,1400 L 500,1200 L 880,1200 L 880,1090" fill="transparent" stroke="#06b6d4" strokeWidth="2" opacity={reactingLeft ? 1 : 0.4}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: "linear", delay: 0.1 }} />
              <motion.circle r="3" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]"
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear", delay: 1.0 }}
                style={{ offsetPath: "path('M 300,2000 L 300,1400 L 500,1200 L 880,1200 L 880,1090')" } as any} />

              {/* Bottom Wire -> RED */}
              <motion.path d="M 1000,2000 L 1000,1090" fill="transparent" stroke="#ef4444" strokeWidth="2" opacity={(reactingLeft || reactingRight) ? 1 : 0.4}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: "linear", delay: 0.8 }} />
              <motion.circle r="3" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]"
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear", delay: 1.3 }}
                style={{ offsetPath: "path('M 1000,2000 L 1000,1090')" } as any} />

              {/* Bottom Right Wire -> ORANGE */}
              <motion.path d="M 1700,2000 L 1700,1400 L 1500,1200 L 1120,1200 L 1120,1090" fill="transparent" stroke="#f97316" strokeWidth="2" opacity={reactingRight ? 1 : 0.4}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: "linear", delay: 0.3 }} />
              <motion.circle r="3" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]"
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear", delay: 1.2 }}
                style={{ offsetPath: "path('M 1700,2000 L 1700,1400 L 1500,1200 L 1120,1200 L 1120,1090')" } as any} />

              {/* Right Wire -> YELLOW-ORANGE */}
              <motion.path d="M 2000,1100 L 1400,1100 L 1300,1000 L 1180,1000" fill="transparent" stroke="#f59e0b" strokeWidth="2" opacity={reactingRight ? 1 : 0.4}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: "linear", delay: 0.5 }} />
              <motion.circle r="3" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]"
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear", delay: 1.2 }}
                style={{ offsetPath: "path('M 2000,1100 L 1400,1100 L 1300,1000 L 1180,1000')" } as any} />

              {/* Top Right Wire -> WHITE */}
              <motion.path d="M 2000,400 L 1600,400 L 1400,600 L 1130,600 L 1130,910" fill="transparent" stroke="#ffffff" strokeWidth="2" opacity={reactingRight ? 1 : 0.4}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "linear", delay: 0.4 }} />
              <motion.circle r="3" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]"
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: 1.2 }}
                style={{ offsetPath: "path('M 2000,400 L 1600,400 L 1400,600 L 1130,600 L 1130,910')" } as any} />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* ==================================================== */}
        {/* CENTRAL ROBOTIC CORE */}
        {/* ==================================================== */}
        <div className="absolute w-[400px] h-[300px] flex items-center justify-center z-20">
          
          {/* Phase 1+: Base Robotic Structure */}
          <AnimatePresence>
            {phase >= 1 && phase < 6 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Mechanical Chamfered Robotic Core Plate */}
                <div className="relative w-[380px] h-[190px] drop-shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center">
                  
                  {/* Outer Mechanical Border Shape */}
                  <div 
                    className="absolute inset-0 bg-gray-800 z-0"
                    style={{ clipPath: "polygon(30px 0, calc(100% - 30px) 0, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 30px)" }}
                  />
                  
                  {/* Inner Core Body */}
                  <div 
                    className="absolute inset-[2px] bg-[#0a0a0e] z-10 overflow-hidden flex items-center justify-center"
                    style={{ clipPath: "polygon(28px 0, calc(100% - 28px) 0, 100% 28px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 28px 100%, 0 calc(100% - 28px), 0 28px)" }}
                  >
                    {/* Dark Metallic Texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]" />
                    
                    {/* Left/Right Separation Panel */}
                    <div className="absolute inset-y-0 left-[48%] right-[48%] bg-[#050508] border-x border-gray-900/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]" />
                    
                    {/* Central Locking Cylinder/Details */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[80px] bg-[#111] border border-gray-800 rounded-md flex flex-col justify-evenly items-center py-2 shadow-lg z-0">
                      <div className="w-4 h-[2px] bg-gray-700" />
                      <div className="w-4 h-[2px] bg-gray-700" />
                      <div className="w-4 h-[2px] bg-gray-700" />
                    </div>

                    {/* Top Vent / Status Light */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#050505] border-b border-gray-800 flex justify-center items-center">
                       <motion.div 
                         animate={{ opacity: phase >= 2 ? [0.4, 1, 0.4] : 0.1 }}
                         transition={{ duration: 3, repeat: Infinity }}
                         className="w-12 h-[2px] bg-red-500 shadow-[0_0_8px_#ef4444]" 
                       />
                    </div>

                    {/* Bottom Vent / Status Light */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#050505] border-t border-gray-800 flex justify-center items-center">
                       <motion.div 
                         animate={{ opacity: phase >= 2 ? [1, 0.4, 1] : 0.1 }}
                         transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                         className="w-12 h-[2px] bg-red-500 shadow-[0_0_8px_#ef4444]" 
                       />
                    </div>
                    
                    {/* Side Ports (for wires to connect into visually) */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-12 bg-black border-y border-r border-gray-800 rounded-r-md" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-12 bg-black border-y border-l border-gray-800 rounded-l-md" />

                    {/* Subtle Red Core Glow */}
                    {phase >= 4 && (
                      <motion.div 
                        animate={{ opacity: [0.05, 0.15, 0.05] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-red-600/10 pointer-events-none z-10"
                      />
                    )}
                  </div>

                  {/* Eye Layout - Above chassis background */}
                  <div className="relative z-20 w-full px-10 flex justify-between items-center">
                    <RoboticEye active={phase >= 3} reacting={reactingLeft} direction="cw" />
                    <RoboticEye active={phase >= 4} reacting={reactingRight} direction="ccw" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ==================================================== */}
        {/* PHASE 5: CINEMATIC TEXT REVEAL */}
        {/* ==================================================== */}
        <AnimatePresence>
          {phase === 5 && (
            <motion.div 
              className="absolute z-40 flex flex-col items-center justify-center w-full h-full bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 1.5 }}
            >
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-[0.3em] text-white uppercase text-center mb-6"
              >
                ROBOTICS <br/><span className="text-gray-500">ENGINEERING</span>
              </motion.h1>
              
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-lg md:text-3xl font-light tracking-[0.4em] text-cyan-main uppercase"
              >
                {(profile?.name || 'NAGA KARTHIKEYA GUTHI').toUpperCase()}
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* UI CONTROLS */}
      <div className="absolute bottom-6 left-6 z-50">
        <button 
          onClick={toggleSound}
          className="flex items-center gap-2 text-[10px] text-gray-600 hover:text-gray-300 transition-colors uppercase tracking-widest"
        >
          {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
          Sound {soundEnabled ? 'On' : 'Off'}
        </button>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={handleUnlock}
          className="px-4 py-2 border border-gray-600 text-gray-400 hover:text-white hover:border-red-500 transition-colors text-xs uppercase tracking-widest bg-black/50 backdrop-blur-sm"
        >
          Skip Intro
        </button>
      </div>

    </motion.div>
  );
};
