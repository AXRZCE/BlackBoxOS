'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { track } from '@/lib/telemetry';

// Hook to check reduced motion preference
function useReducedMotion(): boolean {
  const getSnapshot = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  const getServerSnapshot = () => false;
  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', callback);
    return () => mq.removeEventListener('change', callback);
  };
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function ScanlineGlass() {
  const [intensity, setIntensity] = useState(50);
  const [animating, setAnimating] = useState(true);
  const trackedRef = useRef(false);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!trackedRef.current) {
      track({ type: 'lab_used', name: 'scanline_glass' });
      trackedRef.current = true;
    }
  }, []);

  const shouldAnimate = animating && !reducedMotion;

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Preview area */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-background to-card">
        {/* Sample content behind the glass */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-display text-foreground/20">BLACKBOX</div>
            <div className="text-label text-foreground/10">SYSTEMS ONLINE</div>
          </div>
        </div>

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, ${intensity / 500}) 2px,
              rgba(0, 0, 0, ${intensity / 500}) 4px
            )`,
          }}
        />

        {/* Animated scan line */}
        {shouldAnimate && (
          <div
            className="absolute left-0 right-0 h-px bg-accent/30 animate-scan"
            style={{
              boxShadow: `0 0 ${intensity / 5}px ${intensity / 10}px oklch(var(--accent) / 0.2)`,
            }}
          />
        )}

        {/* Glass reflection */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              135deg,
              rgba(255, 255, 255, ${intensity / 1000}) 0%,
              transparent 50%,
              rgba(0, 0, 0, ${intensity / 500}) 100%
            )`,
          }}
        />
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-border/30 space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="intensity" className="text-label text-foreground/60">
            INTENSITY
          </label>
          <span className="text-micro text-foreground/40">{intensity}%</span>
        </div>
        <input
          id="intensity"
          type="range"
          min="0"
          max="100"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full h-1 bg-border/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
          aria-label="Scanline intensity"
        />
        <button
          onClick={() => setAnimating(!animating)}
          className={`
            w-full py-2 text-label border rounded-sm transition-colors
            ${animating
              ? 'border-accent/50 text-accent bg-accent/10'
              : 'border-border/50 text-foreground/50 bg-transparent'
            }
          `}
          aria-pressed={animating}
        >
          {animating ? 'ANIMATION ON' : 'ANIMATION OFF'}
        </button>
      </div>
    </div>
  );
}

