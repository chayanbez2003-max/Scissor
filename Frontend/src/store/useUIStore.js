import { create } from 'zustand';

/**
 * Zustand global UI state manager.
 * Tracks sidebar open/close status, dashboard modal toggles, and notification feeds.
 */
export const useUIStore = create((set) => ({
  sidebarOpen: false,
  createModalOpen: false,
  activeTab: 'links', // 'links' | 'analytics' | 'settings'
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebar: (isOpen) => set({ sidebarOpen: isOpen }),
  setCreateModal: (isOpen) => set({ createModalOpen: isOpen }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
