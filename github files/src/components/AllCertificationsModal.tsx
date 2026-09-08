import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, ExternalLink } from 'lucide-react';
import { TiltCard } from './TiltCard';
import type { CertItem } from '../context/PortfolioContext';

import { CertificateViewerModal } from './CertificateViewerModal';

interface AllCertificationsModalProps {
  isOpen: boolean;
  certifications: CertItem[];
  onClose: () => void;
}

export const AllCertificationsModal: React.FC<AllCertificationsModalProps> = ({
  isOpen,
  certifications,
  onClose,
}) => {
  const [viewerCert, setViewerCert] = React.useState<{ title: string; imageUrl: string } | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[85vh] bg-black/95 border border-cyan-500/40 rounded-lg shadow-[0_0_50px_rgba(0,255,255,0.2)] overflow-hidden flex flex-col z-10"
        >
          {/* Top Bar / Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono tracking-wider text-white uppercase">
                  ALL CERTIFICATIONS & CREDENTIALS
                </h3>
                <p className="text-xs font-mono text-gray-400">
                  Showing {certifications.length} verified certificates
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 border border-gray-800 rounded-full text-gray-400 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Certificates List Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
            {certifications.map((cert, index) => (
              <TiltCard
                key={cert.id}
                maxTilt={2}
                scaleOnHover={1.01}
                className={`group bg-black/40 p-5 rounded border hover-rgb transition-all duration-300 ${
                  index % 3 === 0 ? 'neon-cyan' : index % 3 === 1 ? 'neon-green' : 'neon-purple'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-display text-white font-bold tracking-wide mb-1">
                      {cert.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs font-mono text-gray-500 mb-2">
                      <span className="text-gray-300 font-bold">{cert.organization}</span>
                      <span>|</span>
                      <span className="text-cyan-400 font-bold">{cert.date}</span>
                    </div>
                    {cert.description && (
                      <p className="text-xs font-mono text-gray-400 leading-relaxed mt-1">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
                    <button
                      onClick={() => {
                        const imgUrl = cert.certificateFile || (cert.url && (cert.url.includes('/uploads/') || cert.url.match(/\.(jpeg|jpg|png|webp)$/i)) ? cert.url : null);
                        if (imgUrl) {
                          setViewerCert({ title: cert.title, imageUrl: imgUrl });
                        } else {
                          showToast('Certificate image not uploaded yet');
                        }
                      }}
                      className="px-3 py-1.5 border border-cyan-500/50 bg-black/40 text-cyan-400 font-mono font-bold text-xs hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-1.5 cursor-pointer uppercase rounded"
                    >
                      <Award size={14} /> VIEW CERTIFICATE
                    </button>

                    {cert.url && !cert.url.includes('/uploads/') && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-bold tracking-widest text-cyan-400 hover:text-white transition-all"
                      >
                        VERIFY <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 bg-black/60 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-700 text-gray-300 font-mono text-xs font-bold hover:border-cyan-400 hover:text-white transition-all rounded cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </motion.div>
      </div>

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
            className="fixed bottom-8 right-8 z-[60] bg-black border border-cyan-500 text-cyan-400 font-mono text-xs px-5 py-3 rounded shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center gap-2"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};
