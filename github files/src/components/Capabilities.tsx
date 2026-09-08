import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Shield, Eye, Globe, Server, Layers } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

// Icon Map
const categoryIcons: Record<string, React.ReactNode> = {
  'programming languages': <Terminal size={18} className="text-cyan-400" />,
  'platforms, tools & services': <Globe size={18} className="text-indigo-400" />,
  'domains & embedded systems': <Cpu size={18} className="text-blue-400" />,
  'soft skills & professional': <Shield size={18} className="text-amber-400" />,
  'web & cloud technologies': <Globe size={18} className="text-emerald-400" />,
  'robotics & computer vision': <Eye size={18} className="text-purple-400" />,
};

export const Capabilities: React.FC = () => {
  const { skills } = usePortfolio();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  return (
    <section id="capabilities" className="py-14 sm:py-16 relative bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-[1px] bg-cyan-400" />
          <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-bold tracking-wider sm:tracking-[0.2em] text-white hover-rgb-text-shadow transition-all duration-300 cursor-default break-words">
            TECHNICAL CAPABILITIES
          </h2>
        </div>

        {/* Skills Grid (2 by 2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {(skills || []).map((group: any, groupIdx: number) => {
            const categoryName = group?.category || 'Skills';
            const iconKey = Object.keys(categoryIcons).find(k => k.toLowerCase() === categoryName.toLowerCase()) || '';
            const icon = categoryIcons[iconKey] || <Layers size={18} className="text-cyan-400" />;

            // Support both string array ('skills') and object array ('items') safely
            const rawSkillList = Array.isArray(group?.skills) ? group.skills : Array.isArray(group?.items) ? group.items : [];
            const key = categoryName + groupIdx;
            const isActive = activeCardId === key;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: groupIdx * 0.05 }}
                onClick={() => setActiveCardId(isActive ? null : key)}
                className={`p-6 rounded-xl flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-cyan-950/30 border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.7),_0_0_50px_rgba(0,240,255,0.3)] -translate-y-1' 
                    : 'bg-black/60 border border-gray-800 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-800">
                    <h3 className="font-mono text-sm sm:text-base font-bold text-white tracking-wider uppercase flex items-center gap-3">
                      {icon}
                      {categoryName}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {rawSkillList.map((skillItem: any, idx: number) => {
                      const name = typeof skillItem === 'string' ? skillItem : skillItem?.name || String(skillItem);
                      const level = typeof skillItem === 'object' && skillItem?.level ? skillItem.level : null;

                      return (
                        <div
                          key={name + idx}
                          className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-300 font-mono text-xs font-semibold flex items-center gap-2"
                        >
                          <span>{name}</span>
                          {level && <span className="text-[10px] text-cyan-400/70">({level}%)</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
