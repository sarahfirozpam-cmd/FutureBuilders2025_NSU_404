import axios from 'axios';
import db from './db';
import { useAppStore } from '../store/useAppStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

class SyncService {
  constructor() {
    this.isSyncing = false;
    this.syncQueue = [];
    this.retryAttempts = 3;
    this.retryDelay = 1000;
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

  // Sync unsynced symptoms
  async syncSymptoms() {
    const { isOnline } = useAppStore.getState();
    if (!isOnline) return;

    try {
      const unsyncedSymptoms = await db.symptoms
        .where('synced')
        .equals(false)
        .toArray();

      for (const symptom of unsyncedSymptoms) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/symptoms`,
            symptom,
            { timeout: 10000 }
          );

          if (response.data.success) {
            await db.symptoms.update(symptom.id, {
              synced: true,
              serverId: response.data.id
            });
          }
        } catch (error) {
          console.error('Failed to sync symptom:', symptom.id, error);
        }
      }
    } catch (error) {
      console.error('Symptom sync error:', error);
    }
  }

  // Sync unsynced vitals
  async syncVitals() {
    const { isOnline } = useAppStore.getState();
    if (!isOnline) return;

    try {
      const unsyncedVitals = await db.vitals
        .where('synced')
        .equals(false)
        .toArray();

      for (const vital of unsyncedVitals) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/vitals`,
            vital,
            { timeout: 10000 }
          );

          if (response.data.success) {
            await db.vitals.update(vital.id, {
              synced: true,
              serverId: response.data.id
            });
          }
        } catch (error) {
          console.error('Failed to sync vital:', vital.id, error);
        }
      }
    } catch (error) {
      console.error('Vitals sync error:', error);
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
  async syncVitalsRecord(vitals) {
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

  // Full sync all pending data
  async syncAll() {
    const { isOnline } = useAppStore.getState();
    if (!isOnline || this.isSyncing) return;

    console.log('Starting full sync...');
    this.isSyncing = true;

    try {
      await Promise.all([
        this.syncConsultations(),
        this.syncSymptoms(),
        this.syncVitals()
      ]);
      console.log('Full sync completed');
    } catch (error) {
      console.error('Full sync error:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // Auto-sync when connection is restored
  startAutoSync() {
    window.addEventListener('online', () => {
      console.log('Connection restored. Starting auto-sync...');
      setTimeout(() => {
        this.syncAll();
      }, 2000);
    });

    // Periodic sync check
    setInterval(() => {
      const { isOnline } = useAppStore.getState();
      if (isOnline) {
        this.syncAll();
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Get sync status
  getSyncStatus() {
    return {
      isSyncing: this.isSyncing,
      queueLength: this.syncQueue.length
    };
  }
}

export const syncService = new SyncService();
