import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { AudioEngine } from '../utils/AudioEngine';
import { AdminAuthModal } from './admin/AdminAuthModal';
import { AdminDashboard } from './admin/AdminDashboard';

export const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    AudioEngine.init();
    const nextMuted = !muted;
    setMuted(nextMuted);
    AudioEngine.setMuted(nextMuted);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNkClick = () => {
    const token = localStorage.getItem('nk_admin_token');
    if (token) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/80 backdrop-blur-md border-b border-gray-800 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between md:justify-center relative">
          
          {/* Left Side Links (Hidden on small mobile, visible on md+) */}
          <div className="hidden md:flex items-center gap-8 absolute left-6 lg:left-8">
            <button 
              onClick={() => scrollTo('engineering')}
              className="text-[13px] font-mono font-bold tracking-widest text-gray-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all duration-300 uppercase cursor-pointer"
            >
              Engineering
            </button>
            <button 
              onClick={() => scrollTo('capabilities')}
              className="text-[13px] font-mono font-bold tracking-widest text-gray-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all duration-300 uppercase cursor-pointer"
            >
              Capabilities
            </button>
            <button 
              onClick={() => scrollTo('project-vault')}
              className="text-[13px] font-mono font-bold tracking-widest text-gray-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all duration-300 uppercase cursor-pointer"
            >
              Projects
            </button>
          </div>

          {/* Center Logo -> Triggers Secret Admin Auth */}
          <button 
            onClick={handleNkClick}
            className="text-2xl font-syncopate font-bold tracking-widest text-white hover:text-cyan-400 hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] transition-all duration-300 cursor-pointer"
          >
            NK
          </button>

        {/* Right Side Links (Hidden on small mobile, visible on md+) */}
        <div className="hidden md:flex items-center gap-8 absolute right-6 lg:left-auto lg:right-8">
          <button 
            onClick={() => scrollTo('internships')}
            className="text-[13px] font-mono font-bold tracking-widest text-gray-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all duration-300 uppercase cursor-pointer"
          >
            Internships
          </button>
          <button 
            onClick={() => scrollTo('credentials')}
            className="text-[13px] font-mono font-bold tracking-widest text-gray-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all duration-300 uppercase cursor-pointer"
          >
            Credentials
          </button>
          <button 
            onClick={() => scrollTo('connect')}
            className="text-[13px] font-mono font-bold tracking-widest text-gray-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all duration-300 uppercase cursor-pointer"
          >
            Contact
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            title={muted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 border border-gray-800 rounded-full text-cyan-400 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all duration-300 cursor-pointer"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Stacked BELOW the logo) */}
      <div className="md:hidden w-full px-6 mt-2 overflow-x-auto hide-scrollbar">
        <div className="flex items-center justify-start gap-5 pb-2 w-max mx-auto">
          <button onClick={() => scrollTo('engineering')} className="text-[11px] font-mono font-bold tracking-widest text-gray-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] uppercase transition-all duration-300">ENGINEERING</button>
          <button onClick={() => scrollTo('capabilities')} className="text-[11px] font-mono font-bold tracking-widest text-gray-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] uppercase transition-all duration-300">CAPABILITIES</button>
          <button onClick={() => scrollTo('project-vault')} className="text-[11px] font-mono font-bold tracking-widest text-gray-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] uppercase transition-all duration-300">PROJECTS</button>
          <button onClick={() => scrollTo('internships')} className="text-[11px] font-mono font-bold tracking-widest text-gray-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] uppercase transition-all duration-300">INTERNSHIPS</button>
          <button onClick={() => scrollTo('credentials')} className="text-[11px] font-mono font-bold tracking-widest text-gray-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] uppercase transition-all duration-300">CREDENTIALS</button>
          <button onClick={() => scrollTo('connect')} className="text-[11px] font-mono font-bold tracking-widest text-gray-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] uppercase transition-all duration-300">CONTACT</button>
          
          <button
            onClick={toggleSound}
            title={muted ? "Unmute Audio" : "Mute Audio"}
            className="px-2 py-1 border border-cyan-500/50 rounded-full text-cyan-400 text-[10px] font-mono flex items-center gap-1.5 cursor-pointer"
          >
            {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            <span>{muted ? "MUTED" : "SOUND ON"}</span>
          </button>
        </div>
      </div>
    </motion.nav>

    <AdminAuthModal
      isOpen={isAuthOpen}
      onClose={() => setIsAuthOpen(false)}
      onSuccess={() => {
        setIsAuthOpen(false);
        setIsAdminDashboardOpen(true);
      }}
    />

    <AdminDashboard
      isOpen={isAdminDashboardOpen}
      onClose={() => setIsAdminDashboardOpen(false)}
    />
  </>
);
};
