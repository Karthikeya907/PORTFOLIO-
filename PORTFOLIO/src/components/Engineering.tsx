import React from 'react';
import { motion } from 'framer-motion';
import { Microchip, Cpu, Network } from 'lucide-react';
import { SensorCore } from './SensorCore';
import { BackgroundRadiantCircuits } from './BackgroundRadiantCircuits';

export const Engineering: React.FC = () => {
  const [isGlitching, setIsGlitching] = React.useState(false);

  React.useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 350);
      const nextDelay = 8000 + Math.random() * 7000;
      timerId = setTimeout(triggerGlitch, nextDelay);
    };
    let timerId = setTimeout(triggerGlitch, 7000);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <section 
      id="engineering" 
      className="py-12 relative bg-transparent overflow-hidden"
    >
      {/* Background Hardware Core */}
      <BackgroundRadiantCircuits color1="#8a2be2" color2="#d400ff" opacity={0.2} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-40 pointer-events-none z-0">
        <SensorCore />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-[1px] bg-cyan-400" />
          <h2 className={`font-display text-xl sm:text-3xl md:text-4xl font-bold tracking-wider sm:tracking-[0.2em] text-white hover-rgb-text-shadow transition-all duration-300 cursor-default break-words ${isGlitching ? 'glitching' : ''}`}>ENGINEERING</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Factual Prose */}
          <motion.div 
            initial={{ opacity: 0, y: -150, rotateX: 45 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4 text-gray-300 leading-relaxed text-sm md:text-base font-mono"
          >
            <p>
              My primary focus lies at the intersection of hardware and software, specifically within <strong className="text-white">Robotics and Embedded Systems</strong>. I am driven by the process of designing physical systems that can perceive their environment, make decisions, and act autonomously.
            </p>
            <p>
              In embedded systems, I have practical experience interfacing microcontrollers like the <strong className="text-white">ESP32, Arduino, and Raspberry Pi</strong> with arrays of sensors (ultrasonic, gas, IR, piezoelectric, camera modules) and actuators (DC motors, servos). My approach emphasizes low-latency real-time control, sensor data processing, and establishing reliable communication protocols (UART, I2C, Wi-Fi) between disparate hardware nodes.
            </p>
            <p>
              On the software side, I write firmware primarily in <strong className="text-white">C/C++ and Python</strong>. For robotics and automation, I integrate <strong className="text-white">Computer Vision (OpenCV)</strong> and real-time sensor processing to give systems environmental awareness. My engineering philosophy prioritizes functional reliability, modular design, and robust hardware-software integration over superficial features.
            </p>
            <p>
              Currently, I am expanding my knowledge in advanced kinematics, ROS (Robot Operating System), and deeper PCB design methodologies to build more complex, industrial-grade robotic architectures.
            </p>
          </motion.div>

          {/* Technical Pillars */}
          <motion.div 
            initial={{ opacity: 0, y: 150, rotateX: -45 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="grid gap-4"
          >
            <div className="group relative neon-cyan bg-transparent p-5 flex gap-4 items-start rounded-xl border border-cyan-500/50 hover:border-cyan-400 hover:bg-black/30 transition-all duration-300 shadow-lg">
              <Microchip className="text-cyan-400 w-7 h-7 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-bold tracking-widest text-sm font-mono">HARDWARE INTEGRATION</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-mono">
                  Interfacing microcontrollers (ESP32, Arduino, Raspberry Pi) with sensors, motor drivers, and power management systems.
                </p>
              </div>
            </div>

            <div className="group relative neon-orange bg-transparent p-5 flex gap-4 items-start rounded-xl border border-amber-500/50 hover:border-amber-400 hover:bg-black/30 transition-all duration-300 shadow-lg">
              <Cpu className="text-amber-400 w-7 h-7 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-bold tracking-widest text-sm font-mono">FIRMWARE & CONTROL</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </div>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-mono">
                  Writing C/C++ and Python for real-time motor control, sensor polling, and state-machine logic in robotic applications.
                </p>
              </div>
            </div>

            <div className="group relative neon-green bg-transparent p-5 flex gap-4 items-start rounded-xl border border-emerald-500/50 hover:border-emerald-400 hover:bg-black/30 transition-all duration-300 shadow-lg">
              <Network className="text-emerald-400 w-7 h-7 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-bold tracking-widest text-sm font-mono">VISION & AUTONOMY</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-mono">
                  Implementing OpenCV and local AI models for object detection, obstacle avoidance, and visual navigation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
