import * as tf from '@tensorflow/tfjs';
import { modelLoader } from './modelLoader';

// Common symptoms database for rural Bangladesh
const COMMON_SYMPTOMS = {
  en: [
    'fever', 'cough', 'headache', 'diarrhea', 'vomiting', 'abdominal pain',
    'body ache', 'fatigue', 'shortness of breath', 'chest pain', 'dizziness',
    'nausea', 'skin rash', 'joint pain', 'loss of appetite'
  ],
  bn: [
    'জ্বর', 'কাশি', 'মাথাব্যথা', 'ডায়রিয়া', 'বমি', 'পেট ব্যথা',
    'শরীর ব্যথা', 'ক্লান্তি', 'শ্বাসকষ্ট', 'বুকে ব্যথা', 'মাথা ঘোরা',
    'বমি বমি ভাব', 'চর্মরোগ', 'গাঁটে ব্যথা', 'ক্ষুধা কমে যাওয়া'
  ]
};

const DISEASE_DATABASE = [
  {
    name: { en: 'Common Cold', bn: 'সাধারণ সর্দি' },
    symptoms: ['fever', 'cough', 'headache', 'body ache', 'fatigue'],
    severity: 'mild',
    advice: {
      en: 'Rest, drink fluids, take paracetamol if needed. Consult doctor if symptoms persist beyond 7 days.',
      bn: 'বিশ্রাম নিন, তরল পান করুন, প্রয়োজনে প্যারাসিটামল খান। ৭ দিনের বেশি উপসর্গ থাকলে ডাক্তারের পরামর্শ নিন।'
    }
  },
  {
    name: { en: 'Gastroenteritis', bn: 'গ্যাস্ট্রোএন্টেরাইটিস' },
    symptoms: ['diarrhea', 'vomiting', 'abdominal pain', 'nausea', 'fever'],
    severity: 'moderate',
    advice: {
      en: 'Stay hydrated with ORS. Avoid solid foods initially. Seek immediate care if severe dehydration occurs.',
      bn: 'ওআরএস দিয়ে হাইড্রেটেড থাকুন। প্রথমে শক্ত খাবার এড়িয়ে চলুন। গুরুতর ডিহাইড্রেশন হলে তাৎক্ষণিক চিকিৎসা নিন।'
    }
  },
  {
    name: { en: 'Hypertension Risk', bn: 'উচ্চ রক্তচাপের ঝুঁকি' },
    symptoms: ['headache', 'dizziness', 'chest pain', 'shortness of breath'],
    severity: 'severe',
    advice: {
      en: 'URGENT: Check blood pressure immediately. Reduce salt intake. Consult doctor as soon as possible.',
      bn: 'জরুরি: অবিলম্বে রক্তচাপ পরীক্ষা করুন। লবণ কম খান। যত তাড়াতাড়ি সম্ভব ডাক্তারের পরামর্শ নিন।'
    }
  },
  {
    name: { en: 'Dengue Suspicion', bn: 'ডেঙ্গু সন্দেহ' },
    symptoms: ['fever', 'body ache', 'headache', 'joint pain', 'skin rash'],
    severity: 'severe',
    advice: {
      en: 'URGENT: Possible dengue. Get blood test (CBC, NS1). Monitor platelet count. Seek immediate medical attention.',
      bn: 'জরুরি: ডেঙ্গু হতে পারে। রক্ত পরীক্ষা করুন (CBC, NS1)। প্লেটলেট গণনা পর্যবেক্ষণ করুন। অবিলম্বে চিকিৎসা সহায়তা নিন।'
    }
  }
];

export class SymptomAnalyzer {
  constructor() {
    this.model = null;
    this.initializeModel();
  }

  async initializeModel() {
    try {
      this.model = await modelLoader.loadSymptomCheckerModel();
    } catch (error) {
      console.error('Failed to initialize symptom analyzer:', error);
    }
  }

  // Text preprocessing for symptom matching
  preprocessSymptoms(symptomsText, language = 'en') {
    const symptoms = symptomsText.toLowerCase()
      .split(/[,،;।\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    return symptoms;
  }

  // Rule-based matching for common diseases
  matchDiseases(symptoms) {
    const matches = [];

    DISEASE_DATABASE.forEach(disease => {
      const matchCount = symptoms.filter(symptom => 
        disease.symptoms.some(ds => 
          symptom.includes(ds) || ds.includes(symptom)
        )
      ).length;

      if (matchCount > 0) {
        const confidence = matchCount / disease.symptoms.length;
        matches.push({
          ...disease,
          matchCount,
          confidence,
          matchedSymptoms: symptoms.filter(symptom =>
            disease.symptoms.some(ds => symptom.includes(ds))
          )
        });
      }
    });

    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  // AI-powered analysis (combines rule-based + ML)
  async analyzeSymptoms(symptomsText, language = 'en') {
    try {
      const symptoms = this.preprocessSymptoms(symptomsText, language);
      
      if (symptoms.length === 0) {
        return {
          success: false,
          message: language === 'bn' 
            ? 'কোনো উপসর্গ সনাক্ত করা যায়নি' 
            : 'No symptoms detected'
        };
      }

      // Rule-based matching
      const matches = this.matchDiseases(symptoms);

      // If model is loaded, enhance with ML predictions
      let aiConfidence = 0;
      if (this.model && matches.length > 0) {
        try {
          // Create feature vector from symptoms
          const featureVector = this.createFeatureVector(symptoms);
          const prediction = await this.model.predict(featureVector);
          const predictionData = await prediction.data();
          aiConfidence = predictionData[0];
          
          // Cleanup tensors
          prediction.dispose();
          featureVector.dispose();
        } catch (error) {
          console.error('AI prediction error:', error);
        }
      }

      const topMatch = matches[0];

      return {
        success: true,
        detectedSymptoms: symptoms,
        possibleConditions: matches.slice(0, 3),
        primaryDiagnosis: topMatch ? {
          name: topMatch.name[language],
          confidence: Math.round((topMatch.confidence + aiConfidence) / 2 * 100),
          severity: topMatch.severity,
          advice: topMatch.advice[language],
          matchedSymptoms: topMatch.matchedSymptoms
        } : null,
        triage: this.determineTriageLevel(matches),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Symptom analysis error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create feature vector for ML model
  createFeatureVector(symptoms) {
    const allSymptoms = COMMON_SYMPTOMS.en;
    const vector = new Array(allSymptoms.length).fill(0);

    symptoms.forEach(symptom => {
      const index = allSymptoms.findIndex(s => 
        symptom.includes(s) || s.includes(symptom)
      );
      if (index !== -1) {
        vector[index] = 1;
      }
    });

    return tf.tensor2d([vector], [1, vector.length]);
  }

  determineTriageLevel(matches) {
    if (matches.length === 0) return 'self-care';
    
    const highestSeverity = matches[0].severity;
    
    switch (highestSeverity) {
      case 'severe':
        return 'urgent';
      case 'moderate':
        return 'soon';
      default:
        return 'self-care';
    }
  }
}

export const symptomAnalyzer = new SymptomAnalyzer();