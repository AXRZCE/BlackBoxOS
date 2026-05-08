'use client';

import { useEffect, useCallback, useSyncExternalStore } from 'react';
import { useModeStore } from '@/lib/mode-store';
import { useVaultStore } from '@/lib/store';
import { shouldRunFx } from '@/lib/motion';

const HERO_DURATION = 2000; // 2 seconds

// External state management to comply with React's rules about setState in effects
type HeroState = {
  isShowing: boolean;
  phase: 'line1' | 'line2' | 'fadeout';
};

let heroState: HeroState = { isShowing: false, phase: 'line1' };
const heroListeners = new Set<() => void>();
let phaseTimers: ReturnType<typeof setTimeout>[] = [];

function notifyListeners() {
  heroListeners.forEach(cb => cb());
}

function subscribeHero(callback: () => void) {
  heroListeners.add(callback);
  return () => heroListeners.delete(callback);
}

function getHeroSnapshot(): HeroState {
  return heroState;
}

// Cache the server snapshot to avoid infinite loops in useSyncExternalStore
const SERVER_SNAPSHOT: HeroState = { isShowing: false, phase: 'line1' };

function getServerSnapshot(): HeroState {
  return SERVER_SNAPSHOT;
}

function showHero(dismissCallback: () => void) {
  if (heroState.isShowing) return;

  heroState = { isShowing: true, phase: 'line1' };
  notifyListeners();

  // Clear any existing timers
  phaseTimers.forEach(t => clearTimeout(t));
  phaseTimers = [];

  // Schedule phase transitions
  phaseTimers.push(setTimeout(() => {
    heroState = { ...heroState, phase: 'line2' };
    notifyListeners();
  }, 800));

  phaseTimers.push(setTimeout(() => {
    heroState = { ...heroState, phase: 'fadeout' };
    notifyListeners();
  }, 1600));

  phaseTimers.push(setTimeout(() => {
    dismissCallback();
  }, HERO_DURATION));
}

function hideHero() {
  phaseTimers.forEach(t => clearTimeout(t));
  phaseTimers = [];
  heroState = { isShowing: false, phase: 'line1' };
  notifyListeners();
}

// Subscribe to mode store changes and trigger hero externally
if (typeof window !== 'undefined') {
  useModeStore.subscribe((state, prevState) => {
    if (
      state.mode === 'overdrive' &&
      prevState.mode !== 'overdrive' &&
      !state.heroSeenThisSession
    ) {
      // Check quality after a tick
      setTimeout(() => {
        const quality = useVaultStore.getState().qualityPreset;
        if (shouldRunFx(quality) && !heroState.isShowing) {
          const modeStore = useModeStore.getState();
          const dismiss = () => {
            hideHero();
            modeStore.setHeroSeen();
            modeStore.triggerGlitch(250);
            modeStore.triggerHudFlash(300);
          };
          showHero(dismiss);
        }
      }, 0);
    }
  });
}

/**
 * HeroMoment - Telemetry-style full-screen reveal when entering overdrive
 * Shows once per session, skippable with ESC
 */
export function HeroMoment() {
  const setHeroSeen = useModeStore((s) => s.setHeroSeen);
  const triggerGlitch = useModeStore((s) => s.triggerGlitch);
  const triggerHudFlash = useModeStore((s) => s.triggerHudFlash);

  const { isShowing, phase } = useSyncExternalStore(subscribeHero, getHeroSnapshot, getServerSnapshot);

  const dismiss = useCallback(() => {
    hideHero();
    setHeroSeen();
    triggerGlitch(250);
    triggerHudFlash(300);
  }, [setHeroSeen, triggerGlitch, triggerHudFlash]);

  // ESC to skip
  useEffect(() => {
    if (!isShowing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShowing, dismiss]);

  if (!isShowing) return null;

  return (
    <div 
      className="fixed inset-0 z-[400] flex flex-col items-center justify-center bg-background/95"
      onClick={dismiss}
    >
      {/* Tactical grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(var(--accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--accent) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 scanlines opacity-50" />
      
      {/* Main text */}
      <div className="relative z-10 text-center px-8">
        <div 
          className={`text-4xl md:text-6xl lg:text-8xl font-sans font-bold tracking-tight transition-all duration-500 ${
            phase === 'line1' || phase === 'line2' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ color: 'var(--accent)' }}
        >
          OVERDRIVE
        </div>
        
        <div 
          className={`text-4xl md:text-6xl lg:text-8xl font-sans font-bold tracking-tight mt-4 transition-all duration-500 delay-100 ${
            phase === 'line2' ? 'opacity-100 translate-y-0' : phase === 'fadeout' ? 'opacity-0 translate-y-4' : 'opacity-0 translate-y-8'
          }`}
          style={{ color: 'var(--foreground)' }}
        >
          ALL SYSTEMS ENGAGED
        </div>
      </div>
      
      {/* Skip hint */}
      <div className="absolute bottom-8 text-micro text-foreground/30">
        ESC TO SKIP
      </div>
    </div>
  );
}

