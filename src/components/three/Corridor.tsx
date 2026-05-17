'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getCorridorLength, CORRIDOR_CONFIG } from '@/lib/corridor-rail';
import { projects } from '@/data/projects';

interface CorridorFrameProps {
  position: [number, number, number];
  index: number;
}

// Seeded pseudo-random for deterministic positions
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGULARITY - The void at the end of the corridor (GPU efficient shader)
// ═══════════════════════════════════════════════════════════════════════════════
function Singularity({ z }: { z: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.z = t * 0.2;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
      const pulse = 1 + Math.sin(t * 2) * 0.15;
      meshRef.current.scale.setScalar(pulse);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.5;
      ringRef.current.rotation.y = t * 0.3;
    }
    if (glowRef.current) {
      const glowPulse = 0.8 + Math.sin(t * 3) * 0.2;
      glowRef.current.scale.setScalar(glowPulse * 3);
    }
  });

  return (
    <group position={[0, 0, z]}>
      {/* Core singularity */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Event horizon ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.03, 16, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.8} />
      </mesh>

      {/* Outer accretion ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 8, 48]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
      </mesh>

      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#4c1d95" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>

      {/* Inner light */}
      <pointLight color="#8b5cf6" intensity={2} distance={15} />
      <pointLight color="#3b82f6" intensity={1} distance={25} />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VOID PARTICLES - Subtle floating particles (shader-based, GPU efficient)
// ═══════════════════════════════════════════════════════════════════════════════
const VOID_PARTICLE_COUNT = 100;

function VoidParticles({ singularityZ }: { corridorLength: number; singularityZ: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Create stable arrays that don't change
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(VOID_PARTICLE_COUNT * 3);
    const col = new Float32Array(VOID_PARTICLE_COUNT * 3);
    const siz = new Float32Array(VOID_PARTICLE_COUNT);

    for (let i = 0; i < VOID_PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Spawn in corridor space
      const angle = seededRandom(i * 77) * Math.PI * 2;
      const radius = 0.5 + seededRandom(i * 77 + 1) * 2.5;
      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = -1.5 + seededRandom(i * 77 + 2) * 3;
      pos[i3 + 2] = -seededRandom(i * 77 + 3) * 30; // Spread along corridor

      // Soft blue/purple/white colors
      const colorChoice = seededRandom(i * 77 + 4);
      if (colorChoice < 0.3) {
        col[i3] = 0.9; col[i3 + 1] = 0.9; col[i3 + 2] = 1.0; // White
      } else if (colorChoice < 0.6) {
        col[i3] = 0.6; col[i3 + 1] = 0.4; col[i3 + 2] = 0.9; // Purple
      } else {
        col[i3] = 0.3; col[i3 + 1] = 0.5; col[i3 + 2] = 0.9; // Blue
      }

      siz[i] = 0.015 + seededRandom(i * 77 + 5) * 0.02;
    }

    return { positions: pos, colors: col, sizes: siz };
  }, []); // No dependencies - stable arrays

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.getAttribute('position');
    if (!posAttr) return;

    const pos = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < VOID_PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Gentle drift toward singularity
      pos[i3 + 2] -= delta * 0.3;
      // Subtle floating motion
      pos[i3] += Math.sin(t * 0.5 + i) * delta * 0.05;
      pos[i3 + 1] += Math.cos(t * 0.3 + i * 0.5) * delta * 0.03;

      // Reset if past singularity
      if (pos[i3 + 2] < singularityZ - 3) {
        pos[i3 + 2] = 5;
        const angle = seededRandom(i * 77 + Math.floor(t * 10)) * Math.PI * 2;
        const radius = 0.5 + seededRandom(i * 77 + 1 + Math.floor(t * 10)) * 2.5;
        pos[i3] = Math.cos(angle) * radius;
        pos[i3 + 1] = -1.5 + seededRandom(i * 77 + 2 + Math.floor(t * 10)) * 3;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={`
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            if (dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            gl_FragColor = vec4(vColor * 1.5, alpha * 0.8);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CorridorFrame({ position, index }: CorridorFrameProps) {
  const frameRef = useRef<THREE.Group>(null);
  const lightIntensityRef = useRef(0.15);

  useFrame((state) => {
    if (frameRef.current) {
      // Subtle breathing animation
      const pulse = Math.sin(state.clock.elapsedTime * 0.5 + index * 0.3) * 0.02 + 1;
      frameRef.current.scale.setScalar(pulse);
      // Flickering light effect
      lightIntensityRef.current = 0.15 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.05;
    }
  });

  return (
    <group ref={frameRef} position={position}>
      {/* Vertical struts with glow strips */}
      {[-3.5, 3.5].map((x, i) => (
        <group key={`strut-group-${i}`}>
          <mesh position={[x, 0, 0]}>
            <boxGeometry args={[0.1, 6, 0.1]} />
            <meshStandardMaterial color="#080808" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Glow strip on strut */}
          <mesh position={[x + (i === 0 ? 0.06 : -0.06), 0, 0]}>
            <boxGeometry args={[0.01, 5.5, 0.02]} />
            <meshBasicMaterial color={i === 0 ? '#3b82f6' : '#8b5cf6'} transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
      {/* Top beam with accent */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[7.2, 0.12, 0.12]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Bottom beam */}
      <mesh position={[0, -3, 0]}>
        <boxGeometry args={[7.2, 0.12, 0.12]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Cross braces for detail */}
      <mesh position={[-3.5, 2.5, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.03, 1.2, 0.03]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[3.5, 2.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.03, 1.2, 0.03]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Accent lights */}
      <pointLight position={[-3.5, 3, 0]} intensity={0.2} distance={10} color="#3b82f6" />
      <pointLight position={[3.5, 3, 0]} intensity={0.2} distance={10} color="#8b5cf6" />
      <pointLight position={[0, -2.8, 0]} intensity={0.1} distance={6} color="#22c55e" />
    </group>
  );
}

function HangingCables({ startZ, endZ }: { startZ: number; endZ: number }) {
  const cables = useMemo(() => {
    const result: { start: THREE.Vector3; end: THREE.Vector3; sag: number }[] = [];
    const count = Math.floor(Math.abs(endZ - startZ) / 8);

    for (let i = 0; i < count; i++) {
      const seed = i * 1000 + startZ;
      const r1 = seededRandom(seed);
      const r2 = seededRandom(seed + 1);
      const r3 = seededRandom(seed + 2);
      const r4 = seededRandom(seed + 3);
      const r5 = seededRandom(seed + 4);

      const z = startZ - i * 8 - r1 * 2;
      const x = (r2 - 0.5) * 6;
      result.push({
        start: new THREE.Vector3(x, 2.8, z),
        end: new THREE.Vector3(x + (r3 - 0.5) * 2, 2.8, z - 3 - r4 * 2),
        sag: 0.3 + r5 * 0.5,
      });
    }
    return result;
  }, [startZ, endZ]);

  return (
    <group>
      {cables.map((cable, i) => {
        const midPoint = new THREE.Vector3().lerpVectors(cable.start, cable.end, 0.5);
        midPoint.y -= cable.sag;
        const curve = new THREE.QuadraticBezierCurve3(cable.start, midPoint, cable.end);
        const points = curve.getPoints(20);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i}>
            <primitive object={geometry} attach="geometry" />
            <lineBasicMaterial color="#1a1a2a" linewidth={1} />
          </line>
        );
      })}
    </group>
  );
}

// Holographic grid lines on floor
function HolographicGrid({ corridorLength }: { corridorLength: number }) {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      // Subtle pulse effect
      const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      gridRef.current.children.forEach((child) => {
        if (child instanceof THREE.Line) {
          (child.material as THREE.LineBasicMaterial).opacity = pulse;
        }
      });
    }
  });

  const gridLines = useMemo(() => {
    const lines: { points: THREE.Vector3[]; color: string }[] = [];
    // Longitudinal lines
    for (let x = -3; x <= 3; x += 1) {
      lines.push({
        points: [new THREE.Vector3(x, -3.15, 5), new THREE.Vector3(x, -3.15, -corridorLength - 5)],
        color: x === 0 ? '#3b82f6' : '#1e3a5f',
      });
    }
    // Cross lines every 4 units
    for (let z = 0; z > -corridorLength - 5; z -= 4) {
      lines.push({
        points: [new THREE.Vector3(-4, -3.15, z), new THREE.Vector3(4, -3.15, z)],
        color: '#1e3a5f',
      });
    }
    return lines;
  }, [corridorLength]);

  return (
    <group ref={gridRef}>
      {gridLines.map((line, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(line.points);
        return (
          <line key={i}>
            <primitive object={geometry} attach="geometry" />
            <lineBasicMaterial color={line.color} transparent opacity={0.3} />
          </line>
        );
      })}
    </group>
  );
}

export function Corridor() {
  const corridorLength = getCorridorLength();
  const { podSpacing } = CORRIDOR_CONFIG;

  // Calculate where projects end (singularity goes beyond)
  const projectsEndZ = -(projects.length - 1) * podSpacing;
  const singularityZ = projectsEndZ - 12;

  // Generate frame positions
  const frameCount = Math.ceil(corridorLength / podSpacing) + 2;
  const frames = useMemo(() => {
    return Array.from({ length: frameCount }, (_, i) => ({
      position: [0, 0, -i * podSpacing] as [number, number, number],
      index: i,
    }));
  }, [frameCount, podSpacing]);

  return (
    <group>
      {/* Fog - pushed back for better visibility */}
      <fog attach="fog" args={['#080812', 20, 70]} />

      {/* SINGULARITY at the end - subtle focal point */}
      <Singularity z={singularityZ} />

      {/* Subtle void particles */}
      <VoidParticles corridorLength={corridorLength} singularityZ={singularityZ} />

      {/* CORRIDOR STRUCTURE */}

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.5, -corridorLength / 2]}>
        <planeGeometry args={[10, corridorLength + 30]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.3} roughness={0.9} />
      </mesh>

      {/* Floor - subtle reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, -corridorLength / 2]}>
        <planeGeometry args={[10, corridorLength + 30]} />
        <meshStandardMaterial color="#080810" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Side walls */}
      {[-5, 5].map((x, i) => (
        <mesh key={`wall-${i}`} position={[x, 0, -corridorLength / 2]} rotation={[0, i === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <planeGeometry args={[corridorLength + 30, 7]} />
          <meshStandardMaterial color="#060610" metalness={0.5} roughness={0.8} />
        </mesh>
      ))}

      {/* Clean holographic grid on floor only */}
      <HolographicGrid corridorLength={corridorLength} />

      {/* Corridor structural frames */}
      {frames.map((frame, i) => (
        <CorridorFrame key={i} position={frame.position} index={frame.index} />
      ))}

      {/* Hanging cables */}
      <HangingCables startZ={5} endZ={-corridorLength - 5} />

      {/* LIGHTING - Much brighter */}
      <ambientLight intensity={0.35} />

      {/* Strong main lights */}
      <pointLight position={[0, 2.5, 5]} intensity={1.0} color="#ffffff" distance={30} />
      <pointLight position={[0, 2.5, -8]} intensity={0.8} color="#ffffff" distance={30} />
      <pointLight position={[0, 2.5, -20]} intensity={0.7} color="#ffffff" distance={30} />
      <pointLight position={[0, 2.5, -35]} intensity={0.6} color="#ffffff" distance={30} />

      {/* Subtle colored accents */}
      <pointLight position={[-2, 0, -10]} intensity={0.3} color="#3b82f6" distance={15} />
      <pointLight position={[2, 0, -25]} intensity={0.3} color="#8b5cf6" distance={15} />

      {/* Singularity glow */}
      <pointLight position={[0, 0, singularityZ + 8]} intensity={0.5} color="#7c3aed" distance={25} />
    </group>
  );
}

