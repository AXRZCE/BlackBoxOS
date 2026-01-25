'use client';

import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/lib/theme-store';
import { applyTheme, getStoredTheme, isHeistUnlocked } from '@/lib/theme';

/**
 * ThemeProvider - Client component that syncs theme state with DOM
 * Mounted in root layout to apply data-theme attribute
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const setHeistUnlocked = useThemeStore((s) => s.setHeistUnlocked);
  const initialized = useRef(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const storedTheme = getStoredTheme();
    const unlocked = isHeistUnlocked();

    setHeistUnlocked(unlocked);
    // Only set heist if unlocked
    if (storedTheme === 'heist' && unlocked) {
      setTheme('heist');
    } else {
      setTheme('blackbox');
    }
  }, [setTheme, setHeistUnlocked]);

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <>{children}</>;
}

