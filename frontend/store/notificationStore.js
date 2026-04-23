import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (note) =>
    set((state) => ({
      notifications: [...state.notifications, note],
    })),
}));