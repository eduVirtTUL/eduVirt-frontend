import { create } from "zustand";

type ResourceGroupEditorStore = {
  id?: string;
  setId: (id: string) => void;
};

export const useResourceGroupEditorStore = create<ResourceGroupEditorStore>(
  (set) => ({
    id: undefined,
    setId: (id) => set({ id }),
  })
);
