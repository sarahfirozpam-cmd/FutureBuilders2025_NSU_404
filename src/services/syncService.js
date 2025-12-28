import axios from 'axios';
import db from './db';
import { useAppStore } from '../store/useAppStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

class SyncService {
  constructor() {
    this.isSyncing = false;
    this.syncQueue = [];
  }

  // Sync queued consultations when online
  async syncConsultations() {
    if (this.isSyncing) return;
    
    const { isOnline, queuedConsultations, removeConsultation } = useAppStore.getState();
    
    if (!isOnline || queuedConsultations.length === 0) return;

    this.isSyncing = true;

    try {
      for (const consultation of queuedConsultations) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/consultations`,
            consultation,
            { timeout: 10000 }
          );

          if (response.data.success) {
            // Update local database
            await db.consultations.update(consultation.id, {
              synced: true,
              status: 'synced',
              syncedAt: new Date().toISOString()
            });

            // Remove from queue
            removeConsultation(consultation.id);
          }
        } catch (error) {
          console.error('Failed to sync consultation:', consultation.id, error);
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  // Save symptom analysis to server
  async syncSymptomAnalysis(analysis) {
    const { isOnline } = useAppStore.getState();
    
    if (!isOnline) {
      // Save locally
      await db.symptoms.add({
        ...analysis,
        synced: false,
        createdAt: new Date().toISOString()
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/symptoms`,
        analysis,
        { timeout: 10000 }
      );

      await db.symptoms.add({
        ...analysis,
        serverId: response.data.id,
        synced: true,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to sync symptom analysis:', error);
      // Save locally even if sync fails
      await db.symptoms.add({
        ...analysis,
        synced: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  // Save vitals to server
  async syncVitals(vitals) {
    const { isOnline } = useAppStore.getState();
    
    if (!isOnline) {
      await db.vitals.add({
        ...vitals,
        synced: false,
        createdAt: new Date().toISOString()
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/vitals`,
        vitals,
        { timeout: 10000 }
      );

      await db.vitals.add({
        ...vitals,
        serverId: response.data.id,
        synced: true,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to sync vitals:', error);
      await db.vitals.add({
        ...vitals,
        synced: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  // Auto-sync when connection is restored
  startAutoSync() {
    window.addEventListener('online', () => {
      console.log('Connection restored. Starting auto-sync...');
      setTimeout(() => {
        this.syncConsultations();
      }, 2000);
    });
  }
}

export const syncService = new SyncService();