import { create } from "zustand";

type Dialog =
  | "createResourceGroup"
  | "editCourseMetric"
  | "createCourseMetricValue"
  | "addVmToResourceGroup"
  | "createCourse"
  | "createPool"
  | "createVlansRange"
  | "showVnicProfileDetails"
  | "createClusterMetricValue"
  | "confirmation"
  | "createReservation"
  | "createInterval";

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
