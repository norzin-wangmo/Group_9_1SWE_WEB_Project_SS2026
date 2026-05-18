// store/authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,

  // Called after successful login — saves user + token
  login: (userData, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    set({ user: userData, token });
  },

  // Called on app load to restore session from localStorage
  restoreSession: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");
      if (token && userRaw) {
        try {
          const user = JSON.parse(userRaw);
          set({ user, token });
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    set({ user: null, token: null });
  },
}));

export default useAuthStore;