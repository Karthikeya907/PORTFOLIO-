import React from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from './TiltCard';
import { RobotFaceCore } from './RobotFaceCore';
import { BackgroundRadiantCircuits } from './BackgroundRadiantCircuits';
import { Cpu, Code, ShieldCheck, Wrench } from 'lucide-react';

import { usePortfolio } from '../context/PortfolioContext';

export const Capabilities: React.FC = () => {
  const { skills } = usePortfolio();
  const [isGlitching, setIsGlitching] = React.useState(false);

  React.useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 350);
      const nextDelay = 8000 + Math.random() * 7000;
      timerId = setTimeout(triggerGlitch, nextDelay);
    };
    let timerId = setTimeout(triggerGlitch, 6000);
    return () => clearTimeout(timerId);
  }, []);

  const categoryIcons: Record<string, React.ReactNode> = {
    'PROGRAMMING LANGUAGES': <Code size={18} className="text-cyan-400" />,
    'PLATFORMS & TOOLS': <Wrench size={18} className="text-purple-400" />,
    'DOMAINS & SPECIALIZATIONS': <Cpu size={18} className="text-amber-400" />,
    'SOFT SKILLS & PROFESSIONAL': <ShieldCheck size={18} className="text-emerald-400" />,
  };

  const displaySkills = skills && skills.length > 0 ? skills : [
    {
      category: "PROGRAMMING LANGUAGES",
      skills: ["Java", "Python", "C", "C++", "SQL", "HTML5", "CSS3", "JavaScript", "TypeScript"]
    },
    {
      category: "PLATFORMS & TOOLS",
      skills: ["Raspberry Pi 5", "Arduino Due / Nano", "Arduino IDE", "Git & GitHub", "VS Code", "Linux CLI", "MS Office"]
    },
    {
      category: "DOMAINS & SPECIALIZATIONS",
      skills: ["Robotics", "Embedded Systems", "Internet of Things (IoT)", "AI Integration", "Computer Vision (OpenCV)", "Autonomous Navigation"]
    },
    {
      category: "SOFT SKILLS & PROFESSIONAL",
      skills: ["Team Collaboration", "Problem Solving", "Adaptability", "Technical Communication", "Project Lifecycle Management"]
    }
  ];

  return (
    <section 
      id="capabilities" 
      className="py-24 relative bg-transparent overflow-hidden"
    >
      {/* Background Hardware Core */}
      <BackgroundRadiantCircuits color1="#00d8ff" color2="#0055ff" opacity={0.25} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 pointer-events-none z-0">
        <RobotFaceCore />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-[1px] bg-cyan-400" />
          <h2 className={`font-display text-xl sm:text-3xl md:text-4xl font-bold tracking-wider sm:tracking-[0.2em] text-white drop-shadow-sm hover-rgb-text-shadow transition-all duration-300 cursor-default break-words ${isGlitching ? 'glitching' : ''}`}>
            CAPABILITIES
          </h2>
        </div>

        {/* Categories 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {displaySkills.map((group, groupIdx) => {
            const borderStyle = 
              groupIdx === 0 ? 'neon-cyan border-cyan-500/40' : 
              groupIdx === 1 ? 'neon-purple border-purple-500/40' : 
              groupIdx === 2 ? 'neon-orange border-amber-500/40' : 
              'neon-green border-emerald-500/40';

            const iconKey = Object.keys(categoryIcons).find(k => k.toLowerCase() === group.category.toLowerCase()) || '';
            const icon = categoryIcons[iconKey] || <Cpu size={18} className="text-cyan-400" />;

            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.5, delay: groupIdx * 0.1 }}
                className="flex flex-col h-full"
              >
                <TiltCard 
                  maxTilt={3} 
                  scaleOnHover={1.01} 
                  className={`group relative h-full bg-transparent p-4 sm:p-6 md:p-8 rounded-xl border ${borderStyle} transition-all duration-300 flex flex-col justify-between hover:bg-black/30 shadow-xl`}
                >
                  <div>
                    {/* Category Title Header */}
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-800/80">
                      <div className="p-2 bg-black/80 border border-cyan-500/30 rounded-sm">
                        {icon}
                      </div>
                      <h3 className="font-mono text-white font-bold tracking-widest text-base sm:text-lg uppercase">
                        {group.category}
                      </h3>
                    </div>

                    {/* Skill Tag Badges */}
                    <div className="flex flex-wrap gap-2.5">
                      {group.skills.map((skill, idx) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: false, amount: 0.1 }}
                          transition={{ duration: 0.3, delay: (groupIdx * 0.1) + (idx * 0.03) }}
                          className="px-3.5 py-1.5 bg-gray-950/90 border border-gray-800 hover:border-cyan-400 text-gray-300 hover:text-white font-mono text-xs tracking-wider rounded-md transition-all duration-200 shadow-sm flex items-center gap-2 cursor-default"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                          <span>{skill}</span>
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
