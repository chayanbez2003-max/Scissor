import { create } from 'zustand';
import api, { setAuthToken } from '../services/api';

/**
 * Zustand global URLs and Analytics state store.
 * Manages HTTP communications, loaders, and stores.
 */
export const useUrlStore = create((set, get) => ({
  urls: [],
  summary: {
    totalUrls: 0,
    totalClicks: 0,
    recentClicks: [],
  },
  currentStats: null,
  loading: false,
  error: null,

  // Helper to establish auth header for API calls
  prepareAuth: (token) => {
    setAuthToken(token);
    set({ error: null });
  },

  // Fetch URLs for current logged in user
  fetchUrls: async (token) => {
    get().prepareAuth(token);
    set({ loading: true });
    try {
      const response = await api.get('/urls');
      set({ urls: response.data.data, loading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.error || 'Failed to fetch links list', 
        loading: false 
      });
    }
  },

  // Fetch dashboard summary (aggregates and activity feed)
  fetchSummary: async (token) => {
    get().prepareAuth(token);
    set({ loading: true });
    try {
      const response = await api.get('/analytics/summary');
      set({ summary: response.data.data, loading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.error || 'Failed to load dashboard metrics', 
        loading: false 
      });
    }
  },

  // Fetch click statistics for a specific URL
  fetchUrlStats: async (urlId, token) => {
    get().prepareAuth(token);
    set({ loading: true, currentStats: null });
    try {
      const response = await api.get(`/analytics/${urlId}`);
      set({ currentStats: response.data.data, loading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.error || 'Failed to load link analytics', 
        loading: false 
      });
    }
  },

  // Shorten a new destination URL (accepts optional title and customSlug)
  shortenUrl: async (payload, token) => {
    get().prepareAuth(token);
    set({ loading: true });
    try {
      const response = await api.post('/urls/shorten', payload);
      const newUrl = response.data.data;
      
      // Update local state list dynamically without full refetch
      set((state) => ({
        urls: [newUrl, ...state.urls],
        summary: {
          ...state.summary,
          totalUrls: state.summary.totalUrls + 1,
        },
        loading: false
      }));
      return { success: true, data: newUrl };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 
                       err.response?.data?.errors?.[0]?.msg || 
                       'Failed to shorten link';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // Delete a short link
  deleteUrl: async (id, token) => {
    get().prepareAuth(token);
    set({ loading: true });
    try {
      await api.delete(`/urls/${id}`);
      
      // Update local state list dynamically
      set((state) => {
        const deletedUrl = state.urls.find((u) => u._id === id);
        const subtractedClicks = deletedUrl ? deletedUrl.clickCount : 0;
        return {
          urls: state.urls.filter((u) => u._id !== id),
          summary: {
            ...state.summary,
            totalUrls: Math.max(0, state.summary.totalUrls - 1),
            totalClicks: Math.max(0, state.summary.totalClicks - subtractedClicks),
          },
          loading: false,
        };
      });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete URL';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },
}));
