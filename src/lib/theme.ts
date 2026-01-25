'use client';

export type Theme = 'blackbox' | 'heist';

const THEME_KEY = 'blackbox-theme';
const HEIST_UNLOCKED_KEY = 'blackbox-heist-unlocked';

/**
 * Get the stored theme from localStorage
 */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'blackbox';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'heist' || stored === 'blackbox') {
    return stored;
  }
  return 'blackbox';
}

/**
 * Store theme in localStorage
 */
export function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Check if Heist mode is unlocked
 */
export function isHeistUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(HEIST_UNLOCKED_KEY) === 'true';
}

/**
 * Unlock Heist mode
 */
export function unlockHeist(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HEIST_UNLOCKED_KEY, 'true');
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
}

