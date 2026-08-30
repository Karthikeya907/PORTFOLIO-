import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldAlert, KeyRound, X } from 'lucide-react';

import { getApiBase } from '../../context/PortfolioContext';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setPassword('');
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

    try {
      const res = await fetch(`${getApiBase()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('nk_admin_token', data.token);
        setPassword('');
        setError('');
        onSuccess();
      } else {
        setError(data.message || 'Incorrect Admin Password');
      }
    } catch (err) {
      // Fallback verification if backend API is unreachable
      if (password === 'Karthikeya@2026') {
        localStorage.setItem('nk_admin_token', 'local_session');
        setPassword('');
        setError('');
        onSuccess();
      } else {
        setError('Invalid Password. Please check environment configuration.');
      }
    } finally {
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
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-black/95 neon-cyan p-8 border border-cyan-500/50 shadow-2xl shadow-cyan-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <Lock size={28} />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-widest text-white">
              ADMIN ACCESS
            </h2>
            <p className="text-xs font-mono text-gray-400 mt-2">
              Protected Management Terminal
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono font-bold tracking-widest text-cyan-400 mb-2 uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="nk_admin_password_field"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 bg-gray-950 border border-cyan-500/40 text-white font-mono text-sm tracking-widest focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
                  autoFocus
                />
                <KeyRound size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono"
              >
                <ShieldAlert size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-widest text-sm font-mono transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.5)] cursor-pointer disabled:opacity-50 uppercase"
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
