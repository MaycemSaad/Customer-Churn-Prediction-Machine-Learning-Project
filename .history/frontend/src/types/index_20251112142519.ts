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

export interface ModelMetricsResponse {
  model_version: string;
  training_date: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  feature_importance: { [key: string]: number };
  confusion_matrix: { [key: string]: number[] };
}

export interface AnalyticsResponse {
  total_predictions: number;
  churn_rate: number;
  avg_confidence: number;
  predictions_today: number;
  high_risk_customers: number;
  hourly_distribution: { [key: string]: number };
}

export interface CustomerData extends PredictionInput {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  signup_date?: string;
}

export interface PredictionHistory {
  predictions: PredictionResponse[];
  total_count: number;
  has_more: boolean;
}