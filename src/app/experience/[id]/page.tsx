import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { experiences, getExperienceById } from '@/data/experience';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return experiences.map((exp) => ({
    id: exp.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const exp = getExperienceById(id);

  if (!exp) {
    return { title: 'Experience Not Found' };
  }

  return {
    title: `${exp.role} at ${exp.organization} | Akshar's Portfolio`,
    description: exp.tldr,
  };
}

export default async function ExperiencePage({ params }: PageProps) {
  const { id } = await params;
  const exp = getExperienceById(id);

  if (!exp) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
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
            <span className="text-xs font-mono uppercase tracking-widest text-accent">{exp.organization}</span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/30 dark:text-white/30">·</span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/40 dark:text-white/40">{exp.location}</span>
          </div>
          <h1 className="text-4xl font-sans tracking-tight text-[#1d2433] dark:text-white mb-4">{exp.role}</h1>
          <p className="text-lg leading-relaxed text-[#1d2433]/70 dark:text-white/70">
            {exp.tldr}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-10">
          {/* Left: Story */}
          <div className="space-y-8">
            <Section title="THE SITUATION">
              <p className="text-sm leading-relaxed text-[#1d2433]/80 dark:text-white/80">{exp.context}</p>
            </Section>

            <Section title="WHAT I DID">
              <ul className="space-y-3">
                {exp.whatIDid.map((item, i) => (
                  <li key={i} className="text-sm leading-relaxed text-[#1d2433]/70 dark:text-white/70 flex items-start gap-2">
                    <span className="text-accent mt-1">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="IMPACT">
              <ul className="space-y-2">
                {exp.impact.map((item, i) => (
                  <li key={i} className="text-sm leading-relaxed text-[#1d2433]/70 dark:text-white/70 flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="WHAT I LEARNED">
              <ul className="space-y-2">
                {exp.learned.map((item, i) => (
                  <li key={i} className="text-sm leading-relaxed text-[#1d2433]/70 dark:text-white/70 flex items-start gap-2">
                    <span className="text-[#1d2433]/40 dark:text-white/40 mt-1">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="CHALLENGES I FACED">
              <ul className="space-y-2">
                {exp.challengesFaced.map((item, i) => (
                  <li key={i} className="text-sm leading-relaxed text-[#1d2433]/70 dark:text-white/70 flex items-start gap-2">
                    <span className="text-orange-500 mt-1">⚡</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            {exp.funFact && (
              <Section title="FUN FACT">
                <p className="text-sm leading-relaxed text-[#1d2433]/80 dark:text-white/80 italic">
                  &quot;{exp.funFact}&quot;
                </p>
              </Section>
            )}
          </div>

          {/* Right: Stats */}
          <div className="space-y-6 md:border-l md:border-[#1d2433]/10 dark:md:border-white/10 md:pl-6">
            <StatBlock label="ROLE" value={exp.role} />
            <StatBlock label="TIMEFRAME" value={exp.timeframe} />
            <StatBlock label="LOCATION" value={exp.location} />
            {exp.teamSize && <StatBlock label="TEAM" value={exp.teamSize} />}
            {exp.reportedTo && <StatBlock label="REPORTED TO" value={exp.reportedTo} />}

            {exp.stack.length > 0 && (
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#1d2433]/50 dark:text-white/50 mb-2">TOOLS & TECH</div>
                <div className="flex flex-wrap gap-1.5">
                  {exp.stack.map((tech) => (
                    <span key={tech} className="text-xs font-mono uppercase tracking-widest px-2 py-1 bg-[#f5f5f5] dark:bg-zinc-800/50 text-[#1d2433]/70 dark:text-white/70 rounded-sm">
                      {tech}
                    </span>
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

