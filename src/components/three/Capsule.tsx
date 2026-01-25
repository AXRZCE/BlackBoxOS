'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import type { Mesh } from 'three';
import type { Project } from '@/data/projects';
import { useVaultStore } from '@/lib/store';

interface CapsuleProps {
  project: Project;
  position: [number, number, number];
  rotation: [number, number, number];
}

export function Capsule({ project, position, rotation }: CapsuleProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const setSelectedProjectId = useVaultStore((state) => state.setSelectedProjectId);
  const setHoverId = useVaultStore((state) => state.setHoverId);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.002) * 0.05;

      // Scale on hover
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, delta * 5);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    setHoverId(project.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    setHoverId(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = () => {
    setSelectedProjectId(project.id);
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <RoundedBox args={[1.2, 0.8, 0.4]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={hovered ? '#3b82f6' : '#1a1a1a'}
            metalness={0.8}
            roughness={0.2}
            emissive={hovered ? '#3b82f6' : '#000000'}
            emissiveIntensity={hovered ? 0.3 : 0}
          />
        </RoundedBox>
      </mesh>

      {/* Html label positioned above capsule - uses Next.js fonts, pointer-events disabled */}
      <Html
        position={[0, 0.55, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`
            px-3 py-1.5 rounded-sm
            font-mono text-center whitespace-nowrap
            border transition-all duration-200
            ${hovered
              ? 'bg-accent/20 border-accent text-white'
              : 'bg-background/80 border-border text-foreground/70'
            }
          `}
        >
          <div className="text-xs font-medium tracking-tight">
            {project.title}
          </div>
          <div className="text-[10px] text-foreground/50 uppercase tracking-widest">
            {project.category}
          </div>
        </div>
      </Html>
    </group>
  );
}

