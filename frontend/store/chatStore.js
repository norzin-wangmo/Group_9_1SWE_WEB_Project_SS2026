import { create } from "zustand";

export const useChatStore = create((set) => ({
  messages: [],

  sendMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),
}));