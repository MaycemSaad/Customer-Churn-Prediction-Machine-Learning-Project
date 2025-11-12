// Interfaces de base
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
  customer_id?: string;
  customer_name?: string;
}

export interface PredictionResponse {
  prediction_id: string;
  churn_probability: number;
  prediction: number;
  confidence: number;
  risk_level: string;
  message: string;
  feature_importance?: { [key: string]: number };
  timestamp: string;
  customer_id?: string;
  
}

export interface CustomerData extends PredictionInput {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  signup_date?: string;
}

// Interfaces pour les prédictions par lot
export interface BatchPredictionInput {
  customers: PredictionInput[];
}

export interface BatchPredictionResponse {
  batch_id: string;
  predictions: PredictionResponse[];
  summary: {
    total_customers: number;
    churn_count: number;
    churn_rate: number;
    avg_confidence: number;
  };
}

// Interfaces pour les métriques du modèle
export interface ModelMetricsResponse {
  model_version: string;
  training_date: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  feature_importance: { [key: string]: number };
  confusion_matrix: {
    true_positive: number[];
    false_positive: number[];
    false_negative: number[];
    true_negative: number[];
  };
}

// Interfaces pour l'analytics avancé
export interface AnalyticsResponse {
  total_predictions: number;
  churn_rate: number;
  avg_confidence: number;
  predictions_today: number;
  high_risk_customers: number;
  hourly_distribution: { [key: string]: number };
}

// Interface pour l'historique des prédictions
export interface PredictionHistory {
  predictions: PredictionResponse[];
  total_count: number;
  has_more: boolean;
}

// Interfaces existantes (maintenues pour la compatibilité)
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
  model_status?: string;
  timestamp?: string;
}

// Nouveaux types pour les fonctionnalités avancées
export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface RiskDistribution {
  high: number;
  medium: number;
  low: number;
}

export interface ModelComparison {
  model_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  auc_score: number;
}

export interface TrainingMetrics {
  training_date: string;
  best_model: string;
  best_auc_score: number;
  model_comparison: {
    [key: string]: {
      cv_mean: number;
      cv_std: number;
      accuracy: number;
      auc_score: number;
      feature_importance: { [key: string]: number };
    };
  };
  feature_names: string[];
}