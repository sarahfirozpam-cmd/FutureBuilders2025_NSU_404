import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        symptomChecker: 'Symptoms',
        vitalsMonitor: 'Vitals',
        healthEducation: 'Education',
        telemedicine: 'Consult'
      },
      
      // Common
      common: {
        loading: 'Loading...',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        offline: 'You are offline',
        online: 'Connected',
        language: 'Language',
        error: 'An error occurred'
      },
      
      // Dashboard
      dashboard: {
        welcome: 'Welcome to Rural Health Assistant',
        recentSymptoms: 'Recent Symptom Checks',
        recentVitals: 'Recent Vital Signs',
        quickActions: 'Quick Actions',
        checkSymptoms: 'Check Symptoms',
        recordVitals: 'Record Vitals',
        learnHealth: 'Learn About Health',
        consultDoctor: 'Consult Doctor'
      },
      
      // Symptom Checker
      symptoms: {
        title: 'Symptom Checker',
        description: 'Describe your symptoms below',
        inputPlaceholder: 'e.g., fever, cough, headache...',
        useVoice: 'Use Voice Input',
        analyzing: 'Analyzing symptoms...',
        results: 'Analysis Results',
        possibleConditions: 'Possible Conditions',
        advice: 'Advice',
        severity: 'Severity',
        confidence: 'Confidence',
        triage: {
          urgent: 'URGENT: Seek immediate medical attention',
          soon: 'Consult a doctor within 24-48 hours',
          'self-care': 'Self-care measures recommended'
        }
      },
      
      // Vitals Monitor
      vitals: {
        title: 'Vital Signs Monitor',
        bloodPressure: 'Blood Pressure',
        systolic: 'Systolic',
        diastolic: 'Diastolic',
        pulse: 'Pulse Rate',
        temperature: 'Temperature',
        weight: 'Weight (Optional)',
        age: 'Age',
        submit: 'Analyze Vitals',
        riskAssessment: 'Risk Assessment',
        riskLevel: 'Risk Level',
        recommendations: 'Recommendations',
        history: 'Vitals History',
        bpm: 'bpm',
        mmHg: 'mmHg',
        celsius: '°C',
        kg: 'kg',
        years: 'years'
      },
      
      // Health Education
      education: {
        title: 'Health Education',
        categories: 'Categories',
        search: 'Search content...',
        downloadedContent: 'Downloaded Content',
        download: 'Download for Offline'
      },
      
      // Telemedicine
      telemedicine: {
        title: 'Telemedicine',
        requestConsultation: 'Request Consultation',
        queuedRequests: 'Queued Requests',
        description: 'Describe your concern',
        priority: 'Priority',
        priorities: {
          low: 'Low',
          medium: 'Medium',
          high: 'High',
          urgent: 'Urgent'
        },
        status: {
          queued: 'Queued (Will sync when online)',
          syncing: 'Syncing...',
          synced: 'Synced',
          completed: 'Completed'
        },
        offlineNote: 'Your consultation request will be sent automatically when you reconnect to the internet.'
      }
    }
  },
  bn: {
    translation: {
      // Navigation
      nav: {
        dashboard: 'ড্যাশবোর্ড',
        symptomChecker: 'উপসর্গ',
        vitalsMonitor: 'ভাইটাল',
        healthEducation: 'শিক্ষা',
        telemedicine: 'পরামর্শ'
      },
      
      // Common
      common: {
        loading: 'লোড হচ্ছে...',
        submit: 'জমা দিন',
        cancel: 'বাতিল করুন',
        save: 'সংরক্ষণ করুন',
        delete: 'মুছে ফেলুন',
        edit: 'সম্পাদনা করুন',
        offline: 'আপনি অফলাইনে আছেন',
        online: 'সংযুক্ত',
        language: 'ভাষা',
        error: 'একটি ত্রুটি ঘটেছে'
      },
      
      // Dashboard
      dashboard: {
        welcome: 'গ্রামীণ স্বাস্থ্য সহায়কে স্বাগতম',
        recentSymptoms: 'সাম্প্রতিক উপসর্গ পরীক্ষা',
        recentVitals: 'সাম্প্রতিক ভাইটাল সাইন',
        quickActions: 'দ্রুত কর্ম',
        checkSymptoms: 'উপসর্গ পরীক্ষা',
        recordVitals: 'ভাইটাল রেকর্ড',
        learnHealth: 'স্বাস্থ্য শিক্ষা',
        consultDoctor: 'ডাক্তার পরামর্শ'
      },
      
      // Symptom Checker
      symptoms: {
        title: 'উপসর্গ পরীক্ষক',
        description: 'নিচে আপনার উপসর্গ বর্ণনা করুন',
        inputPlaceholder: 'যেমন, জ্বর, কাশি, মাথাব্যথা...',
        useVoice: 'ভয়েস ইনপুট ব্যবহার করুন',
        analyzing: 'উপসর্গ বিশ্লেষণ করা হচ্ছে...',
        results: 'বিশ্লেষণ ফলাফল',
        possibleConditions: 'সম্ভাব্য রোগ',
        advice: 'পরামর্শ',
        severity: 'গুরুতরতা',
        confidence: 'আত্মবিশ্বাস',
        triage: {
          urgent: 'জরুরি: অবিলম্বে চিকিৎসা সহায়তা নিন',
          soon: '২৪-৪৮ ঘন্টার মধ্যে ডাক্তারের পরামর্শ নিন',
          'self-care': 'স্ব-যত্ন ব্যবস্থা প্রস্তাবিত'
        }
      },
      
      // Vitals Monitor
      vitals: {
        title: 'ভাইটাল সাইন মনিটর',
        bloodPressure: 'রক্তচাপ',
        systolic: 'সিস্টোলিক',
        diastolic: 'ডায়াস্টোলিক',
        pulse: 'নাড়ির হার',
        temperature: 'তাপমাত্রা',
        weight: 'ওজন (ঐচ্ছিক)',
        age: 'বয়স',
        submit: 'ভাইটাল বিশ্লেষণ',
        riskAssessment: 'ঝুঁকি মূল্যায়ন',
        riskLevel: 'ঝুঁকির মাত্রা',
        recommendations: 'সুপারিশ',
        history: 'ভাইটাল ইতিহাস',
        bpm: 'বিপিএম',
        mmHg: 'এমএমএইচজি',
        celsius: '°সে',
        kg: 'কেজি',
        years: 'বছর'
      },
      
      // Health Education
      education: {
        title: 'স্বাস্থ্য শিক্ষা',
        categories: 'বিভাগসমূহ',
        search: 'কন্টেন্ট অনুসন্ধান করুন...',
        downloadedContent: 'ডাউনলোড করা কন্টেন্ট',
        download: 'অফলাইনে ডাউনলোড করুন'
      },
      
      // Telemedicine
      telemedicine: {
        title: 'টেলিমেডিসিন',
        requestConsultation: 'পরামর্শের অনুরোধ',
        queuedRequests: 'সারিবদ্ধ অনুরোধ',
        description: 'আপনার উদ্বেগ বর্ণনা করুন',
        priority: 'অগ্রাধিকার',
        priorities: {
          low: 'কম',
          medium: 'মাঝারি',
          high: 'উচ্চ',
          urgent: 'জরুরি'
        },
        status: {
          queued: 'সারিবদ্ধ (অনলাইনে সিঙ্ক হবে)',
          syncing: 'সিঙ্ক করা হচ্ছে...',
          synced: 'সিঙ্ক হয়েছে',
          completed: 'সম্পন্ন'
        },
        offlineNote: 'আপনি যখন ইন্টারনেটে পুনরায় সংযুক্ত হবেন তখন আপনার পরামর্শ অনুরোধ স্বয়ংক্রিয়ভাবে পাঠানো হবে।'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
