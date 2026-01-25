'use client';

export function TopBar() {
  return (
    <header className="h-10 px-4 flex items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
        </div>
        <span className="text-micro text-foreground/70">
          BLACKBOX OS
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-micro text-foreground/40">
          SYS.READY
        </span>
        <span className="text-micro text-foreground/30">
          v1.0.0
        </span>
      </div>
    </header>
  );
}

