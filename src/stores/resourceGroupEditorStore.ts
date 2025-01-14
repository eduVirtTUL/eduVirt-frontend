import { create } from "zustand";

type ResourceGroupEditorStore = {
  id?: string;
  etag?: string;
  setId: (id: string) => void;
  setEtag: (etag: string) => void;
};

export const useResourceGroupEditorStore = create<ResourceGroupEditorStore>(
  (set) => ({
    id: undefined,
    etag: undefined,
    setId: (id) => set({ id }),
    setEtag: (etag) => set({ etag }),
  })
);
