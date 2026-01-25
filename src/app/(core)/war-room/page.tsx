import { Metadata } from 'next';
import Link from 'next/link';
import { getTopProjects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'War Room | BLACKBOX OS',
  description: 'Tactical briefing: Top projects, proof of impact, and direct contact.',
};

export default function WarRoomPage() {
  const topProjects = getTopProjects(3);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Identity Header */}
      <header className="border-b border-border/50 py-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-micro uppercase tracking-widest text-foreground/50 mb-2 font-mono">
            {/* Tactical style prefix */}
            {'// WAR ROOM — TACTICAL BRIEFING'}
          </p>
          <h1 className="text-display font-sans font-bold tracking-tight mb-3">
            BLACKBOX<span className="text-accent">_</span>OS
          </h1>
          <p className="text-body text-foreground/70 max-w-xl">
            Product-minded engineer building AI/ML systems, real-time infrastructure, 
            and creative tools. I ship things that work.
          </p>
        </div>
      </header>

      {/* Top 3 Projects */}
      <section className="py-12 px-6 md:px-12 border-b border-border/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-label uppercase tracking-widest text-foreground/50 mb-8 font-mono flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full" />
            TOP PROJECTS
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {topProjects.map((project) => (
              <article
                key={project.id}
                className="group border border-border/50 bg-zinc-900/50 p-6 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-micro uppercase tracking-wider text-accent font-mono">
                    {project.category}
                  </span>
                  <span className="text-micro text-foreground/30">•</span>
                  <span className="text-micro text-foreground/50 font-mono">{project.year}</span>
                </div>
                <h3 className="text-body font-sans font-semibold mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
                  {project.context}
                </p>
                {/* Stack chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-micro px-2 py-0.5 bg-zinc-800 border border-border/30 text-foreground/60 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {/* Outcomes */}
                <ul className="space-y-1.5 mb-5 text-sm text-foreground/70">
                  {project.outcomes.slice(0, 2).map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent mt-1">→</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-border/30">
                  <Link
                    href={`/vault?project=${project.id}`}
                    className="flex-1 text-center text-micro uppercase tracking-wider py-2 border border-accent/50 text-accent hover:bg-accent/10 transition-colors font-mono"
                  >
                    Open in Vault
                  </Link>
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex-1 text-center text-micro uppercase tracking-wider py-2 border border-border/50 text-foreground/70 hover:border-foreground/50 hover:text-foreground transition-colors font-mono"
                  >
                    Case Study
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Proof Strip */}
      <section className="py-10 px-6 md:px-12 border-b border-border/30 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-display font-sans font-bold text-accent">8ms</p>
              <p className="text-micro uppercase tracking-wider text-foreground/50 font-mono">Latency</p>
            </div>
            <div>
              <p className="text-display font-sans font-bold text-accent">50K+</p>
              <p className="text-micro uppercase tracking-wider text-foreground/50 font-mono">Users</p>
            </div>
            <div>
              <p className="text-display font-sans font-bold text-accent">99.7%</p>
              <p className="text-micro uppercase tracking-wider text-foreground/50 font-mono">Uptime</p>
            </div>
            <div>
              <p className="text-display font-sans font-bold text-accent">10x</p>
              <p className="text-micro uppercase tracking-wider text-foreground/50 font-mono">Compression</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-body font-sans font-semibold mb-3">Ready to talk?</h2>
          <p className="text-sm text-foreground/60 mb-8 max-w-md mx-auto">
            I&apos;m open to full-time roles, contract work, and interesting collaborations.
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-block px-8 py-3 bg-accent text-background font-mono text-label uppercase tracking-wider hover:bg-accent/90 transition-colors"
          >
            Get in Touch
          </a>
          {/* Links */}
          <div className="flex justify-center gap-6 mt-8">
            <a href="#" className="text-micro uppercase tracking-wider text-foreground/50 hover:text-accent transition-colors font-mono">
              GitHub
            </a>
            <a href="#" className="text-micro uppercase tracking-wider text-foreground/50 hover:text-accent transition-colors font-mono">
              LinkedIn
            </a>
            <a href="/resume.pdf" className="text-micro uppercase tracking-wider text-foreground/50 hover:text-accent transition-colors font-mono">
              Resume PDF
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 px-6 md:px-12">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-micro text-foreground/40 font-mono">
          <span>© 2025 BLACKBOX_OS</span>
          <Link href="/vault" className="hover:text-accent transition-colors">
            Enter 3D Vault →
          </Link>
        </div>
      </footer>
    </main>
  );
}

