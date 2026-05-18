import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import Link from 'next/link';
import { MissionTracker } from '@/components/shell/MissionTracker';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.title} | Akshar's Portfolio`,
    description: project.context,
    openGraph: {
      title: project.title,
      description: project.context,
      images: [`/api/og?project=${project.id}`],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.context,
      images: [`/api/og?project=${project.id}`],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const artifactIcons: Record<string, string> = {
    link: '🔗',
    github: '⌘',
    demo: '▶',
    paper: '📄',
    docs: '📖',
    video: '🎬',
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Track project view */}
      <MissionTracker event="opened_project" projectId={project.id} />

      {/* Header */}
      <header className="border-b border-[#1d2433]/10 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/war-room" className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/50 dark:text-white/50 hover:text-[#1d2433] dark:hover:text-white transition-colors">
            ← BACK TO WAR ROOM
          </Link>
          <span className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/30 dark:text-white/30">Akshar&apos;s Portfolio</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-accent">{project.category}</span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/30 dark:text-white/30">·</span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/40 dark:text-white/40">{project.year}</span>
          </div>
          <h1 className="text-4xl font-sans tracking-tight text-[#1d2433] dark:text-white mb-4">{project.title}</h1>
          <p className="text-sm leading-relaxed text-[#1d2433]/70 dark:text-white/70 text-lg">
            {project.context}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-10">
          {/* Left: Story */}
          <div className="space-y-8">
            <Section title="PROBLEM">
              <p className="text-sm leading-relaxed text-[#1d2433]/80 dark:text-white/80">{project.sections.problem}</p>
            </Section>

            <Section title="CONSTRAINTS">
              <ul className="space-y-2">
                {project.sections.constraints.map((c, i) => (
                  <li key={i} className="text-sm leading-relaxed text-[#1d2433]/70 dark:text-white/70 flex items-start gap-2">
                    <span className="text-accent mt-1">▸</span>
                    {c}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="KEY DECISIONS">
              <ul className="space-y-2">
                {project.sections.decisions.map((d, i) => (
                  <li key={i} className="text-sm leading-relaxed text-[#1d2433]/70 dark:text-white/70 flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="OUTCOME">
              <p className="text-sm leading-relaxed text-[#1d2433]/80 dark:text-white/80">{project.sections.outcome}</p>
            </Section>

            <Section title="LEARNINGS">
              <ul className="space-y-2">
                {project.sections.learnings.map((l, i) => (
                  <li key={i} className="text-sm leading-relaxed text-[#1d2433]/70 dark:text-white/70 flex items-start gap-2">
                    <span className="text-[#1d2433]/40 dark:text-white/40 mt-1">◆</span>
                    {l}
                  </li>
                ))}
              </ul>
            </Section>

            {/* M6: Proof Section */}
            {project.highlights && project.highlights.length > 0 && (
              <Section title="KEY HIGHLIGHTS">
                <ul className="space-y-2">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="text-sm leading-relaxed text-[#1d2433]/70 dark:text-white/70 flex items-start gap-2">
                      <span className="text-accent mt-1">★</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {project.proof && project.proof.length > 0 && (
              <Section title="PROOF & ARTIFACTS" id="proof-section">
                <div className="flex flex-wrap gap-3">
                  {project.proof.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-[#f5f5f5] dark:bg-zinc-800/50 border border-[#1d2433]/10 dark:border-white/10 text-sm text-[#1d2433]/70 dark:text-white/70 hover:text-accent hover:border-accent/50 transition-colors"
                    >
                      {item.type === 'image' ? '📷' : '🔗'}
                      {item.label}
                    </a>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Right: Stats & Links */}
          <div className="space-y-6 md:border-l md:border-[#1d2433]/10 dark:md:border-white/10 md:pl-6">
            <StatBlock label="TIMEFRAME" value={project.timeframe} />

            {/* M6: Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/50 dark:text-white/50 mb-2">KEY METRICS</div>
                <div className="space-y-2">
                  {project.metrics.map((metric, i) => (
                    <div key={i} className="flex justify-between items-baseline">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/50 dark:text-white/50">{metric.label}</span>
                      <span className="text-sm text-accent font-mono">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* M6: Outcomes */}
            {project.outcomes && project.outcomes.length > 0 && (
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/50 dark:text-white/50 mb-2">OUTCOMES</div>
                <ul className="space-y-1.5">
                  {project.outcomes.map((outcome, i) => (
                    <li key={i} className="text-sm text-[#1d2433]/70 dark:text-white/70 flex items-start gap-2">
                      <span className="text-accent mt-0.5">→</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.stack.length > 0 && (
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/50 dark:text-white/50 mb-2">STACK</div>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono uppercase tracking-widest px-2 py-1 bg-[#f5f5f5] dark:bg-zinc-800/50 text-[#1d2433]/70 dark:text-white/70 rounded-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.artifacts.length > 0 && (
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/50 dark:text-white/50 mb-2">ARTIFACTS</div>
                <div className="space-y-2">
                  {project.artifacts.map((artifact, i) => (
                    <a
                      key={i}
                      href={artifact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-accent hover:underline"
                    >
                      <span>{artifactIcons[artifact.type] || '🔗'}</span>
                      {artifact.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <div id={id}>
      <h2 className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/50 dark:text-white/50 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/50 dark:text-white/50 mb-1">{label}</div>
      <div className="text-sm leading-relaxed text-[#1d2433] dark:text-white">{value}</div>
    </div>
  );
}

