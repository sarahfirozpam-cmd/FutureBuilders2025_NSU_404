// Storage Service for local storage operations

const STORAGE_PREFIX = 'rural_health_';

export const storageService = {
  // Set item with prefix
  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, serializedValue);
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  },

  // Get item with prefix
  getItem(key) {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },

  // Remove item
  removeItem(key) {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      return true;
    } catch (error) {
      console.error('Storage removeItem error:', error);
      return false;
    }
  },

  // Clear all app-related storage
  clearAll() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Storage clearAll error:', error);
      return false;
    }
  },

  // Get storage usage
  getStorageUsage() {
    try {
      let total = 0;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          total += localStorage.getItem(key).length;
        }
      });
      return {
        used: total,
        usedFormatted: this.formatBytes(total)
      };
    } catch (error) {
      console.error('Storage usage error:', error);
      return { used: 0, usedFormatted: '0 B' };
    }
  },

  // Format bytes to human readable
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // User preferences
  getUserPreferences() {
    return this.getItem('preferences') || {
      language: 'en',
      notifications: true,
      darkMode: false,
      fontSize: 'medium'
    };
  },

  setUserPreferences(preferences) {
    return this.setItem('preferences', preferences);
  },

  // Last sync timestamp
  getLastSyncTime() {
    return this.getItem('last_sync');
  },

  setLastSyncTime() {
    return this.setItem('last_sync', new Date().toISOString());
  },

  // Offline cache management
  cacheForOffline(key, data) {
    return this.setItem(`cache_${key}`, {
      data,
      cachedAt: new Date().toISOString()
    });
  },

  getCachedData(key) {
    const cached = this.getItem(`cache_${key}`);
    if (cached) {
      return cached.data;
    }
    return null;
  },

  // Check if data is stale (older than specified hours)
  isDataStale(key, hours = 24) {
    const cached = this.getItem(`cache_${key}`);
    if (!cached || !cached.cachedAt) return true;
    
    const cachedTime = new Date(cached.cachedAt).getTime();
    const now = new Date().getTime();
    const staleThreshold = hours * 60 * 60 * 1000;
    
    return (now - cachedTime) > staleThreshold;
  }
};

export default storageService;
