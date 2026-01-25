export interface Artifact {
  label: string;
  type: 'link' | 'github' | 'demo' | 'paper' | 'docs' | 'video';
  href: string;
}

export interface MediaItem {
  type: 'image' | 'video';
  src: string;
  alt: string;
}

export interface ProjectSections {
  problem: string;
  constraints: string[];
  decisions: string[];
  outcome: string;
  learnings: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  // New fields for richer case files
  role: string;
  timeframe: string;
  stack: string[];
  // Story sections
  context: string;
  sections: ProjectSections;
  // Legacy fields (mapped from sections for backward compat)
  problem: string;
  constraints: string[];
  decisions: string[];
  results: string;
  // Artifacts and media
  artifacts: Artifact[];
  media: MediaItem[];
  modelPath?: string; // GLB file path
}

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Neural Interface',
    category: 'AI/ML',
    year: '2025',
    role: 'Lead Engineer',
    timeframe: '6 months',
    stack: ['Python', 'PyTorch', 'C++', 'CUDA', 'WebSocket'],
    context: 'A cutting-edge brain-computer interface research project exploring direct neural communication pathways.',
    sections: {
      problem: 'Existing BCI systems suffer from high latency and poor signal resolution, making real-time applications impractical.',
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
      outcome: 'Achieved 8ms average latency with 95% signal accuracy, setting new benchmarks for non-invasive BCIs.',
      learnings: [
        'Edge computing is essential for real-time neural processing',
        'Dry electrodes significantly improve user adoption',
        'Transformer architectures outperform CNNs for temporal signals',
      ],
    },
    problem: 'Existing BCI systems suffer from high latency and poor signal resolution.',
    constraints: ['Must achieve sub-10ms latency', 'Non-invasive approach preferred', 'Real-time processing required'],
    decisions: ['Adopted transformer-based signal processing', 'Implemented edge computing for latency reduction', 'Used dry electrodes for better user experience'],
    results: 'Achieved 8ms average latency with 95% signal accuracy, setting new benchmarks for non-invasive BCIs.',
    artifacts: [
      { label: 'Paper', type: 'paper', href: '#' },
      { label: 'GitHub', type: 'github', href: '#' },
    ],
    media: [
      { type: 'image', src: '/images/neural-interface-demo.jpg', alt: 'Neural Interface Demo' },
    ],
  },
  {
    id: 'project-2',
    title: 'Quantum Mesh',
    category: 'Infrastructure',
    year: '2025',
    role: 'Architect',
    timeframe: '12 months',
    stack: ['Rust', 'Qiskit', 'gRPC', 'Kubernetes', 'Redis'],
    context: 'Distributed quantum computing network enabling seamless resource sharing across institutions.',
    sections: {
      problem: 'Quantum resources are scarce and siloed within individual organizations, limiting collaborative research.',
      constraints: ['Maintain quantum coherence across network', 'Sub-millisecond synchronization', 'Enterprise-grade security'],
      decisions: ['Built custom quantum routing protocol', 'Implemented zero-knowledge proofs for access control', 'Designed fault-tolerant mesh topology'],
      outcome: 'Connected 12 quantum processors across 5 continents with 99.7% uptime.',
      learnings: ['Quantum networking requires fundamentally different routing strategies', 'Zero-knowledge proofs are viable for enterprise security'],
    },
    problem: 'Quantum resources are scarce and siloed within individual organizations.',
    constraints: ['Maintain quantum coherence across network', 'Sub-millisecond synchronization', 'Enterprise-grade security'],
    decisions: ['Built custom quantum routing protocol', 'Implemented zero-knowledge proofs for access control', 'Designed fault-tolerant mesh topology'],
    results: 'Connected 12 quantum processors across 5 continents with 99.7% uptime.',
    artifacts: [
      { label: 'Architecture', type: 'docs', href: '#' },
    ],
    media: [],
  },
  {
    id: 'project-3',
    title: 'Synth Engine',
    category: 'Audio',
    year: '2024',
    role: 'Full-Stack Developer',
    timeframe: '8 months',
    stack: ['TypeScript', 'WebAssembly', 'Rust', 'Web Audio API', 'React'],
    context: 'Next-generation audio synthesis platform for music production and sound design.',
    sections: {
      problem: 'Traditional synthesizers lack AI-assisted sound design and real-time adaptation capabilities.',
      constraints: ['Real-time audio processing', 'Cross-platform compatibility', 'Intuitive interface for non-technical users'],
      decisions: ['WebAssembly for cross-platform audio DSP', 'Implemented neural audio codec for style transfer', 'Built modular architecture for extensibility'],
      outcome: 'Over 50,000 active users, featured in 3 major DAW integrations.',
      learnings: ['WebAssembly enables near-native audio performance in browsers', 'Modular architecture is key for creative tools'],
    },
    problem: 'Traditional synthesizers lack AI-assisted sound design and real-time adaptation.',
    constraints: ['Real-time audio processing', 'Cross-platform compatibility', 'Intuitive interface for non-technical users'],
    decisions: ['WebAssembly for cross-platform audio DSP', 'Implemented neural audio codec for style transfer', 'Built modular architecture for extensibility'],
    results: 'Over 50,000 active users, featured in 3 major DAW integrations.',
    artifacts: [
      { label: 'Demo', type: 'demo', href: '#' },
      { label: 'Docs', type: 'docs', href: '#' },
    ],
    media: [],
  },
  {
    id: 'project-4',
    title: 'DataVault',
    category: 'Security',
    year: '2024',
    role: 'Security Engineer',
    timeframe: '10 months',
    stack: ['Go', 'Rust', 'PostgreSQL', 'WebExtension API', 'WASM'],
    context: 'Zero-knowledge personal data management system for privacy-conscious users.',
    sections: {
      problem: 'Users have no control over their personal data scattered across services, leading to privacy concerns.',
      constraints: ['Zero-knowledge architecture', 'GDPR/CCPA compliance', 'Seamless integration with existing services'],
      decisions: ['Homomorphic encryption for data operations', 'Decentralized identity framework', 'Built browser extension for automatic capture'],
      outcome: 'Protected data for 100K+ users with zero known breaches.',
      learnings: ['Homomorphic encryption is practical for specific use cases', 'User experience is critical for security tool adoption'],
    },
    problem: 'Users have no control over their personal data scattered across services.',
    constraints: ['Zero-knowledge architecture', 'GDPR/CCPA compliance', 'Seamless integration with existing services'],
    decisions: ['Homomorphic encryption for data operations', 'Decentralized identity framework', 'Built browser extension for automatic capture'],
    results: 'Protected data for 100K+ users with zero known breaches.',
    artifacts: [
      { label: 'Privacy Policy', type: 'docs', href: '#' },
    ],
    media: [],
  },
  {
    id: 'project-5',
    title: 'HoloSketch',
    category: 'XR',
    year: '2024',
    role: 'XR Developer',
    timeframe: '9 months',
    stack: ['Unity', 'C#', 'WebXR', 'TensorFlow', 'Three.js'],
    context: 'Mixed reality design tool for architects and industrial designers.',
    sections: {
      problem: 'Traditional CAD tools disconnect designers from spatial understanding, limiting creative iteration.',
      constraints: ['Sub-frame latency for hand tracking', 'Photorealistic rendering in real-time', 'Collaboration across devices'],
      decisions: ['Custom hand tracking ML model', 'Implemented neural radiance fields for materials', 'Built WebXR backend for cross-platform support'],
      outcome: 'Reduced design iteration time by 60% in pilot studies.',
      learnings: ['Hand tracking ML models need device-specific optimization', 'WebXR enables broader adoption than native apps'],
    },
    problem: 'Traditional CAD tools disconnect designers from spatial understanding.',
    constraints: ['Sub-frame latency for hand tracking', 'Photorealistic rendering in real-time', 'Collaboration across devices'],
    decisions: ['Custom hand tracking ML model', 'Implemented neural radiance fields for materials', 'Built WebXR backend for cross-platform support'],
    results: 'Reduced design iteration time by 60% in pilot studies.',
    artifacts: [
      { label: 'Case Study', type: 'docs', href: '#' },
      { label: 'Demo', type: 'demo', href: '#' },
    ],
    media: [],
  },
  {
    id: 'project-6',
    title: 'FluxDB',
    category: 'Database',
    year: '2023',
    role: 'Database Engineer',
    timeframe: '14 months',
    stack: ['Rust', 'C++', 'RocksDB', 'Arrow', 'gRPC'],
    context: 'Time-series database optimized for IoT and real-time analytics workloads.',
    sections: {
      problem: 'Existing time-series databases struggle with high-cardinality data at scale, causing performance bottlenecks.',
      constraints: ['Handle 1M+ writes per second', 'Efficient compression for storage', 'SQL-compatible query interface'],
      decisions: ['Implemented LSM-tree with time-partitioning', 'Custom compression codec for sensor data', 'Built query optimizer for time-range operations'],
      outcome: '10x better compression and 5x faster queries than leading alternatives.',
      learnings: ['Time-partitioning is essential for time-series workloads', 'Custom compression codecs can dramatically reduce storage costs'],
    },
    problem: 'Existing time-series databases struggle with high-cardinality data at scale.',
    constraints: ['Handle 1M+ writes per second', 'Efficient compression for storage', 'SQL-compatible query interface'],
    decisions: ['Implemented LSM-tree with time-partitioning', 'Custom compression codec for sensor data', 'Built query optimizer for time-range operations'],
    results: '10x better compression and 5x faster queries than leading alternatives.',
    artifacts: [
      { label: 'Benchmarks', type: 'docs', href: '#' },
      { label: 'GitHub', type: 'github', href: '#' },
    ],
    media: [],
  },
];

