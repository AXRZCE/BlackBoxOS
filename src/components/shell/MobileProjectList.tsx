'use client';

import { useState, useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useVaultStore } from '@/lib/store';
import { projects } from '@/data/projects';

export function MobileProjectList() {
  const mobileListOpen = useVaultStore((state) => state.mobileListOpen);
  const setMobileListOpen = useVaultStore((state) => state.setMobileListOpen);
  const setSelectedProjectId = useVaultStore((state) => state.setSelectedProjectId);
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);
  
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects by search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setMobileListOpen(false);
  };

  return (
    <Sheet open={mobileListOpen} onOpenChange={setMobileListOpen}>
      <SheetContent side="bottom" className="h-[70vh] bg-zinc-950 border-zinc-800">
        <SheetHeader className="pb-2">
          <SheetTitle className="font-heading text-foreground">
            PROJECT ARCHIVE
          </SheetTitle>
          <SheetDescription className="font-mono text-xs text-zinc-500">
            {projects.length} PROJECTS INDEXED
          </SheetDescription>
        </SheetHeader>

        {/* Search input */}
        <div className="px-4 pb-3">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 
                       font-mono text-sm text-foreground placeholder:text-zinc-600
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
                className={`w-full text-left p-3 rounded border transition-colors
                  ${
                    selectedProjectId === project.id
                      ? 'bg-blue-500/10 border-blue-500/50'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading text-sm text-foreground">
                    {project.title}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">
                    {project.year}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-blue-400 uppercase">
                    {project.category}
                  </span>
                  <span className="font-mono text-xs text-zinc-600">
                    [{project.id}]
                  </span>
                </div>
              </button>
            ))}

            {filteredProjects.length === 0 && (
              <div className="text-center py-8 text-zinc-600 font-mono text-sm">
                NO MATCHING PROJECTS
              </div>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-zinc-800">
          <p className="font-mono text-xs text-zinc-600 text-center">
            TAP PROJECT TO VIEW CASE FILE
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

