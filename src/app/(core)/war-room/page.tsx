import { Metadata } from 'next';
import Link from 'next/link';
import { getTopProjects } from '@/data/projects';
import { MissionChecklist } from '@/components/shell/MissionChecklist';
import { ContactPanel } from '@/components/shell/ContactPanel';
import { MissionTracker } from '@/components/shell/MissionTracker';
import { ContinueButton } from '@/components/shell/ContinueButton';

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
            {'// WAR ROOM — TACTICAL BRIEFING'}
          </p>
          <h1 className="text-display font-sans font-bold tracking-tight mb-3">
            Aksharajsinh<span className="text-accent">.</span>Parmar
          </h1>
          <p className="text-body text-foreground/70 max-w-xl">
            Product-minded AI/ML engineer and builder. I design and ship end-to-end systems — 
            from autonomous AI infrastructure to multimodal creative platforms. 
            Graduating Seneca Polytechnic, April 2026. Open to full-time roles.
          </p>
        </div>
      </header>

      {/* Track war room visit */}
      <MissionTracker event="visited_war_room" />

      {/* Continue from last project */}
      <ContinueButton />

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
              <p className="text-display font-sans font-bold text-accent">9</p>
              <p className="text-micro uppercase tracking-wider text-foreground/50 font-mono">Services Running</p>
            </div>
            <div>
              <p className="text-display font-sans font-bold text-accent">~30%</p>
              <p className="text-micro uppercase tracking-wider text-foreground/50 font-mono">Faster Reviews</p>
            </div>
            <div>
              <p className="text-display font-sans font-bold text-accent">6+</p>
              <p className="text-micro uppercase tracking-wider text-foreground/50 font-mono">Projects Shipped</p>
            </div>
            <div>
              <p className="text-display font-sans font-bold text-accent">4</p>
              <p className="text-micro uppercase tracking-wider text-foreground/50 font-mono">Markets Launched</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact-cta" className="py-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-body font-sans font-semibold mb-3">Let&apos;s build something.</h2>
          <p className="text-sm text-foreground/60 mb-8 max-w-md mx-auto">
            I&apos;m graduating April 2026 and looking for full-time roles in AI/ML engineering, 
            product engineering, or infrastructure. Based in Toronto, open to remote and hybrid.
          </p>
          <ContactPanel />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 px-6 md:px-12">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-micro text-foreground/40 font-mono">
          <span>© 2026 Aksharajsinh Parmar</span>
          <Link href="/vault" className="hover:text-accent transition-colors">
            Enter 3D Vault →
          </Link>
        </div>
      </footer>

      {/* Mission Checklist - floating UI */}
      <MissionChecklist />
    </main>
  );
}

