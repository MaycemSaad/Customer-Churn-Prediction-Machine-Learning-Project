import { PredictionInput, PredictionResponse, CustomerData, AnalyticsData } from '../types';

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
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; model_loaded: boolean }> {
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
    // In a real app, this would be an API call
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
    // Mock data
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
          // Add more mock customers as needed
        ]);
      }, 800);
    });
  }
}

export const apiService = new ApiService();