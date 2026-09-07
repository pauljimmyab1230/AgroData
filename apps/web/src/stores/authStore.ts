import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: "ADMIN" | "USER";
  activo: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const res = await api.post("/auth/login", { email, password });
          const { user, token } = res.data.data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          set({ user, token, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, token: null });
      },

      loadProfile: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ loading: false });
          return;
        }
        set({ loading: true });
        try {
          const res = await api.get("/auth/profile");
          const user = res.data.data;
          localStorage.setItem("user", JSON.stringify(user));
          set({ user, token, loading: false });
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          set({ user: null, token: null, loading: false });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: "agrodata-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
