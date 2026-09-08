import React from 'react';

export const Environment3D: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#020305] overflow-hidden">
      {/* Soft High-Performance Cyber Ambient Glows */}
      <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none transform-gpu animate-pulse" />
      <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none transform-gpu animate-pulse" />
    </div>
  );
};
