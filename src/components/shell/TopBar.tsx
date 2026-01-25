'use client';

export function TopBar() {
  return (
    <header className="h-10 px-4 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="font-mono text-xs text-foreground/70 tracking-widest uppercase">
          BLACKBOX OS
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-foreground/50">
          v1.0.0
        </span>
      </div>
    </header>
  );
}

