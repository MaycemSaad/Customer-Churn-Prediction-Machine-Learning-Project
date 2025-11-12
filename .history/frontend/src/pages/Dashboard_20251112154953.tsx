import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { ChurnChart } from '../components/charts/ChurnChart';
import { apiService } from '../services/api';
import { AnalyticsResponse, PredictionResponse } from '../types';

export const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [recentPredictions, setRecentPredictions] = useState<PredictionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
    
    // Rafraîchir les données toutes les 30 secondes
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger toutes les données en parallèle
      const [analyticsData, predictionsData] = await Promise.all([
        apiService.getAdvancedAnalytics(),
        apiService.getPredictionHistory(5, 0) // 5 prédictions récentes
      ]);
      
      setAnalytics(analyticsData);
      setRecentPredictions(predictionsData.predictions);
      setLastUpdate(new Date().toLocaleTimeString());
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskDistribution = () => {
    if (!recentPredictions.length) {
      return { high: 18, medium: 32, low: 50 }; // Valeurs par défaut
    }

    const total = recentPredictions.length;
    const high = recentPredictions.filter(p => p.risk_level === 'HIGH').length;
    const medium = recentPredictions.filter(p => p.risk_level === 'MEDIUM').length;
    const low = recentPredictions.filter(p => p.risk_level === 'LOW').length;

    return {
      high: Math.round((high / total) * 100),
      medium: Math.round((medium / total) * 100),
      low: Math.round((low / total) * 100)
    };
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const predictionTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - predictionTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading real-time dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard data</p>
          <button 
            onClick={loadDashboardData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const riskDistribution = getRiskDistribution();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600">
              Real-time customer churn analytics and insights • Last update: {lastUpdate}
            </p>
          </div>
          <button 
            onClick={loadDashboardData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        </div>

        {/* Key Metrics - Données dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="p-6">
              <div className="text-2xl font-bold mb-2">
                {analytics.total_predictions.toLocaleString()}
              </div>
              <div className="text-blue-100">Total Predictions</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="p-6">
              <div className="text-2xl font-bold mb-2">
                {(analytics.churn_rate * 100).toFixed(1)}%
              </div>
              <div className="text-green-100">Churn Rate</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="p-6">
              <div className="text-2xl font-bold mb-2">
                {(analytics.avg_confidence * 100).toFixed(1)}%
              </div>
              <div className="text-purple-100">Avg Confidence</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="p-6">
              <div className="text-2xl font-bold mb-2">
                {analytics.high_risk_customers}
              </div>
              <div className="text-red-100">High Risk Customers</div>
            </div>
          </Card>
        </div>

        {/* Charts - Données dynamiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Convertir AnalyticsResponse en AnalyticsData pour ChurnChart */}
          <ChurnChart data={{
            totalCustomers: analytics.total_predictions,
            churnRate: analytics.churn_rate * 100,
            predictionAccuracy: analytics.avg_confidence * 100,
            monthlyTrends: Object.entries(analytics.hourly_distribution).map(([hour, count]) => ({
              month: `${hour}:00`,
              churn: Math.round(count * analytics.churn_rate),
              retained: Math.round(count * (1 - analytics.churn_rate))
            }))
          }} />
          
          {/* Risk Distribution - Dynamique */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Risk Distribution (Recent)</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">High Risk</span>
                  <span className="text-sm font-medium">
                    {riskDistribution.high}% ({recentPredictions.filter(p => p.risk_level === 'HIGH').length})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${riskDistribution.high}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Medium Risk</span>
                  <span className="text-sm font-medium">
                    {riskDistribution.medium}% ({recentPredictions.filter(p => p.risk_level === 'MEDIUM').length})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${riskDistribution.medium}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Low Risk</span>
                  <span className="text-sm font-medium">
                    {riskDistribution.low}% ({recentPredictions.filter(p => p.risk_level === 'LOW').length})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${riskDistribution.low}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Based on {recentPredictions.length} recent predictions
            </div>
          </Card>
        </div>

        {/* Predictions Today Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="p-6">
              <div className="text-2xl font-bold mb-2">
                {analytics.predictions_today}
              </div>
              <div className="text-orange-100">Predictions Today</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <div className="p-6">
              <div className="text-2xl font-bold mb-2">
                {Math.round(analytics.predictions_today * analytics.churn_rate)}
              </div>
              <div className="text-indigo-100">Expected Churns Today</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <div className="p-6">
              <div className="text-2xl font-bold mb-2">
                {Object.entries(analytics.hourly_distribution).reduce((max, [hour, count]) => 
                  count > max.count ? { hour, count } : max, { hour: '0', count: 0 }
                ).hour}:00
              </div>
              <div className="text-teal-100">Peak Hour</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
            <div className="p-6">
              <div className="text-2xl font-bold mb-2">
                {Math.round(analytics.total_predictions / 30)}
              </div>
              <div className="text-pink-100">Avg Daily Predictions</div>
            </div>
          </Card>
        </div>

        {/* Recent Activity - Dynamique */}
        <Card className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Predictions</h3>
            <span className="text-sm text-gray-500">
              Showing {recentPredictions.length} of {analytics.total_predictions} total
            </span>
          </div>
          <div className="space-y-3">
            {recentPredictions.length > 0 ? (
              recentPredictions.map((prediction, index) => (
                <div key={prediction.prediction_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(prediction.risk_level)}`}></div>
                    <div>
                      <p className="font-medium">
                        {prediction.customer_id ? `Customer ${prediction.customer_id}` : 'Anonymous Customer'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {prediction.risk_level.toLowerCase().replace('_', ' ')} risk • 
                        {(prediction.churn_probability * 100).toFixed(1)}% churn probability
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 block">
                      {formatTimeAgo(prediction.timestamp)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      prediction.prediction === 1 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {prediction.prediction === 1 ? 'CHURN' : 'NO CHURN'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No recent predictions available
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};