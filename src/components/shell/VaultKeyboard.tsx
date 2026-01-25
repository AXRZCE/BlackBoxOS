'use client';

import { useEffect, useCallback, useState } from 'react';
import { useVaultStore } from '@/lib/store';

/**
 * Handles keyboard navigation for the vault
 * - J: select next project
 * - K: select previous project
 * - Esc: close case file or clear selection
 * - /: open command palette (handled separately)
 */
export function VaultKeyboard() {
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);
  const selectNext = useVaultStore((state) => state.selectNext);
  const selectPrev = useVaultStore((state) => state.selectPrev);
  const clearSelection = useVaultStore((state) => state.clearSelection);
  
  // Track if command palette is open to disable J/K
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Expose setter for command palette state
  useEffect(() => {
    // @ts-expect-error - global for command palette integration
    window.__setCommandPaletteOpen = setCommandPaletteOpen;
    return () => {
      // @ts-expect-error - cleanup
      delete window.__setCommandPaletteOpen;
    };
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't handle if typing in an input
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Don't handle J/K if command palette is open
    if (commandPaletteOpen && (e.key === 'j' || e.key === 'k')) {
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'j':
        e.preventDefault();
        selectNext();
        break;
      case 'k':
        e.preventDefault();
        selectPrev();
        break;
      case 'escape':
        e.preventDefault();
        if (selectedProjectId) {
          clearSelection();
        }
        break;
    }
  }, [selectNext, selectPrev, clearSelection, selectedProjectId, commandPaletteOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null;
}

