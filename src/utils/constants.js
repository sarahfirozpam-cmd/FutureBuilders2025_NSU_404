// Application Constants

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ruralhealth.bd';
export const API_TIMEOUT = 30000; // 30 seconds

// Model Configuration
export const MODEL_PATHS = {
  symptomAnalyzer: '/models/symptom-analyzer/model.json',
  vitalsPredictor: '/models/vitals-predictor/model.json'
};

// Sync Configuration
export const SYNC_INTERVAL = 30000; // 30 seconds
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 5000; // 5 seconds

// Vitals Thresholds
export const VITALS_THRESHOLDS = {
  bloodPressure: {
    systolic: {
      low: 90,
      normalMin: 90,
      normalMax: 120,
      elevated: 130,
      high: 140,
      crisis: 180
    },
    diastolic: {
      low: 60,
      normalMin: 60,
      normalMax: 80,
      elevated: 85,
      high: 90,
      crisis: 120
    }
  },
  pulse: {
    low: 60,
    normalMin: 60,
    normalMax: 100,
    high: 100,
    veryHigh: 120
  },
  temperature: {
    hypothermia: 35.0,
    low: 36.0,
    normalMin: 36.1,
    normalMax: 37.2,
    lowFever: 37.5,
    fever: 38.0,
    highFever: 39.0,
    dangerous: 40.0
  }
};

// Triage Levels
export const TRIAGE_LEVELS = {
  URGENT: 'urgent',
  SOON: 'soon',
  SELF_CARE: 'self-care'
};

// Risk Levels
export const RISK_LEVELS = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Consultation Priorities
export const CONSULTATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Content Categories
export const CONTENT_CATEGORIES = {
  MATERNAL: 'maternal',
  CHILD: 'child',
  NUTRITION: 'nutrition',
  HYGIENE: 'hygiene',
  PREVENTION: 'prevention',
  FIRST_AID: 'first-aid',
  MENTAL_HEALTH: 'mental-health',
  CHRONIC_DISEASE: 'chronic-disease'
};

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' }
];

// Common Symptoms (English to Bengali mapping)
export const SYMPTOM_TRANSLATIONS = {
  fever: 'জ্বর',
  cough: 'কাশি',
  headache: 'মাথাব্যথা',
  vomiting: 'বমি',
  diarrhea: 'ডায়রিয়া',
  'body ache': 'শরীর ব্যথা',
  fatigue: 'ক্লান্তি',
  'chest pain': 'বুকে ব্যথা',
  'difficulty breathing': 'শ্বাস কষ্ট',
  'sore throat': 'গলা ব্যথা',
  'runny nose': 'নাক দিয়ে পানি পড়া',
  'skin rash': 'চামড়ায় ফুসকুড়ি',
  'abdominal pain': 'পেট ব্যথা',
  dizziness: 'মাথা ঘোরা',
  'loss of appetite': 'ক্ষুধামন্দা',
  nausea: 'বমি বমি ভাব',
  weakness: 'দুর্বলতা',
  'joint pain': 'জয়েন্ট ব্যথা',
  'muscle pain': 'পেশী ব্যথা',
  chills: 'শীতল অনুভূতি',
  sweating: 'ঘাম',
  dehydration: 'পানিশূন্যতা',
  'bloody stool': 'রক্ত মিশ্রিত পায়খানা',
  'watery stool': 'পানির মতো পায়খানা'
};

// Common Disease Names (English to Bengali)
export const DISEASE_TRANSLATIONS = {
  'Common Cold': 'সাধারণ সর্দি',
  'Influenza (Flu)': 'ইনফ্লুয়েঞ্জা (ফ্লু)',
  'Malaria': 'ম্যালেরিয়া',
  'Dengue Fever': 'ডেঙ্গু জ্বর',
  'Typhoid': 'টাইফয়েড',
  'Gastroenteritis': 'গ্যাস্ট্রোএন্টেরাইটিস',
  'Cholera': 'কলেরা',
  'Pneumonia': 'নিউমোনিয়া',
  'Respiratory Infection': 'শ্বাসতন্ত্রের সংক্রমণ',
  'Allergic Reaction': 'এলার্জি প্রতিক্রিয়া'
};

// Default User Settings
export const DEFAULT_SETTINGS = {
  language: 'bn',
  notifications: true,
  offlineMode: true,
  autoSync: true,
  darkMode: false,
  fontSize: 'medium'
};

// Cache Durations (in milliseconds)
export const CACHE_DURATIONS = {
  models: 7 * 24 * 60 * 60 * 1000, // 7 days
  healthContent: 24 * 60 * 60 * 1000, // 24 hours
  userData: 60 * 60 * 1000 // 1 hour
};

// Color Codes for Risk/Severity
export const SEVERITY_COLORS = {
  low: '#4caf50',
  moderate: '#ff9800',
  high: '#f44336',
  critical: '#9c27b0'
};

// Animation Durations (in milliseconds)
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500
};

// Breakpoints (matching MUI defaults)
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_SETTINGS: 'rural_health_settings',
  AUTH_TOKEN: 'rural_health_auth',
  SYNC_TIMESTAMP: 'rural_health_last_sync',
  LANGUAGE: 'i18nextLng',
  MODELS_LOADED: 'rural_health_models_loaded'
};
