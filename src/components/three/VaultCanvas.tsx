'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { SpiralCapsules } from './SpiralCapsules';
import { CaseFileSheet } from './CaseFileSheet';
import { useVaultStore } from '@/lib/store';

export default function VaultCanvas() {
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);

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
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {selectedProjectId && <CaseFileSheet />}
    </>
  );
}

