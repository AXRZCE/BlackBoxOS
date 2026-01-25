'use client';

import { useEffect, useState } from 'react';
import { useModeStore } from '@/lib/mode-store';
import { useVaultStore } from '@/lib/store';
import { shouldRunFx } from '@/lib/motion';

/**
 * HudOverlay - Tactical HUD layer with corners, grid, and flash effects
 * Respects mode (stealth/overdrive), quality preset, and reduced motion
 */
export function HudOverlay() {
  const mode = useModeStore((s) => s.mode);
  const hudFlashUntil = useModeStore((s) => s.hudFlashUntil);
  const qualityPreset = useVaultStore((s) => s.qualityPreset);
  const [isFlashing, setIsFlashing] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  // Check if we should render based on quality/motion preferences
  useEffect(() => {
    setShouldRender(shouldRunFx(qualityPreset));
  }, [qualityPreset]);

  // Handle flash animation
  useEffect(() => {
    const checkFlash = () => {
      const now = Date.now();
      const shouldFlash = hudFlashUntil > now;
      setIsFlashing(shouldFlash);
      
      if (shouldFlash) {
        const remaining = hudFlashUntil - now;
        const timeoutId = setTimeout(checkFlash, remaining);
        return () => clearTimeout(timeoutId);
      }
    };
    
    return checkFlash();
  }, [hudFlashUntil]);

  // Don't render in LOW quality or reduced motion
  if (!shouldRender) return null;

  return (
    <div className="hud-overlay fixed inset-0">
      {/* Corner brackets */}
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-tr" />
      <div className="hud-corner hud-corner-bl" />
      <div className="hud-corner hud-corner-br" />

      {/* Grid lines (only in overdrive) */}
      {mode === 'overdrive' && (
        <>
          <div className="hud-grid-line hud-grid-h" style={{ top: '33%' }} />
          <div className="hud-grid-line hud-grid-h" style={{ top: '66%' }} />
          <div className="hud-grid-line hud-grid-v" style={{ left: '33%' }} />
          <div className="hud-grid-line hud-grid-v" style={{ left: '66%' }} />
        </>
      )}

      {/* Flash overlay */}
      <div className={`hud-flash ${isFlashing ? 'active' : ''}`} />

      {/* Status readout (top-right) */}
      <div 
        className="absolute top-5 right-5 font-mono text-[10px] uppercase tracking-widest"
        style={{ opacity: 'var(--hud-opacity, 0.15)', color: 'var(--accent)' }}
      >
        <div>{mode === 'overdrive' ? 'OVERDRIVE' : 'STEALTH'}</div>
      </div>
    </div>
  );
}

