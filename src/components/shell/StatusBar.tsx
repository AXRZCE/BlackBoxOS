'use client';

import { usePathname } from 'next/navigation';
import { useVaultStore } from '@/lib/store';

export function StatusBar() {
  const pathname = usePathname();
  const fps = useVaultStore((state) => state.fps);
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);
  const wireframe = useVaultStore((state) => state.wireframe);
  const qualityPreset = useVaultStore((state) => state.qualityPreset);

  const isVault = pathname === '/vault';

  // Quality indicator color
  const qualityColor = {
    high: 'text-green-400',
    medium: 'text-yellow-400',
    low: 'text-red-400',
  }[qualityPreset];

  return (
    <footer className="h-8 px-4 flex items-center justify-between border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-foreground/50 uppercase tracking-wider">
          {pathname === '/boot' ? 'BOOT' : isVault ? 'VAULT' : 'SYSTEM'}
        </span>
        {isVault && selectedProjectId && (
          <span className="font-mono text-xs text-accent">
            → {selectedProjectId}
          </span>
        )}
        {isVault && wireframe && (
          <span className="font-mono text-xs text-foreground/40">
            [WIREFRAME]
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        {isVault && (
          <>
            <span className={`font-mono text-xs ${qualityColor}`}>
              [{qualityPreset.toUpperCase()}]
            </span>
            <span className="font-mono text-xs text-foreground/30">
              FPS: {fps || '--'}
            </span>
          </>
        )}
        <span className="font-mono text-xs text-foreground/40">
          {isVault ? 'J/K: NAV  /: CMD  ESC: CLOSE' : 'ENTER: OPEN  ESC: CLOSE'}
        </span>
      </div>
    </footer>
  );
}

