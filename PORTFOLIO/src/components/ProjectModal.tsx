import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import type { MissionData } from './MissionCard';
import { getImageUrl } from '../context/PortfolioContext';

interface ProjectModalProps {
  mission: MissionData | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ mission, onClose }) => {
  // Prevent body scrolling and preserve exact position when modal is open
  useEffect(() => {
    if (mission) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      const scrollY = document.body.dataset.scrollY;
      if (scrollY !== undefined) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0'));
        delete document.body.dataset.scrollY;
      }
    }

    // Cleanup function in case component unmounts while modal is open
    return () => {
      const scrollY = document.body.dataset.scrollY;
      if (scrollY !== undefined) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0'));
        delete document.body.dataset.scrollY;
      }
    };
  }, [mission]);

  if (!mission) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 "
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/95 neon-cyan border border-cyan-500/40 custom-scrollbar shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition-colors bg-black/80 border border-gray-800 hover:border-cyan-400 cursor-pointer"
          >
            <X size={24} />
          </button>

          <div className="p-6 md:p-10">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-tech text-cyan-400 tracking-widest uppercase">
                  PROJECT SPECIFICATIONS
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-wider text-white">
                {mission.title}
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {mission.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-mono text-xs text-cyan-300 bg-cyan-950/40 px-3 py-1.5 border border-cyan-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            {(mission.githubUrl || mission.demoUrl) && (
              <div className="flex gap-4 mb-8 pb-8 border-b border-core-border">
                {mission.githubUrl && (
                  <a
                    href={mission.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300 font-mono font-bold text-sm tracking-wider"
                  >
                    <FaGithub size={18} />
                    <span>GITHUB LINK</span>
                  </a>
                )}
                {mission.demoUrl && (
                  <a
                    href={mission.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-muted hover:text-white transition-colors"
                  >
                    <ExternalLink size={20} />
                    <span className="text-tech font-bold">LIVE DEMO</span>
                  </a>
                )}
              </div>
            )}

            {/* Detailed Content */}
            {mission.details ? (
              <div className="space-y-12">
                
                {/* Project Image */}
                {mission.image && (
                  <div className="w-full border border-core-border bg-black/40 p-3 flex items-center justify-center min-h-[250px] max-h-[600px] overflow-hidden rounded">
                    <img 
                      src={getImageUrl(mission.image)} 
                      alt={mission.title} 
                      className="max-w-full max-h-[580px] w-auto h-auto object-contain rounded shadow-lg"
                    />
                  </div>
                )}

                {/* Description */}
                <section>
                  <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
                    DESCRIPTION
                  </h3>
                  <p className="text-gray-200 leading-relaxed text-lg bg-black/40 p-5 border border-cyan-500/20">
                    {mission.details.shortDescription}
                  </p>
                </section>

                {(mission.details.category || mission.details.mainTechnologies) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Category */}
                    {mission.details.category && (
                      <section>
                        <h3 className="text-lg font-bold mb-4 text-purple-400 uppercase tracking-wider">Categories</h3>
                        <ul className="space-y-2">
                          {mission.details.category.map((cat, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-300">
                              <span className="text-purple-400 mt-1">▸</span> {cat}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Tech Stack */}
                    {mission.details.mainTechnologies && (
                      <section>
                        <h3 className="text-lg font-bold mb-4 text-cyan-400 uppercase tracking-wider">Main Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {mission.details.mainTechnologies.map((tech, i) => (
                            <span key={i} className="text-sm border border-cyan-500/40 bg-cyan-950/40 px-3 py-1 text-cyan-300 font-mono">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                )}

                {/* Hardware */}
                {mission.details.mainHardware && mission.details.mainHardware.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                      HARDWARE COMPONENTS
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {mission.details.mainHardware.map((hw, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-emerald-300 border border-emerald-500/30 bg-emerald-950/20 p-3 font-mono">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          <span className="text-sm">{hw}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* How it works */}
                {mission.details.howItWorks && mission.details.howItWorks.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
                      HOW IT WORKS
                    </h3>
                    <div className="space-y-6">
                      {mission.details.howItWorks.map((stage, i) => (
                        <div key={i} className="border-l-2 border-cyan-500/50 pl-4 py-2 bg-cyan-950/10">
                          <h4 className="text-lg font-bold text-cyan-300 mb-3">{stage.stage}</h4>
                          <ul className="space-y-2">
                            {stage.points.map((point, j) => (
                              <li key={j} className="text-gray-300 flex items-start gap-2">
                                <span className="text-cyan-400 mt-1.5 text-xs">■</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* System Flow */}
                {mission.details.systemFlow && mission.details.systemFlow.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2 uppercase tracking-wider">
                      SYSTEM ARCHITECTURE FLOW
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-purple-200 bg-purple-950/20 p-6 border border-purple-500/30">
                      {mission.details.systemFlow.map((step, i) => (
                        <React.Fragment key={i}>
                          <span className="font-mono text-sm px-3 py-1.5 bg-black/60 border border-purple-500/40 text-purple-300">{step}</span>
                          {i < mission.details!.systemFlow!.length - 1 && (
                            <span className="text-purple-400 font-bold text-lg">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </section>
                )}

                {/* Grid for Features & Objectives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {mission.details.keyFeatures && (
                    <section>
                      <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
                        KEY FEATURES
                      </h3>
                      <ul className="space-y-2">
                        {mission.details.keyFeatures.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-200">
                            <span className="text-cyan-400 mt-1">▸</span> {feature}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {mission.details.objectives && (
                    <section>
                      <h3 className="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2 uppercase tracking-wider">
                        PROJECT OBJECTIVES
                      </h3>
                      <ul className="space-y-2">
                        {mission.details.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-200">
                            <span className="text-amber-400 mt-1">▸</span> {obj}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                {/* Applications */}
                {mission.details.applications && mission.details.applications.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                      REAL WORLD APPLICATIONS
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {mission.details.applications.map((app, i) => (
                        <div key={i} className="border border-emerald-500/40 bg-emerald-950/20 px-4 py-2 text-emerald-300 font-mono text-sm">
                          {app}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Custom Generic Sections */}
                {mission.details.customSections && mission.details.customSections.map((section, idx) => (
                  <section key={idx} className="mt-12">
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2 uppercase">
                      {section.title}
                    </h3>
                    
                    {section.type === 'text' && (
                      <p className="text-text-muted leading-relaxed text-lg whitespace-pre-wrap">{section.content}</p>
                    )}

                    {section.type === 'image' && (
                      <div className="mt-6 border border-core-border p-3 bg-black/40 flex justify-center items-center rounded">
                        <img src={getImageUrl(section.content)} alt={section.title} className="max-w-full max-h-[600px] w-auto h-auto object-contain rounded" />
                      </div>
                    )}

                    {section.type === 'video' && (
                      <div className="mt-6 border border-core-border p-2 bg-black/20">
                        <video src={section.content} controls className="w-full h-auto" />
                      </div>
                    )}

                    {section.type === 'list' && (
                      <ul className="space-y-3">
                        {section.content.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-white mt-1">▸</span>
                            <span className="text-text-muted text-lg">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.type === 'multi-flow' && (
                      <div className="flex flex-col gap-6 items-center w-full mt-6">
                        <div className="flex flex-wrap justify-center gap-4">
                          {section.content.inputs.map((input: string, i: number) => (
                            <span key={i} className="text-white font-bold tracking-widest border border-white/30 px-6 py-3 bg-white/5">{input}</span>
                          ))}
                        </div>
                        <div className="text-white text-3xl font-light">↓</div>
                        <div className="flex flex-col gap-4 items-center w-full max-w-lg">
                          {section.content.flow.map((item: string, i: number) => (
                            <React.Fragment key={i}>
                              <div className="bg-black/30 text-white border border-core-border px-6 py-4 w-full text-center font-bold tracking-widest shadow-sm shadow-white/5">{item}</div>
                              {i < section.content.flow.length - 1 && <div className="text-white text-2xl font-light">↓</div>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}

                    {section.type === 'text-flow' && (
                      <div className="space-y-8">
                        <p className="text-text-muted text-lg leading-relaxed">{section.content.text}</p>
                        <div className="flex flex-wrap items-center justify-center gap-3 bg-black/30 p-6 border border-core-border shadow-sm shadow-white/5">
                          {section.content.flow.map((item: string, i: number) => (
                            <React.Fragment key={i}>
                              <span className="font-bold text-white tracking-widest px-3 py-1.5 bg-core-bg border border-core-border">{item}</span>
                              {i < section.content.flow.length - 1 && <span className="text-white font-bold">→</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}

                    {section.type === 'grid' && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {section.content.map((item: string, i: number) => (
                          <div key={i} className="border border-core-border p-5 flex items-center justify-center text-center hover:border-white/50 transition-colors bg-black/20 group cursor-default">
                            <span className="text-text-muted font-medium group-hover:text-white transition-colors">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === 'architecture' && (
                      <div className="flex flex-col gap-6 mt-4">
                        {section.content.map((tier: any, i: number) => (
                          <React.Fragment key={i}>
                            <div className="border border-core-border p-6 bg-black/20 hover:border-white/30 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 border-b border-core-border pb-4">
                                <span className="text-white font-bold tracking-widest text-sm bg-white/10 px-3 py-1 w-fit">{tier.tier}</span>
                                <h4 className="text-white font-bold text-xl tracking-wider">{tier.name}</h4>
                              </div>
                              <div className="flex flex-wrap gap-3 mt-4">
                                {tier.items.map((item: string, j: number) => (
                                  <span key={j} className="bg-core-bg px-4 py-2 text-sm text-text-muted border border-core-border hover:text-white transition-colors tracking-wide">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {i < section.content.length - 1 && <div className="text-white text-3xl font-light text-center">↓</div>}
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    {section.type === 'tech-split' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        {Object.entries(section.content).map(([category, items]) => (
                          <div key={category} className="border border-core-border p-6 bg-black/20">
                            <h4 className="text-white font-bold mb-6 tracking-widest border-b border-core-border pb-2">{category.toUpperCase()}</h4>
                            <div className="flex flex-wrap gap-3">
                              {(items as string[]).map((item, i) => (
                                <span key={i} className="text-white bg-white/5 border border-white/20 px-4 py-2 text-sm font-medium tracking-wide">{item}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === 'verification' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {section.content.map((item: string, i: number) => (
                          <div key={i} className="flex items-center gap-4 bg-black/20 p-4 border border-green-500/20 hover:bg-green-500/5 transition-colors">
                            <div className="text-green-500 font-bold bg-green-500/10 rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</div>
                            <span className="text-white tracking-wide font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === 'flow' && (
                      <div className="flex flex-col gap-2 items-center text-center mt-6">
                        {section.content.map((item: string, i: number) => (
                          <React.Fragment key={i}>
                            <div className="font-bold text-white px-6 py-3 border border-core-border w-full max-w-md bg-black/40 tracking-widest">{item}</div>
                            {i < section.content.length - 1 && <div className="text-white font-bold text-xl">↓</div>}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            ) : (
              <div className="text-text-muted text-lg">
                <p>{mission.description}</p>
                <div className="mt-8 p-4 border border-yellow-500/30 bg-yellow-500/5 text-yellow-500/80 text-sm">
                  Detailed documentation for this project is currently unavailable or classified.
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
