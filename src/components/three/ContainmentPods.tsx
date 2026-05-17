'use client';

import { useMemo } from 'react';
import { projects } from '@/data/projects';
import { ContainmentPod } from './ContainmentPod';
import { getPodPosition } from '@/lib/corridor-rail';

interface ContainmentPodsProps {
  maxPods?: number;
}

export function ContainmentPods({ maxPods }: ContainmentPodsProps) {
  // Limit projects based on quality preset
  const visibleProjects = useMemo(() => {
    if (maxPods === undefined || maxPods >= projects.length) {
      return projects;
    }
    return projects.slice(0, maxPods);
  }, [maxPods]);

  // Generate pod positions using corridor rail system
  const podPositions = useMemo(() => {
    return visibleProjects.map((_, index) => getPodPosition(index));
  }, [visibleProjects]);

  return (
    <group>
      {visibleProjects.map((project, index) => (
        <ContainmentPod
          key={project.id}
          project={project}
          position={podPositions[index]}
        />
      ))}
    </group>
  );
}

