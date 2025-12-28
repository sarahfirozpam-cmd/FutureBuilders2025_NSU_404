import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ruralhealth.example.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response (network error)
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API Service methods
export const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Symptom analysis
  async submitSymptomAnalysis(data) {
    try {
      const response = await api.post('/symptoms', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Vitals
  async submitVitals(data) {
    try {
      const response = await api.post('/vitals', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Consultations
  async createConsultation(data) {
    try {
      const response = await api.post('/consultations', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getConsultations() {
    try {
      const response = await api.get('/consultations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateConsultationStatus(id, status) {
    try {
      const response = await api.patch(`/consultations/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Health content
  async getHealthContent(category = null, language = 'en') {
    try {
      const params = { language };
      if (category) params.category = category;
      const response = await api.get('/content', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async downloadContent(contentId) {
    try {
      const response = await api.get(`/content/${contentId}/download`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // User management
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sync endpoint
  async syncData(data) {
    try {
      const response = await api.post('/sync', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiService;
