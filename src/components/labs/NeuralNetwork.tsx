'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';

interface Node {
  position: [number, number, number];
  layer: number;
  activated: boolean;
  activationTime: number;
}

interface Connection {
  from: number;
  to: number;
  pulseProgress: number;
  active: boolean;
}

const LAYERS = [4, 6, 8, 6, 4]; // Network architecture

// Seeded random for deterministic network
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate network outside of component
function generateNetwork(): { nodes: Node[]; connections: Connection[] } {
  const nodes: Node[] = [];
  const connections: Connection[] = [];

  const layerSpacing = 1.5;
  let seedCounter = 0;

  // Generate nodes
  LAYERS.forEach((count, layerIdx) => {
    const layerX = (layerIdx - (LAYERS.length - 1) / 2) * layerSpacing;
    for (let i = 0; i < count; i++) {
      const y = (i - (count - 1) / 2) * 0.8;
      const z = (seededRandom(seedCounter++) - 0.5) * 0.5;
      nodes.push({ position: [layerX, y, z], layer: layerIdx, activated: false, activationTime: 0 });
    }
  });

  // Generate connections between adjacent layers
  let fromStart = 0;
  for (let l = 0; l < LAYERS.length - 1; l++) {
    const toStart = fromStart + LAYERS[l];
    for (let i = 0; i < LAYERS[l]; i++) {
      for (let j = 0; j < LAYERS[l + 1]; j++) {
        if (seededRandom(seedCounter++) > 0.3) { // 70% connectivity
          connections.push({ from: fromStart + i, to: toStart + j, pulseProgress: -1, active: false });
        }
      }
    }
    fromStart = toStart;
  }

  return { nodes, connections };
}

// Pre-generate network data at module level
const INITIAL_NETWORK = generateNetwork();

// Pre-compute line positions at module level
const INITIAL_LINE_POSITIONS = (() => {
  const positions: number[] = [];
  INITIAL_NETWORK.connections.forEach(conn => {
    const from = INITIAL_NETWORK.nodes[conn.from].position;
    const to = INITIAL_NETWORK.nodes[conn.to].position;
    positions.push(...from, ...to);
  });
  return new Float32Array(positions);
})();

// Pre-compute initial line colors at module level
const INITIAL_LINE_COLORS = new Float32Array(INITIAL_NETWORK.connections.length * 6).fill(0.2);

// Get counts at module level for JSX usage
const NODE_COUNT = INITIAL_NETWORK.nodes.length;
const CONNECTION_COUNT = INITIAL_NETWORK.connections.length;

function NetworkMesh({ onNodeClick }: { onNodeClick: () => void }) {
  const nodesRef = useRef(INITIAL_NETWORK.nodes.map(n => ({ ...n })));
  const connectionsRef = useRef(INITIAL_NETWORK.connections.map(c => ({ ...c })));
  const linesRef = useRef<THREE.LineSegments>(null);
  const spheresRef = useRef<THREE.InstancedMesh>(null);
  const clockRef = useRef(0);

  const dummyRef = useRef(new THREE.Object3D());
  const linePositions = useMemo(() => new Float32Array(INITIAL_LINE_POSITIONS), []);
  const lineColors = useRef(new Float32Array(INITIAL_LINE_COLORS));

  // Handle node click - activate the clicked node
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (e: any) => {
    e.stopPropagation();
    const instanceId = e.instanceId;
    if (instanceId !== undefined) {
      const node = nodesRef.current[instanceId];
      if (!node.activated) {
        node.activated = true;
        node.activationTime = clockRef.current;
        onNodeClick();
      }
    }
  };

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    clockRef.current = time;  // Store time for click handler
    const nodes = nodesRef.current;
    const connections = connectionsRef.current;

    // Update node activations - spread to next layer
    nodes.forEach((node, idx) => {
      if (node.activated && time - node.activationTime > 0.3) {
        // Spread activation to connected nodes
        connections.forEach(conn => {
          if (conn.from === idx && !conn.active) {
            conn.active = true;
            conn.pulseProgress = 0;
          }
        });
      }
    });
    
    // Update connection pulses - faster propagation
    connections.forEach((conn, idx) => {
      const i6 = idx * 6;

      if (conn.active && conn.pulseProgress >= 0) {
        conn.pulseProgress += delta * 3;  // Faster pulse
        if (conn.pulseProgress >= 1) {
          const targetNode = nodes[conn.to];
          if (!targetNode.activated) {
            targetNode.activated = true;
            targetNode.activationTime = time;
          }
          conn.pulseProgress = -1;
          conn.active = false;
        }
      }

      // Update line colors - brighter when active
      let brightness = 0.15;
      if (conn.active && conn.pulseProgress >= 0) {
        brightness = 0.3 + Math.sin(conn.pulseProgress * Math.PI) * 0.7;
      } else if (nodes[conn.from].activated || nodes[conn.to].activated) {
        brightness = 0.4;  // Connected to active node
      }

      // Cyan/green color for active connections
      lineColors.current[i6] = brightness * 0.2;
      lineColors.current[i6 + 1] = brightness;
      lineColors.current[i6 + 2] = brightness * 0.7;
      lineColors.current[i6 + 3] = brightness * 0.2;
      lineColors.current[i6 + 4] = brightness;
      lineColors.current[i6 + 5] = brightness * 0.7;
    });
    
    // Update line colors
    if (linesRef.current) {
      const geom = linesRef.current.geometry;
      geom.setAttribute('color', new THREE.BufferAttribute(lineColors.current, 3));
    }
    
    // Update spheres
    if (spheresRef.current) {
      nodes.forEach((node, idx) => {
        dummyRef.current.position.set(...node.position);
        const scale = node.activated ? 0.15 + Math.sin(time * 5) * 0.02 : 0.1;
        dummyRef.current.scale.setScalar(scale);
        dummyRef.current.updateMatrix();
        spheresRef.current!.setMatrixAt(idx, dummyRef.current.matrix);

        // Set color based on activation
        const color = node.activated ? new THREE.Color(0.2, 1, 0.8) : new THREE.Color(0.3, 0.3, 0.5);
        spheresRef.current!.setColorAt(idx, color);
      });
      spheresRef.current.instanceMatrix.needsUpdate = true;
      if (spheresRef.current.instanceColor) spheresRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[new Float32Array(INITIAL_LINE_COLORS), 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.6} />
      </lineSegments>

      <instancedMesh ref={spheresRef} args={[undefined, undefined, NODE_COUNT]}
        onClick={handleClick}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

interface NeuralNetworkProps { disabled?: boolean; }

export default function NeuralNetwork({ disabled }: NeuralNetworkProps) {
  const [status, setStatus] = useState('IDLE');
  const [activatedCount, setActivatedCount] = useState(0);
  const [key, setKey] = useState(0);  // For resetting the network

  const handleNodeClick = useCallback(() => {
    setStatus('PROPAGATING...');
    setActivatedCount(prev => prev + 1);
    setTimeout(() => setStatus('ACTIVE'), 500);
  }, []);

  const handleReset = () => {
    setKey(prev => prev + 1);  // Force remount of NetworkMesh
    setStatus('IDLE');
    setActivatedCount(0);
  };

  if (disabled) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] rounded-lg">
        <p className="text-white/50 text-sm font-mono">DISABLED ON LOW SPEC</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#050808']} />
        <NetworkMesh key={key} onNodeClick={handleNodeClick} />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} intensity={1.5} />
        </EffectComposer>
      </Canvas>
      <div className="absolute bottom-2 left-2 font-mono text-[10px] text-green-400/70">
        [ CLICK NODES TO ACTIVATE ]
      </div>
      <div className="absolute top-2 left-2 font-mono text-[10px] text-cyan-400/70">
        NODES ACTIVATED: {activatedCount}/{NODE_COUNT}
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <span className={`font-mono text-[10px] ${status === 'PROPAGATING...' ? 'text-yellow-400' : status === 'ACTIVE' ? 'text-green-400' : 'text-white/50'}`}>
          {status}
        </span>
        {activatedCount > 0 && (
          <button
            onClick={handleReset}
            className="font-mono text-[10px] text-red-400/70 hover:text-red-400 transition-colors"
          >
            [RESET]
          </button>
        )}
      </div>
    </div>
  );
}

