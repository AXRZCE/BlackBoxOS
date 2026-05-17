'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { track } from '@/lib/telemetry';

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

type ColorMode = 'green' | 'amber' | 'blue' | 'white';

export function ScanlineGlass() {
  const [intensity, setIntensity] = useState(40);
  const [animating, setAnimating] = useState(true);
  const [colorMode, setColorMode] = useState<ColorMode>('green');
  const [noise, setNoise] = useState(true);
  const trackedRef = useRef(false);
  const [time, setTime] = useState('00:00:00');

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!trackedRef.current) {
      track({ type: 'lab_used', name: 'scanline_glass' });
      trackedRef.current = true;
    }
  }, []);

  // Update time display
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const shouldAnimate = animating && !reducedMotion;

  const colorValues: Record<ColorMode, { primary: string; glow: string }> = {
    green: { primary: '120, 100%, 40%', glow: '120, 100%, 50%' },
    amber: { primary: '45, 100%, 50%', glow: '45, 100%, 60%' },
    blue: { primary: '200, 100%, 50%', glow: '200, 100%, 60%' },
    white: { primary: '0, 0%, 80%', glow: '0, 0%, 90%' },
  };

  const currentColor = colorValues[colorMode];

  return (
    <div className="relative w-full h-full flex flex-col bg-black overflow-hidden">
      {/* CRT Screen */}
      <div className="flex-1 relative overflow-hidden rounded-sm m-2">
        {/* Screen background with slight curve effect */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, #111 0%, #000 100%)`,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div
            className="text-center font-mono"
            style={{
              color: `hsla(${currentColor.primary}, 0.9)`,
              textShadow: `0 0 10px hsla(${currentColor.glow}, 0.5)`,
            }}
          >
            <div className="text-lg font-bold tracking-widest mb-1">BLACKBOX</div>
            <div className="text-[10px] tracking-[0.3em] opacity-70">TERMINAL v2.1</div>
            <div className="text-xs mt-3 opacity-50">{time}</div>
          </div>
        </div>

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, ${intensity / 200}) 1px,
              rgba(0, 0, 0, ${intensity / 200}) 2px
            )`,
          }}
        />

        {/* Noise overlay */}
        {noise && (
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay animate-pulse"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        )}

        {/* Animated scan line */}
        {shouldAnimate && (
          <div
            className="absolute left-0 right-0 h-[2px] animate-scan pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, hsla(${currentColor.glow}, 0.3), transparent)`,
              boxShadow: `0 0 ${intensity / 3}px hsla(${currentColor.glow}, 0.4)`,
            }}
          />
        )}

        {/* Screen curvature/vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)`,
          }}
        />

        {/* Glass reflection */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%)`,
          }}
        />
      </div>

      {/* Controls */}
      <div className="p-3 space-y-3 bg-[#0a0a0a] border-t border-white/5">
        {/* Intensity slider */}
        <div className="flex items-center gap-3">
          <label className="text-[9px] font-mono text-white/40 w-16 tracking-wider">SCAN</label>
          <input
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/60"
          />
          <span className="text-[9px] font-mono text-white/30 w-8 text-right">{intensity}%</span>
        </div>

        {/* Color mode buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-white/40 w-16 tracking-wider">COLOR</span>
          <div className="flex gap-1 flex-1">
            {(['green', 'amber', 'blue', 'white'] as ColorMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setColorMode(mode)}
                className={`flex-1 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded transition-all ${
                  colorMode === mode
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setAnimating(!animating)}
            className={`flex-1 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded transition-all ${
              animating ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'
            }`}
          >
            {animating ? '◉ SCAN ON' : '○ SCAN OFF'}
          </button>
          <button
            onClick={() => setNoise(!noise)}
            className={`flex-1 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded transition-all ${
              noise ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'
            }`}
          >
            {noise ? '◉ NOISE ON' : '○ NOISE OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}

