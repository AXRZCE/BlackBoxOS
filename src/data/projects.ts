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
    role: 'AI Infrastructure Engineer',
    timeframe: 'Ongoing',
    stack: ['Python', 'Docker', 'FastAPI', 'Redis', 'PostgreSQL', 'Qdrant', 'DeepSeek', 'OpenClaw', 'SearXNG', 'Cloudflare', 'Telegram Bot API'],
    context: 'Self-hosted AI infrastructure running on a Linux cloud VM with agentic research, workflow execution, vector memory, private web search, job-search intelligence, fintech and startup news scans, AI-interest briefings, stock research pipelines, and Telegram-based control.',
    sections: {
      problem: 'Most AI assistants give limited control over memory, tools, execution, and feedback loops. I wanted self-hosted AI infrastructure that could research, run workflows, inspect systems, learn from previous outputs, and deliver useful reports from infrastructure I controlled.',
      constraints: [
        'Must run on a single affordable cloud VM (DigitalOcean)',
        'All services containerized with Docker Compose',
        'Secure remote access via Cloudflare Tunnel (no open ports)',
        'Telegram as the primary control surface',
        'Recurring reports needed to improve with stored preferences, feedback, and prior research context',
      ],
      decisions: [
        'Built a FastAPI service layer with Redis/RQ for async background jobs',
        'Used Qdrant for semantic memory, feedback retrieval, and self-improving context across recurring jobs',
        'Integrated SearXNG for private web search without relying on search-provider API keys',
        'Set up recurring intelligence streams for job search, fintech news, startup news, AI-interest news, and market research',
        'Built a multi-stage stock research pipeline covering market data, planning, search, report generation, and model audit',
        'Used LiteLLM to route between DeepSeek V4 Flash and Pro based on task complexity',
      ],
      outcome: 'A 9-container Docker stack now runs 24/7 and handles autonomous work sessions, job-search reports, fintech and startup news briefings, AI-interest news scans, stock research, and daily intelligence summaries. The system acts like a self-improving research layer because recurring jobs can reuse memory, feedback, and prior context instead of starting cold every time.',
      learnings: [
        'Vector memory improves agent context retention across sessions and makes recurring reports feel less generic over time',
        'Dual-model routing saves cost while preserving reasoning quality for harder tasks',
        'Cloudflare Tunnel is a clean access pattern for self-hosted services',
        'Cron-driven work sessions turn an agent from a chatbot into persistent infrastructure',
        'A useful AI system needs feedback loops, not just prompts',
      ],
    },
    problem: 'Most AI assistants give limited control over memory, tools, execution, and feedback loops. I wanted a self-hosted operator I could extend, audit, and improve over time.',
    constraints: ['Single affordable cloud VM', 'All services containerized', 'Secure remote access', 'Telegram primary interface', 'Memory-backed recurring reports'],
    decisions: ['FastAPI + Redis/RQ service layer', 'Qdrant semantic memory and feedback retrieval', 'SearXNG private search', 'Recurring intelligence streams', 'Multi-stage research pipeline', 'Dual-model routing (Flash/Pro)'],
    results: '9-container Docker stack running 24/7 for autonomous work sessions, stock research, job-search intelligence, fintech and startup news, AI-interest briefings, and daily news reports.',
    artifacts: [
      { label: 'GitHub', type: 'github', href: 'https://github.com/AXRZCE/clawbot-v2' },
    ],
    media: [],
    featured: true,
    color: '#3b82f6',
    outcomes: [
      'Designed and deployed a 9-container Docker infrastructure on DigitalOcean',
      'Built a multi-stage stock research pipeline with automated AI report generation',
      'Integrated vector memory and feedback retrieval so recurring workflows can improve with prior context',
      'Built intelligence streams for job search, fintech news, startup news, AI-interest updates, and market research',
      'Kept cron-driven production tasks running without failed jobs',
    ],
    metrics: [
      { label: 'Services', value: '9 containers' },
      { label: 'Uptime', value: '24/7' },
      { label: 'Models', value: 'Flash + Pro' },
      { label: 'Streams', value: '5+' },
    ],
    proof: [
      { type: 'link', label: 'GitHub Repository', href: 'https://github.com/AXRZCE/clawbot-v2' },
    ],
    highlights: [
      'Architected full-stack AI infrastructure with FastAPI, Redis/RQ, Postgres, Qdrant, and SearXNG',
      'Built self-improving loops with vector memory, feedback retrieval, recurring jobs, and prior-report context',
      'Designed autonomous workflows for job search, news intelligence, fintech/startup monitoring, AI updates, research, and reporting',
    ],
  },
  {
    id: 'prophet',
    title: 'Prophet',
    category: 'Quantitative Systems',
    year: '2026',
    role: 'Quantitative Systems Developer',
    timeframe: '2 months',
    stack: ['Python', 'SQLite', 'PostgreSQL', 'DeepSeek', 'Polymarket API', 'Kalshi API', 'MiroFish', 'Brier Scoring', 'Cron'],
    context: 'Simulation-calibrated prediction market system that tests AI-generated forecasts against real-money market probabilities. The project turns forecasting into a measured pipeline with market scanning, simulation runs, parsing, resolution tracking, and Brier scoring.',
    sections: {
      problem: 'Prediction markets are strong aggregators of information, but I wanted evidence before trusting or rejecting AI simulation-based forecasts. Prophet was built to measure that edge before any trading decision.',
      constraints: [
        'Must compare simulation probability vs market-implied probability vs actual outcome',
        'Phase-gated: no trading until scored evidence proves edge',
        'Multi-market support (Polymarket + Kalshi) with separate Track A/B/C scoring',
        'Guardrails against data leakage, Chinese-language outputs, and high-divergence instability',
      ],
      decisions: [
        'Used MiroFish with DeepSeek V4 Pro for multi-run ensemble forecasts',
        'Made Brier score the primary calibration metric with false-confidence diagnostics',
        'Structured phase gates from observation to validation before any trading workflow',
        'Added high-divergence guardrails with reruns above 0.30 gap and scoring exclusion above 0.50',
        'Enforced English-language outputs across all 4 MiroFish prompt paths',
      ],
      outcome: '22 Track C events resolved across Kalshi and Polymarket. Market Brier scores beat simulation scores, which validated the framework and prevented premature trading. The parser reached 13/13 success with zero market-price-copy failures.',
      learnings: [
        'Markets were stronger than LLM simulations on short-deadline hard-data events',
        'Single-run agent simulations are unstable; ensemble runs improve reliability',
        'Seed quality controls matter as much as the model behind the forecast',
        'Phase gates with scored evidence keep trading decisions disciplined',
        'Track separation is essential because Brier scores must not be blended across test types',
      ],
    },
    problem: 'Can AI simulation-based forecasting beat prediction markets? Prophet measures that question before any capital is at risk.',
    constraints: ['Multi-market scoring (Polymarket + Kalshi)', 'Phase-gated: no trading without scored edge', 'Data leakage guardrails', 'Ensemble stability requirements'],
    decisions: ['MiroFish + DeepSeek V4 Pro simulation engine', 'Brier scoring + false-confidence diagnostics', 'High-divergence guardrails (>0.30 rerun, >0.50 exclude)', 'English-language prompt enforcement'],
    results: '22 events resolved. Market forecasts beat simulation forecasts across the scored Track C set. The parser reached 13/13 success and the phase gate prevented premature trading.',
    artifacts: [
      { label: 'GitHub', type: 'github', href: 'https://github.com/AXRZCE/Prophet' },
    ],
    media: [],
    featured: true,
    color: '#f59e0b',
    outcomes: [
      'Built end-to-end calibration pipeline from market scanning to scored reporting',
      'Validated market efficiency on short-deadline events with 22 resolved Track C markets',
      'Implemented ensemble simulation support with high-divergence guardrails',
      'Designed phase gates that stop trading before scored evidence of edge',
    ],
    metrics: [
      { label: 'Events Resolved', value: '22' },
      { label: 'Parser Success', value: '13/13' },
      { label: 'Markets', value: 'Kalshi + Polymarket' },
    ],
    proof: [
      { type: 'link', label: 'GitHub Repository', href: 'https://github.com/AXRZCE/Prophet' },
    ],
    highlights: [
      'Built calibration framework showing markets beat LLMs on hard-data short-deadline events',
      'Implemented ensemble simulation with divergence guardrails to catch unstable forecasts',
      'Designed phase-gated architecture requiring scored evidence before trading decisions',
    ],
  },
  {
    id: 'axrzce-fund',
    title: 'Multi-Agent Hedge Fund',
    category: 'FinTech / AI',
    year: '2026',
    role: 'AI/FinTech Engineer',
    timeframe: '2 months',
    stack: ['LangGraph', 'CrewAI', 'Python', 'yfinance', 'PostgreSQL', 'FastAPI'],
    context: 'Multi-agent financial research system where specialized agents handle market research, fundamentals, risk, portfolio allocation, and strategy debate. The architecture mirrors how an investment committee builds conviction through multiple perspectives.',
    sections: {
      problem: 'Most AI trading tools rely on one model pass and provide limited reasoning traceability. I wanted a research system where specialized agents debate signals and reconcile conflicting views before producing a recommendation.',
      constraints: [
        'Agents must operate with distinct roles (Research, Fundamentals, Risk, Strategy, Portfolio)',
        'Must include inter-agent debate protocol before trade recommendations',
        'Use real market data via yfinance',
        'Must produce auditable decision trails',
      ],
      decisions: [
        'Used LangGraph for agent orchestration with directed debate graph topology',
        'Used CrewAI for role-based specialization and tool delegation',
        'Designed a debate protocol where Strategy and Analysis agents reconcile conflicting signals before output',
        'Added FastAPI and PostgreSQL for persistence and serving',
      ],
      outcome: 'Functional multi-agent research system producing auditable trade recommendations. Specialized agents debate and reconcile signals before output, giving each recommendation a clearer reasoning trail.',
      learnings: [
        'Multi-agent debate catches errors that single-pass LLM calls miss',
        'LangGraph provides clean state management for complex agent workflows',
        'Role specialization produces richer analysis than a single general-purpose agent',
        'Debate protocols need explicit reconciliation rules so agents resolve conflicts instead of talking past each other',
      ],
    },
    problem: 'Most AI trading tools are single-model black boxes. Real investment decisions need debate across research, fundamentals, risk, and strategy.',
    constraints: ['Distinct agent roles', 'Inter-agent debate protocol', 'Real market data', 'Auditable decision trails'],
    decisions: ['LangGraph orchestration', 'CrewAI role specialization', 'Strategy-Analysis debate protocol', 'FastAPI + PostgreSQL backend'],
    results: 'Functional multi-agent research system with specialized agents, debate protocol, and auditable trade recommendations.',
    artifacts: [
      { label: 'GitHub', type: 'github', href: 'https://github.com/AXRZCE/axrzce' },
    ],
    media: [],
    featured: true,
    color: '#10b981',
    outcomes: [
      'Built multi-agent research system with 5 specialized agent roles',
      'Designed inter-agent debate protocol for signal reconciliation',
      'Produced auditable trade recommendations from multi-perspective analysis',
    ],
    metrics: [
      { label: 'Agents', value: '5 roles' },
      { label: 'Architecture', value: 'LangGraph + CrewAI' },
      { label: 'Data', value: 'yfinance + PostgreSQL' },
    ],
    proof: [
      { type: 'link', label: 'GitHub Repository', href: 'https://github.com/AXRZCE/axrzce' },
    ],
    highlights: [
      'Architected 5-agent committee system mirroring institutional investment workflows',
      'Built debate protocol where Strategy and Analysis agents reconcile conflicting signals',
      'Implemented auditable decision trails for research-to-recommendation traceability',
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
    context: 'Multimodal AI platform that combines text, music, images, links, and real-time data to generate personalized creative outputs. Deployed publicly on Hugging Face Spaces.',
    sections: {
      problem: 'Most AI art tools start from a text prompt, but creative direction often includes references, music, images, links, and context. I built CompI to combine those inputs into one guided generation workflow.',
      constraints: [
        'Must run on free-tier cloud infrastructure (Hugging Face Spaces)',
        'Real-time multimodal fusion across text, image, audio, and links',
        'Outputs must be high-quality and diverse across artistic styles',
      ],
      decisions: [
        'Built on Streamlit for rapid prototyping and deployment',
        'Used PyTorch + Transformers + Diffusers for the generation backbone',
        'Implemented style transfer and user-guided customization modules',
        'Deployed on Hugging Face Spaces for zero-cost public hosting',
      ],
      outcome: 'Fully functional multimodal AI art platform deployed publicly on Hugging Face Spaces. The platform combines text, music, images, links, and real-time data into a guided creative generation pipeline.',
      learnings: [
        'Multimodal fusion increases creative diversity compared with single-prompt generation',
        'Streamlit is strong for rapid AI prototyping and public demos',
        'Hugging Face Spaces provides practical free hosting for demo-quality diffusion workflows',
        'User-guided customization improves output quality because users can steer the creative direction',
      ],
    },
    problem: 'Existing AI art tools are often text-only. Creative work blends music, imagery, links, and context.',
    constraints: ['Free-tier cloud hosting', 'Real-time multimodal fusion', 'High-quality diverse outputs'],
    decisions: ['Streamlit for rapid prototyping', 'PyTorch + Transformers + Diffusers backbone', 'Style transfer + user-guided customization', 'Hugging Face Spaces deployment'],
    results: 'Publicly deployed multimodal AI art platform combining text, music, images, links, and real-time data into guided creative generation.',
    artifacts: [
      { label: 'Live Site', type: 'demo', href: 'https://huggingface.co/spaces/axrzce/Comp-I' },
      { label: 'GitHub', type: 'github', href: 'https://github.com/AXRZCE/Project_CompI' },
      { label: 'Gallery', type: 'link', href: 'https://www.instagram.com/projectcompi?igsh=MTE0bG9ya2drdjFkNw==' },
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
      { type: 'link', label: 'Instagram Gallery', href: 'https://www.instagram.com/projectcompi?igsh=MTE0bG9ya2drdjFkNw==' },
    ],
    highlights: [
      'Fused 5 input modalities into one guided generation workflow',
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
    context: 'A sovereign defence readiness decision-support MVP for ALH Dhruv helicopter AOG (Aircraft on Ground) spares intelligence. Built to help defence logistics teams predict and respond to parts shortages using AI-driven analytics.',
    sections: {
      problem: 'Military helicopter fleets face critical parts shortages that ground aircraft. The ALH Dhruv fleet needed an intelligent system to predict AOG events, prioritize spares procurement, and reduce downtime, while existing tools relied on manual spreadsheets and tribal knowledge.',
      constraints: [
        'MVP must be functional within 3 months',
        'Data must be sovereign with no cloud-only dependencies',
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
        'Defence workflows require extreme data integrity, and every field must be auditable',
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
    featured: false,
    color: '#6366f1',
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
    color: '#d946ef',
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
        'Canada-specific job search requires explicit location filters because many roles are US-remote',
        'Regex-based filtering catches ~80% of mismatches; the rest need LLM-based review',
        'Daily cadence is critical because postings >30 days old have very low response rates',
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
];

// Helper to get featured/top projects
export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getTopProjects = (count = 3) => getFeaturedProjects().slice(0, count);
