import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText } from 'lucide-react';
import { usePortfolio, getImageUrl } from '../context/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { resume } = usePortfolio();

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

  if (!isOpen) return null;

  const isAvailable = resume && resume.available !== false && Boolean(resume.fileUrl);
  const rawUrl = resume?.fileUrl || '/resume.pdf';
  const fullResumeUrl = getImageUrl(rawUrl);
  const isImage = rawUrl.match(/\.(jpeg|jpg|png|webp)$/i);

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
          className="relative w-full max-w-4xl max-h-[90vh] bg-black border border-cyan-500/50 rounded-lg shadow-[0_0_50px_rgba(0,255,255,0.3)] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800 bg-gray-950 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <FileText size={18} />
              </div>
              <h3 className="font-mono text-base md:text-lg font-bold tracking-wider text-white uppercase">
                RESUME
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {isAvailable && (
                <a
                  href={fullResumeUrl}
                  download={resume.filename || "Naga_Karthikeya_Resume.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.5)] cursor-pointer uppercase hover:scale-[1.03]"
                  style={{
                    clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)'
                  }}
                >
                  <Download size={15} />
                  <span>DOWNLOAD RESUME</span>
                </a>
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
          <div className="flex-1 bg-black p-4 flex items-center justify-center overflow-auto">
            {isAvailable ? (
              isImage ? (
                <img
                  src={fullResumeUrl}
                  alt="Resume Document"
                  className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded shadow-2xl border border-gray-800"
                />
              ) : (
                <iframe
                  src={`${fullResumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  title="Resume PDF"
                  className="w-full h-[75vh] rounded border-0 bg-white"
                />
              )
            ) : (
              <div className="text-center p-8 border border-amber-500/40 bg-amber-500/10 text-amber-400 font-mono text-sm space-y-2 rounded">
                <p className="font-bold uppercase">NO RESUME FILE UPLOADED YET</p>
                <p className="text-xs text-gray-400">Please upload your resume file in the Admin Dashboard.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
