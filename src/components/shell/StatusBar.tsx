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

  // Quality indicator styling
  const qualityStyles = {
    high: { color: 'text-green-400', dot: 'bg-green-400' },
    medium: { color: 'text-yellow-400', dot: 'bg-yellow-400' },
    low: { color: 'text-red-400', dot: 'bg-red-400' },
  }[qualityPreset];

  return (
    <footer className="h-8 px-4 flex items-center justify-between border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        {/* Mode indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${qualityStyles.dot}`} />
          <span className="text-micro text-foreground/50">
            {pathname === '/boot' ? 'BOOT' : isVault ? 'VAULT' : 'SYSTEM'}
          </span>
        </div>

        {/* Selection indicator */}
        {isVault && selectedProjectId && (
          <span className="text-micro text-accent">
            ▸ {selectedProjectId}
          </span>
        )}

        {/* Wireframe mode badge */}
        {isVault && wireframe && (
          <span className="text-micro text-foreground/30 border border-foreground/20 px-1.5 py-0.5 rounded-sm">
            WIRE
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isVault && (
          <>
            {/* Quality preset */}
            <span className={`text-micro ${qualityStyles.color}`}>
              {qualityPreset.toUpperCase()}
            </span>

            {/* FPS counter */}
            <span className="text-micro text-foreground/30 tabular-nums">
              {fps || '--'} FPS
            </span>

            {/* Separator */}
            <span className="text-foreground/20">│</span>
          </>
        )}

        {/* Keyboard hints */}
        <span className="text-micro text-foreground/30 hidden sm:inline">
          {isVault ? 'J/K NAV · / CMD · ESC CLOSE' : 'ENTER OPEN · ESC CLOSE'}
        </span>
      </div>
    </footer>
  );
}

