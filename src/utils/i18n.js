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
        telemedicine: 'Consult',
        visualScanner: 'Visual Scanner'
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
      },
      
      // Visual Scanner
      scanner: {
        title: 'Visual Scanner',
        description: 'AI-powered skin condition analysis using your camera',
        howItWorks: 'How It Works',
        step1: 'Take a clear photo of the affected skin area in good lighting',
        step2: 'Our AI analyzes the image for possible skin conditions',
        step3: 'Get instant results with recommendations and next steps',
        importantNote: 'This tool is for screening purposes only and does not replace professional medical diagnosis.',
        startScanning: 'Start Scanning',
        uploadFromGallery: 'Upload from Gallery',
        takePhoto: 'Take Photo',
        reviewPhoto: 'Review Photo',
        retakePhoto: 'Retake Photo',
        analyzeNow: 'Analyze Now',
        analyzing: 'Analyzing Image...',
        analyzingMessage: 'Our AI is analyzing your image. This may take a few seconds.',
        results: 'Analysis Results',
        scanAnother: 'Scan Another',
        capturedImage: 'Captured Image',
        confidence: 'Confidence',
        about: 'About This Condition',
        recommendations: 'Recommendations',
        otherPossibilities: 'Other Possible Conditions',
        otherPossibilitiesNote: 'These conditions also matched but with lower confidence',
        readyToAnalyze: 'Ready to Analyze',
        analyzeDescription: 'Click below to analyze the captured image for possible skin conditions.',
        cameraNotSupported: 'Camera is not supported on this device',
        permissionRequired: 'Camera Permission Required',
        permissionMessage: 'We need access to your camera to scan skin conditions.',
        permissionInstructions: 'Please enable camera access in your browser settings and try again.',
        retryCamera: 'Try Again',
        initializingCamera: 'Initializing camera...',
        frameInstruction: 'Align the affected area within this frame',
        privacyNote: 'All images are processed on your device. Nothing is uploaded to the internet.',
        disclaimer: {
          title: 'Medical Disclaimer',
          message: 'This AI analysis is for informational purposes only and should not be considered medical advice. Always consult a qualified healthcare professional for proper diagnosis and treatment.'
        },
        nextSteps: {
          title: 'Next Steps',
          step1: 'Document your symptoms and when they started',
          step2: 'Consult a dermatologist or healthcare provider',
          step3: 'Show them this analysis along with the photo'
        }
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
        telemedicine: 'পরামর্শ',
        visualScanner: 'ভিজ্যুয়াল স্ক্যানার'
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
      },
      
      // Visual Scanner
      scanner: {
        title: 'ভিজ্যুয়াল স্ক্যানার',
        description: 'আপনার ক্যামেরা ব্যবহার করে এআই-চালিত ত্বকের অবস্থা বিশ্লেষণ',
        howItWorks: 'এটি কীভাবে কাজ করে',
        step1: 'ভাল আলোতে প্রভাবিত ত্বকের এলাকার একটি পরিষ্কার ছবি তুলুন',
        step2: 'আমাদের এআই সম্ভাব্য ত্বকের অবস্থার জন্য চিত্র বিশ্লেষণ করে',
        step3: 'সুপারিশ এবং পরবর্তী পদক্ষেপ সহ তাৎক্ষণিক ফলাফল পান',
        importantNote: 'এই টুলটি শুধুমাত্র স্ক্রীনিং উদ্দেশ্যে এবং পেশাদার চিকিৎসা নির্ণয়ের বিকল্প নয়।',
        startScanning: 'স্ক্যানিং শুরু করুন',
        uploadFromGallery: 'গ্যালারি থেকে আপলোড করুন',
        takePhoto: 'ছবি তুলুন',
        reviewPhoto: 'ছবি পর্যালোচনা করুন',
        retakePhoto: 'পুনরায় ছবি তুলুন',
        analyzeNow: 'এখনই বিশ্লেষণ করুন',
        analyzing: 'চিত্র বিশ্লেষণ করা হচ্ছে...',
        analyzingMessage: 'আমাদের এআই আপনার ছবি বিশ্লেষণ করছে। এটি কয়েক সেকেন্ড সময় নিতে পারে।',
        results: 'বিশ্লেষণ ফলাফল',
        scanAnother: 'আরেকটি স্ক্যান করুন',
        capturedImage: 'ক্যাপচার করা ছবি',
        confidence: 'আত্মবিশ্বাস',
        about: 'এই অবস্থা সম্পর্কে',
        recommendations: 'সুপারিশ',
        otherPossibilities: 'অন্যান্য সম্ভাব্য অবস্থা',
        otherPossibilitiesNote: 'এই অবস্থাগুলিও মিলেছে তবে কম আত্মবিশ্বাসের সাথে',
        readyToAnalyze: 'বিশ্লেষণের জন্য প্রস্তুত',
        analyzeDescription: 'সম্ভাব্য ত্বকের অবস্থার জন্য ক্যাপচার করা চিত্র বিশ্লেষণ করতে নীচে ক্লিক করুন।',
        cameraNotSupported: 'এই ডিভাইসে ক্যামেরা সমর্থিত নয়',
        permissionRequired: 'ক্যামেরা অনুমতি প্রয়োজন',
        permissionMessage: 'ত্বকের অবস্থা স্ক্যান করতে আমাদের আপনার ক্যামেরা অ্যাক্সেস প্রয়োজন।',
        permissionInstructions: 'অনুগ্রহ করে আপনার ব্রাউজার সেটিংসে ক্যামেরা অ্যাক্সেস সক্ষম করুন এবং আবার চেষ্টা করুন।',
        retryCamera: 'আবার চেষ্টা করুন',
        initializingCamera: 'ক্যামেরা আরম্ভ করা হচ্ছে...',
        frameInstruction: 'এই ফ্রেমের মধ্যে প্রভাবিত এলাকা সারিবদ্ধ করুন',
        privacyNote: 'সমস্ত চিত্র আপনার ডিভাইসে প্রক্রিয়া করা হয়। ইন্টারনেটে কিছুই আপলোড করা হয় না।',
        disclaimer: {
          title: 'চিকিৎসা দাবিত্যাগ',
          message: 'এই এআই বিশ্লেষণ শুধুমাত্র তথ্যের উদ্দেশ্যে এবং চিকিৎসা পরামর্শ হিসাবে বিবেচিত হওয়া উচিত নয়। সঠিক নির্ণয় এবং চিকিৎসার জন্য সর্বদা একজন যোগ্য স্বাস্থ্যসেবা পেশাদারের সাথে পরামর্শ করুন।'
        },
        nextSteps: {
          title: 'পরবর্তী পদক্ষেপ',
          step1: 'আপনার উপসর্গ এবং কখন শুরু হয়েছে তা নথিভুক্ত করুন',
          step2: 'একজন চর্মরোগ বিশেষজ্ঞ বা স্বাস্থ্যসেবা প্রদানকারীর সাথে পরামর্শ করুন',
          step3: 'তাদের এই বিশ্লেষণ এবং ছবি দেখান'
        }
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
