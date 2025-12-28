import { VITALS_THRESHOLDS, SYMPTOM_TRANSLATIONS, DISEASE_TRANSLATIONS } from './constants';

/**
 * Format date to localized string
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale code (en, bn)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en') => {
  const d = new Date(date);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return d.toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', options);
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale code
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date, locale = 'en') => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (locale === 'bn') {
    if (diffMins < 1) return 'এইমাত্র';
    if (diffMins < 60) return `${toBengaliNumber(diffMins)} মিনিট আগে`;
    if (diffHours < 24) return `${toBengaliNumber(diffHours)} ঘন্টা আগে`;
    return `${toBengaliNumber(diffDays)} দিন আগে`;
  }
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

/**
 * Convert number to Bengali numerals
 * @param {number|string} num - Number to convert
 * @returns {string} Bengali numeral string
 */
export const toBengaliNumber = (num) => {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (match) => bengaliNumerals[parseInt(match)]);
};

/**
 * Translate symptom to Bengali
 * @param {string} symptom - English symptom
 * @returns {string} Bengali symptom or original if not found
 */
export const translateSymptom = (symptom) => {
  const lower = symptom.toLowerCase().trim();
  return SYMPTOM_TRANSLATIONS[lower] || symptom;
};

/**
 * Translate disease name to Bengali
 * @param {string} disease - English disease name
 * @returns {string} Bengali disease name or original if not found
 */
export const translateDisease = (disease) => {
  return DISEASE_TRANSLATIONS[disease] || disease;
};

/**
 * Classify blood pressure reading
 * @param {number} systolic - Systolic reading
 * @param {number} diastolic - Diastolic reading
 * @returns {object} Classification with level and color
 */
export const classifyBloodPressure = (systolic, diastolic) => {
  const thresholds = VITALS_THRESHOLDS.bloodPressure;
  
  if (systolic >= thresholds.systolic.crisis || diastolic >= thresholds.diastolic.crisis) {
    return { level: 'critical', label: 'Hypertensive Crisis', labelBn: 'উচ্চ রক্তচাপ সংকট', color: '#9c27b0' };
  }
  if (systolic >= thresholds.systolic.high || diastolic >= thresholds.diastolic.high) {
    return { level: 'high', label: 'High Blood Pressure', labelBn: 'উচ্চ রক্তচাপ', color: '#f44336' };
  }
  if (systolic >= thresholds.systolic.elevated || diastolic >= thresholds.diastolic.elevated) {
    return { level: 'elevated', label: 'Elevated', labelBn: 'উন্নত', color: '#ff9800' };
  }
  if (systolic < thresholds.systolic.low || diastolic < thresholds.diastolic.low) {
    return { level: 'low', label: 'Low Blood Pressure', labelBn: 'নিম্ন রক্তচাপ', color: '#2196f3' };
  }
  return { level: 'normal', label: 'Normal', labelBn: 'স্বাভাবিক', color: '#4caf50' };
};

/**
 * Classify pulse rate
 * @param {number} pulse - Pulse rate in BPM
 * @returns {object} Classification with level and color
 */
export const classifyPulse = (pulse) => {
  const thresholds = VITALS_THRESHOLDS.pulse;
  
  if (pulse >= thresholds.veryHigh) {
    return { level: 'critical', label: 'Very High', labelBn: 'অত্যন্ত উচ্চ', color: '#9c27b0' };
  }
  if (pulse >= thresholds.high) {
    return { level: 'high', label: 'High', labelBn: 'উচ্চ', color: '#f44336' };
  }
  if (pulse < thresholds.low) {
    return { level: 'low', label: 'Low', labelBn: 'নিম্ন', color: '#2196f3' };
  }
  return { level: 'normal', label: 'Normal', labelBn: 'স্বাভাবিক', color: '#4caf50' };
};

/**
 * Classify body temperature
 * @param {number} temp - Temperature in Celsius
 * @returns {object} Classification with level and color
 */
export const classifyTemperature = (temp) => {
  const thresholds = VITALS_THRESHOLDS.temperature;
  
  if (temp >= thresholds.dangerous) {
    return { level: 'critical', label: 'Dangerous Fever', labelBn: 'বিপজ্জনক জ্বর', color: '#9c27b0' };
  }
  if (temp >= thresholds.highFever) {
    return { level: 'high', label: 'High Fever', labelBn: 'উচ্চ জ্বর', color: '#f44336' };
  }
  if (temp >= thresholds.fever) {
    return { level: 'moderate', label: 'Fever', labelBn: 'জ্বর', color: '#ff9800' };
  }
  if (temp >= thresholds.lowFever) {
    return { level: 'elevated', label: 'Low-Grade Fever', labelBn: 'হালকা জ্বর', color: '#ffc107' };
  }
  if (temp < thresholds.hypothermia) {
    return { level: 'critical', label: 'Hypothermia', labelBn: 'হাইপোথার্মিয়া', color: '#9c27b0' };
  }
  if (temp < thresholds.low) {
    return { level: 'low', label: 'Below Normal', labelBn: 'স্বাভাবিকের নিচে', color: '#2196f3' };
  }
  return { level: 'normal', label: 'Normal', labelBn: 'স্বাভাবিক', color: '#4caf50' };
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Calculate BMI
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {object} BMI value and classification
 */
export const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  const rounded = Math.round(bmi * 10) / 10;
  
  let classification;
  if (bmi < 18.5) {
    classification = { level: 'underweight', label: 'Underweight', labelBn: 'কম ওজন', color: '#2196f3' };
  } else if (bmi < 25) {
    classification = { level: 'normal', label: 'Normal', labelBn: 'স্বাভাবিক', color: '#4caf50' };
  } else if (bmi < 30) {
    classification = { level: 'overweight', label: 'Overweight', labelBn: 'অতিরিক্ত ওজন', color: '#ff9800' };
  } else {
    classification = { level: 'obese', label: 'Obese', labelBn: 'স্থূলতা', color: '#f44336' };
  }
  
  return { value: rounded, ...classification };
};

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if browser supports required features
 * @returns {object} Feature support status
 */
export const checkFeatureSupport = () => {
  return {
    indexedDB: 'indexedDB' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webSpeech: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    notifications: 'Notification' in window,
    geolocation: 'geolocation' in navigator,
    vibration: 'vibrate' in navigator
  };
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate vitals input
 * @param {object} vitals - Vitals data
 * @returns {object} Validation result
 */
export const validateVitals = (vitals) => {
  const errors = {};
  
  if (vitals.systolic) {
    if (vitals.systolic < 50 || vitals.systolic > 300) {
      errors.systolic = 'Systolic must be between 50-300 mmHg';
    }
  }
  
  if (vitals.diastolic) {
    if (vitals.diastolic < 30 || vitals.diastolic > 200) {
      errors.diastolic = 'Diastolic must be between 30-200 mmHg';
    }
  }
  
  if (vitals.systolic && vitals.diastolic) {
    if (vitals.diastolic >= vitals.systolic) {
      errors.diastolic = 'Diastolic must be less than systolic';
    }
  }
  
  if (vitals.pulse) {
    if (vitals.pulse < 20 || vitals.pulse > 250) {
      errors.pulse = 'Pulse must be between 20-250 bpm';
    }
  }
  
  if (vitals.temperature) {
    if (vitals.temperature < 30 || vitals.temperature > 45) {
      errors.temperature = 'Temperature must be between 30-45°C';
    }
  }
  
  if (vitals.age) {
    if (vitals.age < 0 || vitals.age > 120) {
      errors.age = 'Age must be between 0-120 years';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get severity icon name
 * @param {string} level - Severity level
 * @returns {string} MUI icon name
 */
export const getSeverityIcon = (level) => {
  switch (level) {
    case 'critical':
      return 'Error';
    case 'high':
      return 'Warning';
    case 'moderate':
    case 'elevated':
      return 'Info';
    case 'low':
    case 'normal':
    default:
      return 'CheckCircle';
  }
};

/**
 * Parse symptoms from text input
 * @param {string} text - Raw symptom text
 * @returns {string[]} Array of parsed symptoms
 */
export const parseSymptoms = (text) => {
  // Split by common delimiters
  const delimiters = /[,;।\n]+/;
  const symptoms = text
    .split(delimiters)
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 1);
  
  return [...new Set(symptoms)]; // Remove duplicates
};

/**
 * Get greeting based on time of day
 * @param {string} locale - Locale code
 * @returns {string} Greeting message
 */
export const getGreeting = (locale = 'en') => {
  const hour = new Date().getHours();
  
  if (locale === 'bn') {
    if (hour < 12) return 'সুপ্রভাত';
    if (hour < 17) return 'শুভ অপরাহ্ণ';
    if (hour < 20) return 'শুভ সন্ধ্যা';
    return 'শুভ রাত্রি';
  }
  
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 20) return 'Good evening';
  return 'Good night';
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Sleep utility for async operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
