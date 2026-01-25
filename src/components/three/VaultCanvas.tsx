'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect, useState } from 'react';
import { SpiralCapsules } from './SpiralCapsules';
import { CaseFileSheet } from './CaseFileSheet';
import { CameraRail } from './CameraRail';
import { FpsMeter } from './FpsMeter';
import { useVaultStore } from '@/lib/store';

export default function VaultCanvas() {
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);
  const [reducedMotion, setReducedMotion] = useState(() => {
    // Check initial value on client (SSR-safe)
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Subscribe to changes in prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Reduce effect intensity for reduced motion preference
  const bloomIntensity = reducedMotion ? 0.15 : 0.3;
  const vignetteIntensity = reducedMotion ? 0.3 : 0.5;

  return (
    <>
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
        <color attach="background" args={['#0a0a0a']} />

        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />

        <Suspense fallback={null}>
          <SpiralCapsules />
          <Environment preset="night" />
        </Suspense>

        {/* Camera controlled by scroll/selection - replaces OrbitControls */}
        <CameraRail />

        {/* FPS measurement */}
        <FpsMeter />

        {/* Subtle postprocessing effects */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.9}
            luminanceSmoothing={0.9}
            intensity={bloomIntensity}
          />
          <Vignette
            offset={0.5}
            darkness={vignetteIntensity}
          />
        </EffectComposer>
      </Canvas>

      {selectedProjectId && <CaseFileSheet />}
    </>
  );
}

