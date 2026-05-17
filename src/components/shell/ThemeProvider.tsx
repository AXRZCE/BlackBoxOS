'use client';

import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/lib/theme-store';
import { applyTheme, applyColorMode, getStoredTheme, getStoredColorMode, isHeistUnlocked, resolveColorMode } from '@/lib/theme';

/**
 * ThemeProvider - Client component that syncs theme state with DOM
 * Mounted in root layout to apply data-theme and data-mode attributes
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const colorMode = useThemeStore((s) => s.colorMode);
  const setTheme = useThemeStore((s) => s.setTheme);
  const setColorMode = useThemeStore((s) => s.setColorMode);
  const setHeistUnlocked = useThemeStore((s) => s.setHeistUnlocked);
  const initialized = useRef(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const storedTheme = getStoredTheme();
    const storedColorMode = getStoredColorMode();
    const unlocked = isHeistUnlocked();

    setHeistUnlocked(unlocked);
    setColorMode(storedColorMode);

    // Only set heist if unlocked
    if (storedTheme === 'heist' && unlocked) {
      setTheme('heist');
    } else {
      setTheme('blackbox');
    }
  }, [setTheme, setColorMode, setHeistUnlocked]);

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Apply color mode to DOM whenever it changes
  // Also listen for system preference changes when in 'system' mode
  useEffect(() => {
    const resolved = resolveColorMode(colorMode);
    applyColorMode(resolved);

    // Listen for system preference changes
    if (colorMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyColorMode(resolveColorMode('system'));
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [colorMode]);

  return <>{children}</>;
}

