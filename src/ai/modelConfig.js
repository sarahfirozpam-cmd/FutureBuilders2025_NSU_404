// AI Model Configuration
export const MODEL_CONFIG = {
  symptomChecker: {
    path: '/models/symptom-checker/model.json',
    inputShape: [1, 15],
    outputClasses: 4
  },
  vitalsPredictor: {
    path: '/models/vitals-predictor/model.json',
    inputShape: [1, 6],
    outputClasses: 1
  }
};

// Symptom categories for feature extraction
export const SYMPTOM_CATEGORIES = {
  respiratory: ['cough', 'shortness of breath', 'chest pain', 'wheezing'],
  digestive: ['diarrhea', 'vomiting', 'nausea', 'abdominal pain', 'loss of appetite'],
  general: ['fever', 'fatigue', 'body ache', 'headache', 'dizziness'],
  skin: ['skin rash', 'itching', 'swelling'],
  musculoskeletal: ['joint pain', 'muscle pain', 'back pain']
};

// Severity levels
export const SEVERITY_LEVELS = {
  MILD: 'mild',
  MODERATE: 'moderate',
  SEVERE: 'severe',
  CRITICAL: 'critical'
};

// Triage levels
export const TRIAGE_LEVELS = {
  SELF_CARE: 'self-care',
  SOON: 'soon',
  URGENT: 'urgent',
  EMERGENCY: 'emergency'
};

// Risk thresholds
export const RISK_THRESHOLDS = {
  LOW: 0.3,
  MODERATE: 0.6,
  HIGH: 0.8
};
