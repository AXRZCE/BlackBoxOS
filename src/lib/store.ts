import { create } from 'zustand';
import { projects } from '@/data/projects';

interface VaultState {
  // Selection
  selectedProjectId: string | null;
  hoverId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  setHoverId: (id: string | null) => void;

  // Navigation
  selectNext: () => void;
  selectPrev: () => void;
  clearSelection: () => void;

  // Scroll
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;

  // Wireframe mode
  wireframe: boolean;
  toggleWireframe: () => void;

  // Performance
  fps: number;
  setFps: (fps: number) => void;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  // Selection
  selectedProjectId: null,
  hoverId: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setHoverId: (id) => set({ hoverId: id }),

  // Navigation
  selectNext: () => {
    const { selectedProjectId } = get();
    const currentIndex = projects.findIndex(p => p.id === selectedProjectId);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % projects.length;
    set({ selectedProjectId: projects[nextIndex].id });
  },
  selectPrev: () => {
    const { selectedProjectId } = get();
    const currentIndex = projects.findIndex(p => p.id === selectedProjectId);
    const prevIndex = currentIndex === -1
      ? projects.length - 1
      : (currentIndex - 1 + projects.length) % projects.length;
    set({ selectedProjectId: projects[prevIndex].id });
  },
  clearSelection: () => set({ selectedProjectId: null }),

  // Scroll
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  // Wireframe mode
  wireframe: false,
  toggleWireframe: () => set((state) => ({ wireframe: !state.wireframe })),

  // Performance
  fps: 0,
  setFps: (fps) => set({ fps }),
}));

