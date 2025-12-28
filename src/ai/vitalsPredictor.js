import * as tf from '@tensorflow/tfjs';
import { modelLoader } from './modelLoader';

export class VitalsPredictor {
  constructor() {
    this.model = null;
    this.initializeModel();
  }

  async initializeModel() {
    try {
      this.model = await modelLoader.loadVitalsPredictor();
    } catch (error) {
      console.error('Failed to initialize vitals predictor:', error);
    }
  }

  // Normalize vitals data
  normalizeVitals(vitals) {
    // Normalization ranges based on typical values
    const normalized = {
      systolic: (vitals.systolic - 90) / 90,      // Normal: 90-180
      diastolic: (vitals.diastolic - 60) / 60,    // Normal: 60-120
      pulse: (vitals.pulse - 50) / 100,           // Normal: 50-150
      temperature: (vitals.temperature - 35) / 7, // Normal: 35-42°C
      weight: vitals.weight ? (vitals.weight - 30) / 120 : 0, // Optional
      age: (vitals.age - 18) / 82                 // 18-100 years
    };

    return Object.values(normalized);
  }

  // Rule-based risk assessment
  assessRuleBasedRisk(vitals) {
    const risks = [];
    let overallRisk = 'low';

    // Blood pressure assessment
    if (vitals.systolic >= 140 || vitals.diastolic >= 90) {
      risks.push({
        type: 'hypertension',
        severity: vitals.systolic >= 180 || vitals.diastolic >= 120 ? 'critical' : 'high',
        message: {
          en: 'High blood pressure detected. Seek medical attention.',
          bn: 'উচ্চ রক্তচাপ সনাক্ত হয়েছে। চিকিৎসা সহায়তা নিন।'
        }
      });
      overallRisk = 'high';
    } else if (vitals.systolic < 90 || vitals.diastolic < 60) {
      risks.push({
        type: 'hypotension',
        severity: 'moderate',
        message: {
          en: 'Low blood pressure. Monitor closely and consult if symptoms worsen.',
          bn: 'নিম্ন রক্তচাপ। সতর্কভাবে পর্যবেক্ষণ করুন এবং উপসর্গ খারাপ হলে পরামর্শ নিন।'
        }
      });
      overallRisk = overallRisk === 'low' ? 'moderate' : overallRisk;
    }

    // Pulse assessment
    if (vitals.pulse > 100) {
      risks.push({
        type: 'tachycardia',
        severity: vitals.pulse > 120 ? 'high' : 'moderate',
        message: {
          en: 'Elevated heart rate. Rest and monitor. Consult doctor if persistent.',
          bn: 'হৃদস্পন্দন বৃদ্ধি পেয়েছে। বিশ্রাম নিন এবং পর্যবেক্ষণ করুন। স্থায়ী হলে ডাক্তারের পরামর্শ নিন।'
        }
      });
      overallRisk = overallRisk === 'low' ? 'moderate' : overallRisk;
    } else if (vitals.pulse < 60) {
      risks.push({
        type: 'bradycardia',
        severity: 'moderate',
        message: {
          en: 'Low heart rate detected. Monitor and consult if you feel dizzy or weak.',
          bn: 'কম হৃদস্পন্দন সনাক্ত হয়েছে। মাথা ঘোরা বা দুর্বলতা অনুভব করলে পরামর্শ নিন।'
        }
      });
    }

    // Temperature assessment
    if (vitals.temperature >= 38) {
      risks.push({
        type: 'fever',
        severity: vitals.temperature >= 39.5 ? 'high' : 'moderate',
        message: {
          en: 'Fever detected. Stay hydrated and take paracetamol if needed.',
          bn: 'জ্বর সনাক্ত হয়েছে। হাইড্রেটেড থাকুন এবং প্রয়োজনে প্যারাসিটামল খান।'
        }
      });
      overallRisk = vitals.temperature >= 39.5 ? 'high' : 
                    (overallRisk === 'low' ? 'moderate' : overallRisk);
    } else if (vitals.temperature < 36) {
      risks.push({
        type: 'hypothermia',
        severity: vitals.temperature < 35 ? 'high' : 'moderate',
        message: {
          en: 'Low body temperature detected. Keep warm and monitor closely.',
          bn: 'শরীরের তাপমাত্রা কম। উষ্ণ থাকুন এবং সতর্কভাবে পর্যবেক্ষণ করুন।'
        }
      });
    }

    // Age-specific concerns
    if (vitals.age >= 60) {
      if (vitals.systolic >= 130 || vitals.diastolic >= 80) {
        if (!risks.some(r => r.type === 'hypertension')) {
          risks.push({
            type: 'elderly_bp_concern',
            severity: 'moderate',
            message: {
              en: 'Blood pressure slightly elevated for your age. Regular monitoring recommended.',
              bn: 'আপনার বয়সের জন্য রক্তচাপ সামান্য বেশি। নিয়মিত পর্যবেক্ষণ প্রস্তাবিত।'
            }
          });
        }
      }
    }

    return { risks, overallRisk };
  }

  async predictRisk(vitals) {
    try {
      // Rule-based assessment
      const ruleBasedAssessment = this.assessRuleBasedRisk(vitals);

      // AI prediction if model is available
      let aiRiskScore = 0;
      if (this.model) {
        try {
          const normalizedData = this.normalizeVitals(vitals);
          const inputTensor = tf.tensor2d([normalizedData], [1, normalizedData.length]);
          const prediction = await this.model.predict(inputTensor);
          const predictionData = await prediction.data();
          aiRiskScore = predictionData[0];

          // Cleanup
          prediction.dispose();
          inputTensor.dispose();
        } catch (error) {
          console.error('AI prediction error:', error);
        }
      }

      // Combine rule-based and AI scores
      const combinedRiskScore = ruleBasedAssessment.risks.length > 0 
        ? Math.max(aiRiskScore, ruleBasedAssessment.risks[0].severity === 'critical' ? 0.9 : 0.6)
        : aiRiskScore;

      return {
        success: true,
        riskScore: Math.round(combinedRiskScore * 100),
        riskLevel: this.getRiskLevel(combinedRiskScore),
        detectedRisks: ruleBasedAssessment.risks,
        recommendations: this.generateRecommendations(ruleBasedAssessment, vitals),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Vitals prediction error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  getRiskLevel(score) {
    if (score >= 0.7) return 'high';
    if (score >= 0.4) return 'moderate';
    return 'low';
  }

  generateRecommendations(assessment, vitals) {
    const recommendations = {
      en: [],
      bn: []
    };

    if (assessment.overallRisk === 'high') {
      recommendations.en.push('Seek immediate medical attention');
      recommendations.bn.push('অবিলম্বে চিকিৎসা সহায়তা নিন');
    } else if (assessment.overallRisk === 'moderate') {
      recommendations.en.push('Monitor vitals regularly and consult doctor within 24-48 hours');
      recommendations.bn.push('নিয়মিত ভাইটাল পর্যবেক্ষণ করুন এবং ২৪-৪৮ ঘন্টার মধ্যে ডাক্তারের পরামর্শ নিন');
    }

    // Lifestyle recommendations
    if (vitals.systolic >= 120 || vitals.diastolic >= 80) {
      recommendations.en.push('Reduce salt intake and avoid processed foods');
      recommendations.bn.push('লবণ এবং প্রক্রিয়াজাত খাবার কম খান');
    }

    if (vitals.pulse > 90) {
      recommendations.en.push('Practice relaxation techniques and regular exercise');
      recommendations.bn.push('শিথিলকরণ কৌশল এবং নিয়মিত ব্যায়াম করুন');
    }

    recommendations.en.push('Maintain a healthy lifestyle with proper diet and exercise');
    recommendations.bn.push('সঠিক খাদ্য এবং ব্যায়াম সহ একটি স্বাস্থ্যকর জীবনযাপন বজায় রাখুন');

    recommendations.en.push('Drink plenty of water and get adequate sleep');
    recommendations.bn.push('পর্যাপ্ত পানি পান করুন এবং যথেষ্ট ঘুমান');

    return recommendations;
  }

  // Get normal ranges for UI display
  getNormalRanges() {
    return {
      systolic: { min: 90, max: 120, unit: 'mmHg' },
      diastolic: { min: 60, max: 80, unit: 'mmHg' },
      pulse: { min: 60, max: 100, unit: 'bpm' },
      temperature: { min: 36.1, max: 37.2, unit: '°C' }
    };
  }
}

export const vitalsPredictor = new VitalsPredictor();
