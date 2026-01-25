'use client';

import { usePathname } from 'next/navigation';

export function StatusBar() {
  const pathname = usePathname();

  return (
    <footer className="h-8 px-4 flex items-center justify-between border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-foreground/50 uppercase tracking-wider">
          {pathname === '/boot' ? 'BOOT' : pathname === '/vault' ? 'VAULT' : 'SYSTEM'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-foreground/40">
          ENTER: OPEN &nbsp; ESC: CLOSE
        </span>
      </div>
    </footer>
  );
}

