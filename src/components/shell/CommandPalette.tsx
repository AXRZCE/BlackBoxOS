'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useVaultStore } from '@/lib/store';
import { projects } from '@/data/projects';
import { track } from '@/lib/telemetry';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const setSelectedProjectId = useVaultStore((state) => state.setSelectedProjectId);
  const clearSelection = useVaultStore((state) => state.clearSelection);
  const toggleWireframe = useVaultStore((state) => state.toggleWireframe);
  const wireframe = useVaultStore((state) => state.wireframe);
  const wasOpenRef = useRef(false);

  // Track open/close
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      track({ type: 'command_palette_open' });
    } else if (!open && wasOpenRef.current) {
      track({ type: 'command_palette_close' });
    }
    wasOpenRef.current = open;
  }, [open]);

  // Notify keyboard handler about palette state
  useEffect(() => {
    // @ts-expect-error - global for keyboard integration
    if (window.__setCommandPaletteOpen) {
      // @ts-expect-error - global
      window.__setCommandPaletteOpen(open);
    }
  }, [open]);

  // Handle / key to open palette
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger if typing in an input
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    if (e.key === '/') {
      e.preventDefault();
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSelectProject = (projectId: string) => {
    track({ type: 'command_execute', command: `select:${projectId}` });
    setSelectedProjectId(projectId);
    setOpen(false);
  };

  const handleToggleWireframe = () => {
    track({ type: 'command_execute', command: 'toggle_wireframe' });
    track({ type: 'wireframe_toggle', enabled: !wireframe });
    toggleWireframe();
    setOpen(false);
  };

  const handleClearSelection = () => {
    track({ type: 'command_execute', command: 'clear_selection' });
    clearSelection();
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search projects..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem
              key={project.id}
              value={`${project.title} ${project.category}`}
              onSelect={() => handleSelectProject(project.id)}
            >
              <span className="font-medium">{project.title}</span>
              <span className="ml-2 text-foreground/50 text-xs uppercase">
                {project.category}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={handleToggleWireframe}>
            <span>Toggle Wireframe Mode</span>
            <span className="ml-auto text-xs text-foreground/40">
              {wireframe ? 'ON' : 'OFF'}
            </span>
          </CommandItem>
          <CommandItem onSelect={handleClearSelection}>
            <span>Clear Selection</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

