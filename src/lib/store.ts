import { create } from 'zustand';
import { projects } from '@/data/projects';
import type { QualityPreset } from './device';

interface VaultState {
  // Selection
  selectedProjectId: string | null;
  hoverId: string | null;
  hoverWorldPos: [number, number, number] | null;
  hoverScreenPos: { x: number; y: number } | null;
  setSelectedProjectId: (id: string | null) => void;
  setHoverId: (id: string | null) => void;
  setHoverWorldPos: (pos: [number, number, number] | null) => void;
  setHoverScreenPos: (pos: { x: number; y: number } | null) => void;
  setHoverTarget: (id: string | null, worldPos: [number, number, number] | null) => void;

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

  // Quality preset
  qualityPreset: QualityPreset;
  setQualityPreset: (preset: QualityPreset) => void;

  // Mobile project list
  mobileListOpen: boolean;
  setMobileListOpen: (open: boolean) => void;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  // Selection
  selectedProjectId: null,
  hoverId: null,
  hoverWorldPos: null,
  hoverScreenPos: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setHoverId: (id) => set({ hoverId: id }),
  setHoverWorldPos: (pos) => set({ hoverWorldPos: pos }),
  setHoverScreenPos: (pos) => set({ hoverScreenPos: pos }),
  setHoverTarget: (id, worldPos) => set({
    hoverId: id,
    hoverWorldPos: worldPos,
    // Clear screen pos when target changes; ReticleBridge will update it
    hoverScreenPos: worldPos ? get().hoverScreenPos : null,
  }),

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

  // Quality preset
  qualityPreset: 'high',
  setQualityPreset: (preset) => set({ qualityPreset: preset }),

  // Mobile project list
  mobileListOpen: false,
  setMobileListOpen: (open) => set({ mobileListOpen: open }),
}));

