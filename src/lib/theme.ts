'use client';

export type Theme = 'blackbox' | 'heist';
export type ColorMode = 'light' | 'dark' | 'system';

const THEME_KEY = 'blackbox-theme';
const COLOR_MODE_KEY = 'blackbox-color-mode';
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
 * Get the stored color mode from localStorage
 */
export function getStoredColorMode(): ColorMode {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(COLOR_MODE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'dark';
}

/**
 * Store color mode in localStorage
 */
export function setStoredColorMode(mode: ColorMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COLOR_MODE_KEY, mode);
}

/**
 * Get the system's preferred color scheme
 */
export function getSystemColorMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolve the actual color mode (handles 'system' option)
 */
export function resolveColorMode(mode: ColorMode): 'light' | 'dark' {
  if (mode === 'system') {
    return getSystemColorMode();
  }
  return mode;
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

/**
 * Apply color mode to document
 * Sets both data-mode attribute (for CSS variables) and .dark class (for Tailwind dark: variant)
 */
export function applyColorMode(mode: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-mode', mode);

  // Toggle .dark class for Tailwind's dark: variant
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

