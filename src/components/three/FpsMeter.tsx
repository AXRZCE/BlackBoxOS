'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVaultStore } from '@/lib/store';

// Rolling average window size
const SAMPLE_SIZE = 60;

export function FpsMeter() {
  const setFps = useVaultStore((state) => state.setFps);
  const frameTimes = useRef<number[]>([]);
  const lastTime = useRef<number>(0);
  const initialized = useRef(false);

  // Initialize lastTime in useEffect to avoid calling impure function during render
  useEffect(() => {
    lastTime.current = performance.now();
    initialized.current = true;
  }, []);

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
    }
  });

  return null;
}

