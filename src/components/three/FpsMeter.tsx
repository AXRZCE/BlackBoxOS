'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVaultStore } from '@/lib/store';
import { FPSMonitor } from '@/lib/device';
import { track } from '@/lib/telemetry';

// Rolling average window size
const SAMPLE_SIZE = 60;

export function FpsMeter() {
  const setFps = useVaultStore((state) => state.setFps);
  const qualityPreset = useVaultStore((state) => state.qualityPreset);
  const setQualityPreset = useVaultStore((state) => state.setQualityPreset);

  const frameTimes = useRef<number[]>([]);
  const lastTime = useRef<number>(0);
  const initialized = useRef(false);
  const fpsMonitor = useRef<FPSMonitor | null>(null);
  const hasDowngraded = useRef(false);

  // Initialize in useEffect to avoid calling impure function during render
  useEffect(() => {
    lastTime.current = performance.now();
    fpsMonitor.current = new FPSMonitor();
    initialized.current = true;

    // Reset downgrade flag when quality changes (allows re-downgrade if upgraded)
    hasDowngraded.current = false;
  }, [qualityPreset]);

  useFrame(() => {
    if (!initialized.current) return;

    const now = performance.now();
    const delta = now - lastTime.current;
    lastTime.current = now;

    // Add frame time to rolling window
    frameTimes.current.push(delta);
    if (frameTimes.current.length > SAMPLE_SIZE) {
      frameTimes.current.shift();
    }

    // Calculate average FPS every 10 frames to reduce store updates
    if (frameTimes.current.length % 10 === 0) {
      const avgDelta = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;
      const fps = Math.round(1000 / avgDelta);
      setFps(fps);

      // Check for FPS-based downgrade (only if not already at lowest quality)
      if (
        fpsMonitor.current &&
        !hasDowngraded.current &&
        qualityPreset !== 'low'
      ) {
        const shouldDowngrade = fpsMonitor.current.addSample(fps);
        if (shouldDowngrade) {
          // Downgrade quality
          const newPreset = qualityPreset === 'high' ? 'medium' : 'low';
          setQualityPreset(newPreset);
          hasDowngraded.current = true;
          track({ type: 'quality_preset_changed', preset: newPreset, auto: true });
          console.log(`[FpsMeter] Low FPS detected, downgrading to ${newPreset}`);
        }
      }
    }
  });

  return null;
}

