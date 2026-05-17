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

// M6: New fields for recruiter credibility
export interface Metric {
  label: string;
  value: string;
}

export interface ProofItem {
  type: 'image' | 'link';
  label: string;
  href: string;
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
  // M6: Recruiter credibility fields
  outcomes: string[]; // 2-4 key outcomes
  metrics: Metric[]; // Quantitative or qualitative metrics
  proof: ProofItem[]; // Screenshots, links to evidence
  highlights: string[]; // Key decisions/achievements (max 3)
  featured?: boolean; // Mark as top project for War Room
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
    // M6 fields
    featured: true,
    outcomes: [
      'Reduced signal processing latency from 50ms to 8ms',
      'Achieved 95% accuracy on standard BCI benchmarks',
      'Published research paper accepted at NeurIPS',
    ],
    metrics: [
      { label: 'Latency', value: '8ms avg' },
      { label: 'Accuracy', value: '95%' },
      { label: 'Users tested', value: '50+' },
    ],
    proof: [
      { type: 'link', label: 'Research Paper', href: '#' },
      { type: 'link', label: 'GitHub Repository', href: '#' },
      { type: 'image', label: 'Dashboard Screenshot', href: '/proof/project-1/dashboard.png' },
      { type: 'image', label: 'Latency Metrics', href: '/proof/project-1/latency-metrics.png' },
    ],
    highlights: [
      'Designed transformer architecture for temporal signal processing',
      'Led team of 4 engineers through research-to-prototype cycle',
      'Implemented real-time edge inference pipeline',
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
    // M6 fields
    featured: true,
    outcomes: [
      'Connected 12 quantum processors across 5 continents',
      'Achieved 99.7% network uptime',
      'Enabled cross-institutional quantum research collaboration',
    ],
    metrics: [
      { label: 'Uptime', value: '99.7%' },
      { label: 'Nodes', value: '12 QPUs' },
      { label: 'Continents', value: '5' },
    ],
    proof: [
      { type: 'link', label: 'Architecture Docs', href: '#' },
      { type: 'image', label: 'Network Topology', href: '/proof/project-2/network-topology.png' },
      { type: 'image', label: 'Latency Map', href: '/proof/project-2/latency-map.png' },
    ],
    highlights: [
      'Designed fault-tolerant mesh topology from scratch',
      'Implemented zero-knowledge proofs for secure access',
      'Built custom quantum routing protocol',
    ],
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
    // M6 fields
    featured: true,
    outcomes: [
      'Grew to 50,000+ active users',
      'Integrated with 3 major DAWs (Ableton, Logic, FL Studio)',
      'Reduced sound design iteration time significantly',
    ],
    metrics: [
      { label: 'Active Users', value: '50K+' },
      { label: 'DAW Integrations', value: '3' },
      { label: 'Latency', value: '<5ms' },
    ],
    proof: [
      { type: 'link', label: 'Live Demo', href: '#' },
      { type: 'link', label: 'Documentation', href: '#' },
      { type: 'image', label: 'Synthesizer UI', href: '/proof/project-3/synthesizer-ui.png' },
      { type: 'image', label: 'Waveform Editor', href: '/proof/project-3/waveform-editor.png' },
    ],
    highlights: [
      'Built WebAssembly audio DSP for cross-platform support',
      'Implemented neural audio codec for style transfer',
      'Designed modular plugin architecture',
    ],
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
    // M6 fields
    outcomes: [
      'Protected data for 100K+ users',
      'Zero known security breaches',
      'GDPR/CCPA compliant architecture',
    ],
    metrics: [
      { label: 'Users Protected', value: '100K+' },
      { label: 'Breaches', value: '0' },
    ],
    proof: [
      { type: 'link', label: 'Privacy Policy', href: '#' },
      { type: 'image', label: 'Vault Dashboard', href: '/proof/project-4/vault-dashboard.png' },
      { type: 'image', label: 'Encryption Flow', href: '/proof/project-4/encryption-flow.png' },
    ],
    highlights: [
      'Implemented homomorphic encryption for data operations',
      'Built browser extension for seamless data capture',
    ],
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
    // M6 fields
    outcomes: [
      'Reduced design iteration time by 60%',
      'Enabled real-time collaboration across devices',
      'Piloted with 3 architecture firms',
    ],
    metrics: [
      { label: 'Iteration Time', value: '-60%' },
      { label: 'Pilot Partners', value: '3 firms' },
    ],
    proof: [
      { type: 'link', label: 'Case Study', href: '#' },
      { type: 'link', label: 'Demo Video', href: '#' },
      { type: 'image', label: 'Hand Tracking Demo', href: '/proof/project-5/hand-tracking.png' },
      { type: 'image', label: '3D Canvas View', href: '/proof/project-5/3d-canvas.png' },
    ],
    highlights: [
      'Built custom hand tracking ML model',
      'Implemented neural radiance fields for materials',
    ],
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
    // M6 fields
    outcomes: [
      '10x better compression than alternatives',
      '5x faster queries on time-range operations',
      'Handles 1M+ writes per second',
    ],
    metrics: [
      { label: 'Compression', value: '10x better' },
      { label: 'Query Speed', value: '5x faster' },
      { label: 'Write Throughput', value: '1M+/sec' },
    ],
    proof: [
      { type: 'link', label: 'Benchmarks', href: '#' },
      { type: 'link', label: 'GitHub', href: '#' },
      { type: 'image', label: 'Query Interface', href: '/proof/project-6/query-interface.png' },
      { type: 'image', label: 'Performance Metrics', href: '/proof/project-6/performance-metrics.png' },
    ],
    highlights: [
      'Designed LSM-tree with time-partitioning',
      'Built custom compression codec for sensor data',
    ],
  },
];

// Helper to get featured/top projects
export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getTopProjects = (count = 3) => getFeaturedProjects().slice(0, count);

