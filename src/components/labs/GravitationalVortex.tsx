'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, useState } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 8000;
const SPIRAL_ARMS = 4;

// Seeded random for deterministic generation
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999.1) * 10000;
  return x - Math.floor(x);
}

// Generate galaxy spiral particles
function generateGalaxy() {
  const positions: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];
  const angles: number[] = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const seed = i * 7.31;

    // Spiral arm assignment
    const arm = i % SPIRAL_ARMS;
    const armAngle = (arm / SPIRAL_ARMS) * Math.PI * 2;

    // Distance from center (exponential distribution for density)
    const radius = 0.3 + Math.pow(seededRandom(seed), 0.5) * 3.5;

    // Spiral angle based on distance
    const spiralAngle = armAngle + radius * 1.2 + seededRandom(seed + 1) * 0.8;

    // Add randomness to position
    const scatter = (1 - radius / 4) * 0.4;
    const x = Math.cos(spiralAngle) * radius + (seededRandom(seed + 2) - 0.5) * scatter;
    const z = Math.sin(spiralAngle) * radius + (seededRandom(seed + 3) - 0.5) * scatter;

    // Flatten toward center, more vertical dispersion at edges
    const heightScale = 0.15 + radius * 0.08;
    const y = (seededRandom(seed + 4) - 0.5) * heightScale;

    positions.push(x, y, z);
    angles.push(spiralAngle);

    // Color based on distance - blue outer, orange/white inner
    const t = radius / 4;
    if (radius < 0.8) {
      // Core - bright white/yellow
      colors.push(1.0, 0.95, 0.8);
      sizes.push(0.04 + seededRandom(seed + 5) * 0.03);
    } else if (t < 0.5) {
      // Inner region - orange/yellow
      colors.push(1.0, 0.6 + seededRandom(seed + 6) * 0.3, 0.3);
      sizes.push(0.025 + seededRandom(seed + 5) * 0.02);
    } else {
      // Outer region - blue/purple
      const blue = 0.5 + seededRandom(seed + 7) * 0.5;
      colors.push(0.4 + seededRandom(seed + 8) * 0.3, 0.5 + seededRandom(seed + 9) * 0.3, blue);
      sizes.push(0.015 + seededRandom(seed + 5) * 0.015);
    }
  }

  return { positions, colors, sizes, angles };
}

const GALAXY = generateGalaxy();

function Galaxy({ isAttracting, mousePos, containerSize }: { isAttracting: boolean; mousePos: { x: number; y: number }; containerSize: { width: number; height: number } }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const posRef = useRef(new Float32Array(GALAXY.positions));
  const baseAngles = useRef(new Float32Array(GALAXY.angles));
  const rotationRef = useRef(0);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positions = posRef.current;
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.getAttribute('position');

    // Galaxy rotation
    rotationRef.current += delta * 0.15;

    // Mouse attraction point - convert container coords to normalized device coords
    const mouseX = containerSize.width > 0 ? (mousePos.x / containerSize.width) * 2 - 1 : 0;
    const mouseY = containerSize.height > 0 ? -(mousePos.y / containerSize.height) * 2 + 1 : 0;
    const attractX = mouseX * viewport.width * 0.5;
    const attractY = mouseY * viewport.height * 0.5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const baseX = GALAXY.positions[i3];
      const baseY = GALAXY.positions[i3 + 1];
      const baseZ = GALAXY.positions[i3 + 2];

      // Calculate radius from center
      const radius = Math.sqrt(baseX * baseX + baseZ * baseZ);

      // Differential rotation - inner particles rotate faster
      const rotSpeed = 1.0 / (radius + 0.3);
      const angle = baseAngles.current[i] + rotationRef.current * rotSpeed;

      // New rotated position
      let x = Math.cos(angle) * radius;
      let y = baseY;
      let z = Math.sin(angle) * radius;

      // Mouse attraction - MUCH stronger and more visible
      if (isAttracting) {
        const dx = attractX - x;
        const dy = attractY - y;
        const dz = 0 - z; // Pull towards z=0 plane
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Much stronger force with better falloff
        const force = Math.min(3.0 / (dist * dist + 0.1), 10.0);

        x += dx * force * delta * 8;
        y += dy * force * delta * 8;
        z += dz * force * delta * 6;
      }

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
    }

    for (let i = 0; i < positions.length; i++) {
      (posAttr.array as Float32Array)[i] = positions[i];
    }
    posAttr.needsUpdate = true;

    // Tilt the galaxy for better view
    pointsRef.current.rotation.x = Math.PI * 0.35;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(GALAXY.positions), 3]} />
        <bufferAttribute attach="attributes-color" args={[new Float32Array(GALAXY.colors), 3]} />
        <bufferAttribute attach="attributes-aSize" args={[new Float32Array(GALAXY.sizes), 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={`
          attribute float aSize;
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (350.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            if (dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.1, 0.5, dist);
            gl_FragColor = vec4(vColor * 1.8, alpha);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GalaxyCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(pulse);
    }
  });
  return (
    <mesh ref={meshRef} rotation={[Math.PI * 0.35, 0, 0]}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshBasicMaterial color="#fffaf0" toneMapped={false} />
    </mesh>
  );
}

interface GravitationalVortexProps { disabled?: boolean; }

export default function GravitationalVortex({ disabled }: GravitationalVortexProps) {
  const [isAttracting, setIsAttracting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  if (disabled) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] rounded-lg">
        <p className="text-white/50 text-sm font-mono">DISABLED ON LOW SPEC</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative cursor-crosshair"
      onMouseMove={(e) => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          setContainerSize({ width: rect.width, height: rect.height });
        }
      }}
      onMouseDown={() => setIsAttracting(true)}
      onMouseUp={() => setIsAttracting(false)}
      onMouseLeave={() => setIsAttracting(false)}
    >
      <Canvas camera={{ position: [0, 3, 7], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#020208']} />
        <Galaxy isAttracting={isAttracting} mousePos={mousePos} containerSize={containerSize} />
        <GalaxyCore />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} intensity={2.0} levels={6} />
        </EffectComposer>
      </Canvas>
      <div className="absolute bottom-2 left-2 font-mono text-[10px] text-cyan-400/70">
        {isAttracting ? '[ GRAVITATIONAL PULL ACTIVE ]' : '[ CLICK & DRAG TO ATTRACT ]'}
      </div>
      <div className="absolute top-2 right-2 font-mono text-[10px] text-orange-400/70">
        GALAXY · {PARTICLE_COUNT.toLocaleString()} STARS
      </div>
    </div>
  );
}