'use client';

import { useRef, useEffect, useCallback } from 'react';
import { track } from '@/lib/telemetry';

interface ParticleFieldProps {
  disabled?: boolean;
}

const PARTICLE_COUNT = 100;
const PARTICLE_SIZE = 2;

export function ParticleField({ disabled = false }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseX: number;
    baseY: number;
  }>>([]);
  const animationRef = useRef<number>(0);
  const trackedRef = useRef(false);

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
      };
    });
  }, []);

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initParticles(rect.width, rect.height);
    };
    resize();

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      particlesRef.current.forEach((p) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 100;

        if (dist < maxDist && !prefersReducedMotion) {
          // Push away from mouse
          const force = (maxDist - dist) / maxDist;
          p.vx -= (dx / dist) * force * 2;
          p.vy -= (dy / dist) * force * 2;
        }

        // Return to base position
        p.vx += (p.baseX - p.x) * 0.02;
        p.vy += (p.baseY - p.y) * 0.02;

        // Apply friction
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle - use electric blue color directly
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_SIZE, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.7)'; // Electric blue #3b82f6
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', resize);

    // Track usage once
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
      };
    }
  };

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair"
      onMouseMove={handleMouseMove}
    />
  );
}

