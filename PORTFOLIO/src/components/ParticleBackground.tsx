import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      driftPhase: number;
      driftSpeed: number;
      color: string;
      glowIntensity: number;

      constructor(startY?: number) {
        this.x = Math.random() * width;
        // Start randomly on screen if startY is provided (for initial fill), else start below screen
        this.y = startY !== undefined ? startY : height + Math.random() * 200;
        
        // Depth effect: zLayer from 0 (far/dim/slow) to 1 (near/bright/fast)
        const zLayer = Math.random();
        
        this.size = 0.5 + zLayer * 1.5; // 0.5px to 2.0px
        this.speedY = 0.2 + zLayer * 0.6; // 0.2px to 0.8px per frame (slow and elegant)
        
        this.driftPhase = Math.random() * Math.PI * 2;
        this.driftSpeed = 0.005 + Math.random() * 0.01;
        
        // Robotics Red / Tech Blue
        const isRed = Math.random() > 0.5;
        // Base opacity based on depth
        const opacity = 0.1 + zLayer * 0.4;
        
        if (isRed) {
          this.color = `rgba(220, 38, 38, ${opacity})`; // Red-600
        } else {
          this.color = `rgba(6, 182, 212, ${opacity})`; // Cyan-500
        }
        
        // Only nearest particles get a subtle glow
        this.glowIntensity = zLayer > 0.8 ? 3 : 0;
      }

      update() {
        this.y -= this.speedY;
        this.driftPhase += this.driftSpeed;
        this.x += Math.sin(this.driftPhase) * 0.2;

        // Reset if it goes above screen top
        if (this.y < -50) {
          this.y = height + 50;
          this.x = Math.random() * width;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Fade out near the top 30% of the screen
        const fadeThreshold = height * 0.3;
        let currentAlpha = 1;
        if (this.y < fadeThreshold) {
          currentAlpha = Math.max(0, this.y / fadeThreshold);
        }

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        
        if (this.glowIntensity > 0) {
          ctx.shadowBlur = this.glowIntensity;
          ctx.shadowColor = this.color;
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    const init = () => {
      particles = [];
      // Moderate density: not too many, not too few
      const particleCount = Math.min(Math.floor(width / 25), 60); 
      for (let i = 0; i < particleCount; i++) {
        // Distribute them vertically for the initial state so the screen isn't empty
        particles.push(new Particle(Math.random() * height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
