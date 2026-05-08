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
  color?: string; // Accent color for 3D capsule (hex)
}

export const projects: Project[] = [
  {
    id: 'clawbot',
    title: 'ClawBot',
    category: 'AI Infrastructure',
    year: '2026',
    role: 'Founder & Engineer',
    timeframe: 'Ongoing',
    stack: ['Python', 'Docker', 'FastAPI', 'Redis', 'PostgreSQL', 'Qdrant', 'DeepSeek', 'OpenClaw', 'Cloudflare', 'Telegram Bot API'],
    context: 'Self-hosted autonomous AI operator running on a Linux cloud VM. A multi-service backend with agentic reasoning, vector memory, web search, stock research pipelines, job scanning, and Telegram-based control — all built from scratch.',
    sections: {
      problem: 'Most AI assistants are walled-garden SaaS products. I wanted a fully self-hosted, autonomous operator that could research, code, deploy, and monitor — with no external dependencies beyond model APIs.',
      constraints: [
        'Must run on a single affordable cloud VM (DigitalOcean)',
        'All services containerized with Docker Compose',
        'Secure remote access via Cloudflare Tunnel (no open ports)',
        'Telegram as the primary control surface',
      ],
      decisions: [
        'Built a FastAPI service layer with Redis/RQ for async background jobs',
        'Qdrant vector DB for semantic memory and feedback retrieval',
        'SearXNG for private web search (no API keys leaking to search providers)',
        'Multi-stage stock research pipeline: Yahoo → AI planning → Tavily search → DeepSeek report → Flash audit',
        'LiteLLM proxy to route between DeepSeek V4 Flash and Pro based on task complexity',
      ],
      outcome: '9-container Docker stack running 24/7, handling autonomous work sessions, daily news scans, stock research, and job market intelligence. Zero failed jobs in production. Serves as both a productivity tool and a demonstration of self-hosted AI infrastructure.',
      learnings: [
        'Vector memory (Qdrant) dramatically improves agent context retention across sessions',
        'Dual-model routing (Flash for cheap tasks, Pro for reasoning) saves cost without sacrificing quality',
        'Cloudflare Tunnel is a clean alternative to reverse proxies for self-hosted services',
        'Cron-driven autonomous work sessions create a persistent, productive agent experience',
      ],
    },
    problem: 'Most AI assistants are walled-garden SaaS products. I wanted a fully self-hosted, autonomous operator.',
    constraints: ['Single affordable cloud VM', 'All services containerized', 'Secure remote access', 'Telegram primary interface'],
    decisions: ['FastAPI + Redis/RQ service layer', 'Qdrant semantic memory', 'SearXNG private search', 'Multi-stage research pipeline', 'Dual-model routing (Flash/Pro)'],
    results: '9-container Docker stack running 24/7. Autonomous work sessions, stock research, job scanning, and daily news intelligence — all self-hosted.',
    artifacts: [
      { label: 'GitHub', type: 'github', href: 'https://github.com/AXRZCE/clawbot-v2' },
    ],
    media: [],
    featured: true,
    color: '#3b82f6',
    outcomes: [
      'Designed and deployed a 9-service Docker infrastructure on DigitalOcean',
      'Built multi-stage stock research pipeline with automated AI report generation',
      'Integrated vector memory, job scanning, and daily autonomous work sessions',
      'Zero failed jobs in production across all cron-driven tasks',
    ],
    metrics: [
      { label: 'Services', value: '9 containers' },
      { label: 'Uptime', value: '24/7' },
      { label: 'Models', value: 'Flash + Pro' },
    ],
    proof: [
      { type: 'link', label: 'GitHub Repository', href: 'https://github.com/AXRZCE/clawbot-v2' },
    ],
    highlights: [
      'Architected full-stack AI infra: FastAPI, Redis/RQ, Postgres, Qdrant, SearXNG',
      'Built dual-model cost router switching between Flash and Pro based on task complexity',
      'Designed autonomous cron-driven agent that researches, codes, and self-improves',
    ],
  },
  {
    id: 'compi',
    title: 'CompI',
    category: 'AI/ML',
    year: '2025',
    role: 'AI Engineer',
    timeframe: '4 months',
    stack: ['Python', 'Streamlit', 'PyTorch', 'Transformers', 'Diffusers', 'Hugging Face Spaces'],
    context: 'A multimodal AI art platform that combines text, music, images, links, and real-time data to generate more dynamic and personalized creative outputs. Deployed on Hugging Face Spaces for public access.',
    sections: {
      problem: 'Existing AI art tools are single-modal — they only accept text prompts. Creative work often blends music, imagery, links, and context. There was no tool that fused multiple input modalities into a unified generation pipeline.',
      constraints: [
        'Must run on free-tier cloud infrastructure (Hugging Face Spaces)',
        'Real-time multimodal fusion — text, image, audio, links',
        'Outputs must be high-quality and diverse across artistic styles',
      ],
      decisions: [
        'Built on Streamlit for rapid prototyping and deployment',
        'Used PyTorch + Transformers + Diffusers for the generation backbone',
        'Implemented style transfer and user-guided customization modules',
        'Deployed on Hugging Face Spaces for zero-cost public hosting',
      ],
      outcome: 'Fully functional multimodal AI art platform deployed and publicly accessible. Combines multiple input modalities — text, music, images, links, real-time data — into a unified creative generation pipeline.',
      learnings: [
        'Multimodal fusion significantly increases creative diversity vs single-prompt generation',
        'Streamlit is excellent for rapid AI prototyping but has UI ceiling for complex interactions',
        'Hugging Face Spaces provides sufficient free GPU for demo-quality diffusion models',
        'User-guided customization (sliders, style references) dramatically improves satisfaction',
      ],
    },
    problem: 'Existing AI art tools are single-modal (text only). Creative work blends music, imagery, links, and context.',
    constraints: ['Free-tier cloud hosting', 'Real-time multimodal fusion', 'High-quality diverse outputs'],
    decisions: ['Streamlit for rapid prototyping', 'PyTorch + Transformers + Diffusers backbone', 'Style transfer + user-guided customization', 'Hugging Face Spaces deployment'],
    results: 'Publicly deployed multimodal AI art platform combining text, music, images, and links into unified creative generation.',
    artifacts: [
      { label: 'Live Site', type: 'demo', href: 'https://huggingface.co/spaces/axrzce/Comp-I' },
      { label: 'GitHub', type: 'github', href: 'https://github.com/AXRZCE/Project_CompI' },
      { label: 'Gallery', type: 'link', href: 'https://www.instagram.com/projectcompi' },
    ],
    media: [],
    featured: true,
    color: '#8b5cf6',
    outcomes: [
      'Built multimodal AI platform fusing text, music, images, links, and real-time data',
      'Deployed publicly on Hugging Face Spaces for zero-cost hosting',
      'Implemented style transfer and user-guided customization modules',
    ],
    metrics: [
      { label: 'Modalities', value: '5 inputs' },
      { label: 'Deployment', value: 'Hugging Face' },
      { label: 'Stack', value: 'PyTorch + Diffusers' },
    ],
    proof: [
      { type: 'link', label: 'Live Demo', href: 'https://huggingface.co/spaces/axrzce/Comp-I' },
      { type: 'link', label: 'GitHub Repository', href: 'https://github.com/AXRZCE/Project_CompI' },
      { type: 'link', label: 'Instagram Gallery', href: 'https://www.instagram.com/projectcompi' },
    ],
    highlights: [
      'Fused 5 input modalities (text, music, image, link, real-time data) into unified generation',
      'Built custom style transfer pipeline with user-guided parameter controls',
      'Deployed and serving publicly on Hugging Face Spaces',
    ],
  },
  {
    id: 'sutradhar',
    title: 'Sutradhar',
    category: 'Defence AI',
    year: '2026',
    role: 'Full-Stack Developer',
    timeframe: '3 months',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'TypeScript', 'LangChain', 'OpenAI'],
    context: 'A sovereign defence readiness decision-support system — an MVP for ALH Dhruv helicopter AOG (Aircraft on Ground) spares intelligence. Built to help defence logistics teams predict and respond to parts shortages using AI-driven analytics.',
    sections: {
      problem: 'Military helicopter fleets face critical parts shortages that ground aircraft. The ALH Dhruv fleet needed an intelligent system to predict AOG events, prioritize spares procurement, and reduce downtime — but existing tools relied on manual spreadsheets and tribal knowledge.',
      constraints: [
        'MVP must be functional within 3 months',
        'Data must be sovereign — no cloud-only dependencies',
        'Must integrate with existing defence logistics workflows',
      ],
      decisions: [
        'FastAPI backend with PostgreSQL for structured spares data',
        'LangChain + LLM for natural language querying of parts inventory',
        'React + TypeScript frontend for logistics dashboards',
        'Designed for on-premise or air-gapped deployment',
      ],
      outcome: 'Delivered a functional MVP that ingests spares data, predicts AOG risk, and provides natural language querying. Demonstrated to defence stakeholders as a proof-of-concept for AI-assisted logistics.',
      learnings: [
        'Defence workflows require extreme data integrity — every field must be auditable',
        'LLM-based natural language queries dramatically reduce training time for logistics staff',
        'Sovereign/air-gapped deployment constraints fundamentally change architecture decisions',
        'MVP scope in regulated domains needs early stakeholder alignment on evaluation criteria',
      ],
    },
    problem: 'Military helicopter fleets face critical parts shortages. The ALH Dhruv fleet needed intelligent AOG prediction, but existing tools relied on manual spreadsheets.',
    constraints: ['3-month MVP deadline', 'Sovereign data constraints', 'Must integrate with defence logistics workflows'],
    decisions: ['FastAPI + PostgreSQL backend', 'LangChain for natural language querying', 'React + TypeScript dashboards', 'On-premise deployable architecture'],
    results: 'Delivered functional MVP for ALH Dhruv AOG spares intelligence with AI-driven analytics and natural language querying.',
    artifacts: [
      { label: 'GitHub', type: 'github', href: 'https://github.com/AXRZCE/sutradhar' },
    ],
    media: [],
    featured: true,
    color: '#10b981',
    outcomes: [
      'Built AI-driven AOG prediction system for military helicopter spares logistics',
      'Implemented natural language querying for parts inventory via LangChain + LLM',
      'Delivered MVP in 3 months with sovereign deployment architecture',
    ],
    metrics: [
      { label: 'Timeline', value: '3 months' },
      { label: 'Fleet', value: 'ALH Dhruv' },
      { label: 'Deployment', value: 'On-premise ready' },
    ],
    proof: [
      { type: 'link', label: 'GitHub Repository', href: 'https://github.com/AXRZCE/sutradhar' },
    ],
    highlights: [
      'Designed sovereign AI architecture for air-gapped defence environments',
      'Built natural language query layer on top of structured parts inventory',
      'Navigated regulated-domain constraints: audit trails, data integrity, stakeholder alignment',
    ],
  },
  {
    id: 'job-scanner',
    title: 'Job Scanner',
    category: 'Automation',
    year: '2026',
    role: 'Full-Stack Developer',
    timeframe: '1 week',
    stack: ['Python', 'SearXNG', 'Bash', 'Regex', 'Markdown'],
    context: 'A daily automated job search engine that scans 10+ search queries across Canada for AI/ML, FinTech, SWE, startup, and new-grad roles. Filters out senior positions, co-ops, and stale listings. Scores and categorizes leads, producing a structured daily report.',
    sections: {
      problem: 'Manual job searching is repetitive and time-consuming. I needed an automated system that casts a wide net across multiple search engines, filters out noise (senior roles, co-ops, stale postings), and delivers a structured daily report of qualified leads.',
      constraints: [
        'Must use only free/open-source tools (SearXNG for search)',
        'Must filter: 0-4 years experience only, no co-op, real active listings',
        'Must produce a readable daily markdown report',
      ],
      decisions: [
        'SearXNG as private search aggregator (Bing, Brave, Startpage engines)',
        '10 targeted queries across 5 categories: AI/ML, FinTech, SWE, startup, new-grad',
        'Scoring system weights title relevance, company quality, and listing freshness',
        'Regex-based filtering for experience level and co-op detection',
      ],
      outcome: 'Fully automated daily job pipeline running via cron at 8 AM ET. Produces structured reports with top picks, verified leads by category, and new-since-yesterday tracking. 50+ raw results filtered to ~15 quality leads daily.',
      learnings: [
        'SearXNG provides surprisingly good coverage when configured with multiple engines',
        'Canada-specific job search requires explicit location filters — many roles are US-remote',
        'Regex-based filtering catches ~80% of mismatches; the rest need LLM-based review',
        'Daily cadence is critical — postings >30 days old have very low response rates',
      ],
    },
    problem: 'Manual job searching is repetitive and time-consuming. Needed an automated system to scan, filter, and report.',
    constraints: ['Free/open-source tools only', '0-4 yr exp filter', 'No co-ops', 'Real active listings only'],
    decisions: ['SearXNG multi-engine search', '10 queries across 5 categories', 'Scoring + regex filtering', 'Daily cron at 8 AM ET'],
    results: 'Fully automated daily pipeline. 10 queries, 50+ raw results, ~15 quality leads daily with structured markdown reports.',
    artifacts: [
      { label: 'GitHub', type: 'github', href: 'https://github.com/AXRZCE/clawbot-v2' },
    ],
    media: [],
    color: '#f59e0b',
    outcomes: [
      'Automated multi-engine job search across 5 categories and 10 queries daily',
      'Built scoring + filtering pipeline reducing 50+ raw results to ~15 quality leads',
      'Integrated into ClawBot infrastructure with daily cron and structured reporting',
    ],
    metrics: [
      { label: 'Queries', value: '10/day' },
      { label: 'Categories', value: '5' },
      { label: 'Signal Ratio', value: '~30%' },
    ],
    proof: [
      { type: 'link', label: 'GitHub (clawbot-v2)', href: 'https://github.com/AXRZCE/clawbot-v2' },
    ],
    highlights: [
      'Built a SearXNG-based search aggregator that queries Bing, Brave, and Startpage simultaneously',
      'Implemented regex + scoring pipeline to filter experience level and detect co-op listings',
      'Runs autonomously as a cron job within the ClawBot infrastructure',
    ],
  },
  {
    id: 'electronix-ai',
    title: 'Electronix AI',
    category: 'Full-Stack',
    year: '2025',
    role: 'Full-Stack Developer',
    timeframe: '2 months',
    stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'Tailwind CSS', 'scikit-learn'],
    context: 'End-to-end sentiment analysis microservice with a FastAPI backend and React TypeScript frontend. Designed as a clean, production-style demo of ML model serving through a modern web interface.',
    sections: {
      problem: 'Sentiment analysis tools are often Jupyter notebooks that never see production. I wanted to build a complete, deployable microservice that shows the full lifecycle: model training → API serving → modern frontend.',
      constraints: [
        'Must be a complete microservice (not a notebook)',
        'Clean separation of backend API and frontend',
        'Responsive UI that works on mobile',
      ],
      decisions: [
        'FastAPI for async model serving with proper error handling',
        'React + TypeScript + Tailwind for a polished, responsive frontend',
        'scikit-learn pipeline for the sentiment model (explainable, no GPU needed)',
        'RESTful API design with proper status codes and validation',
      ],
      outcome: 'A production-quality sentiment analysis microservice. Clean architecture with FastAPI async endpoints, a polished React frontend, and a trained ML model serving real predictions through the API.',
      learnings: [
        'FastAPI + Pydantic provides excellent API validation with minimal boilerplate',
        'Separating model inference from the web server enables independent scaling',
        'Tailwind CSS dramatically accelerates frontend development for data apps',
        'Proper error handling on the API side prevents the frontend from crashing on bad input',
      ],
    },
    problem: 'Sentiment analysis tools rarely leave Jupyter notebooks. I wanted a complete, production-style microservice.',
    constraints: ['Complete microservice (not notebook)', 'Clean API/frontend separation', 'Responsive mobile UI'],
    decisions: ['FastAPI async model serving', 'React + TypeScript + Tailwind frontend', 'scikit-learn pipeline', 'RESTful API with validation'],
    results: 'Production-quality sentiment analysis microservice with FastAPI backend, React frontend, and trained ML model.',
    artifacts: [
      { label: 'GitHub', type: 'github', href: 'https://github.com/AXRZCE/electronix-ai-sentiment-analysis' },
    ],
    media: [],
    color: '#ef4444',
    outcomes: [
      'Built complete ML microservice from model to API to frontend',
      'Implemented async FastAPI endpoints with Pydantic validation',
      'Designed responsive React + TypeScript UI with Tailwind CSS',
    ],
    metrics: [
      { label: 'Stack', value: 'FastAPI + React' },
      { label: 'API Design', value: 'RESTful' },
      { label: 'Model', value: 'scikit-learn' },
    ],
    proof: [
      { type: 'link', label: 'GitHub Repository', href: 'https://github.com/AXRZCE/electronix-ai-sentiment-analysis' },
    ],
    highlights: [
      'Built full ML lifecycle: training pipeline → API serving → modern web UI',
      'Designed clean separation between async FastAPI backend and React frontend',
      'Production-style error handling and API validation throughout',
    ],
  },
  {
    id: 'ai-notetaking',
    title: 'AI NoteTaker',
    category: 'Web App',
    year: '2025',
    role: 'Full-Stack Developer',
    timeframe: '3 weeks',
    stack: ['React', 'Vite', 'JavaScript', 'Web Speech API', 'docx.js', 'Tailwind CSS'],
    context: 'A free, privacy-first web app for real-time meeting transcription and note-taking. Built with the Web Speech API so everything runs client-side — no audio ever leaves the browser. Exports notes as formatted .docx files.',
    sections: {
      problem: 'Most meeting transcription tools are paid subscriptions that send your audio to the cloud. I wanted a free, privacy-respecting alternative that works entirely in the browser with no backend.',
      constraints: [
        'Everything must run client-side (no server, no audio uploads)',
        'Must work in Chrome and Edge (Web Speech API support)',
        'Export to standard formats (.docx)',
      ],
      decisions: [
        'Web Speech API for real-time transcription (built into Chromium browsers)',
        'React + Vite for fast development and optimized builds',
        'docx.js for client-side .docx export — no server needed',
        'Minimalist UI focused on the transcription experience',
      ],
      outcome: 'A fully client-side meeting transcription app. Zero infrastructure cost, zero privacy concerns. Transcribes in real-time and exports formatted notes as downloadable .docx files.',
      learnings: [
        'Web Speech API is surprisingly capable for clear English speech at moderate pace',
        'Client-side .docx generation with docx.js is production-quality',
        'Privacy-first architecture (no backend) is a genuine differentiator for utility apps',
        'Vite provides an excellent developer experience for React apps',
      ],
    },
    problem: 'Most transcription tools are paid subscriptions that upload your audio. I wanted a free, private alternative.',
    constraints: ['100% client-side (no server)', 'No audio uploads', 'Browser-native APIs only', 'Export to .docx'],
    decisions: ['Web Speech API for real-time transcription', 'React + Vite for build', 'docx.js for export', 'Minimalist UI'],
    results: 'Privacy-first transcription app — fully client-side, real-time, exports formatted .docx. Zero infrastructure cost.',
    artifacts: [
      { label: 'GitHub', type: 'github', href: 'https://github.com/AXRZCE/AI_NoteTaking_WebApp' },
    ],
    media: [],
    color: '#06b6d4',
    outcomes: [
      'Built privacy-first transcription app with zero server dependencies',
      'Implemented real-time Web Speech API transcription in the browser',
      'Client-side .docx export with formatted meeting notes',
    ],
    metrics: [
      { label: 'Architecture', value: 'Client-only' },
      { label: 'Infra Cost', value: '$0' },
      { label: 'Export', value: '.docx' },
    ],
    proof: [
      { type: 'link', label: 'GitHub Repository', href: 'https://github.com/AXRZCE/AI_NoteTaking_WebApp' },
    ],
    highlights: [
      '100% client-side architecture — no audio ever leaves the browser',
      'Real-time transcription using browser-native Web Speech API',
      'Formatted .docx export using docx.js with zero server dependency',
    ],
  },
];

// Helper to get featured/top projects
export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getTopProjects = (count = 3) => getFeaturedProjects().slice(0, count);
