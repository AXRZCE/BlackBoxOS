'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import { Vector3 } from 'three';
import type { Group } from 'three';
import type { Project } from '@/data/projects';
import { useVaultStore } from '@/lib/store';

interface CapsuleProps {
  project: Project;
  position: [number, number, number];
  rotation: [number, number, number];
}

export function Capsule({ project, position, rotation }: CapsuleProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  // Reusable Vector3 to avoid allocations
  const tempVec3 = useMemo(() => new Vector3(), []);

  const setSelectedProjectId = useVaultStore((state) => state.setSelectedProjectId);
  const setHoverTarget = useVaultStore((state) => state.setHoverTarget);
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);
  const wireframe = useVaultStore((state) => state.wireframe);

  const isSelected = selectedProjectId === project.id;

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Subtle floating animation on the group's y position
      const floatOffset = Math.sin(Date.now() * 0.002) * 0.05;
      groupRef.current.position.y = position[1] + floatOffset;

      // Scale on hover or selection
      const targetScale = hovered || isSelected ? 1.1 : 1;
      groupRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, delta * 5);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    // Get world position of the group for reticle targeting
    if (groupRef.current) {
      groupRef.current.getWorldPosition(tempVec3);
      setHoverTarget(project.id, [tempVec3.x, tempVec3.y, tempVec3.z]);
    } else {
      setHoverTarget(project.id, position);
    }
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    setHoverTarget(null, null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = () => {
    setSelectedProjectId(project.id);
  };

  // Determine colors based on state
  const isHighlighted = hovered || isSelected;
  const baseColor = wireframe ? '#ffffff' : (isHighlighted ? '#3b82f6' : '#1a1a1a');
  const emissiveColor = isHighlighted ? '#3b82f6' : '#000000';

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      rotation={rotation}
    >
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <RoundedBox args={[1.2, 0.8, 0.4]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={baseColor}
            metalness={wireframe ? 0 : 0.8}
            roughness={wireframe ? 1 : 0.2}
            emissive={emissiveColor}
            emissiveIntensity={isHighlighted ? 0.3 : 0}
            wireframe={wireframe}
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
            ${isHighlighted
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

