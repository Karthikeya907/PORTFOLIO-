import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { CloudCore } from './CloudCore';
import { BackgroundRadiantCircuits } from './BackgroundRadiantCircuits';
import certificationsData from '../data/certifications.json';
import { TiltCard } from './TiltCard';


import { AllCertificationsModal } from './AllCertificationsModal';
import { CertificateViewerModal } from './CertificateViewerModal';
import { usePortfolio } from '../context/PortfolioContext';

export const Credentials: React.FC = () => {
  const { certifications } = usePortfolio();
  const [isGlitching, setIsGlitching] = React.useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = React.useState(false);
  const [viewerCert, setViewerCert] = React.useState<{ title: string; imageUrl: string } | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  React.useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 350);
      const nextDelay = 8000 + Math.random() * 7000;
      timerId = setTimeout(triggerGlitch, nextDelay);
    };
    let timerId = setTimeout(triggerGlitch, 10000);
    return () => clearTimeout(timerId);
  }, []);

  const visibleCerts = (certifications && certifications.length > 0 ? certifications : certificationsData).filter(c => c.visible !== false);
  const mainCerts = visibleCerts.slice(0, 4);

  const handleViewCert = (cert: any) => {
    const imgUrl = cert.certificateFile || (cert.url && (cert.url.includes('/uploads/') || cert.url.match(/\.(jpeg|jpg|png|webp)$/i)) ? cert.url : null);
    if (imgUrl) {
      setViewerCert({ title: cert.title, imageUrl: imgUrl });
    } else {
      showToast('Certificate image not uploaded yet');
    }
  };

  return (
    <section id="credentials" className="pt-16 pb-4 relative bg-transparent ">
      {/* Background Hardware Core */}
      <BackgroundRadiantCircuits color1="#00aaff" color2="#00d8ff" opacity={0.2} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-40 pointer-events-none z-0">
        <CloudCore />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-[1px] bg-white" />
          <h2 className={`font-display text-xl sm:text-3xl md:text-4xl font-bold tracking-wider sm:tracking-[0.2em] text-white drop-shadow-md hover-rgb-text-shadow transition-all duration-300 cursor-default break-words ${isGlitching ? 'glitching' : ''}`}>CREDENTIALS</h2>
        </div>

        <div>
          {/* Certifications List */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <h3 className="text-gray-400 font-bold tracking-widest text-sm mb-8 flex items-center gap-3 border-b border-gray-800 pb-4">
              <Award size={18} />
              CERTIFICATIONS
            </h3>

            {mainCerts.length > 0 ? (
              <div className="flex flex-col gap-6">
                {mainCerts.map((cert, index) => (
                  <TiltCard 
                    key={cert.id} 
                    maxTilt={3} 
                    scaleOnHover={1.02} 
                    className={`group relative bg-transparent p-4 sm:p-6 rounded-xl border transition-all duration-300 hover:bg-black/30 shadow-xl ${index === 0 ? 'neon-cyan border-cyan-500/50 hover:border-cyan-400' : index === 1 ? 'neon-green border-emerald-500/50 hover:border-emerald-400' : 'neon-purple border-purple-500/50 hover:border-purple-400'}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-display text-sm sm:text-base text-white font-bold tracking-wide mb-1 break-words">
                          {cert.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-gray-500 mb-2">
                          <span className="text-gray-400 font-bold break-words">{cert.organization}</span>
                          <span>|</span>
                          <span className="text-cyan-400 font-bold">{cert.date}</span>
                        </div>
                        {cert.description && (
                          <p className="text-xs font-mono text-gray-300 leading-relaxed mt-1 break-words">{cert.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          onClick={() => handleViewCert(cert)}
                          className="px-4 py-2 border border-cyan-500/70 bg-black/80 text-cyan-400 font-mono font-bold text-xs hover:bg-cyan-500/20 hover:border-cyan-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer uppercase"
                          style={{
                            clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
                          }}
                        >
                          <Award size={14} /> VIEW CERTIFICATE
                        </button>

                        {cert.url && !cert.url.includes('/uploads/') && (
                          <a 
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 hover-rgb-text hover:-translate-y-0.5 transition-all"
                          >
                            VERIFY <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            ) : (
              <div className="neon-green bg-black/10 p-8 flex items-center justify-center text-gray-600 font-mono text-sm">
                No external certifications listed yet.
              </div>
            )}

            {/* View More Button */}
            {visibleCerts.length > 4 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setIsArchiveOpen(true)}
                  className="px-8 py-3.5 border border-cyan-500/70 text-cyan-400 font-mono font-bold tracking-widest text-xs bg-black/80 hover:bg-cyan-500/20 hover:border-cyan-300 hover:text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:scale-[1.04] hover:-translate-y-1 transition-all duration-300 uppercase flex items-center gap-3 cursor-pointer"
                  style={{
                    clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)'
                  }}
                >
                  <Award size={16} />
                  <span>VIEW MORE CERTIFICATIONS ({visibleCerts.length})</span>
                </button>
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {/* Popup Modal for All Certifications */}
      <AllCertificationsModal
        isOpen={isArchiveOpen}
        certifications={visibleCerts}
        onClose={() => setIsArchiveOpen(false)}
      />

      {/* Certificate Viewer Modal */}
      <CertificateViewerModal
        isOpen={Boolean(viewerCert)}
        title={viewerCert?.title || ''}
        imageUrl={viewerCert?.imageUrl}
        onClose={() => setViewerCert(null)}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50 bg-black border border-cyan-500 text-cyan-400 font-mono text-xs px-5 py-3 rounded shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center gap-2"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
