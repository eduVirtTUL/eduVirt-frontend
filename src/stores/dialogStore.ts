import { create } from "zustand";

type Dialog = "createCourse" | "createPool" | "createVlansRange" | "showVnicProfileDetails" | "createClusterMetricValue" | "createVlansRange";

type DialogStore = {
  opened?: Dialog;
  isOpen: (dialog: Dialog) => boolean;
  open: (dialog: Dialog) => void;
  close: () => void;
};

export const useDialog = create<DialogStore>((set, get) => ({
  opened: undefined,
  isOpen: (dialog) => dialog === get().opened,
  open: (dialog) => set({ opened: dialog }),
  close: () => set({ opened: undefined }),
}));
