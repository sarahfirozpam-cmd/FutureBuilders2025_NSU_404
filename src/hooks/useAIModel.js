import { useState, useEffect, useCallback } from 'react';
import { modelLoader } from '../ai/modelLoader';
import { useAppStore } from '../store/useAppStore';

export const useAIModel = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { modelsLoaded, setModelsLoaded } = useAppStore();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = useCallback(async () => {
    if (modelsLoaded) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        modelLoader.loadSymptomCheckerModel(),
        modelLoader.loadVitalsPredictor()
      ]);
      setModelsLoaded(true);
      console.log('AI models loaded successfully');
    } catch (err) {
      console.error('Error loading AI models:', err);
      setError('Failed to load AI models. Using fallback mode.');
      // Still mark as loaded since we have mock models
      setModelsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [modelsLoaded, setModelsLoaded]);

  const reloadModels = useCallback(async () => {
    modelLoader.disposeModels();
    setModelsLoaded(false);
    await loadModels();
  }, [loadModels, setModelsLoaded]);

  return {
    isLoading,
    modelsLoaded,
    error,
    reloadModels
  };
};

export default useAIModel;
