import React from 'react';
import { motion } from 'framer-motion';
import { Microchip, Cpu, Network } from 'lucide-react';

export const Engineering: React.FC = () => {
  return (
    <section 
      id="engineering" 
      className="py-14 sm:py-16 relative bg-transparent overflow-hidden"
    >

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-[1px] bg-cyan-400" />
          <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-bold tracking-wider sm:tracking-[0.2em] text-white hover-rgb-text-shadow transition-all duration-300 cursor-default break-words">
            ENGINEERING
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">

          {/* Line-by-Line Clean Text Entrance */}
          <div className="p-6 sm:p-8 bg-black/40 border border-gray-800 rounded-xl flex flex-col gap-5 text-gray-300 leading-relaxed text-sm md:text-base font-mono hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,240,255,0.35)] transition-all duration-200">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              My primary focus lies at the intersection of hardware and software, specifically within <strong className="text-white">Robotics and Embedded Systems</strong>. I am driven by the process of designing physical systems that can perceive their environment, make decisions, and act autonomously.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              In embedded systems, I have practical experience interfacing microcontrollers like the <strong className="text-white">ESP32, Arduino, and Raspberry Pi</strong> with arrays of sensors (ultrasonic, gas, IR, piezoelectric, camera modules) and actuators (DC motors, servos). My approach emphasizes low-latency real-time control, sensor data processing, and establishing reliable communication protocols (UART, I2C, Wi-Fi) between disparate hardware nodes.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              On the software side, I write firmware primarily in <strong className="text-white">C/C++ and Python</strong>. For robotics and automation, I integrate <strong className="text-white">Computer Vision (OpenCV)</strong> and real-time sensor processing to give systems environmental awareness. My engineering philosophy prioritizes functional reliability, modular design, and robust hardware-software integration over superficial features.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Currently, I am expanding my knowledge in advanced kinematics, ROS (Robot Operating System), and deeper PCB design methodologies to build more complex, industrial-grade robotic architectures.
            </motion.p>
          </div>

          {/* Technical Pillars - Clean Fade In with Hover Glow */}
          <div className="flex flex-col gap-4 justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              tabIndex={0}
              className="p-4 sm:p-5 bg-black/60 border border-gray-800 rounded-xl flex items-start gap-4 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.7),_0_0_50px_rgba(0,240,255,0.35)] hover:-translate-y-1 active:border-cyan-400 active:shadow-[0_0_35px_rgba(0,240,255,0.8),_0_0_60px_rgba(0,240,255,0.4)] focus:border-cyan-400 focus:shadow-[0_0_35px_rgba(0,240,255,0.8),_0_0_60px_rgba(0,240,255,0.4)] transition-all duration-300 cursor-pointer outline-none"
            >
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400 shrink-0">
                <Cpu size={22} />
              </div>
              <div>
                <h3 className="font-mono font-bold text-white text-base mb-1">EMBEDDED ARCHITECTURES</h3>
                <p className="text-xs text-gray-400 font-mono leading-relaxed">
                  Low-level firmware development, microcontroller peripherals, interrupt-driven I/O, and real-time hardware execution.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.15 }}
              tabIndex={0}
              className="p-4 sm:p-5 bg-black/60 border border-gray-800 rounded-xl flex items-start gap-4 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.7),_0_0_50px_rgba(0,240,255,0.35)] hover:-translate-y-1 active:border-cyan-400 active:shadow-[0_0_35px_rgba(0,240,255,0.8),_0_0_60px_rgba(0,240,255,0.4)] focus:border-cyan-400 focus:shadow-[0_0_35px_rgba(0,240,255,0.8),_0_0_60px_rgba(0,240,255,0.4)] transition-all duration-300 cursor-pointer outline-none"
            >
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400 shrink-0">
                <Microchip size={22} />
              </div>
              <div>
                <h3 className="font-mono font-bold text-white text-base mb-1">SENSOR & ACTUATOR INTEGRATION</h3>
                <p className="text-xs text-gray-400 font-mono leading-relaxed">
                  Signal conditioning, analog-to-digital data acquisition, PWM motor control, and closed-loop feedback systems.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
              tabIndex={0}
              className="p-4 sm:p-5 bg-black/60 border border-gray-800 rounded-xl flex items-start gap-4 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.7),_0_0_50px_rgba(0,240,255,0.35)] hover:-translate-y-1 active:border-cyan-400 active:shadow-[0_0_35px_rgba(0,240,255,0.8),_0_0_60px_rgba(0,240,255,0.4)] focus:border-cyan-400 focus:shadow-[0_0_35px_rgba(0,240,255,0.8),_0_0_60px_rgba(0,240,255,0.4)] transition-all duration-300 cursor-pointer outline-none"
            >
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400 shrink-0">
                <Network size={22} />
              </div>
              <div>
                <h3 className="font-mono font-bold text-white text-base mb-1">HARDWARE-SOFTWARE PIPELINES</h3>
                <p className="text-xs text-gray-400 font-mono leading-relaxed">
                  Bridge physical sensor inputs with software vision systems (OpenCV) and communication buses (UART/I2C/Wi-Fi).
                </p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};
