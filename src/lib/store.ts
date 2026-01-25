import { create } from 'zustand';

interface VaultState {
  selectedProjectId: string | null;
  hoverId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  setHoverId: (id: string | null) => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  selectedProjectId: null,
  hoverId: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setHoverId: (id) => set({ hoverId: id }),
}));

