import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderOpen, ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { type MissionData } from './MissionCard';
import { TiltCard } from './TiltCard';

interface AllProjectsModalProps {
  isOpen: boolean;
  projects: MissionData[];
  onClose: () => void;
  onSelectProject: (project: MissionData) => void;
}

const getProjectColorConfig = (title: string, index: number) => {
  const t = title.toUpperCase();
  if (t.includes('HUMANOID')) {
    return {
      neonClass: 'neon-purple',
      titleColor: 'group-hover:text-purple-400',
      badgeClass: 'bg-purple-950/40 border border-purple-500/30 text-purple-300',
      ghBtnClass: 'bg-purple-500/10 border border-purple-500/40 text-purple-400 hover:bg-purple-500 hover:text-black',
    };
  }
  if (t.includes('MAZE') || t.includes('RESCUE')) {
    return {
      neonClass: 'neon-cyan',
      titleColor: 'group-hover:text-cyan-400',
      badgeClass: 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-300',
      ghBtnClass: 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black',
    };
  }
  if (t.includes('SAFEFRUIT')) {
    return {
      neonClass: 'neon-green',
      titleColor: 'group-hover:text-emerald-400',
      badgeClass: 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300',
      ghBtnClass: 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black',
    };
  }
  if (t.includes('ECOCHARGE')) {
    return {
      neonClass: 'neon-orange',
      titleColor: 'group-hover:text-amber-400',
      badgeClass: 'bg-amber-950/40 border border-amber-500/30 text-amber-300',
      ghBtnClass: 'bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-black',
    };
  }
  const defaults = [
    { neonClass: 'neon-purple', titleColor: 'group-hover:text-purple-400', badgeClass: 'bg-purple-950/40 border border-purple-500/30 text-purple-300', ghBtnClass: 'bg-purple-500/10 border border-purple-500/40 text-purple-400 hover:bg-purple-500 hover:text-black' },
    { neonClass: 'neon-cyan', titleColor: 'group-hover:text-cyan-400', badgeClass: 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-300', ghBtnClass: 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black' },
    { neonClass: 'neon-green', titleColor: 'group-hover:text-emerald-400', badgeClass: 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300', ghBtnClass: 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black' },
    { neonClass: 'neon-orange', titleColor: 'group-hover:text-amber-400', badgeClass: 'bg-amber-950/40 border border-amber-500/30 text-amber-300', ghBtnClass: 'bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-black' },
  ];
  return defaults[index % defaults.length];
};

export const AllProjectsModal: React.FC<AllProjectsModalProps> = ({
  isOpen,
  projects,
  onClose,
  onSelectProject
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[85vh] overflow-y-auto bg-black/95 neon-cyan p-6 md:p-10 shadow-2xl custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex justify-between items-center pb-6 border-b border-gray-800 mb-8 sticky top-0 bg-black/90 backdrop-blur-md z-20 py-2">
            <div className="flex items-center gap-3">
              <FolderOpen className="text-cyan-400 w-7 h-7" />
              <h2 className="font-display text-xl md:text-2xl font-bold tracking-widest text-white">
                PROJECT VAULT ARCHIVE
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Grid of All Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {projects.map((project, idx) => {
              const config = getProjectColorConfig(project.title, idx);
              return (
                <div
                  key={project.id}
                  onClick={() => {
                    onSelectProject(project);
                  }}
                  className="group relative cursor-pointer outline-none h-full"
                >
                  <TiltCard
                    maxTilt={4}
                    scaleOnHover={1.02}
                    className={`${config.neonClass} bg-black/40 p-6 md:p-8 flex flex-col justify-between min-h-[300px] h-full hover-rgb transition-all duration-300`}
                  >
                    <div>
                      <h3 className={`font-display text-xl font-bold text-white tracking-wide mb-3 transition-colors ${config.titleColor}`}>
                        {project.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3 font-mono">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className={`text-[10px] font-mono px-2.5 py-1 ${config.badgeClass}`}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-900 mt-auto gap-4">
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded transition-all duration-300 text-xs font-mono font-bold tracking-wider ${config.ghBtnClass}`}
                          >
                            <FaGithub size={14} />
                            <span>GITHUB LINK</span>
                          </a>
                        ) : (
                          <span />
                        )}

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase group-hover:text-white transition-colors">
                            OPEN SPECIFICATIONS
                          </span>
                          <ArrowUpRight size={16} className="text-cyan-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
