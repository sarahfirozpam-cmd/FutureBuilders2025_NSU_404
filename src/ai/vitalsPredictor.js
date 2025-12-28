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

    recommendations.en.push('Maintain a healthy lifestyle with proper diet and exercise');
    recommendations.bn.push('সঠিক খাদ্য এবং ব্যায়াম সহ একটি স্বাস্থ্যকর জীবনযাপন বজায় রাখুন');

    return recommendations;
  }
}

export const vitalsPredictor = new VitalsPredictor();