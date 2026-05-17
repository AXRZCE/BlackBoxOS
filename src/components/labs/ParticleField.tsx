'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { track } from '@/lib/telemetry';

interface ParticleFieldProps {
  disabled?: boolean;
}

const PARTICLE_COUNT = 80;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  hue: number;
}

export function ParticleField({ disabled = false }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const trackedRef = useRef(false);
  const [particleCount, setParticleCount] = useState(0);

  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        baseX: x,
        baseY: y,
        size: 1.5 + Math.random() * 2,
        hue: 200 + Math.random() * 40, // Blue-cyan range
      };
    });
    setParticleCount(PARTICLE_COUNT);
  }, []);

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initParticles(rect.width, rect.height);
    };
    resize();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();

      // Fade effect for trails
      ctx.fillStyle = 'rgba(245, 245, 245, 0.15)';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw connections between nearby particles
      particlesRef.current.forEach((p, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${(p.hue + p2.hue) / 2}, 70%, 50%, ${0.15 * (1 - dist / 60)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      particlesRef.current.forEach((p) => {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist && mouseRef.current.active && !prefersReducedMotion) {
          const force = (maxDist - dist) / maxDist;
          p.vx -= (dx / dist) * force * 3;
          p.vy -= (dy / dist) * force * 3;
          // Shift hue when disturbed
          p.hue = (p.hue + 2) % 360;
        }

        // Return to base with spring physics
        p.vx += (p.baseX - p.x) * 0.015;
        p.vy += (p.baseY - p.y) * 0.015;

        // Friction
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle with glow
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const glowSize = p.size + speed * 2;

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 60%, 0.4)`);
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, 0.9)`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resize);

    if (!trackedRef.current) {
      track({ type: 'lab_used', name: 'particle_field' });
      trackedRef.current = true;
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [disabled, initParticles]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  if (disabled) return null;

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair bg-[#f5f5f5] dark:bg-[#0a0a0a]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {/* Stats overlay */}
      <div className="absolute bottom-2 left-2 text-[9px] font-mono text-[#1d2433]/30 dark:text-white/30 tracking-wider">
        PARTICLES: {particleCount}
      </div>
    </div>
  );
}

