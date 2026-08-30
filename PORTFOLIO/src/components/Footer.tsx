import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { profile } = usePortfolio();

  return (
    <footer className="py-12 border-t border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center gap-4 text-center">
        
        <h3 className="text-white font-bold tracking-[0.2em] text-lg uppercase">
          {(profile?.name || 'NAGA KARTHIKEYA GUTHI').toUpperCase()}
        </h3>
        
        <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
          {profile?.title || 'Robotics • Embedded Systems • Engineering'}
        </p>

        <div className="mt-4 text-gray-500 text-xs tracking-widest font-mono flex items-center gap-3">
          <span>&copy; {new Date().getFullYear()} {(profile?.name || 'Naga Karthikeya Guthi').toUpperCase()}</span>
          <span>•</span>
          <span className="text-cyan-400 font-bold">version 2.1.3</span>
        </div>

      </div>
    </footer>
  );
};
