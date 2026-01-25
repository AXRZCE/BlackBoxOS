'use client';

import { useEffect, useCallback, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useVaultStore } from '@/lib/store';
import { projects } from '@/data/projects';
import type { Artifact } from '@/data/projects';
import { track, createProjectViewTracker } from '@/lib/telemetry';

// Artifact type icons
const artifactIcons: Record<Artifact['type'], string> = {
  link: '🔗',
  github: '⌘',
  demo: '▶',
  paper: '📄',
  docs: '📖',
  video: '🎬',
};

export function CaseFileSheet() {
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);
  const setSelectedProjectId = useVaultStore((state) => state.setSelectedProjectId);
  const viewTrackerRef = useRef<ReturnType<typeof createProjectViewTracker> | null>(null);
  const prevProjectIdRef = useRef<string | null>(null);

  const project = projects.find((p) => p.id === selectedProjectId);

  // Track project open/close
  useEffect(() => {
    if (selectedProjectId && selectedProjectId !== prevProjectIdRef.current) {
      // Project opened
      track({ type: 'project_open', project_id: selectedProjectId });
      viewTrackerRef.current = createProjectViewTracker(selectedProjectId);
    } else if (!selectedProjectId && prevProjectIdRef.current) {
      // Project closed
      viewTrackerRef.current?.complete();
      viewTrackerRef.current = null;
    }
    prevProjectIdRef.current = selectedProjectId;
  }, [selectedProjectId]);

  const handleClose = useCallback(() => {
    setSelectedProjectId(null);
  }, [setSelectedProjectId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  if (!project) return null;

  return (
    <Sheet open={!!selectedProjectId} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="w-[90vw] max-w-[800px] bg-background border-border overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="font-sans text-2xl tracking-tight">
            {project.title}
          </SheetTitle>
          <SheetDescription className="font-mono text-xs text-foreground/50 uppercase tracking-widest">
            {project.category} • {project.year}
          </SheetDescription>
        </SheetHeader>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6 mt-4">
          {/* Left column: Story sections */}
          <div className="space-y-5">
            <Section title="CONTEXT">
              <p className="text-sm text-foreground/80 leading-relaxed">{project.context}</p>
            </Section>

            <Separator className="bg-border/50" />

            <Section title="PROBLEM">
              <p className="text-sm text-foreground/80 leading-relaxed">{project.sections.problem}</p>
            </Section>

            <Separator className="bg-border/50" />

            <Section title="CONSTRAINTS">
              <ul className="space-y-1.5">
                {project.sections.constraints.map((c, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="text-accent mt-1">▸</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Separator className="bg-border/50" />

            <Section title="KEY DECISIONS">
              <ul className="space-y-1.5">
                {project.sections.decisions.map((d, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Separator className="bg-border/50" />

            <Section title="OUTCOME">
              <p className="text-sm text-foreground/80 leading-relaxed">{project.sections.outcome}</p>
            </Section>

            {project.sections.learnings.length > 0 && (
              <>
                <Separator className="bg-border/50" />
                <Section title="LEARNINGS">
                  <ul className="space-y-1.5">
                    {project.sections.learnings.map((l, i) => (
                      <li key={i} className="text-sm text-foreground/70 italic flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">◆</span>
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              </>
            )}
          </div>

          {/* Right column: Stats & Links */}
          <div className="space-y-5 md:border-l md:border-border/50 md:pl-5">
            <StatBlock label="ROLE" value={project.role} />
            <StatBlock label="TIMEFRAME" value={project.timeframe} />

            <div>
              <h4 className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-2">
                STACK
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-foreground/70 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.artifacts.length > 0 && (
              <div>
                <h4 className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-2">
                  ARTIFACTS
                </h4>
                <div className="flex flex-col gap-1.5">
                  {project.artifacts.map((artifact, i) => (
                    <a
                      key={i}
                      href={artifact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-2 py-1.5 text-xs font-mono bg-accent/10 text-accent hover:bg-accent/20 rounded-sm transition-colors border border-accent/20"
                    >
                      <span>{artifactIcons[artifact.type]}</span>
                      <span>{artifact.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-1">
        {label}
      </h4>
      <p className="text-sm font-medium text-foreground/90">{value}</p>
    </div>
  );
}

