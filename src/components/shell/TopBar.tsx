'use client';

import { ThemeToggle } from './ThemeToggle';

export function TopBar() {
  return (
    <header className="h-10 px-4 flex items-center justify-between border-b border-[#1d2433]/10 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60">
      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#1d2433]/20 dark:bg-white/20" />
        </div>
        <span className="text-[10px] uppercase tracking-widest font-mono text-[#1d2433]/70 dark:text-white/70">
          Akshar&apos;s Portfolio
        </span>
      </div>
      <div className="flex items-center gap-4">
        {/* Light/Dark toggle */}
        <ThemeToggle />
        <span className="text-[10px] uppercase tracking-widest font-mono text-[#1d2433]/40 dark:text-white/40 hidden sm:inline">
          SYS.READY
        </span>
        <span className="text-[10px] uppercase tracking-widest font-mono text-[#1d2433]/30 dark:text-white/30 hidden sm:inline">
          v1.0.0
        </span>
      </div>
    </header>
  );
}

