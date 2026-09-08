import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, ExternalLink, Download } from 'lucide-react';
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

  const handleOpenNewTab = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!fullImageUrl) return;

    // Convert Base64 data URIs to a clean Blob URL to bypass browser top-level navigation blocks
    if (fullImageUrl.startsWith('data:image/')) {
      try {
        const parts = fullImageUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        const win = window.open(blobUrl, '_blank');
        if (win) win.focus();
        return;
      } catch (err) {
        console.warn('Failed to convert base64 to blob:', err);
      }
    }

    const win = window.open(fullImageUrl, '_blank');
    if (win) win.focus();
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!fullImageUrl) return;

    const sanitizeName = title ? title.replace(/[^a-zA-Z0-9]/g, '_') : 'Certificate';
    const fileName = `${sanitizeName}_Document.png`;

    if (fullImageUrl.startsWith('data:image/')) {
      try {
        const parts = fullImageUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        return;
      } catch (err) {
        console.warn('Download blob error:', err);
      }
    }

    const a = document.createElement('a');
    a.href = fullImageUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
              <button
                onClick={handleDownload}
                className="p-2 border border-cyan-500/50 bg-cyan-500/10 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all cursor-pointer flex items-center gap-1.5 px-3 font-mono text-xs font-bold"
                title="Download Certificate"
              >
                <Download size={14} />
                <span className="hidden sm:inline">DOWNLOAD</span>
              </button>
              <button
                onClick={handleOpenNewTab}
                className="p-2 border border-gray-800 rounded-full text-cyan-400 hover:text-white hover:border-cyan-400 transition-all cursor-pointer flex items-center gap-1.5 px-3 font-mono text-xs font-bold"
                title="Open full size in new tab"
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">OPEN FULL SIZE</span>
              </button>
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
            <span className="text-[11px]">OFFICIAL VERIFIED DOCUMENT</span>
            <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">NK PORTFOLIO VAULT</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
