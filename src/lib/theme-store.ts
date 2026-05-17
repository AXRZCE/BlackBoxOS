import { create } from 'zustand';
import type { Theme, ColorMode } from './theme';
import { setStoredTheme, setStoredColorMode, unlockHeist as persistUnlock } from './theme';

interface ThemeState {
  theme: Theme;
  colorMode: ColorMode;
  heistUnlocked: boolean;
  setTheme: (theme: Theme) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleTheme: () => void;
  setHeistUnlocked: (unlocked: boolean) => void;
  unlockHeist: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'blackbox',
  colorMode: 'dark',
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

  setColorMode: (mode) => {
    set({ colorMode: mode });
    setStoredColorMode(mode);
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

