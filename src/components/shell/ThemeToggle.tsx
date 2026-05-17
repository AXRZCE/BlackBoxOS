'use client';

import { useThemeStore } from '@/lib/theme-store';
import type { ColorMode } from '@/lib/theme';
import { useSyncExternalStore } from 'react';

// Use useSyncExternalStore to safely access client-only state
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

const modes: { value: ColorMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
];

/**
 * ThemeToggle - Light/System/Dark mode toggle with segmented control UI
 * Matches Palantir's design language
 */
export function ThemeToggle() {
  const colorMode = useThemeStore((s) => s.colorMode);
  const setColorMode = useThemeStore((s) => s.setColorMode);
  const isMounted = useIsMounted();

  // Show placeholder on server to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center border border-border/50 rounded-sm overflow-hidden">
        {modes.map((mode) => (
          <div key={mode.value} className="px-2 py-1 text-micro text-foreground/40">
            {mode.label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center border border-border/50 rounded-sm overflow-hidden">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => setColorMode(mode.value)}
          className={`px-2 py-1 text-micro transition-all duration-200 ${
            colorMode === mode.value
              ? 'bg-foreground text-background font-medium'
              : 'bg-transparent text-foreground/60 hover:text-foreground/80'
          }`}
          aria-pressed={colorMode === mode.value}
          aria-label={`Switch to ${mode.label.toLowerCase()} mode`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

