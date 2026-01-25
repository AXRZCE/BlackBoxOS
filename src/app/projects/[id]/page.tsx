import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import Link from 'next/link';

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
    title: `${project.title} | BLACKBOX OS`,
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/vault" className="text-micro text-foreground/50 hover:text-foreground">
            ← BACK TO VAULT
          </Link>
          <span className="text-micro text-foreground/30">BLACKBOX OS</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-micro text-accent">{project.category}</span>
            <span className="text-micro text-foreground/30">·</span>
            <span className="text-micro text-foreground/40">{project.year}</span>
          </div>
          <h1 className="text-display text-foreground mb-4">{project.title}</h1>
          <p className="text-body text-foreground/70 text-lg leading-relaxed">
            {project.context}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-10">
          {/* Left: Story */}
          <div className="space-y-8">
            <Section title="PROBLEM">
              <p className="text-body text-foreground/80">{project.sections.problem}</p>
            </Section>

            <Section title="CONSTRAINTS">
              <ul className="space-y-2">
                {project.sections.constraints.map((c, i) => (
                  <li key={i} className="text-body text-foreground/70 flex items-start gap-2">
                    <span className="text-accent mt-1">▸</span>
                    {c}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="KEY DECISIONS">
              <ul className="space-y-2">
                {project.sections.decisions.map((d, i) => (
                  <li key={i} className="text-body text-foreground/70 flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="OUTCOME">
              <p className="text-body text-foreground/80">{project.sections.outcome}</p>
            </Section>

            <Section title="LEARNINGS">
              <ul className="space-y-2">
                {project.sections.learnings.map((l, i) => (
                  <li key={i} className="text-body text-foreground/70 flex items-start gap-2">
                    <span className="text-foreground/40 mt-1">◆</span>
                    {l}
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          {/* Right: Stats & Links */}
          <div className="space-y-6 md:border-l md:border-border/30 md:pl-6">
            <StatBlock label="ROLE" value={project.role} />
            <StatBlock label="TIMEFRAME" value={project.timeframe} />

            {project.stack.length > 0 && (
              <div>
                <div className="text-micro text-foreground/50 mb-2">STACK</div>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-micro px-2 py-1 bg-secondary/50 text-foreground/70 rounded-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.artifacts.length > 0 && (
              <div>
                <div className="text-micro text-foreground/50 mb-2">ARTIFACTS</div>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-label text-foreground/50 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-micro text-foreground/50 mb-1">{label}</div>
      <div className="text-body text-foreground">{value}</div>
    </div>
  );
}

