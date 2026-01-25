'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect, useState } from 'react';
import { SpiralCapsules } from './SpiralCapsules';
import { CaseFileSheet } from './CaseFileSheet';
import { CameraRail } from './CameraRail';
import { FpsMeter } from './FpsMeter';
import { ReticleBridge } from './ReticleBridge';
import { useVaultStore } from '@/lib/store';
import { QUALITY_CONFIGS, detectCapabilities, getQualityPreset } from '@/lib/device';

export default function VaultCanvas() {
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);
  const qualityPreset = useVaultStore((state) => state.qualityPreset);
  const setQualityPreset = useVaultStore((state) => state.setQualityPreset);

  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Initialize quality preset based on device capabilities
  useEffect(() => {
    const capabilities = detectCapabilities();
    const initialPreset = getQualityPreset(capabilities);
    setQualityPreset(initialPreset);
  }, [setQualityPreset]);

  // Subscribe to changes in prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Get quality config
  const config = QUALITY_CONFIGS[qualityPreset];

  // Reduce effect intensity for reduced motion or low quality
  const bloomIntensity = reducedMotion ? config.bloomIntensity * 0.5 : config.bloomIntensity;
  const vignetteIntensity = reducedMotion ? config.vignetteIntensity * 0.6 : config.vignetteIntensity;

  // Determine number of lights based on preset
  const renderLights = () => {
    const lights = [
      <ambientLight key="ambient" intensity={0.3} />,
      <pointLight key="light1" position={[10, 10, 10]} intensity={0.5} />,
    ];
    if (config.lightCount >= 2) {
      lights.push(
        <pointLight key="light2" position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
      );
    }
    if (config.lightCount >= 3) {
      lights.push(
        <pointLight key="light3" position={[0, 10, -10]} intensity={0.2} color="#8b5cf6" />
      );
    }
    return lights;
  };

  return (
    <>
      <Canvas className="w-full h-full" dpr={config.dpr}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
        <color attach="background" args={['#0a0a0a']} />

        {renderLights()}

        <Suspense fallback={null}>
          <SpiralCapsules maxCapsules={config.maxCapsules} />
          {config.environmentPreset && <Environment preset={config.environmentPreset} />}
        </Suspense>

        {/* Camera controlled by scroll/selection */}
        <CameraRail />

        {/* FPS measurement */}
        <FpsMeter />

        {/* Reticle bridge - projects hover world pos to screen coords */}
        <ReticleBridge />

        {/* Postprocessing effects (conditional based on quality preset) */}
        {config.postprocessing && (
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
        )}
      </Canvas>

      {selectedProjectId && <CaseFileSheet />}
    </>
  );
}

