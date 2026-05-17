'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Group, Mesh } from 'three';
import type { Project } from '@/data/projects';
import { useVaultStore } from '@/lib/store';
import { useModeStore } from '@/lib/mode-store';
import { track } from '@/lib/telemetry';
import { terminalLog, LOG_MESSAGES } from '@/lib/terminal';
import { shouldTween } from '@/lib/motion';

interface ContainmentPodProps {
  project: Project;
  position: [number, number, number];
}

// Category color mapping for the techno-occult aesthetic
const CATEGORY_COLORS: Record<string, string> = {
  'AI/ML': '#3b82f6',      // Electric blue
  'Infrastructure': '#8b5cf6', // Violet
  'Audio': '#ec4899',      // Pink
  'Security': '#22c55e',   // Green
  'XR': '#f59e0b',         // Amber
  'Database': '#06b6d4',   // Cyan
};

// Blueprint line patterns for different categories
const BLUEPRINT_PATTERNS: Record<string, THREE.Vector3[][]> = {
  'AI/ML': [
    // Neural network nodes pattern
    [new THREE.Vector3(-0.4, 0.3, 0), new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(0.4, 0.3, 0)],
    [new THREE.Vector3(-0.4, -0.3, 0), new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0.4, -0.3, 0)],
    [new THREE.Vector3(-0.4, 0.3, 0), new THREE.Vector3(-0.4, -0.3, 0)],
    [new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(0, -0.5, 0)],
    [new THREE.Vector3(0.4, 0.3, 0), new THREE.Vector3(0.4, -0.3, 0)],
  ],
  'Infrastructure': [
    // Server rack / grid pattern
    [new THREE.Vector3(-0.5, 0.5, 0), new THREE.Vector3(0.5, 0.5, 0)],
    [new THREE.Vector3(-0.5, 0, 0), new THREE.Vector3(0.5, 0, 0)],
    [new THREE.Vector3(-0.5, -0.5, 0), new THREE.Vector3(0.5, -0.5, 0)],
    [new THREE.Vector3(-0.5, 0.5, 0), new THREE.Vector3(-0.5, -0.5, 0)],
    [new THREE.Vector3(0.5, 0.5, 0), new THREE.Vector3(0.5, -0.5, 0)],
  ],
  default: [
    // Hexagonal pattern
    [new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(0.43, 0.25, 0)],
    [new THREE.Vector3(0.43, 0.25, 0), new THREE.Vector3(0.43, -0.25, 0)],
    [new THREE.Vector3(0.43, -0.25, 0), new THREE.Vector3(0, -0.5, 0)],
    [new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(-0.43, -0.25, 0)],
    [new THREE.Vector3(-0.43, -0.25, 0), new THREE.Vector3(-0.43, 0.25, 0)],
    [new THREE.Vector3(-0.43, 0.25, 0), new THREE.Vector3(0, 0.5, 0)],
  ],
};

export function ContainmentPod({ project, position }: ContainmentPodProps) {
  const groupRef = useRef<Group>(null);
  const glassRef = useRef<Mesh>(null);
  const coreRef = useRef<Group>(null);
  const scanRef = useRef<Mesh>(null);
  const blueprintRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [revealProgress, setRevealProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  const tempVec3 = useMemo(() => new THREE.Vector3(), []);

  const setSelectedProjectId = useVaultStore((state) => state.setSelectedProjectId);
  const setHoverTarget = useVaultStore((state) => state.setHoverTarget);
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);
  const isSelected = selectedProjectId === project.id;

  const startTransition = useModeStore((s) => s.startTransition);
  const triggerGlitch = useModeStore((s) => s.triggerGlitch);
  const triggerHudFlash = useModeStore((s) => s.triggerHudFlash);

  const accentColor = CATEGORY_COLORS[project.category] || '#3b82f6';
  const blueprintLines = BLUEPRINT_PATTERNS[project.category] || BLUEPRINT_PATTERNS.default;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Floating animation
    const floatY = Math.sin(state.clock.elapsedTime * 0.8 + position[2] * 0.1) * 0.08;
    groupRef.current.position.y = position[1] + floatY;

    // Scale on hover/selection - more dramatic during reveal
    const revealScale = isRevealing ? 1.15 + Math.sin(state.clock.elapsedTime * 8) * 0.05 : 1;
    const targetScale = (hovered || isSelected ? 1.08 : 1) * revealScale;
    groupRef.current.scale.lerp(
      { x: targetScale, y: targetScale, z: targetScale },
      delta * 4
    );

    // Rotate specimen core - faster during reveal
    if (coreRef.current) {
      const rotSpeed = isRevealing ? 4 : (hovered ? 1.5 : 0.3);
      coreRef.current.rotation.y += delta * rotSpeed;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      // Extrude effect during reveal - scale up Z axis
      if (isRevealing) {
        const extrudeAmount = Math.min(revealProgress * 2, 1);
        coreRef.current.scale.z = 1 + extrudeAmount * 0.8;
        coreRef.current.scale.x = 1 + extrudeAmount * 0.3;
        coreRef.current.scale.y = 1 + extrudeAmount * 0.3;
      } else {
        coreRef.current.scale.set(1, 1, 1);
      }
    }

    // Blueprint reveal animation
    if (blueprintRef.current) {
      if (isRevealing) {
        setRevealProgress((prev) => Math.min(prev + delta * 1.5, 1));
        blueprintRef.current.visible = true;
        blueprintRef.current.rotation.y = state.clock.elapsedTime * 2;
        // Fade in effect via scale
        const bpScale = Math.min(revealProgress * 1.5, 1);
        blueprintRef.current.scale.setScalar(bpScale);
      } else {
        blueprintRef.current.visible = false;
        blueprintRef.current.scale.setScalar(0);
      }
    }

    // Scan sweep animation when hovered
    if (hovered && scanRef.current) {
      setScanProgress((prev) => {
        const next = prev + delta * 2;
        return next > 1 ? 0 : next;
      });
      scanRef.current.position.y = -1.2 + scanProgress * 2.4;
      scanRef.current.visible = true;
    } else if (scanRef.current) {
      scanRef.current.visible = false;
      setScanProgress(0);
    }

    // Glass material pulse on hover - more intense during reveal
    if (glassRef.current && glassRef.current.material) {
      const mat = glassRef.current.material as THREE.MeshPhysicalMaterial;
      const targetIntensity = isRevealing ? 0.6 : (hovered || isSelected ? 0.3 : 0.05);
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        targetIntensity,
        delta * 5
      );
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
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
    track({ type: 'target_lock', project_id: project.id });
    terminalLog(LOG_MESSAGES.target_lock(project.id), 'info');

    if (shouldTween()) {
      // Start the reveal animation
      setIsRevealing(true);
      setRevealProgress(0);
      startTransition(project.id);
      triggerGlitch(150);

      // Multiple glitch pulses during reveal
      setTimeout(() => triggerGlitch(100), 300);
      setTimeout(() => triggerGlitch(80), 600);

      // Open case file after reveal completes
      setTimeout(() => {
        setIsRevealing(false);
        setRevealProgress(0);
        setSelectedProjectId(project.id);
        triggerHudFlash(200);
        track({ type: 'casefile_open', project_id: project.id });
        terminalLog(LOG_MESSAGES.casefile_open(project.id), 'success');
      }, 900);
    } else {
      setSelectedProjectId(project.id);
      track({ type: 'casefile_open', project_id: project.id });
    }
  };

  const isHighlighted = hovered || isSelected;

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {/* Outer containment ring - top */}
      <mesh position={[0, 1.3, 0]}>
        <torusGeometry args={[1.0, 0.04, 8, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.1} emissive={accentColor} emissiveIntensity={0.1} />
      </mesh>

      {/* Outer containment ring - bottom */}
      <mesh position={[0, -1.3, 0]}>
        <torusGeometry args={[1.0, 0.04, 8, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.1} emissive={accentColor} emissiveIntensity={0.1} />
      </mesh>

      {/* Glass containment shell */}
      <mesh
        ref={glassRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <cylinderGeometry args={[0.95, 0.95, 2.5, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#050510"
          metalness={0.05}
          roughness={0.05}
          transmission={0.85}
          thickness={0.3}
          transparent
          opacity={0.35}
          emissive={accentColor}
          emissiveIntensity={0.03}
          side={THREE.DoubleSide}
          ior={1.5}
        />
      </mesh>

      {/* Inner glass layer for depth */}
      <mesh>
        <cylinderGeometry args={[0.85, 0.85, 2.3, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#000008"
          metalness={0}
          roughness={0}
          transmission={0.9}
          thickness={0.1}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Top cap with detail */}
      <group position={[0, 1.25, 0]}>
        <mesh>
          <cylinderGeometry args={[1.0, 1.0, 0.08, 32]} />
          <meshStandardMaterial color="#080808" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Tech detail ring */}
        <mesh position={[0, 0.05, 0]}>
          <torusGeometry args={[0.6, 0.02, 8, 24]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Bottom cap with detail */}
      <group position={[0, -1.25, 0]}>
        <mesh>
          <cylinderGeometry args={[1.0, 1.0, 0.08, 32]} />
          <meshStandardMaterial color="#080808" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Base glow ring */}
        <mesh position={[0, -0.05, 0]}>
          <torusGeometry args={[0.7, 0.03, 8, 24]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Vertical support struts */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh key={`strut-${i}`} position={[Math.cos(angle) * 0.98, 0, Math.sin(angle) * 0.98]}>
            <boxGeometry args={[0.03, 2.4, 0.03]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Specimen Core - floating shards/particles */}
      <group ref={coreRef}>
        {/* Central glowing core - larger and more detailed */}
        <mesh>
          <icosahedronGeometry args={[0.3, 2]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={isHighlighted ? 2 : 1}
            metalness={0.7}
            roughness={0.15}
          />
        </mesh>

        {/* Inner core glow */}
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.5} />
        </mesh>

        {/* Orbiting shards - more of them */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 0.5;
          const yOffset = Math.sin(i * 1.2) * 0.25;
          return (
            <mesh key={i} position={[
              Math.cos(angle) * radius,
              yOffset,
              Math.sin(angle) * radius
            ]} rotation={[angle, angle * 0.5, i * 0.3]}>
              <octahedronGeometry args={[0.06, 0]} />
              <meshStandardMaterial
                color={accentColor}
                emissive={accentColor}
                emissiveIntensity={isHighlighted ? 1.2 : 0.5}
                metalness={0.95}
                roughness={0.05}
              />
            </mesh>
          );
        })}

        {/* Outer orbit ring of tiny particles */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 0.65;
          return (
            <mesh key={`outer-${i}`} position={[
              Math.cos(angle) * radius,
              Math.sin(i * 0.8) * 0.15,
              Math.sin(angle) * radius
            ]}>
              <sphereGeometry args={[0.02, 6, 6]} />
              <meshBasicMaterial color={accentColor} transparent opacity={0.7} />
            </mesh>
          );
        })}
      </group>

      {/* Scan sweep bar (visible on hover) */}
      <mesh ref={scanRef} visible={false}>
        <planeGeometry args={[1.6, 0.02]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.8} />
      </mesh>

      {/* Blueprint reveal layer - appears during selection animation */}
      <group ref={blueprintRef} visible={false}>
        {/* Blueprint grid lines */}
        {blueprintLines.map((points, i) => (
          <Line
            key={i}
            points={points}
            color={accentColor}
            lineWidth={2}
            transparent
            opacity={0.9}
          />
        ))}
        {/* Outer ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.65, 0.01, 8, 32]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.7} />
        </mesh>
        {/* Inner ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.008, 8, 24]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.5} />
        </mesh>
        {/* Corner markers */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
          const r = 0.55;
          return (
            <mesh
              key={`corner-${i}`}
              position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]}
            >
              <boxGeometry args={[0.06, 0.06, 0.02]} />
              <meshBasicMaterial color={accentColor} />
            </mesh>
          );
        })}
        {/* Scanline effect */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.4, 0.03]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Extra light burst during reveal */}
      {isRevealing && (
        <pointLight
          position={[0, 0, 0.5]}
          intensity={2 * revealProgress}
          distance={5}
          color={accentColor}
        />
      )}

      {/* Internal glow light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={isRevealing ? 1.5 : (isHighlighted ? 0.8 : 0.3)}
        distance={3}
        color={accentColor}
      />

      {/* Html label */}
      <Html
        position={[0, 1.6, 0]}
        center
        distanceFactor={10}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`
            px-3 py-1.5 rounded-sm
            font-mono text-center whitespace-nowrap
            border transition-all duration-200 backdrop-blur-sm
            ${isHighlighted
              ? 'bg-black/80 border-accent text-white scale-105'
              : 'bg-black/60 border-zinc-800 text-zinc-400'
            }
          `}
        >
          <div className="text-xs font-medium tracking-tight">
            {project.title}
          </div>
          <div
            className="text-[10px] uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            {project.category}
          </div>
        </div>
      </Html>
    </group>
  );
}

