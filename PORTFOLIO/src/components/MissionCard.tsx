import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';
import { getImageUrl } from '../context/PortfolioContext';

export interface MissionData {
  id: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'IN PROGRESS' | 'CLASSIFIED';
  tags: string[];
  image?: string;
  githubUrl?: string;
  demoUrl?: string;
  hidden?: boolean;
  details?: {
    shortDescription: string;
    category: string[];
    mainTechnologies: string[];
    mainHardware?: string[];
    howItWorks?: { stage: string; points: string[] }[];
    systemFlow?: string[];
    keyFeatures?: string[];
    objectives?: string[];
    applications?: string[];
    customSections?: {
      title: string;
      type: 'text' | 'list' | 'flow' | 'multi-flow' | 'text-flow' | 'grid' | 'architecture' | 'tech-split' | 'verification' | 'image' | 'video';
      content: any;
    }[];
  };
}

interface MissionCardProps {
  mission: MissionData;
  index: number;
  onClick?: () => void;
}

const getAccentColor = (title: string): string => {
  const t = title.toUpperCase();
  if (t.includes('HUMANOID')) return '#8b5cf6'; // Violet
  if (t.includes('MAZE')) return '#38bdf8'; // Sky Blue
  if (t.includes('SAFEFRUIT')) return '#10b981'; // Green
  if (t.includes('ECOCHARGE')) return '#eab308'; // Yellow
  return '#06b6d4'; // Default Cyan
};

export const MissionCard: React.FC<MissionCardProps> = ({ mission, index, onClick }) => {
  const accentColor = getAccentColor(mission.title);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt state
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // For CSS variables (spotlight)
    cardRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
    cardRef.current.style.setProperty('--mouse-y', `${mouseY}px`);

    // For 3D Tilt (-0.5 to 0.5 range)
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative tech-panel overflow-hidden transition-all duration-500 bg-core-panel/50 hover:bg-black/60 ${onClick ? 'cursor-pointer' : ''}`}
      style={{ 
        '--accent-color': accentColor,
        rotateX,
        rotateY,
        transformPerspective: 1000,
        z: y.get() ? 10 : 0,
        boxShadow: y.get() ? `0 0 25px ${accentColor}70, 0 0 45px ${accentColor}35` : 'none'
      } as any}
    >
      {/* Dynamic Spotlight Background Glow */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accentColor}25, transparent 40%)`
        }}
      />

      {/* Scanning line effect on hover */}
      <div 
        className="absolute top-0 bottom-0 left-0 w-full h-[2px] translate-y-[-10px] group-hover:animate-scan z-20 pointer-events-none opacity-0 group-hover:opacity-50" 
        style={{ backgroundColor: accentColor }}
      />

      <div className="p-6 md:p-8 relative z-10 flex flex-col h-full bg-core-bg/40 ">
        
        <div className="flex justify-between items-start mb-6">
          <div className="text-tech flex items-center gap-2 transition-colors duration-500 text-text-muted group-hover:text-[var(--accent-color)]">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500 bg-core-border group-hover:bg-[var(--accent-color)]" />
            PROJECT {String(index + 1).padStart(2, '0')}
          </div>
          
          <div className="text-tech text-text-muted border border-core-border px-2 py-1 bg-core-bg/50 transition-colors duration-500 group-hover:border-[var(--accent-color)]/30">
            STATUS: <span className={mission.status === 'COMPLETED' ? 'text-white' : 'text-text-muted transition-colors duration-500 group-hover:text-[var(--accent-color)]'}>{mission.status}</span>
          </div>
        </div>

        {mission.image && (
          <div className="w-full h-52 mb-6 overflow-hidden border border-gray-800 rounded bg-black/60 flex items-center justify-center p-2">
            <img 
              src={getImageUrl(mission.image)} 
              alt={mission.title}
              className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500 rounded" 
            />
          </div>
        )}

        <h3 className="text-2xl font-bold mb-4 transition-colors duration-500 text-white group-hover:text-[var(--accent-color)]">
          {mission.title}
        </h3>
        
        <p className="text-text-muted mb-8 flex-grow transition-colors duration-500 group-hover:text-gray-300">
          {mission.description}
        </p>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {mission.tags.map((tag) => (
              <span key={tag} className="text-tech text-text-muted bg-core-bg/80 px-2 py-1 border border-core-border transition-colors duration-500 group-hover:border-[var(--accent-color)]/30 group-hover:text-gray-300">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4 border-t border-core-border pt-4 transition-colors duration-500 group-hover:border-[var(--accent-color)]/30">
            {mission.githubUrl && (
              <a 
                href={mission.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()} 
                className="text-text-muted transition-colors duration-300 hover:text-[var(--accent-color)] flex items-center gap-2"
              >
                <Code size={18} />
                <span className="text-tech">SOURCE</span>
              </a>
            )}
            {mission.demoUrl && (
              <a href={mission.demoUrl} className="text-text-muted transition-colors duration-300 hover:text-[var(--accent-color)] flex items-center gap-2">
                <ExternalLink size={18} />
                <span className="text-tech">DEPLOY</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

