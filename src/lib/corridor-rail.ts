import { projects } from '@/data/projects';

// Corridor parameters
const POD_SPACING = 4.5; // Distance between pods along Z-axis
const CORRIDOR_WIDTH = 2.5; // How far pods can be from center (X)
const CORRIDOR_HEIGHT_VARIANCE = 0.8; // Y variance for organic feel
const CAMERA_DISTANCE_Z = 6; // How far camera is from current pod
const CAMERA_HEIGHT = 1.2; // Camera eye height

export interface RailPose {
  camPos: [number, number, number];
  lookAt: [number, number, number];
}

/**
 * Get the position of a pod at a given index
 * Pods are arranged in a corridor going into -Z with slight X/Y variations
 */
export function getPodPosition(index: number): [number, number, number] {
  const z = -index * POD_SPACING;
  // Alternating left/right with some organic variation
  const sideOffset = (index % 2 === 0 ? 1 : -1) * CORRIDOR_WIDTH * 0.7;
  const x = sideOffset + Math.sin(index * 0.7) * 0.5;
  // Slight vertical variation for organic feel
  const y = Math.sin(index * 1.3) * CORRIDOR_HEIGHT_VARIANCE;
  
  return [x, y, z];
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
 * Camera moves down the corridor center, looking at the current pod
 */
export function getRailPose(t: number): RailPose {
  const clampedT = Math.max(0, Math.min(1, t));
  
  // Get the target pod position (what we're looking at)
  const targetIndex = clampedT * (projects.length - 1);
  const lowerIndex = Math.floor(targetIndex);
  const upperIndex = Math.min(Math.ceil(targetIndex), projects.length - 1);
  const blend = targetIndex - lowerIndex;
  
  // Interpolate between pod positions for smooth movement
  const lowerPos = getPodPosition(lowerIndex);
  const upperPos = getPodPosition(upperIndex);
  
  const lookAt: [number, number, number] = [
    lowerPos[0] + (upperPos[0] - lowerPos[0]) * blend,
    lowerPos[1] + (upperPos[1] - lowerPos[1]) * blend,
    lowerPos[2] + (upperPos[2] - lowerPos[2]) * blend,
  ];
  
  // Camera position: down the corridor center, offset from lookAt in Z
  const camZ = lookAt[2] + CAMERA_DISTANCE_Z;
  // Slight X offset to create parallax as pods alternate sides
  const camX = lookAt[0] * 0.2;
  
  const camPos: [number, number, number] = [
    camX,
    CAMERA_HEIGHT,
    camZ,
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

/**
 * Get total corridor length for environment generation
 */
export function getCorridorLength(): number {
  return projects.length * POD_SPACING + CAMERA_DISTANCE_Z * 2;
}

/**
 * Get corridor config for external use
 */
export const CORRIDOR_CONFIG = {
  podSpacing: POD_SPACING,
  corridorWidth: CORRIDOR_WIDTH,
  heightVariance: CORRIDOR_HEIGHT_VARIANCE,
  cameraDistance: CAMERA_DISTANCE_Z,
  cameraHeight: CAMERA_HEIGHT,
};

