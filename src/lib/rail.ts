import { projects } from '@/data/projects';

// Spiral parameters - should match SpiralCapsules.tsx
const SPIRAL_ANGLE_INCREMENT = 0.8;
const SPIRAL_BASE_RADIUS = 2;
const SPIRAL_RADIUS_INCREMENT = 0.3;
const SPIRAL_HEIGHT_INCREMENT = 0.5;

// Camera offset from capsule position
const CAMERA_DISTANCE = 4;
const CAMERA_HEIGHT_OFFSET = 1.5;

export interface RailPose {
  camPos: [number, number, number];
  lookAt: [number, number, number];
}

/**
 * Get the position of a capsule at a given index
 */
export function getCapsulePosition(index: number): [number, number, number] {
  const angle = index * SPIRAL_ANGLE_INCREMENT;
  const radius = SPIRAL_BASE_RADIUS + index * SPIRAL_RADIUS_INCREMENT;
  const height = index * SPIRAL_HEIGHT_INCREMENT - (projects.length * 0.25);
  
  return [
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius,
  ];
}

/**
 * Get the t parameter (0-1) for a project by index
 */
export function getProjectT(index: number): number {
  if (projects.length <= 1) return 0;
  return index / (projects.length - 1);
}

/**
 * Get the project index from a t parameter (0-1)
 */
export function getIndexFromT(t: number): number {
  return Math.round(t * (projects.length - 1));
}

/**
 * Get camera pose for a given t parameter (0-1)
 * Camera follows a path that looks at the spiral from outside
 */
export function getRailPose(t: number): RailPose {
  // Clamp t to valid range
  const clampedT = Math.max(0, Math.min(1, t));
  
  // Get the target capsule position (what we're looking at)
  const targetIndex = clampedT * (projects.length - 1);
  const lowerIndex = Math.floor(targetIndex);
  const upperIndex = Math.min(Math.ceil(targetIndex), projects.length - 1);
  const blend = targetIndex - lowerIndex;
  
  // Interpolate between capsule positions for smooth movement
  const lowerPos = getCapsulePosition(lowerIndex);
  const upperPos = getCapsulePosition(upperIndex);
  
  const lookAt: [number, number, number] = [
    lowerPos[0] + (upperPos[0] - lowerPos[0]) * blend,
    lowerPos[1] + (upperPos[1] - lowerPos[1]) * blend,
    lowerPos[2] + (upperPos[2] - lowerPos[2]) * blend,
  ];
  
  // Camera position: offset from lookAt, following the spiral but further out
  const angle = targetIndex * SPIRAL_ANGLE_INCREMENT;
  const cameraRadius = SPIRAL_BASE_RADIUS + targetIndex * SPIRAL_RADIUS_INCREMENT + CAMERA_DISTANCE;
  
  const camPos: [number, number, number] = [
    Math.cos(angle) * cameraRadius,
    lookAt[1] + CAMERA_HEIGHT_OFFSET,
    Math.sin(angle) * cameraRadius,
  ];
  
  return { camPos, lookAt };
}

/**
 * Get the t parameter for a specific project ID
 */
export function getProjectTById(projectId: string): number {
  const index = projects.findIndex(p => p.id === projectId);
  if (index === -1) return 0;
  return getProjectT(index);
}

