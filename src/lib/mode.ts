/**
 * BLACKBOX OS Mode System
 * 
 * Operational modes: STEALTH (default) and OVERDRIVE (unlockable)
 */

export type Mode = 'stealth' | 'overdrive';

const MODE_KEY = 'blackbox-mode';
const OVERDRIVE_UNLOCKED_KEY = 'blackbox-overdrive-unlocked';

/**
 * Get stored mode from localStorage
 */
export function getStoredMode(): Mode {
  if (typeof window === 'undefined') return 'stealth';
  const stored = localStorage.getItem(MODE_KEY);
  if (stored === 'overdrive' && isOverdriveUnlocked()) {
    return 'overdrive';
  }
  return 'stealth';
}

/**
 * Set mode in localStorage
 */
export function setStoredMode(mode: Mode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MODE_KEY, mode);
}

/**
 * Check if overdrive is unlocked
 */
export function isOverdriveUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(OVERDRIVE_UNLOCKED_KEY) === 'true';
}

/**
 * Unlock overdrive mode
 */
export function unlockOverdrive(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(OVERDRIVE_UNLOCKED_KEY, 'true');
}

/**
 * Apply mode to DOM (sets data-mode attribute on html element)
 */
export function applyMode(mode: Mode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-mode', mode);
}

