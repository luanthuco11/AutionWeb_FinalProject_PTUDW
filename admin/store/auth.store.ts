import { create } from "zustand";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;

  mockLogin: () => void;
  mockLogout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: {
    id: "1",
    email: "mock@example.com",
  },
  setUser: (user) => set({ user }),

  mockLogin: () =>
    set({
      user: {
        id: "1",
        email: "mock@example.com",
      },
    }),
  mockLogout: () => set({ user: null }),
}));
