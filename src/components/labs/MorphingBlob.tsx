'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { MeshDistortMaterial } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function Blob({ isHovering, mousePos }: { isHovering: boolean; mousePos: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);
  const { size } = useThree();
  const [distort, setDistort] = useState(0.4);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Much more dramatic distortion on hover
    const targetDistort = isHovering ? 1.2 : 0.4;
    setDistort(prev => prev + (targetDistort - prev) * delta * 3);

    // Smooth rotation
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;

    // Subtle tilt towards mouse when hovering
    if (isHovering && size.width > 0 && size.height > 0) {
      const mouseX = (mousePos.x / size.width) * 2 - 1;
      const mouseY = -(mousePos.y / size.height) * 2 + 1;

      meshRef.current.rotation.y += mouseX * 0.3 * delta;
      meshRef.current.rotation.x += mouseY * 0.3 * delta;
    }

    // Animate color shift for iridescent effect
    if (materialRef.current) {
      const t = state.clock.elapsedTime;
      const hue = (Math.sin(t * 0.3) * 0.5 + 0.5) * 0.15 + 0.85; // Cycle between purple-pink
      materialRef.current.color.setHSL(hue, 0.9, 0.5);
      materialRef.current.emissive.setHSL(hue - 0.1, 0.8, 0.3);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 128]} />
      <MeshDistortMaterial
        ref={materialRef}
        color="#ff006e"
        emissive="#8338ec"
        emissiveIntensity={0.5}
        metalness={1.0}
        roughness={0.05}
        distort={distort}
        speed={3}
        toneMapped={false}
      />
    </mesh>
  );
}

interface MorphingBlobProps { disabled?: boolean; }

export default function MorphingBlob({ disabled }: MorphingBlobProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  if (disabled) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] rounded-lg">
        <p className="text-white/50 text-sm font-mono">DISABLED ON LOW SPEC</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative cursor-pointer"
      onMouseMove={(e) => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#000000']} />

        {/* Multiple colored lights for iridescent effect */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-3, 2, 3]} intensity={2} color="#ff006e" />
        <pointLight position={[3, -2, 2]} intensity={2} color="#8338ec" />
        <pointLight position={[0, 3, -3]} intensity={1.5} color="#3a86ff" />

        <Blob isHovering={isHovering} mousePos={mousePos} />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            intensity={2.5}
            levels={9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
      <div className="absolute bottom-2 left-2 font-mono text-[10px] text-purple-400/70">
        {isHovering ? '[ DEFORMING... ]' : '[ HOVER TO INTERACT ]'}
      </div>
      <div className="absolute top-2 right-2 font-mono text-[10px] text-pink-400/70">
        MORPHING BLOB
      </div>
    </div>
  );
}

