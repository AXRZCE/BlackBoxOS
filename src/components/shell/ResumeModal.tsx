'use client';

import { useEffect, useCallback } from 'react';
import { track } from '@/lib/telemetry';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RESUME_URL = '/AksharajsinhResume.docx';

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
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

  const handleDownload = () => {
    track({ type: 'contact_click', channel: 'resume' });
    const link = document.createElement('a');
    link.href = RESUME_URL;
    link.download = 'Aksharajsinh_Parmar_Resume.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl h-[90vh] mx-4 bg-white dark:bg-zinc-900 border border-[#1d2433]/20 dark:border-white/20 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1d2433]/10 dark:border-white/10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-mono uppercase tracking-widest text-[#1d2433] dark:text-white">Resume</h2>
            <span className="text-xs font-mono text-[#1d2433]/40 dark:text-white/40">Aksharajsinh Parmar</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-widest bg-accent text-white hover:bg-accent/90 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button onClick={onClose} className="p-2 text-[#1d2433]/50 dark:text-white/50 hover:text-[#1d2433] dark:hover:text-white transition-colors" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-zinc-900">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Name & Contact */}
            <div className="text-center border-b border-[#1d2433]/10 dark:border-white/10 pb-6">
              <h1 className="text-3xl font-semibold text-[#1d2433] dark:text-white mb-3">Aksharajsinh Parmar</h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-[#1d2433]/60 dark:text-white/60">
                <span>(+1) 437-473-9736</span>
                <span>•</span>
                <a href="mailto:aksharaj.asp.15@gmail.com" className="hover:text-accent">aksharaj.asp.15@gmail.com</a>
                <span>•</span>
                <a href="https://www.linkedin.com/in/aksharajsinh" target="_blank" rel="noopener noreferrer" className="hover:text-accent">LinkedIn</a>
                <span>•</span>
                <a href="https://github.com/AXRZCE" target="_blank" rel="noopener noreferrer" className="hover:text-accent">GitHub</a>
              </div>
            </div>

            {/* Education */}
            <Section title="EDUCATION">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[#1d2433] dark:text-white">Seneca Polytechnic</h3>
                  <p className="text-sm text-[#1d2433]/70 dark:text-white/70">Advanced Diploma (3-yr), Computer Programming and Analysis</p>
                </div>
                <span className="text-sm text-[#1d2433]/50 dark:text-white/50">Toronto, ON | April 2026</span>
              </div>
            </Section>

            {/* Experience */}
            <Section title="EXPERIENCE">
              <ExperienceItem
                company="Government of Ontario"
                role="AI/ML Intern"
                location="Toronto, ON"
                date="May 2025 - Dec 2025"
                bullets={[
                  "Product Strategy & Roadmapping: Led the initiative as product owner, owned scope, roadmap, and Jira backlog for an internal AI-assisted architecture workflow tool; defined milestones, success criteria, and release plan with senior architects.",
                  "Process Improvement: Standardized review artifacts and automated manual steps, cutting architecture review cycle time by ~30% and removing multiple handoffs across branches.",
                  "Data-Driven Delivery: Built a leadership dashboard in Power BI / Microsoft Fabric to centralize application portfolios and software tools across clusters, improving visibility for governance and decision-making.",
                  "AI Product Integration: Designed and integrated an Azure AI Foundry model to support drafting, summarizing, and structuring architecture inputs inside the tool.",
                  "Stakeholder Management: Ran demos and feedback loops with architecture leadership; translated requirements into tickets, validated outputs, and supported adoption with documentation and training."
                ]}
              />
              <ExperienceItem
                company="BeautyNBrushes"
                role="Product Manager Intern"
                location="Toronto, ON"
                date="Jan 2026 – Apr 2026"
                bullets={[
                  "Backlog Management: Wrote and refined user stories, acceptance criteria, and priorities for a relaunch across client and provider flows (signup, profiles, booking, payments, notifications).",
                  "Quality & Release Execution: Owned UAT/QA for sprint deliverables; logged actionable defects with clear repro steps, validated fixes, and reduced release risk for launch-critical features.",
                  "Competitive & Market Research: Produced competitor teardown and positioning insights to inform feature prioritization and go-to-market messaging."
                ]}
              />
              <ExperienceItem
                company="Google Developer Group on Campus"
                role="Marketing Lead"
                location="Toronto, ON"
                date="Jan 2026 – Mar 2026"
                bullets={[
                  "Go-to-Market: Planned and executed event campaigns (positioning, content, launch timeline, and community promotion) to drive RSVPs and attendance.",
                  "Growth Ops: Built a monthly content calendar and tracked engagement signals to iterate on channel strategy and improve reach."
                ]}
              />
            </Section>

            {/* Skills */}
            <Section title="SKILLS">
              <div className="grid gap-4 text-sm">
                <SkillRow label="Product" skills="PRDs, problem framing, roadmap & prioritization, user stories & acceptance criteria, stakeholder management, discovery interviews, UAT/QA, launch readiness, Pendo, Qualtrics" />
                <SkillRow label="Data & Analytics" skills="Power BI, Microsoft Fabric, SQL (MS SQL/Postgres), KPI design, dashboards & semantic models, experimentation basics, Tableau" />
                <SkillRow label="Tools" skills="Jira, Notion, Figma, Confluence/Miro, Git/GitHub" />
                <SkillRow label="Programming & Technical" skills="Python (Pandas, NumPy, OpenCV), Java, JavaScript, C++, C, R, React, Node.js/Express, Streamlit, XML, Kotlin, Claude Code, Cursor, MCP, Figma, Android Studio, Blender, LangChain" />
              </div>
            </Section>

            {/* Projects */}
            <Section title="PROJECTS">
              <ProjectItem
                name="ClawBotV2 — Self-Hosted Autonomous AI Operator"
                bullets={[
                  "Built a self-hosted AI operator running on Linux cloud VM using OpenClaw as the agent brain for research, workflow execution, and system inspection.",
                  "Designed backend workflow layer: FastAPI, Redis/RQ background jobs, Postgres task history, Qdrant vector memory, SearXNG web search — 9-container Docker stack.",
                  "Added Telegram-based remote control and Cloudflare Tunnel access for secure phone-based operation, monitoring, and report delivery."
                ]}
              />
              <ProjectItem
                name="Prophet — Simulation-Calibrated Prediction Market System"
                bullets={[
                  "Built a calibration tool testing whether AI simulation-based forecasts can outperform prediction markets, using Brier scores and false-confidence diagnostics.",
                  "Built a full validation pipeline: market scanning → seed generation → simulation runs → probability parsing → forecast logging → resolution tracking → calibration reporting.",
                  "Resolved 22 Track C events; market Brier scores beat simulation scores — proving the framework works and preventing premature trading."
                ]}
              />
              <ProjectItem
                name="CompI — Multimodal Creative AI Platform"
                bullets={[
                  "Developed a multimodal AI platform that combines text, music, images, links, and real-time data to generate personalized creative outputs.",
                  "Built generation workflows for text-to-image, style transfer, and user-guided customization using PyTorch, Transformers, and Diffusers.",
                  "Deployed publicly on Hugging Face Spaces; designed flexible input workflows where users guide AI-generated outputs using creative references."
                ]}
              />
            </Section>

            {/* Certifications */}
            <Section title="CERTIFICATIONS">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#1d2433] dark:text-white">Professional Scrum Product Owner (PSPO I)</span>
                  <span className="text-[#1d2433]/50 dark:text-white/50 text-xs">Scrum.org • In Progress</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#1d2433] dark:text-white">Product Management Certification</span>
                  <span className="text-[#1d2433]/50 dark:text-white/50 text-xs">Pragmatic Institute • In Progress</span>
                </div>
              </div>
            </Section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1d2433]/10 dark:border-white/10 flex items-center justify-between flex-shrink-0">
          <span className="text-xs font-mono text-[#1d2433]/40 dark:text-white/40">Press ESC to close</span>
          <button onClick={handleDownload} className="text-xs font-mono text-[#1d2433]/50 dark:text-white/50 hover:text-accent transition-colors">
            Download .docx →
          </button>
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
        {bullets.map((bullet, i) => (
          <li key={i} className="text-sm text-[#1d2433]/80 dark:text-white/80 flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SkillRow({ label, skills }: { label: string; skills: string }) {
  return (
    <div className="flex gap-3">
      <span className="font-medium text-[#1d2433] dark:text-white min-w-[120px]">{label}:</span>
      <span className="text-[#1d2433]/70 dark:text-white/70">{skills}</span>
    </div>
  );
}

function ProjectItem({ name, bullets }: { name: string; bullets: string[] }) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-[#1d2433] dark:text-white">{name}</h3>
      <ul className="space-y-1.5 ml-4">
        {bullets.map((bullet, i) => (
          <li key={i} className="text-sm text-[#1d2433]/80 dark:text-white/80 flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
