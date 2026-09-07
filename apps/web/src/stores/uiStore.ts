import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  modalStack: string[];
  openModal: (id: string) => void;
  closeModal: (id?: string) => void;

  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  modalStack: [],
  openModal: (id) => set((s) => ({ modalStack: [...s.modalStack, id] })),
  closeModal: (id) =>
    set((s) => ({
      modalStack: id ? s.modalStack.filter((m) => m !== id) : [],
    })),

  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));
