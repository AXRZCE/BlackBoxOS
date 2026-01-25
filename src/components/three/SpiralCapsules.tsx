'use client';

import { useMemo } from 'react';
import { projects } from '@/data/projects';
import { Capsule } from './Capsule';

// Spiral parameters - must match lib/rail.ts
const SPIRAL_ANGLE_INCREMENT = 0.8;
const SPIRAL_BASE_RADIUS = 2;
const SPIRAL_RADIUS_INCREMENT = 0.3;
const SPIRAL_HEIGHT_INCREMENT = 0.5;

interface SpiralCapsulesProps {
  maxCapsules?: number;
}

export function SpiralCapsules({ maxCapsules }: SpiralCapsulesProps) {
  // Limit projects based on quality preset
  const visibleProjects = useMemo(() => {
    if (maxCapsules === undefined || maxCapsules >= projects.length) {
      return projects;
    }
    return projects.slice(0, maxCapsules);
  }, [maxCapsules]);

  // Generate spiral positions for capsules
  const capsulePositions = useMemo(() => {
    return visibleProjects.map((_, index) => {
      const angle = index * SPIRAL_ANGLE_INCREMENT;
      const radius = SPIRAL_BASE_RADIUS + index * SPIRAL_RADIUS_INCREMENT;
      const height = index * SPIRAL_HEIGHT_INCREMENT;

      return {
        x: Math.cos(angle) * radius,
        y: height - (visibleProjects.length * 0.25), // Center vertically
        z: Math.sin(angle) * radius,
        rotation: -angle, // Face outward
      };
    });
  }, [visibleProjects]);

  // No auto-rotation - camera rail handles movement in M2
  return (
    <group>
      {visibleProjects.map((project, index) => (
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

