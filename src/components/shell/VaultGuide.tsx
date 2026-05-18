'use client';

import { useVaultStore } from '@/lib/store';

/**
 * Guided UI overlay for the Vault experience.
 * Shows navigation hints and interaction prompts.
 * All visibility is derived directly from store state.
 */
export function VaultGuide() {
  const hoverId = useVaultStore((state) => state.hoverId);
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);
  const scrollProgress = useVaultStore((state) => state.scrollProgress);

  // Don't render if project selected
  if (selectedProjectId) {
    return null;
  }

  // Derive visibility from state
  const hasScrolled = scrollProgress > 0.02;
  const isTargeting = hoverId !== null;

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      {/* Main scroll hint - bottom center */}
      {!hasScrolled && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-pulse">
          <div className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">
            Scroll Up to Navigate
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="text-zinc-600 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>
      )}

      {/* Target lock hint - appears when hovering */}
      {isTargeting && !selectedProjectId && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-24">
          <div className="px-4 py-2 bg-black/70 border border-zinc-800 backdrop-blur-sm font-mono text-xs text-zinc-400 uppercase tracking-wider animate-in fade-in duration-300">
            <span className="text-accent">Click</span> to Open Case File
          </div>
        </div>
      )}

      {/* Keyboard shortcuts - bottom right */}
      <div
        className={`absolute bottom-6 right-6 flex flex-col gap-1 font-mono text-[10px] text-zinc-600 transition-opacity duration-500 ${hasScrolled && !selectedProjectId ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex items-center gap-3">
          <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-500">
            J
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-500">
            K
          </kbd>
          <span className="text-zinc-600 ml-1">Navigate</span>
        </div>
        <div className="flex items-center gap-3">
          <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-500">
            /
          </kbd>
          <span className="text-zinc-600 ml-1">Command</span>
        </div>
      </div>

      {/* Scan line effect at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-scan-line" />
    </div>
  );
}

