import { Metadata } from 'next';
import Link from 'next/link';
import { getExperiences } from '@/data/experience';
import { MissionChecklist } from '@/components/shell/MissionChecklist';
import { ContactPanel } from '@/components/shell/ContactPanel';
import { MissionTracker } from '@/components/shell/MissionTracker';
import { PalantirCard } from '@/components/shell/PalantirCard';

export const metadata: Metadata = {
  title: 'War Room | BLACKBOX OS',
  description: 'Tactical briefing: Work experience, proof of impact, and direct contact.',
};

export default function WarRoomPage() {
  const experiences = getExperiences();

  return (
    <main className="min-h-screen bg-white dark:bg-black text-[#1d2433] dark:text-white">
      {/* Track war room visit */}
      <MissionTracker event="visited_war_room" />

      {/* Minimal Header */}
      <header className="py-6 px-6 md:px-12 border-b border-[#1d2433]/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-mono text-sm text-[#1d2433]/60 dark:text-white/60 hover:text-[#1d2433] dark:hover:text-white transition-colors">
            BLACKBOX<span className="text-accent">_</span>OS
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/vault" className="text-sm text-[#1d2433]/50 dark:text-white/50 hover:text-[#1d2433] dark:hover:text-white transition-colors">
              Vault
            </Link>
            <Link href="/labs" className="text-sm text-[#1d2433]/50 dark:text-white/50 hover:text-[#1d2433] dark:hover:text-white transition-colors">
              Labs
            </Link>
            <Link
              href="#contact"
              className="text-sm px-4 py-2 border border-[#1d2433]/20 dark:border-white/20 hover:border-[#1d2433]/50 dark:hover:border-white/50 transition-colors"
            >
              Get in Touch
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Statement - Palantir style */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-sans font-medium leading-tight tracking-tight max-w-5xl text-[#1d2433] dark:text-white">
            I build systems that power real-time,{' '}
            <span className="text-accent">AI-driven</span> decisions
            in production environments—from neural interfaces to distributed databases.
          </h1>
        </div>
      </section>

      {/* Experience Section - Palantir style */}
      <section className="border-t border-[#1d2433]/20 dark:border-white/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <h2 className="text-lg md:text-xl font-sans text-[#1d2433]/60 dark:text-white/60 mb-4">
            Experience
          </h2>
        </div>

        {/* Experience Cards */}
        {experiences.map((exp, index) => (
          <PalantirCard
            key={exp.id}
            index={index + 1}
            title={exp.role}
            subtitle={`${exp.organization} • ${exp.timeframe}`}
            description={exp.tldr}
            href={`/experience/${exp.id}`}
          />
        ))}

        {/* View Projects Link */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 border-b border-[#1d2433]/20 dark:border-white/20">
          <Link
            href="/vault"
            className="inline-flex items-center gap-2 text-sm text-[#1d2433]/50 dark:text-white/50 hover:text-accent transition-colors group"
          >
            <span>View all projects in 3D Vault</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* Metrics Section - Palantir style */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg md:text-xl font-sans text-[#1d2433]/60 dark:text-white/60 mb-16">
            Impact Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
            <div className="space-y-2">
              <p className="text-4xl md:text-6xl font-sans font-medium tracking-tight text-[#1d2433] dark:text-white">8ms</p>
              <p className="text-sm text-[#1d2433]/40 dark:text-white/40">Average latency</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-6xl font-sans font-medium tracking-tight text-[#1d2433] dark:text-white">50K+</p>
              <p className="text-sm text-[#1d2433]/40 dark:text-white/40">Users served</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-6xl font-sans font-medium tracking-tight text-[#1d2433] dark:text-white">99.7%</p>
              <p className="text-sm text-[#1d2433]/40 dark:text-white/40">System uptime</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-6xl font-sans font-medium tracking-tight text-[#1d2433] dark:text-white">10x</p>
              <p className="text-sm text-[#1d2433]/40 dark:text-white/40">Compression ratio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Palantir style */}
      <section id="contact" className="py-20 md:py-32 px-6 md:px-12 border-t border-[#1d2433]/20 dark:border-white/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-sans font-medium tracking-tight mb-6 text-[#1d2433] dark:text-white">
                Let&apos;s build something together.
              </h2>
              <p className="text-[#1d2433]/50 dark:text-white/50 leading-relaxed max-w-md">
                I&apos;m open to full-time roles, contract work, and interesting collaborations.
                Currently based in Toronto, ON and available for remote work.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <ContactPanel />
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-8 px-6 md:px-12 border-t border-[#1d2433]/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#1d2433]/30 dark:text-white/30">
          <span className="font-mono">© 2025 BLACKBOX_OS</span>
          <div className="flex items-center gap-6">
            <Link href="/vault" className="hover:text-[#1d2433] dark:hover:text-white transition-colors">
              3D Vault
            </Link>
            <Link href="/labs" className="hover:text-[#1d2433] dark:hover:text-white transition-colors">
              Labs
            </Link>
            <Link href="/boot" className="hover:text-[#1d2433] dark:hover:text-white transition-colors">
              Boot
            </Link>
          </div>
        </div>
      </footer>

      {/* Mission Checklist - floating UI */}
      <MissionChecklist />
    </main>
  );
}

