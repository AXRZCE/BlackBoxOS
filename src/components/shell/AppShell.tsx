'use client';

import { TopBar } from './TopBar';
import { StatusBar } from './StatusBar';
import { HudOverlay } from './HudOverlay';
import { GlitchLayer } from './GlitchLayer';
import { TerminalOverlay } from './TerminalOverlay';
import { WeaponCursor } from './WeaponCursor';
import { HeroMoment } from './HeroMoment';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <TopBar />
      <main className="flex-1 overflow-auto relative">
        {children}
      </main>
      <StatusBar />

      {/* M5 Overlays */}
      <HudOverlay />
      <GlitchLayer />
      <TerminalOverlay />
      <WeaponCursor />
      <HeroMoment />
    </div>
  );
}

