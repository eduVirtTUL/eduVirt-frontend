import { create } from "zustand";

export type DialogType =
  | "editResourceGroupPool"
  | "editResourceGroup"
  | "deleteResourceGroupConfirmation"
  | "editVm"
  | "createResourceGroup"
  | "editCourseMetric"
  | "createCourseMetricValue"
  | "addVmToResourceGroup"
  | "createCourse"
  | "createPool"
  | "createVlansRange"
  | "showVnicProfileDetails"
  | "createMetric"
  | "createClusterMetricValue"
  | "updateClusterMetricValue"
  | "confirmation"
  | "createReservation"
  | "createInterval"
  | "createCourseKey"
  | "showMaintenanceInterval"
  | "manageTeamUsers"

type DialogStore = {
  opened?: DialogType;
  isOpen: (dialog: DialogType) => boolean;
  open: (dialog: DialogType) => void;
  close: () => void;
};

export const useDialog = create<DialogStore>((set, get) => ({
  opened: undefined,
  isOpen: (dialog) => dialog === get().opened,
  open: (dialog) => set({ opened: dialog }),
  close: () => set({ opened: undefined }),
}));
