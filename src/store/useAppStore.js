import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      
      // Online status
      isOnline: navigator.onLine,
      setOnlineStatus: (status) => set({ isOnline: status }),
      
      // Language
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      
      // Symptoms history
      symptomsHistory: [],
      addSymptomRecord: (record) => set((state) => ({
        symptomsHistory: [record, ...state.symptomsHistory].slice(0, 50)
      })),
      clearSymptomsHistory: () => set({ symptomsHistory: [] }),
      
      // Vitals history
      vitalsHistory: [],
      addVitalsRecord: (record) => set((state) => ({
        vitalsHistory: [record, ...state.vitalsHistory].slice(0, 100)
      })),
      clearVitalsHistory: () => set({ vitalsHistory: [] }),
      
      // Queued consultations
      queuedConsultations: [],
      addConsultation: (consultation) => set((state) => ({
        queuedConsultations: [...state.queuedConsultations, consultation]
      })),
      removeConsultation: (id) => set((state) => ({
        queuedConsultations: state.queuedConsultations.filter(c => c.id !== id)
      })),
      updateConsultation: (id, updates) => set((state) => ({
        queuedConsultations: state.queuedConsultations.map(c =>
          c.id === id ? { ...c, ...updates } : c
        )
      })),
      clearConsultations: () => set({ queuedConsultations: [] }),
      
      // Downloaded content
      downloadedContent: [],
      addDownloadedContent: (content) => set((state) => ({
        downloadedContent: [...state.downloadedContent, content]
      })),
      removeDownloadedContent: (id) => set((state) => ({
        downloadedContent: state.downloadedContent.filter(c => c.id !== id)
      })),
      
      // AI models status
      modelsLoaded: false,
      setModelsLoaded: (status) => set({ modelsLoaded: status }),
      
      // App settings
      settings: {
        notifications: true,
        autoSync: true,
        darkMode: false,
        fontSize: 'medium'
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      // Loading states
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Error state
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Sync status
      lastSyncTime: null,
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
      isSyncing: false,
      setSyncing: (syncing) => set({ isSyncing: syncing })
    }),
    {
      name: 'rural-health-storage',
      partialize: (state) => ({
        user: state.user,
        language: state.language,
        symptomsHistory: state.symptomsHistory,
        vitalsHistory: state.vitalsHistory,
        downloadedContent: state.downloadedContent,
        queuedConsultations: state.queuedConsultations,
        settings: state.settings,
        lastSyncTime: state.lastSyncTime
      })
    }
  )
);
