'use client';

import { TopBar } from './TopBar';
import { StatusBar } from './StatusBar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <TopBar />
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
      <StatusBar />
    </div>
  );
}

