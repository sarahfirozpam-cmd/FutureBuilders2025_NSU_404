import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
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
      
      // Vitals history
      vitalsHistory: [],
      addVitalsRecord: (record) => set((state) => ({
        vitalsHistory: [record, ...state.vitalsHistory].slice(0, 100)
      })),
      
      // Queued consultations
      queuedConsultations: [],
      addConsultation: (consultation) => set((state) => ({
        queuedConsultations: [...state.queuedConsultations, consultation]
      })),
      removeConsultation: (id) => set((state) => ({
        queuedConsultations: state.queuedConsultations.filter(c => c.id !== id)
      })),
      
      // Downloaded content
      downloadedContent: [],
      addDownloadedContent: (content) => set((state) => ({
        downloadedContent: [...state.downloadedContent, content]
      })),
      
      // AI models status
      modelsLoaded: false,
      setModelsLoaded: (status) => set({ modelsLoaded: status })
    }),
    {
      name: 'rural-health-storage',
      partialize: (state) => ({
        user: state.user,
        language: state.language,
        symptomsHistory: state.symptomsHistory,
        vitalsHistory: state.vitalsHistory,
        downloadedContent: state.downloadedContent,
        queuedConsultations: state.queuedConsultations
      })
    }
  )
);