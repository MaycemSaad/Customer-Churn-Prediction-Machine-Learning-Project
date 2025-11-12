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