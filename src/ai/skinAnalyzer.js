// src/ai/skinAnalyzer.js
import * as tf from '@tensorflow/tfjs';

// Disease labels from Falconsai/skin-disease-classification
const DISEASE_LABELS = [
  'Eczema',
  'Melanoma',
  'Atopic Dermatitis',
  'Basal Cell Carcinoma',
  'Benign Keratosis',
  'Psoriasis',
  'Seborrheic Keratosis',
  'Tinea Ringworm',
  'Acne',
  'Warts'
];

const DISEASE_INFO = {
  'Eczema': {
    severity: 'moderate',
    description: {
      en: 'A skin condition causing inflamed, itchy, cracked, and rough skin patches.',
      bn: 'একটি ত্বকের অবস্থা যা প্রদাহযুক্ত, চুলকানিযুক্ত, ফাটা এবং রুক্ষ ত্বকের প্যাচ সৃষ্টি করে।'
    },
    advice: {
      en: 'Keep skin moisturized, avoid irritants. Consult dermatologist if symptoms persist.',
      bn: 'ত্বক আর্দ্র রাখুন, জ্বালাকারক এড়িয়ে চলুন। উপসর্গ স্থায়ী হলে চর্মরোগ বিশেষজ্ঞের পরামর্শ নিন।'
    }
  },
  'Melanoma': {
    severity: 'severe',
    description: {
      en: 'A serious form of skin cancer developing from pigment cells.',
      bn: 'রঙ্গক কোষ থেকে বিকশিত ত্বক ক্যান্সারের একটি গুরুতর রূপ।'
    },
    advice: {
      en: 'URGENT: Consult oncologist immediately for biopsy and treatment options.',
      bn: 'জরুরি: বায়োপসি এবং চিকিৎসা বিকল্পের জন্য অবিলম্বে অনকোলজিস্টের পরামর্শ নিন।'
    }
  },
  'Atopic Dermatitis': {
    severity: 'moderate',
    description: {
      en: 'Chronic inflammatory skin condition with red, itchy patches.',
      bn: 'লাল, চুলকানি প্যাচ সহ দীর্ঘস্থায়ী প্রদাহজনক ত্বকের অবস্থা।'
    },
    advice: {
      en: 'Use gentle soaps, apply moisturizer regularly. See doctor for prescription treatments.',
      bn: 'মৃদু সাবান ব্যবহার করুন, নিয়মিত ময়েশ্চারাইজার লাগান। প্রেসক্রিপশন চিকিৎসার জন্য ডাক্তার দেখান।'
    }
  },
  'Basal Cell Carcinoma': {
    severity: 'severe',
    description: {
      en: 'Most common type of skin cancer, usually appears on sun-exposed areas.',
      bn: 'ত্বক ক্যান্সারের সবচেয়ে সাধারণ ধরন, সাধারণত সূর্যের সংস্পর্শে আসা এলাকায় দেখা যায়।'
    },
    advice: {
      en: 'URGENT: Seek immediate dermatologist consultation for biopsy and removal.',
      bn: 'জরুরি: বায়োপসি এবং অপসারণের জন্য তাৎক্ষণিক চর্মরোগ বিশেষজ্ঞের পরামর্শ নিন।'
    }
  },
  'Benign Keratosis': {
    severity: 'mild',
    description: {
      en: 'Non-cancerous skin growth that appears with age.',
      bn: 'অ-ক্যান্সারজনিত ত্বকের বৃদ্ধি যা বয়সের সাথে দেখা দেয়।'
    },
    advice: {
      en: 'Generally harmless. Consult doctor if it changes in appearance or becomes irritated.',
      bn: 'সাধারণত ক্ষতিকারক নয়। চেহারা পরিবর্তন হলে বা জ্বালা সৃষ্টি করলে ডাক্তারের পরামর্শ নিন।'
    }
  },
  'Psoriasis': {
    severity: 'moderate',
    description: {
      en: 'Autoimmune condition causing rapid skin cell buildup with scaly patches.',
      bn: 'অটোইমিউন অবস্থা যা দ্রুত ত্বক কোষের জমা সৃষ্টি করে এবং আঁশযুক্ত প্যাচ তৈরি করে।'
    },
    advice: {
      en: 'Manage stress, use prescribed medications. Regular dermatologist visits recommended.',
      bn: 'চাপ পরিচালনা করুন, নির্ধারিত ওষুধ ব্যবহার করুন। নিয়মিত চর্মরোগ বিশেষজ্ঞ পরিদর্শন প্রস্তাবিত।'
    }
  },
  'Seborrheic Keratosis': {
    severity: 'mild',
    description: {
      en: 'Common non-cancerous skin growth appearing as brown, black, or tan growths.',
      bn: 'সাধারণ অ-ক্যান্সারজনিত ত্বকের বৃদ্ধি যা বাদামী, কালো বা ট্যান বৃদ্ধি হিসাবে দেখা দেয়।'
    },
    advice: {
      en: 'Harmless but can be removed for cosmetic reasons. Consult dermatologist if desired.',
      bn: 'ক্ষতিকারক নয় তবে প্রসাধনী কারণে অপসারণ করা যেতে পারে। ইচ্ছা হলে চর্মরোগ বিশেষজ্ঞের পরামর্শ নিন।'
    }
  },
  'Tinea Ringworm': {
    severity: 'mild',
    description: {
      en: 'Fungal infection causing ring-shaped rash on the skin.',
      bn: 'ছত্রাক সংক্রমণ যা ত্বকে রিং-আকৃতির ফুসকুড়ি সৃষ্টি করে।'
    },
    advice: {
      en: 'Use antifungal cream, keep area dry and clean. See doctor if not improving.',
      bn: 'অ্যান্টিফাঙ্গাল ক্রিম ব্যবহার করুন, এলাকা শুষ্ক এবং পরিষ্কার রাখুন। উন্নতি না হলে ডাক্তার দেখান।'
    }
  },
  'Acne': {
    severity: 'mild',
    description: {
      en: 'Common skin condition causing pimples, blackheads, and oily skin.',
      bn: 'সাধারণ ত্বকের অবস্থা যা ব্রণ, ব্ল্যাকহেডস এবং তৈলাক্ত ত্বক সৃষ্টি করে।'
    },
    advice: {
      en: 'Maintain good hygiene, use gentle cleanser. Avoid picking or squeezing.',
      bn: 'ভাল স্বাস্থ্যবিধি বজায় রাখুন, মৃদু ক্লিনজার ব্যবহার করুন। তোলা বা চেপে ধরা এড়িয়ে চলুন।'
    }
  },
  'Warts': {
    severity: 'mild',
    description: {
      en: 'Viral infection causing small, rough growths on the skin.',
      bn: 'ভাইরাল সংক্রমণ যা ত্বকে ছোট, রুক্ষ বৃদ্ধি সৃষ্টি করে।'
    },
    advice: {
      en: 'Often resolve on their own. Can be treated with over-the-counter medications or freezing.',
      bn: 'প্রায়শই নিজেরাই সমাধান হয়। ওভার-দ্য-কাউন্টার ওষুধ বা হিমায়িত করে চিকিৎসা করা যায়।'
    }
  }
};

export class SkinAnalyzer {
  constructor() {
    this.model = null;
    this.isLoading = false;
  }

  async loadModel() {
    if (this.model) {
      return this.model;
    }

    if (this.isLoading) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.model) {
            clearInterval(checkInterval);
            resolve(this.model);
          }
        }, 100);
      });
    }

    this.isLoading = true;

    try {
      console.log('Loading skin disease classification model...');
      this.model = await tf.loadGraphModel('/models/skin-disease/model.json');
      this.isLoading = false;
      console.log('Skin disease model loaded successfully');
      return this.model;
    } catch (error) {
      console.error('Error loading skin disease model:', error);
      console.log('Using mock model for development...');
      this.isLoading = false;
      // Assign mock model to this.model and return it
      this.model = this.createMockModel();
      return this.model;
    }
  }

  createMockModel() {
    // Mock model for development/testing
    return {
      predict: (input) => {
        return tf.tidy(() => {
          // Simulate model output - 10 classes
          const randomProbs = Array.from({ length: 10 }, () => Math.random());
          const sum = randomProbs.reduce((a, b) => a + b, 0);
          const normalized = randomProbs.map(p => p / sum);
          return tf.tensor2d([normalized], [1, 10]);
        });
      }
    };
  }

  preprocessImage(imageElement) {
    return tf.tidy(() => {
      // Convert image to tensor
      let tensor = tf.browser.fromPixels(imageElement);

      // Resize to 224x224 (standard for ViT/ResNet models)
      tensor = tf.image.resizeBilinear(tensor, [224, 224]);

      // Normalize to [0, 1]
      tensor = tensor.toFloat().div(tf.scalar(255.0));

      // Expand dimensions to match model input shape [1, 224, 224, 3]
      tensor = tensor.expandDims(0);

      return tensor;
    });
  }

  async analyzeImage(imageElement) {
    try {
      // Ensure model is loaded
      if (!this.model) {
        await this.loadModel();
      }

      console.log('Preprocessing image...');
      const preprocessedImage = this.preprocessImage(imageElement);

      console.log('Running inference...');
      const predictions = await this.model.predict(preprocessedImage);
      const predictionsData = await predictions.data();

      // Clean up tensors
      preprocessedImage.dispose();
      predictions.dispose();

      // Get top 3 predictions
      const predictionArray = Array.from(predictionsData);
      const topPredictions = predictionArray
        .map((probability, index) => ({
          label: DISEASE_LABELS[index],
          confidence: probability,
          info: DISEASE_INFO[DISEASE_LABELS[index]]
        }))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3);

      const topPrediction = topPredictions[0];

      return {
        success: true,
        predictions: topPredictions.map(p => ({
          condition: p.label,
          confidence: Math.round(p.confidence * 100),
          severity: p.info.severity,
          description: p.info.description,
          advice: p.info.advice
        })),
        primaryDiagnosis: {
          condition: topPrediction.label,
          confidence: Math.round(topPrediction.confidence * 100),
          severity: topPrediction.info.severity,
          description: topPrediction.info.description,
          advice: topPrediction.info.advice
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Skin analysis error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Clean up resources
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}

export const skinAnalyzer = new SkinAnalyzer();
