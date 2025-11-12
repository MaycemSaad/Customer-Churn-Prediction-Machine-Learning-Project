import { 
  PredictionInput, 
  PredictionResponse, 
  CustomerData, 
  AnalyticsData,
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

  // === ENDPOINTS DE BASE ===
  
  async healthCheck(): Promise<ApiHealth> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/health`);
  }

  async predictChurn(data: PredictionInput): Promise<PredictionResponse> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // === ENDPOINTS AVANCÉS ===

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

  // === MÉTHODES DE COMPATIBILITÉ ===

  async getAnalytics(): Promise<AnalyticsData> {
    try {
      // Essayer d'abord le nouvel endpoint
      const advancedData = await this.getAdvancedAnalytics();
      
      // Convertir les nouvelles données en format ancien pour la compatibilité
      return {
        totalCustomers: advancedData.total_predictions,
        churnRate: advancedData.churn_rate,
        predictionAccuracy: advancedData.avg_confidence,
        monthlyTrends: this.generateMonthlyTrends(advancedData)
      };
    } catch (error) {
      console.error('Failed to get advanced analytics, using fallback:', error);
      // Fallback vers des données simulées si l'API échoue
      return this.getFallbackAnalytics();
    }
  }

  private generateMonthlyTrends(analytics: AnalyticsResponse) {
    // Générer des tendances mensuelles basées sur les données actuelles
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseChurn = Math.round(analytics.total_predictions * analytics.churn_rate / 6);
    
    return months.map(month => ({
      month,
      churn: Math.round(baseChurn * (0.8 + Math.random() * 0.4)),
      retained: Math.round((analytics.total_predictions / 6) * (1 - analytics.churn_rate) * (0.8 + Math.random() * 0.4))
    }));
  }

  private getFallbackAnalytics(): AnalyticsData {
    return {
      totalCustomers: 1247,
      churnRate: 0.143,
      predictionAccuracy: 0.872,
      monthlyTrends: [
        { month: 'Jan', churn: 45, retained: 320 },
        { month: 'Feb', churn: 52, retained: 315 },
        { month: 'Mar', churn: 48, retained: 325 },
        { month: 'Apr', churn: 61, retained: 310 },
        { month: 'May', churn: 55, retained: 305 },
        { month: 'Jun', churn: 58, retained: 312 },
      ],
    };
  }

  async getCustomers(): Promise<CustomerData[]> {
    try {
      // Essayer de récupérer l'historique des prédictions pour avoir des données réelles
      const history = await this.getPredictionHistory(10);
      
      if (history.predictions.length > 0) {
        // Convertir l'historique en format CustomerData
        return history.predictions.map(pred => ({
          id: pred.prediction_id,
          name: pred.customer_id ? `Customer ${pred.customer_id}` : 'Unknown Customer',
          email: 'customer@example.com',
          phone: '+1 (555) 000-0000',
          signup_date: new Date().toISOString().split('T')[0],
          account_length: 120,
          international_plan: 0,
          voice_mail_plan: 0,
          number_vmail_messages: 0,
          total_day_minutes: 200,
          total_day_calls: 100,
          total_day_charge: 30,
          total_eve_minutes: 200,
          total_eve_calls: 100,
          total_eve_charge: 15,
          total_night_minutes: 200,
          total_night_calls: 100,
          total_night_charge: 10,
          total_intl_minutes: 10,
          total_intl_calls: 5,
          total_intl_charge: 3,
          customer_service_calls: 2,
          customer_id: pred.customer_id,
          churn_probability: pred.churn_probability,
          prediction: pred.prediction,
          confidence: pred.confidence,
          risk_level: pred.risk_level
        }));
      }
      
      // Fallback vers des données simulées
      return this.getFallbackCustomers();
    } catch (error) {
      console.error('Failed to get customers from history, using fallback:', error);
      return this.getFallbackCustomers();
    }
  }

  private getFallbackCustomers(): CustomerData[] {
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
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        phone: '+1 (555) 456-7890',
        signup_date: '2023-03-10',
        account_length: 85,
        international_plan: 0,
        voice_mail_plan: 0,
        number_vmail_messages: 0,
        total_day_minutes: 312.7,
        total_day_calls: 125,
        total_day_charge: 53.16,
        total_eve_minutes: 234.1,
        total_eve_calls: 112,
        total_eve_charge: 19.90,
        total_night_minutes: 198.4,
        total_night_calls: 88,
        total_night_charge: 8.93,
        total_intl_minutes: 8.7,
        total_intl_calls: 2,
        total_intl_charge: 2.35,
        customer_service_calls: 5,
      }
    ];
  }

  async getRealTimeStats(): Promise<RealTimeStats> {
    try {
      // Utiliser les données d'analytics avancées pour des statistiques en temps réel
      const analytics = await this.getAdvancedAnalytics();
      
      return {
        activePredictions: analytics.predictions_today,
        totalPredictions: analytics.total_predictions,
        accuracyRate: analytics.avg_confidence * 100, // Convertir en pourcentage
        avgResponseTime: 1.8 // Cette valeur pourrait venir d'un endpoint dédié
      };
    } catch (error) {
      console.error('Failed to get real-time stats, using fallback:', error);
      // Fallback vers des données simulées
      return {
        activePredictions: 42,
        totalPredictions: 1247,
        accuracyRate: 87.2,
        avgResponseTime: 1.8,
      };
    }
  }

  // === MÉTHODES UTILITAIRES ===
  
  async checkAPIConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.error('API connection failed:', error);
      return false;
    }
  }

  async getFeatureImportance(): Promise<{[key: string]: number}> {
    try {
      const metrics = await this.getModelMetrics();
      return metrics.feature_importance;
    } catch (error) {
      console.error('Failed to get feature importance:', error);
      return {};
    }
  }

  async getTopFeatures(limit: number = 5): Promise<Array<{feature: string, importance: number}>> {
    const featureImportance = await this.getFeatureImportance();
    return Object.entries(featureImportance)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([feature, importance]) => ({ feature, importance }));
  }
}

export const apiService = new ApiService();