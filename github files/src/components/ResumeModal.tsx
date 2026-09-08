import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, ExternalLink, Eye } from 'lucide-react';
import { usePortfolio, getImageUrl } from '../context/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { resume } = usePortfolio();
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Robust Mobile, Tablet & Touch Device Detection
  const isMobile = typeof window !== 'undefined' && (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 1024 ||
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0)
  );

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

  const rawUrl = resume?.fileUrl || '/resume.pdf';
  const fullResumeUrl = getImageUrl(rawUrl);
  const isImage = rawUrl.match(/\.(jpeg|jpg|png|webp)$/i);

  // Convert Base64 data:application/pdf URL to a clean Blob URL
  useEffect(() => {
    if (fullResumeUrl && fullResumeUrl.startsWith('data:application/pdf')) {
      try {
        const parts = fullResumeUrl.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: contentType });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (e) {
        setBlobUrl(null);
      }
    } else {
      setBlobUrl(null);
    }
  }, [fullResumeUrl]);

  if (!isOpen) return null;

  const isAvailable = resume && resume.available !== false && Boolean(resume.fileUrl);
  const displayUrl = blobUrl || fullResumeUrl;
  
  // Safe direct PDF link
  const safeDirectPdfUrl = fullResumeUrl.startsWith('data:') ? (blobUrl || fullResumeUrl) : fullResumeUrl;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = displayUrl;
    a.download = resume?.filename || "Naga_Karthikeya_Resume.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full ${isMobile ? 'max-w-md' : 'max-w-4xl'} max-h-[90vh] bg-black border border-cyan-500/50 rounded-xl shadow-[0_0_50px_rgba(0,255,255,0.3)] flex flex-col overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800 bg-gray-950 flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <FileText size={18} />
              </div>
              <h3 className="font-mono text-base md:text-lg font-bold tracking-wider text-white uppercase">
                RESUME VAULT
              </h3>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Show top header action buttons ONLY on Desktop */}
              {isAvailable && !isMobile && (
                <>
                  <a
                    href={safeDirectPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-cyan-400 border border-cyan-500/40 font-mono text-xs font-bold transition-all cursor-pointer uppercase rounded shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                    title="Open Fullscreen PDF"
                  >
                    <ExternalLink size={14} />
                    <span>OPEN FULLSCREEN</span>
                  </a>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.5)] cursor-pointer uppercase rounded"
                  >
                    <Download size={14} />
                    <span>DOWNLOAD</span>
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white border border-gray-800 rounded-full hover:border-cyan-400 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Clean Resume Display Area */}
          <div className="flex-1 bg-black p-2 sm:p-4 flex items-center justify-center overflow-auto">
            {isAvailable ? (
              isImage ? (
                <img
                  src={displayUrl}
                  alt="Resume Document"
                  className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded shadow-2xl border border-gray-800"
                />
              ) : isMobile ? (
                /* Mobile Clean High-Tech Resume Action Card */
                <div className="w-full p-5 sm:p-6 bg-gray-950 border border-cyan-500/30 rounded-xl text-center space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h4 className="text-white font-mono font-bold text-base tracking-wider uppercase mb-1">
                      NAGA KARTHIKEYA RESUME
                    </h4>
                    <p className="text-gray-400 font-mono text-xs">
                      PDF Document Ready
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    <a
                      href={safeDirectPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase rounded shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Eye size={16} />
                      <span>VIEW RESUME FULLSCREEN</span>
                    </a>

                    <button
                      onClick={handleDownload}
                      className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-cyan-400 border border-cyan-500/40 font-mono font-bold text-xs tracking-wider uppercase rounded flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download size={16} />
                      <span>DOWNLOAD RESUME (.PDF)</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Desktop PDF Iframe Viewer */
                <iframe
                  src={`${displayUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  title="Resume PDF"
                  className="w-full h-[75vh] rounded border-0 bg-white"
                />
              )
            ) : (
              <div className="text-center p-8 border border-amber-500/40 bg-amber-500/10 text-amber-400 font-mono text-sm space-y-2 rounded">
                <p className="font-bold uppercase">Resume will be available soon.</p>
                <p className="text-xs text-gray-400">The resume file is currently being updated by the administrator.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
