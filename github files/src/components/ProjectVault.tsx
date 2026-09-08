import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProjectModal, type MissionData } from './ProjectModal';
import { AllProjectsModal } from './AllProjectsModal';
import { ArrowUpRight, FolderOpen } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const getProjectColorConfig = (title: string, index: number) => {
  const t = title.toUpperCase();
  if (t.includes('HUMANOID')) {
    return {
      neonClass: 'neon-purple',
      titleColor: 'group-hover:text-purple-400',
      badgeClass: 'bg-purple-950/40 border border-purple-500/30 text-purple-300',
      ghBtnClass: 'bg-purple-500/10 border border-purple-500/40 text-purple-400 hover:bg-purple-500 hover:text-black',
      arrowBg: 'group-hover:bg-purple-500',
    };
  }
  if (t.includes('MAZE') || t.includes('RESCUE')) {
    return {
      neonClass: 'neon-cyan',
      titleColor: 'group-hover:text-cyan-400',
      badgeClass: 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-300',
      ghBtnClass: 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black',
      arrowBg: 'group-hover:bg-cyan-500',
    };
  }
  if (t.includes('SAFEFRUIT')) {
    return {
      neonClass: 'neon-green',
      titleColor: 'group-hover:text-emerald-400',
      badgeClass: 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300',
      ghBtnClass: 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black',
      arrowBg: 'group-hover:bg-emerald-500',
    };
  }
  if (t.includes('ECOCHARGE')) {
    return {
      neonClass: 'neon-orange',
      titleColor: 'group-hover:text-amber-400',
      badgeClass: 'bg-amber-950/40 border border-amber-500/30 text-amber-300',
      ghBtnClass: 'bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-black',
      arrowBg: 'group-hover:bg-amber-500',
    };
  }
  const defaults = [
    { neonClass: 'neon-purple', titleColor: 'group-hover:text-purple-400', badgeClass: 'bg-purple-950/40 border border-purple-500/30 text-purple-300', ghBtnClass: 'bg-purple-500/10 border border-purple-500/40 text-purple-400 hover:bg-purple-500 hover:text-black', arrowBg: 'group-hover:bg-purple-500' },
    { neonClass: 'neon-cyan', titleColor: 'group-hover:text-cyan-400', badgeClass: 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-300', ghBtnClass: 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black', arrowBg: 'group-hover:bg-cyan-500' },
    { neonClass: 'neon-green', titleColor: 'group-hover:text-emerald-400', badgeClass: 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300', ghBtnClass: 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black', arrowBg: 'group-hover:bg-emerald-500' },
    { neonClass: 'neon-orange', titleColor: 'group-hover:text-amber-400', badgeClass: 'bg-amber-950/40 border border-amber-500/30 text-amber-300', ghBtnClass: 'bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-black', arrowBg: 'group-hover:bg-amber-500' },
  ];
  return defaults[index % defaults.length];
};

export const ProjectVault: React.FC = () => {
  const { projects } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<MissionData | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 350);
      const nextDelay = 8000 + Math.random() * 7000;
      timerId = setTimeout(triggerGlitch, nextDelay);
    };
    let timerId = setTimeout(triggerGlitch, 8000);
    return () => clearTimeout(timerId);
  }, []);

  // Filter visible projects and take top 4 for main grid
  const visibleProjects = projects.filter(p => !p.hidden);
  const initialProjects = visibleProjects.slice(0, 4);

  return (
    <section id="project-vault" className="py-14 sm:py-16 relative bg-transparent">

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-[1px] bg-white" />
          <h2 className={`font-display text-xl sm:text-3xl md:text-4xl font-bold tracking-wider sm:tracking-[0.2em] text-white drop-shadow-md hover-rgb-text-shadow transition-all duration-300 cursor-default break-words ${isGlitching ? 'glitching' : ''}`}>
            PROJECT VAULT
          </h2>
        </div>

        {/* Uniform 2x2 Symmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {initialProjects.map((project, idx) => {
            const config = getProjectColorConfig(project.title, idx);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: (idx % 2) * 0.05 }}
                onClick={() => setSelectedProject(project)}
                tabIndex={0}
                className="group relative cursor-pointer outline-none h-full bg-black/60 p-5 sm:p-6 md:p-8 flex flex-col justify-between min-h-[auto] sm:min-h-[320px] rounded-xl border border-gray-800 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.7),_0_0_50px_rgba(0,240,255,0.35)] hover:-translate-y-1 active:border-cyan-400 active:shadow-[0_0_35px_rgba(0,240,255,0.8),_0_0_60px_rgba(0,240,255,0.4)] focus:border-cyan-400 focus:shadow-[0_0_35px_rgba(0,240,255,0.8),_0_0_60px_rgba(0,240,255,0.4)] transition-all duration-300"
              >
                <div>
                  <h3 className={`font-display text-xl sm:text-2xl font-bold text-white tracking-wide mb-3 transition-colors break-words ${config.titleColor}`}>
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6 font-mono break-words">
                    {project.description}
                  </p>
                </div>
                
                <div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.slice(0, 4).map(tag => (
                      <span key={tag} className={`text-[11px] font-mono px-2.5 py-1 ${config.badgeClass}`}>
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className={`text-[11px] font-mono px-2.5 py-1 ${config.badgeClass}`}>
                        +{project.tags.length - 4}
                      </span>
                    )}
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

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tracking-widest text-gray-400 uppercase group-hover:text-white transition-colors">
                        VIEW DETAILS
                      </span>
                      <div className={`w-8 h-8 rounded-full bg-gray-900/80 flex items-center justify-center ${config.arrowBg} group-hover:text-black transition-all duration-300`}>
                        <ArrowUpRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View More Popup Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setIsArchiveOpen(true)}
            className="px-8 py-3.5 border border-cyan-500/70 text-cyan-400 font-mono font-bold tracking-widest text-xs bg-black/80 hover:bg-cyan-500/20 hover:border-cyan-300 hover:text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:scale-[1.04] hover:-translate-y-1 transition-all duration-300 uppercase flex items-center gap-3 cursor-pointer"
            style={{
              clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)'
            }}
          >
            <FolderOpen size={16} />
            <span>VIEW MORE PROJECTS</span>
          </button>
        </div>

      </div>

      {/* Popup Modal for All Projects */}
      <AllProjectsModal
        isOpen={isArchiveOpen}
        projects={visibleProjects}
        onClose={() => setIsArchiveOpen(false)}
        onSelectProject={(project) => {
          setSelectedProject(project);
        }}
      />

      {/* Individual Project Details Modal */}
      <ProjectModal 
        mission={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
};
