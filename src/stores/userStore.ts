import { create } from "zustand";

type UserStore = {
  id: string;
  name: string;
  roles: Role[];
  activeRole: Role;
  set: (user: { id: string; name: string; roles: Role[] }) => void;
  changeActiveRole: (role: Role) => void;
};

export type Role = "administrator" | "teacher" | "student";

export const useUser = create<UserStore>((set) => ({
  id: "",
  name: "",
  roles: [],
  activeRole: "student",
  set: (user) => set({ ...user }),
  changeActiveRole: (role) => set({ activeRole: role }),
}));
