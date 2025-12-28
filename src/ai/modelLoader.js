import * as tf from '@tensorflow/tfjs';

class ModelLoader {
  constructor() {
    this.models = {};
    this.isLoading = {};
  }

  async loadSymptomCheckerModel() {
    const modelName = 'symptom-checker';
    
    if (this.models[modelName]) {
      return this.models[modelName];
    }

    if (this.isLoading[modelName]) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.models[modelName]) {
            clearInterval(checkInterval);
            resolve(this.models[modelName]);
          }
        }, 100);
      });
    }

    this.isLoading[modelName] = true;

    try {
      // Load pre-trained model from public directory
      const model = await tf.loadLayersModel('/models/symptom-checker/model.json');
      this.models[modelName] = model;
      this.isLoading[modelName] = false;
      console.log('Symptom checker model loaded successfully');
      return model;
    } catch (error) {
      console.error('Error loading symptom checker model:', error);
      this.isLoading[modelName] = false;
      // Return mock model for development
      return this.createMockModel();
    }
  }

  async loadVitalsPredictor() {
    const modelName = 'vitals-predictor';
    
    if (this.models[modelName]) {
      return this.models[modelName];
    }

    try {
      const model = await tf.loadLayersModel('/models/vitals-predictor/model.json');
      this.models[modelName] = model;
      return model;
    } catch (error) {
      console.error('Error loading vitals predictor:', error);
      return this.createMockVitalsModel();
    }
  }

  createMockModel() {
    // Mock model for development/testing
    return {
      predict: (input) => {
        return tf.tidy(() => {
          // Simulate model output
          return tf.tensor2d([[0.3, 0.5, 0.2]], [1, 3]);
        });
      }
    };
  }

  createMockVitalsModel() {
    return {
      predict: (input) => {
        return tf.tidy(() => {
          return tf.tensor2d([[0.15]], [1, 1]); // Risk score
        });
      }
    };
  }

  // Clean up models from memory
  disposeModels() {
    Object.values(this.models).forEach(model => {
      if (model && model.dispose) {
        model.dispose();
      }
    });
    this.models = {};
  }

  // Check if models are loaded
  areModelsLoaded() {
    return Object.keys(this.models).length > 0;
  }
}

export const modelLoader = new ModelLoader();
