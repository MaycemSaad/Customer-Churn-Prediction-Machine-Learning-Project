import { useState } from 'react';
import { PredictionInput, PredictionResponse } from '../types';
import { apiService } from '../services/api';

export const usePrediction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const predict = async (input: PredictionInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.predictChurn(input);
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Prediction failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    predict,
    reset,
    loading,
    error,
    result,
  };
};