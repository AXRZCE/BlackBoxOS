export interface Artifact {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  context: string;
  problem: string;
  constraints: string[];
  decisions: string[];
  results: string;
  artifacts?: Artifact[];
  modelPath?: string; // GLB file path
}

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Neural Interface',
    category: 'AI/ML',
    year: '2025',
    context: 'A cutting-edge brain-computer interface research project exploring direct neural communication pathways.',
    problem: 'Existing BCI systems suffer from high latency and poor signal resolution.',
    constraints: [
      'Must achieve sub-10ms latency',
      'Non-invasive approach preferred',
      'Real-time processing required',
    ],
    decisions: [
      'Adopted transformer-based signal processing',
      'Implemented edge computing for latency reduction',
      'Used dry electrodes for better user experience',
    ],
    results: 'Achieved 8ms average latency with 95% signal accuracy, setting new benchmarks for non-invasive BCIs.',
    artifacts: [
      { label: 'Paper', url: '#' },
      { label: 'GitHub', url: '#' },
    ],
  },
  {
    id: 'project-2',
    title: 'Quantum Mesh',
    category: 'Infrastructure',
    year: '2025',
    context: 'Distributed quantum computing network enabling seamless resource sharing across institutions.',
    problem: 'Quantum resources are scarce and siloed within individual organizations.',
    constraints: [
      'Maintain quantum coherence across network',
      'Sub-millisecond synchronization',
      'Enterprise-grade security',
    ],
    decisions: [
      'Built custom quantum routing protocol',
      'Implemented zero-knowledge proofs for access control',
      'Designed fault-tolerant mesh topology',
    ],
    results: 'Connected 12 quantum processors across 5 continents with 99.7% uptime.',
  },
  {
    id: 'project-3',
    title: 'Synth Engine',
    category: 'Audio',
    year: '2024',
    context: 'Next-generation audio synthesis platform for music production and sound design.',
    problem: 'Traditional synthesizers lack AI-assisted sound design and real-time adaptation.',
    constraints: [
      'Real-time audio processing',
      'Cross-platform compatibility',
      'Intuitive interface for non-technical users',
    ],
    decisions: [
      'WebAssembly for cross-platform audio DSP',
      'Implemented neural audio codec for style transfer',
      'Built modular architecture for extensibility',
    ],
    results: 'Over 50,000 active users, featured in 3 major DAW integrations.',
    artifacts: [
      { label: 'Demo', url: '#' },
      { label: 'Docs', url: '#' },
    ],
  },
  {
    id: 'project-4',
    title: 'DataVault',
    category: 'Security',
    year: '2024',
    context: 'Zero-knowledge personal data management system for privacy-conscious users.',
    problem: 'Users have no control over their personal data scattered across services.',
    constraints: [
      'Zero-knowledge architecture',
      'GDPR/CCPA compliance',
      'Seamless integration with existing services',
    ],
    decisions: [
      'Homomorphic encryption for data operations',
      'Decentralized identity framework',
      'Built browser extension for automatic capture',
    ],
    results: 'Protected data for 100K+ users with zero known breaches.',
  },
  {
    id: 'project-5',
    title: 'HoloSketch',
    category: 'XR',
    year: '2024',
    context: 'Mixed reality design tool for architects and industrial designers.',
    problem: 'Traditional CAD tools disconnect designers from spatial understanding.',
    constraints: [
      'Sub-frame latency for hand tracking',
      'Photorealistic rendering in real-time',
      'Collaboration across devices',
    ],
    decisions: [
      'Custom hand tracking ML model',
      'Implemented neural radiance fields for materials',
      'Built WebXR backend for cross-platform support',
    ],
    results: 'Reduced design iteration time by 60% in pilot studies.',
    artifacts: [
      { label: 'Case Study', url: '#' },
    ],
  },
  {
    id: 'project-6',
    title: 'FluxDB',
    category: 'Database',
    year: '2023',
    context: 'Time-series database optimized for IoT and real-time analytics workloads.',
    problem: 'Existing time-series databases struggle with high-cardinality data at scale.',
    constraints: [
      'Handle 1M+ writes per second',
      'Efficient compression for storage',
      'SQL-compatible query interface',
    ],
    decisions: [
      'Implemented LSM-tree with time-partitioning',
      'Custom compression codec for sensor data',
      'Built query optimizer for time-range operations',
    ],
    results: '10x better compression and 5x faster queries than leading alternatives.',
    artifacts: [
      { label: 'Benchmarks', url: '#' },
      { label: 'GitHub', url: '#' },
    ],
  },
];

