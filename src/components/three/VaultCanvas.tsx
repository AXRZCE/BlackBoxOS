'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise, Scanline } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense, useEffect, useState } from 'react';
import { Corridor } from './Corridor';
import { ContainmentPods } from './ContainmentPods';
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
        <PerspectiveCamera makeDefault position={[0, 1.2, 6]} fov={60} />
        <color attach="background" args={['#000000']} />

        {renderLights()}

        <Suspense fallback={null}>
          {/* Distant stars for depth */}
          <Stars radius={100} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />

          {/* Containment Corridor environment */}
          <Corridor />
          {/* Containment Pods with projects */}
          <ContainmentPods maxPods={config.maxCapsules} />
          {config.environmentPreset && <Environment preset={config.environmentPreset} />}
        </Suspense>

        {/* Camera controlled by scroll/selection */}
        <CameraRail />

        {/* FPS measurement */}
        <FpsMeter />

        {/* Reticle bridge - projects hover world pos to screen coords */}
        <ReticleBridge />

        {/* Postprocessing effects - enhanced for techno-occult aesthetic */}
        {config.postprocessing && (
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.5}
              luminanceSmoothing={0.9}
              intensity={bloomIntensity * 1.5}
              mipmapBlur
              levels={5}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0008, 0.0008]}
            />
            <Scanline
              blendFunction={BlendFunction.OVERLAY}
              density={1.2}
              opacity={0.02}
            />
            <Noise
              blendFunction={BlendFunction.SOFT_LIGHT}
              opacity={0.04}
            />
            <Vignette
              offset={0.5}
              darkness={vignetteIntensity * 0.6}
            />
          </EffectComposer>
        )}
      </Canvas>

      {selectedProjectId && <CaseFileSheet />}
    </>
  );
}

