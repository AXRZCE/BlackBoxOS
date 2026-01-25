'use client';

import { useVaultStore } from '@/lib/store';

/**
 * BLACKBOX lock-on reticle overlay.
 * Positioned via CSS transform based on hoverScreenPos from store.
 * Completely non-interactive (pointer-events: none).
 */
export function Reticle() {
  const hoverScreenPos = useVaultStore((state) => state.hoverScreenPos);
  const hoverId = useVaultStore((state) => state.hoverId);
  const qualityPreset = useVaultStore((state) => state.qualityPreset);

  // Disable reticle on LOW quality preset
  if (qualityPreset === 'low') {
    return null;
  }

  // Hide when no hover target
  const isVisible = hoverScreenPos !== null && hoverId !== null;

  return (
    <div
      className="fixed inset-0 z-30 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={`
          absolute transition-opacity duration-150
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          transform: hoverScreenPos
            ? `translate3d(${hoverScreenPos.x}px, ${hoverScreenPos.y}px, 0) translate(-50%, -50%)`
            : 'translate3d(-9999px, -9999px, 0)',
          willChange: 'transform, opacity',
        }}
      >
        {/* Reticle ring */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          className="absolute -left-8 -top-8"
        >
          {/* Outer ring */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-blue-500/60"
          />
          {/* Inner ring */}
          <circle
            cx="32"
            cy="32"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-blue-400/40"
            strokeDasharray="4 4"
          />
          {/* Crosshair lines */}
          <line x1="32" y1="0" x2="32" y2="12" stroke="currentColor" strokeWidth="1" className="text-blue-500/50" />
          <line x1="32" y1="52" x2="32" y2="64" stroke="currentColor" strokeWidth="1" className="text-blue-500/50" />
          <line x1="0" y1="32" x2="12" y2="32" stroke="currentColor" strokeWidth="1" className="text-blue-500/50" />
          <line x1="52" y1="32" x2="64" y2="32" stroke="currentColor" strokeWidth="1" className="text-blue-500/50" />
          {/* Center dot */}
          <circle cx="32" cy="32" r="2" fill="currentColor" className="text-blue-400" />
        </svg>

        {/* LOCK label */}
        <div
          className={`
            absolute left-6 top-6
            px-2 py-0.5
            bg-zinc-950/80 border border-blue-500/30
            font-mono text-[10px] uppercase tracking-widest
            text-blue-400
            whitespace-nowrap
            transition-transform duration-150
            ${isVisible ? 'scale-100' : 'scale-95'}
          `}
        >
          <span className="text-blue-500">LOCK</span>
          <span className="text-zinc-500 mx-1">:</span>
          <span className="text-zinc-400">{hoverId || '---'}</span>
        </div>
      </div>
    </div>
  );
}

