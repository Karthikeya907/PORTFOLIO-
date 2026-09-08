import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldAlert, KeyRound, Eye, EyeOff, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { settings } = usePortfolio();

  const handleClose = () => {
    setPassword('');
    setShowPassword(false);
    setError('');
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      setPassword('');
      setShowPassword(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the admin password');
      return;
    }

    setLoading(true);
    setError('');

    const activeSavedPass = settings?.adminPassword || import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    if (password === activeSavedPass) {
      localStorage.setItem('nk_admin_token', 'supabase_admin_session');
      setPassword('');
      setShowPassword(false);
      setError('');
      onSuccess();
      setLoading(false);
    } else {
      setError('Incorrect Admin Password');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-black/80 border border-cyan-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] backdrop-blur-xl"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-6 text-center">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Lock size={28} />
            </div>
            <h3 className="text-xl font-bold font-mono tracking-widest text-white uppercase">
              ADMIN AUTHENTICATION
            </h3>
            <p className="text-xs font-mono text-gray-400">
              Enter security password to access administration vault
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-xs font-mono">
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form with AutoComplete Disabled */}
          <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4">
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                name="nk_admin_access_key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER ADMIN PASSWORD"
                autoComplete="new-password"
                className="w-full bg-black/50 border border-cyan-500/30 hover:border-cyan-400 px-4 py-3 pl-11 pr-11 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg transition-colors placeholder:text-gray-600"
                autoFocus
              />
              <KeyRound size={18} className="absolute left-3.5 text-gray-500 pointer-events-none" />
              
              {/* Show / Hide Password Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-sm tracking-wider uppercase rounded-lg transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
