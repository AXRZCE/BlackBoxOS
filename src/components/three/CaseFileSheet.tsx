'use client';

import { useEffect, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useVaultStore } from '@/lib/store';
import { projects } from '@/data/projects';

export function CaseFileSheet() {
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);
  const setSelectedProjectId = useVaultStore((state) => state.setSelectedProjectId);

  const project = projects.find((p) => p.id === selectedProjectId);

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
      <SheetContent className="w-[400px] sm:w-[540px] bg-background border-border overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-mono text-xl tracking-tight">
            {project.title}
          </SheetTitle>
          <SheetDescription className="font-mono text-xs text-foreground/50 uppercase tracking-widest">
            {project.category} • {project.year}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <Section title="CONTEXT">
            <p className="text-sm text-foreground/80">{project.context}</p>
          </Section>

          <Separator className="bg-border" />

          <Section title="PROBLEM">
            <p className="text-sm text-foreground/80">{project.problem}</p>
          </Section>

          <Separator className="bg-border" />

          <Section title="CONSTRAINTS">
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              {project.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Section>

          <Separator className="bg-border" />

          <Section title="DECISIONS">
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              {project.decisions.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </Section>

          <Separator className="bg-border" />

          <Section title="RESULTS">
            <p className="text-sm text-foreground/80">{project.results}</p>
          </Section>

          {project.artifacts && project.artifacts.length > 0 && (
            <>
              <Separator className="bg-border" />
              <Section title="ARTIFACTS">
                <div className="flex flex-wrap gap-2">
                  {project.artifacts.map((artifact, i) => (
                    <a
                      key={i}
                      href={artifact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs font-mono bg-accent/10 text-accent hover:bg-accent/20 rounded-sm transition-colors"
                    >
                      {artifact.label}
                    </a>
                  ))}
                </div>
              </Section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-xs text-foreground/50 uppercase tracking-widest mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

