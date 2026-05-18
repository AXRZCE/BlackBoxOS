'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import { useThemeStore } from '@/lib/theme-store';
import { useModeStore } from '@/lib/mode-store';
import { projects } from '@/data/projects';
import { track } from '@/lib/telemetry';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  const setSelectedProjectId = useVaultStore((state) => state.setSelectedProjectId);
  const clearSelection = useVaultStore((state) => state.clearSelection);
  const toggleWireframe = useVaultStore((state) => state.toggleWireframe);
  const wireframe = useVaultStore((state) => state.wireframe);
  const wasOpenRef = useRef(false);

  // Theme state
  const theme = useThemeStore((s) => s.theme);
  const heistUnlocked = useThemeStore((s) => s.heistUnlocked);
  const setTheme = useThemeStore((s) => s.setTheme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const unlockHeist = useThemeStore((s) => s.unlockHeist);

  // Mode state
  const mode = useModeStore((s) => s.mode);
  const overdriveUnlocked = useModeStore((s) => s.overdriveUnlocked);
  const setMode = useModeStore((s) => s.setMode);
  const toggleMode = useModeStore((s) => s.toggleMode);
  const unlockOverdrive = useModeStore((s) => s.unlockOverdrive);
  const triggerGlitch = useModeStore((s) => s.triggerGlitch);

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

  const handleToggleTheme = () => {
    track({ type: 'command_execute', command: 'toggle_theme' });
    toggleTheme();
    track({ type: 'theme_toggle', theme: theme === 'blackbox' ? 'heist' : 'blackbox' });
    setOpen(false);
  };

  const handleSetTheme = (newTheme: 'blackbox' | 'heist') => {
    track({ type: 'command_execute', command: `set_theme:${newTheme}` });
    setTheme(newTheme);
    track({ type: 'theme_toggle', theme: newTheme });
    setOpen(false);
  };

  // Mode handlers
  const handleToggleMode = () => {
    track({ type: 'command_execute', command: 'toggle_mode' });
    toggleMode();
    track({ type: 'mode_change', mode: mode === 'stealth' ? 'overdrive' : 'stealth' });
    setOpen(false);
  };

  const handleSetMode = (newMode: 'stealth' | 'overdrive') => {
    track({ type: 'command_execute', command: `set_mode:${newMode}` });
    setMode(newMode);
    track({ type: 'mode_change', mode: newMode });
    setOpen(false);
  };

  // Hidden unlock commands
  const handleInputChange = (value: string) => {
    setInputValue(value);
    // Check for heist secret command
    if (value.toLowerCase() === 'heist' && !heistUnlocked) {
      unlockHeist();
      track({ type: 'heist_unlocked', source: 'command' });
      setInputValue('');
      setOpen(false);
      return;
    }
    // Check for overdrive secret command
    if (value.toLowerCase() === 'ovrdrv' && !overdriveUnlocked) {
      unlockOverdrive();
      triggerGlitch(300);
      track({ type: 'overdrive_unlocked', source: 'command' });
      track({ type: 'mode_change', mode: 'overdrive' });
      setInputValue('');
      setOpen(false);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search projects..."
        value={inputValue}
        onValueChange={handleInputChange}
      />
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

        <CommandGroup heading="Mode">
          {overdriveUnlocked && (
            <CommandItem onSelect={handleToggleMode}>
              <span>Toggle Mode</span>
              <span className="ml-auto text-xs text-foreground/40 uppercase">
                {mode}
              </span>
            </CommandItem>
          )}
          <CommandItem onSelect={() => handleSetMode('stealth')}>
            <span>Set Mode: STEALTH</span>
            {mode === 'stealth' && (
              <span className="ml-auto text-xs text-accent">●</span>
            )}
          </CommandItem>
          {overdriveUnlocked && (
            <CommandItem onSelect={() => handleSetMode('overdrive')}>
              <span>Set Mode: OVERDRIVE</span>
              {mode === 'overdrive' && (
                <span className="ml-auto text-xs text-accent">●</span>
              )}
            </CommandItem>
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem onSelect={handleToggleTheme}>
            <span>Toggle Theme</span>
            <span className="ml-auto text-xs text-foreground/40 uppercase">
              {theme}
            </span>
          </CommandItem>
          <CommandItem onSelect={() => handleSetTheme('blackbox')}>
            <span>Set Theme: BLACKBOX</span>
            {theme === 'blackbox' && (
              <span className="ml-auto text-xs text-accent">●</span>
            )}
          </CommandItem>
          {heistUnlocked && (
            <CommandItem onSelect={() => handleSetTheme('heist')}>
              <span>Set Theme: HEIST</span>
              {theme === 'heist' && (
                <span className="ml-auto text-xs text-accent">●</span>
              )}
            </CommandItem>
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => {
            track({ type: 'command_execute', command: 'open_war_room' });
            router.push('/war-room');
            setOpen(false);
          }}>
            <span>Open War Room</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            track({ type: 'command_execute', command: 'open_vault' });
            router.push('/vault');
            setOpen(false);
          }}>
            <span>Open Vault</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            track({ type: 'command_execute', command: 'open_boot' });
            router.push('/boot');
            setOpen(false);
          }}>
            <span>Open Boot Screen</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            track({ type: 'command_execute', command: 'open_labs' });
            router.push('/labs');
            setOpen(false);
          }}>
            <span>Open Labs</span>
          </CommandItem>
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
          <CommandItem onSelect={() => {
            track({ type: 'contact_click', channel: 'resume' });
            window.open('/Aksharajsinh_Resume_Product.docx', '_blank');
            setOpen(false);
          }}>
            <span>Open Product / AI Resume</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

