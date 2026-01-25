'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useVaultStore } from '@/lib/store';

/**
 * Bridge component that runs inside Canvas to project 3D hover position to screen coords.
 * Updates store.hoverScreenPos for the DOM Reticle overlay to consume.
 */
export function ReticleBridge() {
  const hoverWorldPos = useVaultStore((state) => state.hoverWorldPos);
  const setHoverScreenPos = useVaultStore((state) => state.setHoverScreenPos);
  
  const { camera, size } = useThree();
  
  // Reusable Vector3 to avoid allocations
  const tempVec = useRef(new Vector3());
  
  // Track current screen position for lerping
  const currentScreenPos = useRef({ x: 0, y: 0 });
  const targetScreenPos = useRef({ x: 0, y: 0 });
  const isActive = useRef(false);
  
  // Detect reduced motion preference (lazy initializer to avoid effect setState)
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useFrame(() => {
    if (!hoverWorldPos) {
      // No hover target - clear screen position
      if (isActive.current) {
        isActive.current = false;
        setHoverScreenPos(null);
      }
      return;
    }

    // Project world position to screen
    tempVec.current.set(hoverWorldPos[0], hoverWorldPos[1], hoverWorldPos[2]);
    tempVec.current.project(camera);

    // Check if behind camera or outside frustum
    if (tempVec.current.z > 1) {
      // Behind camera
      if (isActive.current) {
        isActive.current = false;
        setHoverScreenPos(null);
      }
      return;
    }

    // Convert NDC [-1, 1] to screen pixels
    const screenX = (tempVec.current.x * 0.5 + 0.5) * size.width;
    const screenY = (-tempVec.current.y * 0.5 + 0.5) * size.height;

    // Check if outside screen bounds (with margin)
    const margin = 50;
    if (
      screenX < -margin ||
      screenX > size.width + margin ||
      screenY < -margin ||
      screenY > size.height + margin
    ) {
      if (isActive.current) {
        isActive.current = false;
        setHoverScreenPos(null);
      }
      return;
    }

    // Update target position
    targetScreenPos.current.x = screenX;
    targetScreenPos.current.y = screenY;

    // Initialize current position on first activation
    if (!isActive.current) {
      isActive.current = true;
      if (reducedMotion) {
        // Snap directly
        currentScreenPos.current.x = screenX;
        currentScreenPos.current.y = screenY;
      } else {
        // Start from target for smooth entry
        currentScreenPos.current.x = screenX;
        currentScreenPos.current.y = screenY;
      }
    }

    // Lerp towards target (smooth movement)
    // Use faster lerp factor for snappier feel
    const lerpFactor = reducedMotion ? 1 : 0.15;
    currentScreenPos.current.x += (targetScreenPos.current.x - currentScreenPos.current.x) * lerpFactor;
    currentScreenPos.current.y += (targetScreenPos.current.y - currentScreenPos.current.y) * lerpFactor;

    // Only update store if position changed significantly (avoid unnecessary renders)
    const roundedX = Math.round(currentScreenPos.current.x);
    const roundedY = Math.round(currentScreenPos.current.y);
    
    setHoverScreenPos({ x: roundedX, y: roundedY });
  });

  return null;
}

