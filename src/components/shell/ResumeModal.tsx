'use client';

import { useCallback, useEffect, useState } from 'react';
import { track } from '@/lib/telemetry';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ResumeKey = 'product' | 'fintech';

interface ResumeVariant {
  id: ResumeKey;
  label: string;
  eyebrow: string;
  downloadUrl: string;
  downloadName: string;
  headline: string;
  skills: Array<{ label: string; skills: string }>;
  experience: Array<{
    company: string;
    role: string;
    location: string;
    date: string;
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    stack: string;
    bullets: string[];
  }>;
}

const RESUME_VARIANTS: ResumeVariant[] = [
  {
    id: 'product',
    label: 'Product / AI Analyst',
    eyebrow: 'Product, AI, analytics, and workflow systems',
    downloadUrl: '/Aksharajsinh_Resume_Product.docx',
    downloadName: 'Aksharajsinh_Resume_Product.docx',
    headline:
      'Product & AI Analyst with 1+ year of experience turning workflows into AI-assisted tools, dashboards, and sprint-delivered product features across payments, onboarding, and dispute workflows. Skilled in backlog management, UAT, and data visualization using Power BI, SQL, and Microsoft Fabric. Reduced architecture review cycle time by 30% and supported multi-market product launches across the U.S., Canada, Ghana, and Nigeria.',
    skills: [
      {
        label: 'Product & Analytics',
        skills:
          'Backlog management, user stories, acceptance criteria, UAT/QA, roadmap prioritization, market and competitor research, KPI design, AI-assisted requirements gathering, stakeholder communication, process automation identification',
      },
      {
        label: 'Data & Visualization',
        skills:
          'Power BI, Microsoft Fabric, SQL, Tableau, Snowflake, Databricks, dbt, MongoDB, Excel, Postgres, Redis, Qdrant',
      },
      {
        label: 'AI & Automation',
        skills:
          'LangChain, LangGraph, LLM orchestration, Azure AI Foundry, prompt engineering, RAG, CrewAI, n8n, Power Automate, MCP, agentic AI workflows, AI governance awareness',
      },
      {
        label: 'Languages & Frameworks',
        skills: 'Python, Pandas, NumPy, PyTorch, JavaScript, Java, C++, R, React, Node.js, Streamlit, FastAPI',
      },
      {
        label: 'Developer Tools',
        skills: 'Git/GitHub, Jira, Confluence, Notion, Figma, Miro, Docker, AWS, Azure, Cursor, Claude Code',
      },
    ],
    experience: [
      {
        company: 'Government of Ontario - Enterprise Architecture Office',
        role: 'AI/ML Intern',
        location: 'Toronto, ON',
        date: 'May 2025 - Dec 2025',
        bullets: [
          'Configured Azure AI Foundry models to support drafting, summarization, and structured architecture review inputs inside an internal workflow tool.',
          'Used RAG techniques to ground AI responses in relevant architecture and portfolio context instead of generic model output.',
          'Built Power BI and Microsoft Fabric dashboards for the EAO Director and Application Portfolio team to analyze the software application portfolio across ministries and clusters.',
          'Owned scope, roadmap, Jira backlog, milestones, and release planning with senior architects while staying hands-on with AI and dashboard delivery.',
          'Standardized review artifacts and automated manual handoff steps across 3+ branches, reducing architecture review cycle time by 30%.',
        ],
      },
      {
        company: 'BeautyNBrushes',
        role: 'Product Manager Intern',
        location: 'Toronto, ON',
        date: 'Jan 2026 - Apr 2026',
        bullets: [
          'Supported the BeautyNBrushes 2.0 relaunch across 4 international markets: Canada, the U.S., Ghana, and Nigeria.',
          'Owned backlog refinement for 8+ workflows, including onboarding, booking, payments, tipping, notifications, disputes, and policies.',
          'Led sprint reviews and stakeholder meetings to keep product decisions, open questions, and delivery progress visible.',
          'Acted as APM while the PM was away, helping manage day-to-day product execution and unblock sprint work.',
          'Led UAT and release QA for sprint deliverables, documented defects, validated fixes, and reduced launch risk across two platform experiences.',
          'Onboarded new interns by walking them through product context, team workflows, backlog structure, and release priorities.',
        ],
      },
      {
        company: 'Google Developer Group on Campus',
        role: 'Marketing Lead',
        location: 'Toronto, ON',
        date: 'Jan 2026 - Mar 2026',
        bullets: [
          'Led go-to-market planning for campus events by shaping campaign strategy, managing a monthly content calendar, and coordinating promotion across channels.',
          'Created, edited, and posted social media content with help from AI tools while keeping the voice useful for student developers.',
          'Came up with engagement ideas for events and community posts, then discussed and presented them to the organizing team.',
          'Tracked engagement KPIs and refined messaging, timing, and channel tactics to improve event reach and participation.',
        ],
      },
    ],
    projects: [
      {
        name: 'ClawBotV2',
        stack: 'FastAPI, Docker, OpenClaw, DeepSeek, Redis, Postgres, Qdrant, SearXNG',
        bullets: [
          'Built a self-hosted AI operator running on a Linux cloud VM with OpenClaw as the agent brain for research, workflow execution, and system inspection.',
          'Designed the backend workflow layer using FastAPI, Redis/RQ background jobs, Postgres task history, Qdrant vector memory, and SearXNG web search.',
          'Added Telegram-based remote control and Cloudflare Tunnel access for secure phone-based operation, monitoring, and report delivery.',
        ],
      },
      {
        name: 'Prophet: Simulation Calibrated Prediction Market System',
        stack: 'SQLite/Postgres, Polymarket/Kalshi, MiroFish, Brier scoring, cron jobs',
        bullets: [
          'Built a calibration tool to test whether simulation-based forecasts can outperform prediction markets on narrative-rich events.',
          'Built a validation pipeline covering market scanning, seed generation, simulation runs, probability parsing, forecast logging, resolution tracking, and calibration reporting.',
          'Implemented Brier scoring and false-confidence diagnostics to compare simulation probability, market-implied probability, and actual outcomes.',
        ],
      },
      {
        name: 'CompI: Multimodal Creative AI Platform',
        stack: 'Streamlit, Python, PyTorch, Transformers, Diffusers, APIs',
        bullets: [
          'Built a multimodal AI platform that combines text, images, music, links, and real-time data to generate personalized creative outputs.',
          'Developed text-to-image, style transfer, and user-guided customization workflows using PyTorch, Transformers, and Diffusers.',
          'Designed flexible input workflows that let users guide AI-generated outputs with creative references and contextual data.',
        ],
      },
    ],
  },
  {
    id: 'fintech',
    label: 'Fintech / Data Analyst',
    eyebrow: 'Markets, data systems, research tooling, and analytics',
    downloadUrl: '/Aksharajsinh_Resume_Fintech.docx',
    downloadName: 'Aksharajsinh_Resume_Fintech.docx',
    headline:
      'Fintech & Data Analyst with 1+ year of experience building AI-assisted workflow tools, analytics dashboards, and structured data systems across enterprise and multi-market environments. Focused on public markets, financial data infrastructure, and using Python, SQL, and BI tools to improve research, reporting, and operational workflows. Experienced in stakeholder alignment, process automation, UAT, and delivering measurable efficiency gains.',
    skills: [
      {
        label: 'Finance & Markets',
        skills:
          'Financial data analysis, public markets research, investment research, capital markets and trading operations, risk analysis, forecasting, trend analysis, market data workflows, reconciliation, KPI design',
      },
      {
        label: 'Data & Analytics',
        skills:
          'SQL, Python, Pandas, NumPy, Excel, Power BI, Microsoft Fabric, Tableau, dashboard reporting, data visualization, process automation, statistical analysis',
      },
      {
        label: 'Quant & Research Systems',
        skills:
          'Backtesting, Brier scoring, scenario analysis, probability forecasting, time-series analysis, forecast calibration, signal tracking, model evaluation, research logging, prediction market analysis',
      },
      {
        label: 'AI & Automation',
        skills:
          'Azure AI Foundry, LLM workflows, prompt engineering, RAG, LangChain, LangGraph, CrewAI, n8n, Power Automate, MCP, agentic AI workflows',
      },
      {
        label: 'Programming & Tools',
        skills:
          'Python, SQL, JavaScript, Java, C++, R, PostgreSQL, MS SQL, MongoDB, Redis, Qdrant, FastAPI, Streamlit, Git/GitHub, Docker, Jira, Confluence, Notion, Figma, Miro',
      },
    ],
    experience: [
      {
        company: 'Government of Ontario - Enterprise Architecture Office',
        role: 'AI/ML Intern',
        location: 'Toronto, ON',
        date: 'May 2025 - Dec 2025',
        bullets: [
          'Configured Azure AI Foundry models and used RAG techniques to support drafting, summarization, and structured architecture review inputs.',
          'Built Power BI and Microsoft Fabric dashboards that improved visibility into the software application portfolio across ministries and clusters.',
          'Reduced architecture review cycle time by 30% by standardizing review artifacts and automating manual handoff steps across 3+ branches.',
          'Owned scope, roadmap, Jira backlog, milestones, and release planning with senior architects for an internal AI-assisted workflow tool.',
        ],
      },
      {
        company: 'BeautyNBrushes',
        role: 'Product Manager Intern',
        location: 'Toronto, ON',
        date: 'Jan 2026 - Apr 2026',
        bullets: [
          'Supported the BeautyNBrushes 2.0 relaunch across Canada, the U.S., Ghana, and Nigeria by defining client and provider product workflows.',
          'Owned backlog refinement for 8+ core workflows, including onboarding, booking, payments, tipping, notifications, disputes, and policies.',
          'Led UAT and release QA for sprint deliverables, documented defects, validated fixes, and reduced launch risk for critical features.',
          'Produced market and competitor research across 4 regions to support roadmap decisions, prioritization, and go-to-market planning.',
        ],
      },
      {
        company: 'Google Developer Group on Campus',
        role: 'Marketing Lead',
        location: 'Toronto, ON',
        date: 'Jan 2026 - Mar 2026',
        bullets: [
          'Led go-to-market planning for campus events by building campaign strategy, managing a monthly content calendar, and coordinating promotion across channels.',
          'Created and edited social content with help from AI tools, posted across community channels, and tracked engagement KPIs to improve reach and participation.',
        ],
      },
    ],
    projects: [
      {
        name: 'Prophet: Simulation Calibrated Prediction Market System',
        stack: 'SQLite/Postgres, Polymarket/Kalshi, MiroFish, Brier scoring, cron jobs',
        bullets: [
          'Built a calibration tool to test whether simulation-based forecasts can outperform prediction markets on narrative-rich events.',
          'Built a validation pipeline covering market scanning, seed generation, simulation runs, probability parsing, forecast logging, resolution tracking, and calibration reporting.',
          'Added phase gates that require scored evidence before moving from calibration testing to paper trading.',
        ],
      },
      {
        name: 'axrzce: Multi-Agent Hedge Fund',
        stack: 'LangGraph, CrewAI, Python, yfinance, PostgreSQL, FastAPI',
        bullets: [
          'Built a multi-agent financial research system where specialized agents handle market research, fundamental analysis, risk assessment, portfolio allocation, and strategy debate.',
          'Designed an inter-agent debate protocol where strategy and analysis agents reconcile conflicting signals before generating a trade recommendation.',
          'Modeled the workflow after institutional investment committee decision-making.',
        ],
      },
      {
        name: 'ClawBotV2',
        stack: 'FastAPI, Docker, OpenClaw, DeepSeek, Redis, Postgres, Qdrant, SearXNG',
        bullets: [
          'Built a self-hosted AI operator that runs on a Linux cloud VM and uses OpenClaw as the agent brain for research, workflow execution, and system inspection.',
        ],
      },
    ],
  },
];

const CONTACT_LINKS = [
  { label: 'aksharaj.asp.15@gmail.com', href: 'mailto:aksharaj.asp.15@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aksharajsinh' },
  { label: 'GitHub', href: 'https://github.com/AXRZCE' },
];

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [activeResumeId, setActiveResumeId] = useState<ResumeKey>('product');
  const activeResume = RESUME_VARIANTS.find((resume) => resume.id === activeResumeId) ?? RESUME_VARIANTS[0];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  const handleDownload = useCallback((resume: ResumeVariant) => {
    track({ type: 'contact_click', channel: 'resume' });
    const link = document.createElement('a');
    link.href = resume.downloadUrl;
    link.download = resume.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-5xl h-[90vh] mx-4 bg-white dark:bg-zinc-900 border border-[#1d2433]/20 dark:border-white/20 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#1d2433]/10 dark:border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-widest text-[#1d2433] dark:text-white">Resume</h2>
            <p className="text-xs font-mono text-[#1d2433]/40 dark:text-white/40 mt-1">Choose the version that matches the role</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleDownload(activeResume)} className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-widest bg-accent text-white hover:bg-accent/90 transition-colors">
              Download {activeResume.id === 'product' ? 'Product' : 'Fintech'}
            </button>
            <button onClick={onClose} className="p-2 text-[#1d2433]/50 dark:text-white/50 hover:text-[#1d2433] dark:hover:text-white transition-colors" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-[#1d2433]/10 dark:border-white/10 flex flex-wrap gap-2">
          {RESUME_VARIANTS.map((resume) => (
            <button
              key={resume.id}
              onClick={() => setActiveResumeId(resume.id)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border transition-colors ${
                activeResume.id === resume.id
                  ? 'border-accent bg-accent text-white'
                  : 'border-[#1d2433]/15 dark:border-white/15 text-[#1d2433]/60 dark:text-white/60 hover:border-accent hover:text-accent'
              }`}
            >
              {resume.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-zinc-900">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center border-b border-[#1d2433]/10 dark:border-white/10 pb-6">
              <p className="text-xs font-mono uppercase tracking-widest text-accent mb-3">{activeResume.eyebrow}</p>
              <h1 className="text-3xl font-semibold text-[#1d2433] dark:text-white mb-3">Aksharajsinh Parmar</h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-[#1d2433]/60 dark:text-white/60">
                <span>(+1) 437-473-9736</span>
                {CONTACT_LINKS.map((link) => (
                  <a key={link.href} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="hover:text-accent">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <Section title="SUMMARY">
              <p className="text-sm leading-relaxed text-[#1d2433]/80 dark:text-white/80">{activeResume.headline}</p>
            </Section>

            <Section title="EDUCATION">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <h3 className="font-medium text-[#1d2433] dark:text-white">Seneca Polytechnic</h3>
                  <p className="text-sm text-[#1d2433]/70 dark:text-white/70">Advanced Diploma in Computer Programming & Analysis</p>
                  <p className="text-xs text-[#1d2433]/50 dark:text-white/50 mt-1">Coursework: UNIX/Linux, OOP, Software Testing, Database Services, Web Programming, Mobile App Development, IT Project Management, Software Architecture Design, Data Structures & Algorithms, Computer Vision, Cloud Computing</p>
                </div>
                <span className="text-sm text-[#1d2433]/50 dark:text-white/50">Toronto, ON | Apr 2026</span>
              </div>
            </Section>

            <Section title="SKILLS">
              <div className="grid gap-4 text-sm">
                {activeResume.skills.map((skill) => (
                  <SkillRow key={skill.label} label={skill.label} skills={skill.skills} />
                ))}
              </div>
            </Section>

            <Section title="EXPERIENCE">
              {activeResume.experience.map((item) => (
                <ExperienceItem key={`${activeResume.id}-${item.company}`} {...item} />
              ))}
            </Section>

            <Section title="PROJECTS">
              {activeResume.projects.map((project) => (
                <ProjectItem key={`${activeResume.id}-${project.name}`} {...project} />
              ))}
            </Section>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-[#1d2433]/10 dark:border-white/10 flex items-center justify-between gap-4 flex-wrap flex-shrink-0">
          <span className="text-xs font-mono text-[#1d2433]/40 dark:text-white/40">Press ESC to close</span>
          <div className="flex items-center gap-4">
            {RESUME_VARIANTS.map((resume) => (
              <button key={resume.id} onClick={() => handleDownload(resume)} className="text-xs font-mono text-[#1d2433]/50 dark:text-white/50 hover:text-accent transition-colors">
                Download {resume.id === 'product' ? 'Product / AI' : 'Fintech'} .docx
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-mono uppercase tracking-widest text-accent mb-4 border-b border-accent/30 pb-2">{title}</h2>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function ExperienceItem({ company, role, location, date, bullets }: { company: string; role: string; location: string; date: string; bullets: string[] }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <h3 className="font-medium text-[#1d2433] dark:text-white">{company}</h3>
          <p className="text-sm text-[#1d2433]/70 dark:text-white/70">{role}</p>
        </div>
        <span className="text-sm text-[#1d2433]/50 dark:text-white/50">{location} | {date}</span>
      </div>
      <ul className="space-y-1.5 ml-4">
        {bullets.map((bullet) => (
          <li key={bullet} className="text-sm text-[#1d2433]/80 dark:text-white/80 flex items-start gap-2">
            <span className="text-accent mt-1">*</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SkillRow({ label, skills }: { label: string; skills: string }) {
  return (
    <div className="flex gap-3 flex-wrap sm:flex-nowrap">
      <span className="font-medium text-[#1d2433] dark:text-white min-w-[160px]">{label}:</span>
      <span className="text-[#1d2433]/70 dark:text-white/70">{skills}</span>
    </div>
  );
}

function ProjectItem({ name, stack, bullets }: { name: string; stack: string; bullets: string[] }) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="font-medium text-[#1d2433] dark:text-white">{name}</h3>
        <p className="text-xs text-[#1d2433]/50 dark:text-white/50 mt-1">{stack}</p>
      </div>
      <ul className="space-y-1.5 ml-4">
        {bullets.map((bullet) => (
          <li key={bullet} className="text-sm text-[#1d2433]/80 dark:text-white/80 flex items-start gap-2">
            <span className="text-accent mt-1">*</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
