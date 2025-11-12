// CORRECTION COMPLÈTE du fichier src/types/index.ts
export interface PredictionInput {
  account_length: number;
  international_plan: number;
  voice_mail_plan: number;
  number_vmail_messages: number;
  total_day_minutes: number;
  total_day_calls: number;
  total_day_charge: number;
  total_eve_minutes: number;
  total_eve_calls: number;
  total_eve_charge: number;
  total_night_minutes: number;
  total_night_calls: number;
  total_night_charge: number;
  total_intl_minutes: number;
  total_intl_calls: number;
  total_intl_charge: number;
  customer_service_calls: number;
}

export interface PredictionResponse {
  churn_probability: number;
  prediction: number;
  confidence: number;
  message: string;
}

export interface CustomerData extends PredictionInput {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  signup_date?: string;
}

export interface AnalyticsData {
  totalCustomers: number;
  churnRate: number;
  predictionAccuracy: number;
  monthlyTrends: {
    month: string;
    churn: number;
    retained: number;
  }[];
}

export interface ModelMetrics {
  version: string;
  trainingDate: string;
  features: string[];
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
}

export interface RealTimeStats {
  activePredictions: number;
  totalPredictions: number;
  accuracyRate: number;
  avgResponseTime: number;
}

export interface ApiHealth {
  status: string;
  model_loaded: boolean;
}