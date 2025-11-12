import { 
  PredictionInput, 
  PredictionResponse, 
  CustomerData, 
  AnalyticsData,
  ModelMetrics,
  RealTimeStats,
  ApiHealth,
  // Nouvelles interfaces
  ModelMetricsResponse,
  AnalyticsResponse,
  BatchPredictionInput,
  BatchPredictionResponse,
  PredictionHistory
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

  // Endpoints existants
  async healthCheck(): Promise<ApiHealth> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/health`);
  }

  async predictChurn(data: PredictionInput): Promise<PredictionResponse> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Nouveaux endpoints avancés
  async batchPredict(customers: PredictionInput[]): Promise<BatchPredictionResponse> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/predict/batch`, {
      method: 'POST',
      body: JSON.stringify({ customers }),
    });
  }

  async getModelMetrics(): Promise<ModelMetricsResponse> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/model/metrics`);
  }

  async getAdvancedAnalytics(): Promise<AnalyticsResponse> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/analytics/dashboard`);
  }

  async getPredictionHistory(limit: number = 50, offset: number = 0): Promise<PredictionHistory> {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/predictions/history?limit=${limit}&offset=${offset}`
    );
  }

  async retrainModel(): Promise<{ message: string }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/model/retrain`, {
      method: 'POST',
    });
  }

  // Méthodes existantes pour la compatibilité
  async getAnalytics(): Promise<AnalyticsData> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/analytics/dashboard`);
  }

  async getCustomers(): Promise<CustomerData[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        signup_date: '2023-01-15',
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
        phone: '+1 (555) 987-6543',
        signup_date: '2022-11-20',
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
    ];
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
}

export const apiService = new ApiService();