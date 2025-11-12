import { 
  PredictionInput, 
  PredictionResponse, 
  CustomerData, 
  AnalyticsData,
  ModelMetrics,
  RealTimeStats,
  ApiHealth 
} from '../types';

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  private async fetchWithErrorHandling(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error(`Failed to connect to API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async healthCheck(): Promise<ApiHealth> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/health`);
  }

  async predictChurn(data: PredictionInput): Promise<PredictionResponse> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Mock data for development
  async getAnalytics(): Promise<AnalyticsData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalCustomers: 1247,
          churnRate: 14.3,
          predictionAccuracy: 87.2,
          monthlyTrends: [
            { month: 'Jan', churn: 45, retained: 320 },
            { month: 'Feb', churn: 52, retained: 315 },
            { month: 'Mar', churn: 48, retained: 325 },
            { month: 'Apr', churn: 61, retained: 310 },
            { month: 'May', churn: 55, retained: 305 },
            { month: 'Jun', churn: 58, retained: 312 },
          ],
        });
      }, 1000);
    });
  }

  async getCustomers(): Promise<CustomerData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            account_length: 120,
            international_plan: 0,
            voice_mail_plan: 1,
            number_vmail_messages: 25,
            total_day_minutes: 265.1,
            total_day_calls: 110,
            total_day_charge: 45.07,
            total_eve_minutes: 197.4,
            total_eve_calls: 99,
            total_eve_charge: 16.78,
            total_night_minutes: 244.7,
            total_night_calls: 91,
            total_night_charge: 11.01,
            total_intl_minutes: 10.0,
            total_intl_calls: 3,
            total_intl_charge: 2.7,
            customer_service_calls: 1,
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            phone: '+1234567891',
            account_length: 210,
            international_plan: 1,
            voice_mail_plan: 0,
            number_vmail_messages: 0,
            total_day_minutes: 189.5,
            total_day_calls: 95,
            total_day_charge: 32.22,
            total_eve_minutes: 156.8,
            total_eve_calls: 87,
            total_eve_charge: 13.33,
            total_night_minutes: 278.9,
            total_night_calls: 104,
            total_night_charge: 12.55,
            total_intl_minutes: 12.3,
            total_intl_calls: 4,
            total_intl_charge: 3.32,
            customer_service_calls: 3,
          }
        ]);
      }, 800);
    });
  }

  async getCustomerById(id: string): Promise<CustomerData | null> {
    const customers = await this.getCustomers();
    return customers.find(customer => customer.id === id) || null;
  }

  async getRealTimeStats(): Promise<RealTimeStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          activePredictions: 42,
          totalPredictions: 1247,
          accuracyRate: 87.2,
          avgResponseTime: 1.8,
        });
      }, 600);
    });
  }

  async getModelMetrics(): Promise<ModelMetrics> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          version: '1.2.0',
          trainingDate: '2024-01-15',
          features: [
            'account_length',
            'international_plan',
            'voice_mail_plan',
            'number_vmail_messages',
            'total_day_minutes',
            'total_day_calls',
            'total_day_charge',
            'total_eve_minutes',
            'total_eve_calls',
            'total_eve_charge',
            'total_night_minutes',
            'total_night_calls',
            'total_night_charge',
            'total_intl_minutes',
            'total_intl_calls',
            'total_intl_charge',
            'customer_service_calls'
          ],
          performance: {
            accuracy: 0.872,
            precision: 0.851,
            recall: 0.823,
            f1Score: 0.836,
          },
        });
      }, 700);
    });
  }

  async checkAPIConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.error('API connection failed:', error);
      return false;
    }
  }
  
}
// Ajoutez ces interfaces aux types existants
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

// Ajoutez ces méthodes à la classe ApiService
async getModelMetrics(): Promise<ModelMetricsResponse> {
  return this.fetchWithErrorHandling(`${API_BASE_URL}/model/metrics`);
}

async getAnalytics(): Promise<AnalyticsResponse> {
  return this.fetchWithErrorHandling(`${API_BASE_URL}/analytics/dashboard`);
}

async getPredictionHistory(limit: number = 50, offset: number = 0): Promise<any> {
  return this.fetchWithErrorHandling(
    `${API_BASE_URL}/predictions/history?limit=${limit}&offset=${offset}`
  );
}

async batchPredict(customers: any[]): Promise<any> {
  return this.fetchWithErrorHandling(`${API_BASE_URL}/predict/batch`, {
    method: 'POST',
    body: JSON.stringify({ customers }),
  });
}

export const apiService = new ApiService();