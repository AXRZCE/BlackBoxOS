'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useVaultStore } from '@/lib/store';
import { getRailPose, getProjectTById } from '@/lib/rail';
import * as THREE from 'three';

// Damping factor for smooth camera movement
const DAMPING = 0.05;
const SNAP_DAMPING = 0.08; // Faster when snapping to selection

export function CameraRail() {
  const { camera } = useThree();
  const scrollProgress = useVaultStore((state) => state.scrollProgress);
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);
  
  // Target vectors for smooth interpolation
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    // Determine target t based on selection or scroll
    let targetT: number;
    let damping: number;
    
    if (selectedProjectId) {
      // Snap to selected project
      targetT = getProjectTById(selectedProjectId);
      damping = SNAP_DAMPING;
    } else {
      // Follow scroll progress
      targetT = scrollProgress;
      damping = DAMPING;
    }
    
    // Get the rail pose for target t
    const pose = getRailPose(targetT);
    
    // Update target vectors
    targetPosition.current.set(...pose.camPos);
    targetLookAt.current.set(...pose.lookAt);
    
    // Smoothly interpolate camera position
    camera.position.lerp(targetPosition.current, damping);
    
    // Smoothly interpolate lookAt
    currentLookAt.current.lerp(targetLookAt.current, damping);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

