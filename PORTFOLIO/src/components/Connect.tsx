import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { FaGithub, FaLinkedin, FaHackerrank } from 'react-icons/fa';
import { ServoMotorCore } from './ServoMotorCore';
import { BackgroundRadiantCircuits } from './BackgroundRadiantCircuits';
import { CommunicationTerminal } from './CommunicationTerminal';

import { usePortfolio } from '../context/PortfolioContext';

export const Connect: React.FC = () => {
  const { profile, socialLinks } = usePortfolio();
  const [isGlitching, setIsGlitching] = React.useState(false);

  React.useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 350);
      const nextDelay = 8000 + Math.random() * 7000;
      timerId = setTimeout(triggerGlitch, nextDelay);
    };
    let timerId = setTimeout(triggerGlitch, 11000);
    return () => clearTimeout(timerId);
  }, []);

  const linkedinLink = socialLinks.find(s => s.id === 'linkedin')?.url || 'https://linkedin.com/in/naga-karthikeya-guthi-76711a28a';
  const githubLink = socialLinks.find(s => s.id === 'github')?.url || 'https://github.com/Karthikeya907?tab=repositories';
  const hackerrankLink = socialLinks.find(s => s.id === 'hackerrank')?.url || 'https://hackerrank.com/profile/226K1A0582';

  const cleanPhone = (profile.whatsapp || profile.phone || '').replace(/[^0-9]/g, '');

  return (
    <section id="connect" className="pt-28 pb-12 relative bg-transparent overflow-hidden">
      {/* Background Hardware Core & Radial Glow */}
      <BackgroundRadiantCircuits color1="#00f0ff" color2="#9333ea" opacity={0.25} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.92)_100%)] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-45 pointer-events-none z-0">
        <ServoMotorCore />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-[1px] bg-cyan-400" />
          <h2 className={`font-display text-xl sm:text-3xl md:text-4xl font-bold tracking-wider sm:tracking-[0.2em] text-white drop-shadow-sm hover-rgb-text-shadow transition-all duration-300 cursor-default break-words ${isGlitching ? 'glitching' : ''}`}>CONNECT</h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-start">

          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.2, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="group relative flex flex-col gap-8 mt-4 bg-transparent p-4 sm:p-6 md:p-8 rounded-xl border border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] hover:bg-black/20 transition-all duration-300 shadow-xl"
          >
            <div className="flex flex-col gap-5">
              <a href={`mailto:${profile.email}`} className="flex items-center gap-4 group p-2.5 sm:p-3 rounded-lg border border-transparent hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:translate-x-2 transition-all duration-300 min-w-0">
                <div className="w-10 h-10 neon-cyan bg-black/40 flex-shrink-0 flex items-center justify-center rounded-lg border border-cyan-500/30 group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300">
                  <Mail size={18} className="text-cyan-400 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold tracking-[0.25em] text-cyan-400 font-mono mb-0.5 group-hover:text-white transition-colors duration-300">EMAIL</span>
                  <span className="text-xs sm:text-sm font-mono text-white font-semibold group-hover:text-cyan-300 transition-colors break-all sm:break-normal">{profile.email}</span>
                </div>
              </a>

              <div className="flex items-center gap-4 group p-3 rounded-lg border border-transparent hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:translate-x-2 transition-all duration-300">
                <div className="w-10 h-10 neon-green bg-black/40 flex items-center justify-center rounded-lg border border-emerald-500/30 group-hover:scale-110 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-300">
                  <Phone size={18} className="text-emerald-400 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-[0.25em] text-emerald-400 font-mono mb-0.5 group-hover:text-white transition-colors duration-300">PHONE</span>
                  <span className="text-sm font-mono text-white font-semibold group-hover:text-emerald-300 transition-colors">{profile.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 group p-3 rounded-lg border border-transparent hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:translate-x-2 transition-all duration-300">
                <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 neon-cyan bg-black/40 flex items-center justify-center rounded-lg border border-cyan-500/30 group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300">
                  <Phone size={18} className="text-cyan-400 group-hover:text-white transition-colors" />
                </a>
                <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-[0.25em] text-cyan-400 font-mono mb-0.5 group-hover:text-white transition-colors duration-300">WHATSAPP</span>
                  <span className="text-sm font-mono text-white font-semibold group-hover:text-cyan-300 transition-colors">{profile.whatsapp}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center w-fit px-6 py-3 border border-emerald-500/70 text-emerald-400 font-mono font-bold tracking-widest text-xs bg-black/80 hover:bg-emerald-500/20 hover:text-white hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                style={{
                  clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)'
                }}
              >
                MESSAGE ON WHATSAPP
              </a>

              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 neon-orange bg-black/40 rounded-lg border border-amber-500/40 flex items-center justify-center hover:border-amber-400 hover:bg-amber-500/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all duration-300 group" title="LinkedIn">
                  <FaLinkedin size={20} className="text-amber-400 group-hover:text-white transition-colors" />
                </a>
                <a href={githubLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 neon-cyan bg-black/40 rounded-lg border border-cyan-500/40 flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-500/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300 group" title="GitHub">
                  <FaGithub size={20} className="text-cyan-400 group-hover:text-white transition-colors" />
                </a>
                <a href={hackerrankLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 neon-green bg-black/40 rounded-lg border border-emerald-500/40 flex items-center justify-center hover:border-emerald-400 hover:bg-emerald-500/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-300 group" title="HackerRank">
                  <FaHackerrank size={20} className="text-emerald-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Secure Transmission Terminal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.2, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative flex flex-col gap-6 mt-4 lg:mt-0 bg-transparent p-6 sm:p-8 rounded-xl border border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] hover:bg-black/20 transition-all duration-300 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-[0.3em] text-cyan-400 font-mono">COMMUNICATION TERMINAL</span>
            </div>
            <CommunicationTerminal />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
