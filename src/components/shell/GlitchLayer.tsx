'use client';

import { useEffect, useState } from 'react';
import { useModeStore } from '@/lib/mode-store';
import { useVaultStore } from '@/lib/store';
import { shouldRunFx } from '@/lib/motion';

/**
 * GlitchLayer - Event-driven glitch effect overlay
 * Triggers: overdrive unlock, mode switch, target lock, errors
 * Duration: 120-250ms, subtle
 */
export function GlitchLayer() {
  const glitchUntil = useModeStore((s) => s.glitchUntil);
  const qualityPreset = useVaultStore((s) => s.qualityPreset);
  const [isGlitching, setIsGlitching] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  // Check if we should render based on quality preferences
  useEffect(() => {
    setShouldRender(shouldRunFx(qualityPreset));
  }, [qualityPreset]);

  // Handle glitch animation
  useEffect(() => {
    const checkGlitch = () => {
      const now = Date.now();
      const shouldGlitch = glitchUntil > now;
      setIsGlitching(shouldGlitch);

      if (shouldGlitch) {
        const remaining = glitchUntil - now;
        const timeoutId = setTimeout(checkGlitch, remaining);
        return () => clearTimeout(timeoutId);
      }
    };

    return checkGlitch();
  }, [glitchUntil]);

  // Don't render in LOW quality or reduced motion
  if (!shouldRender || !isGlitching) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      {/* Jitter layer */}
      <div className="absolute inset-0 glitch-active" />
      
      {/* Scanline intensify */}
      <div className="absolute inset-0 glitch-scanline opacity-30" />
      
      {/* Chromatic aberration effect */}
      <div 
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: 'linear-gradient(90deg, rgba(255,0,0,0.02) 0%, transparent 50%, rgba(0,255,255,0.02) 100%)',
        }}
      />
    </div>
  );
}

