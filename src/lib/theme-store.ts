import { create } from 'zustand';
import type { Theme } from './theme';
import { setStoredTheme, unlockHeist as persistUnlock } from './theme';

interface ThemeState {
  theme: Theme;
  heistUnlocked: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setHeistUnlocked: (unlocked: boolean) => void;
  unlockHeist: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'blackbox',
  heistUnlocked: false,

  setTheme: (theme) => {
    const { heistUnlocked } = get();
    // Only allow heist if unlocked
    if (theme === 'heist' && !heistUnlocked) {
      return;
    }
    set({ theme });
    setStoredTheme(theme);
  },

  toggleTheme: () => {
    const { theme, heistUnlocked } = get();
    if (theme === 'blackbox' && heistUnlocked) {
      set({ theme: 'heist' });
      setStoredTheme('heist');
    } else {
      set({ theme: 'blackbox' });
      setStoredTheme('blackbox');
    }
  },

  setHeistUnlocked: (unlocked) => {
    set({ heistUnlocked: unlocked });
  },

  unlockHeist: () => {
    set({ heistUnlocked: true, theme: 'heist' });
    persistUnlock();
    setStoredTheme('heist');
  },
}));

