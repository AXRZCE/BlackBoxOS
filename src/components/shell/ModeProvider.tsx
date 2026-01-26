'use client';

import { useEffect, useRef } from 'react';
import { useModeStore } from '@/lib/mode-store';
import { getStoredMode, isOverdriveUnlocked, applyMode } from '@/lib/mode';
import { terminalLog, LOG_MESSAGES } from '@/lib/terminal';
import { CrosshairCursor } from './CrosshairCursor';

/**
 * ModeProvider - Hydrates mode state from localStorage and applies to DOM
 * Must be rendered as a client component in the root layout
 */
export function ModeProvider({ children }: { children: React.ReactNode }) {
  const prevModeRef = useRef<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const unlocked = isOverdriveUnlocked();
    if (unlocked) {
      useModeStore.setState({ overdriveUnlocked: true });
    }

    const storedMode = getStoredMode();
    useModeStore.setState({ mode: storedMode });
    applyMode(storedMode);
    prevModeRef.current = storedMode;
  }, []);

  // Apply mode changes to DOM and log to terminal
  useEffect(() => {
    const unsubscribe = useModeStore.subscribe((state) => {
      applyMode(state.mode);

      // Log mode change if it changed
      if (prevModeRef.current !== null && prevModeRef.current !== state.mode) {
        if (state.mode === 'overdrive') {
          terminalLog(LOG_MESSAGES.mode_overdrive, 'success');
        } else {
          terminalLog(LOG_MESSAGES.mode_stealth, 'info');
        }
      }
      prevModeRef.current = state.mode;
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <CrosshairCursor />
      {children}
    </>
  );
}

