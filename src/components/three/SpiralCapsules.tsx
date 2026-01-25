'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { projects } from '@/data/projects';
import { Capsule } from './Capsule';
import type { Group } from 'three';

export function SpiralCapsules() {
  const groupRef = useRef<Group>(null);

  // Generate spiral positions for capsules
  const capsulePositions = useMemo(() => {
    return projects.map((_, index) => {
      const angle = index * 0.8; // Spiral angle increment
      const radius = 2 + index * 0.3; // Increasing radius
      const height = index * 0.5; // Height along spiral
      
      return {
        x: Math.cos(angle) * radius,
        y: height - (projects.length * 0.25), // Center vertically
        z: Math.sin(angle) * radius,
        rotation: -angle, // Face outward
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05; // Slow rotation
    }
  });

  return (
    <group ref={groupRef}>
      {projects.map((project, index) => (
        <Capsule
          key={project.id}
          project={project}
          position={[
            capsulePositions[index].x,
            capsulePositions[index].y,
            capsulePositions[index].z,
          ]}
          rotation={[0, capsulePositions[index].rotation, 0]}
        />
      ))}
    </group>
  );
}

