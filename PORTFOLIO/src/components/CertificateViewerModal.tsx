import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, ExternalLink } from 'lucide-react';
import { getImageUrl } from '../context/PortfolioContext';

interface CertificateViewerModalProps {
  isOpen: boolean;
  title: string;
  imageUrl?: string;
  onClose: () => void;
}

export const CertificateViewerModal: React.FC<CertificateViewerModalProps> = ({
  isOpen,
  title,
  imageUrl,
  onClose,
}) => {
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

  if (!isOpen || !imageUrl) return null;

  const fullImageUrl = getImageUrl(imageUrl);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-black border border-cyan-500/50 rounded-lg shadow-[0_0_50px_rgba(0,255,255,0.3)] overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-4 md:p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Award size={18} />
              </div>
              <h3 className="text-base md:text-lg font-bold font-mono tracking-wider text-white uppercase truncate max-w-md">
                {title} — CERTIFICATE
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={fullImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-gray-800 rounded-full text-cyan-400 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
                title="Open full size"
              >
                <ExternalLink size={16} />
              </a>
              <button
                onClick={onClose}
                className="p-2 border border-gray-800 rounded-full text-gray-400 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Certificate Image View */}
          <div className="p-4 flex-1 flex items-center justify-center overflow-auto bg-black/80">
            <img
              src={fullImageUrl}
              alt={title}
              className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded border border-gray-800 shadow-2xl"
            />
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-800 bg-gray-950 flex justify-between items-center text-xs font-mono text-gray-400">
            <span>OFFICIAL VERIFIED DOCUMENT</span>
            <button
              onClick={onClose}
              className="px-5 py-1.5 border border-cyan-500/40 text-cyan-400 font-bold hover:bg-cyan-500 hover:text-black transition-all rounded cursor-pointer uppercase"
            >
              CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
