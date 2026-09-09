import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import type { Rol, RolSic } from "@agrodata/types";

// ─── Types ──────────────────────────────────────────────────
export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  rol_sic: RolSic | null;
  activo: boolean;
}

interface AuthApiResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

interface ProfileApiResponse {
  success: boolean;
  data: User;
}

// ─── Store ──────────────────────────────────────────────────
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
    (set) => ({
      user: null,
      token: null,
      loading: false,

      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const res = await api.post<AuthApiResponse>("/auth/login", {
            email,
            password,
          });
          const { user, token } = res.data.data;
          set({ user, token, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("agrodata-auth");
        set({ user: null, token: null });
      },

      loadProfile: async () => {
        set({ loading: true });
        try {
          const res = await api.get<ProfileApiResponse>("/auth/profile");
          const user = res.data.data;
          set({ user, loading: false });
        } catch {
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
