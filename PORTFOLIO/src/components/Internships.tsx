import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GPSCore } from './GPSCore';
import { BackgroundRadiantCircuits } from './BackgroundRadiantCircuits';
import { CertificateViewerModal } from './CertificateViewerModal';
import { usePortfolio } from '../context/PortfolioContext';

export const Internships: React.FC = () => {
  const { internships } = usePortfolio();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [viewerCert, setViewerCert] = useState<{ title: string; imageUrl: string } | null>(null);

  React.useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 350);
      const nextDelay = 8000 + Math.random() * 7000;
      timerId = setTimeout(triggerGlitch, nextDelay);
    };
    let timerId = setTimeout(triggerGlitch, 9000);
    return () => clearTimeout(timerId);
  }, []);

  const visibleInternships = internships.filter((i) => !i.hidden);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <section id="internships" className="relative bg-transparent py-24  overflow-hidden">
      
      {/* Background Hardware Core */}
      <BackgroundRadiantCircuits color1="#00ff55" color2="#00d8ff" opacity={0.2} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-40 pointer-events-none z-0">
        <GPSCore />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 px-6 py-3 bg-white text-black font-mono text-sm tracking-widest font-bold shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-[1px] bg-white" />
          <h2 className={`font-display text-xl sm:text-3xl md:text-4xl font-bold tracking-wider sm:tracking-[0.2em] text-white hover-rgb-text-shadow transition-all duration-300 cursor-default break-words ${isGlitching ? 'glitching' : ''}`}>
            INTERNSHIPS
          </h2>
        </div>

        {/* Empty State Message */}
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-widest mb-4">
            INTERNSHIP JOURNEY
          </h3>
          <p className="text-gray-400 font-mono text-sm tracking-wider max-w-2xl leading-relaxed">
            Hands-on experience, real-world projects, and continuous learning.
          </p>
        </div>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {visibleInternships.map((internship, index) => (
            <motion.div 
              key={internship.id} 
              initial={{ opacity: 0, rotateX: 90, scale: 0.5 }} 
              whileInView={{ opacity: 1, rotateX: 0, scale: 1 }} 
              viewport={{ once: false, amount: 0.2 }} 
              transition={{ duration: 0.6, delay: index * 0.1 }} 
              className={`group relative bg-transparent p-5 sm:p-6 md:p-8 rounded-xl border transition-all duration-300 flex flex-col justify-between min-h-[auto] sm:min-h-[350px] hover:bg-black/30 shadow-xl ${index === 0 ? 'neon-cyan border-cyan-500/50 hover:border-cyan-400' : index === 1 ? 'neon-orange border-amber-500/50 hover:border-amber-400' : 'neon-purple border-purple-500/50 hover:border-purple-400'}`}
            >
              {/* Top Section */}
              <div>
                <div className="flex justify-end items-start mb-4 sm:mb-6">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase block">Duration</span>
                    <span className="text-xs text-gray-300 font-mono tracking-wider">{internship.duration}</span>
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-white tracking-wider sm:tracking-widest mb-1 break-words">
                  {internship.role}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 tracking-wider mb-4 break-words">
                  {internship.company}
                </p>
                
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 bg-gray-600 rounded-full" />
                  <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">{internship.location}</span>
                </div>

                <p className="text-xs text-gray-400 font-mono leading-relaxed mb-6">
                  {internship.description}
                </p>
              </div>

              {/* Bottom Section */}
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-8">
                  {internship.technologies.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-900 neon-blue text-gray-400 text-[10px] font-mono tracking-widest">
                      {tech}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    if (internship.certificateUrl) {
                      setViewerCert({ title: `${internship.role} (${internship.company})`, imageUrl: internship.certificateUrl });
                    } else {
                      showToast("Certificate image not uploaded yet");
                    }
                  }}
                  className="w-full py-3 bg-black/80 border border-cyan-500/60 text-cyan-400 font-mono text-xs font-bold tracking-widest hover:border-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:scale-[1.02] transition-all duration-300 cursor-pointer uppercase flex items-center justify-center gap-2"
                  style={{
                    clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)'
                  }}
                >
                  VIEW CERTIFICATE
                </button>
              </div>
            </motion.div>
          ))}

        </div>
      </div>

      {/* Certificate Viewer Modal */}
      <CertificateViewerModal
        isOpen={Boolean(viewerCert)}
        title={viewerCert?.title || ''}
        imageUrl={viewerCert?.imageUrl}
        onClose={() => setViewerCert(null)}
      />
    </section>
  );
};
