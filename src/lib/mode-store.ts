import { create } from 'zustand';
import type { Mode } from './mode';
import { setStoredMode, unlockOverdrive as persistUnlock, applyMode } from './mode';

interface ModeState {
  mode: Mode;
  overdriveUnlocked: boolean;
  heroSeenThisSession: boolean;
  
  // Actions
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  unlockOverdrive: () => void;
  setHeroSeen: () => void;
  
  // Glitch system
  glitchUntil: number;
  triggerGlitch: (durationMs?: number) => void;
  
  // HUD flash system
  hudFlashUntil: number;
  triggerHudFlash: (durationMs?: number) => void;
  
  // Transition state for cinematic project selection
  isTransitioning: boolean;
  transitionTargetId: string | null;
  startTransition: (targetId: string) => void;
  endTransition: () => void;
}

export const useModeStore = create<ModeState>((set, get) => ({
  mode: 'stealth',
  overdriveUnlocked: false,
  heroSeenThisSession: false,
  
  setMode: (mode) => {
    const { overdriveUnlocked } = get();
    // Only allow overdrive if unlocked
    if (mode === 'overdrive' && !overdriveUnlocked) {
      return;
    }
    set({ mode });
    setStoredMode(mode);
    applyMode(mode);
  },
  
  toggleMode: () => {
    const { mode, overdriveUnlocked } = get();
    if (mode === 'stealth' && overdriveUnlocked) {
      const newMode = 'overdrive';
      set({ mode: newMode });
      setStoredMode(newMode);
      applyMode(newMode);
    } else {
      set({ mode: 'stealth' });
      setStoredMode('stealth');
      applyMode('stealth');
    }
  },
  
  unlockOverdrive: () => {
    set({ overdriveUnlocked: true, mode: 'overdrive' });
    persistUnlock();
    setStoredMode('overdrive');
    applyMode('overdrive');
  },
  
  setHeroSeen: () => {
    set({ heroSeenThisSession: true });
  },
  
  // Glitch system
  glitchUntil: 0,
  triggerGlitch: (durationMs = 200) => {
    set({ glitchUntil: Date.now() + durationMs });
  },
  
  // HUD flash system
  hudFlashUntil: 0,
  triggerHudFlash: (durationMs = 300) => {
    set({ hudFlashUntil: Date.now() + durationMs });
  },
  
  // Transition state
  isTransitioning: false,
  transitionTargetId: null,
  startTransition: (targetId) => {
    set({ isTransitioning: true, transitionTargetId: targetId });
  },
  endTransition: () => {
    set({ isTransitioning: false, transitionTargetId: null });
  },
}));

