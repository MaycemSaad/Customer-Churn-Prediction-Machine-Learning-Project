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
    
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [analyticsData, predictionsData] = await Promise.all([
        apiService.getAdvancedAnalytics(),
        apiService.getPredictionHistory(5, 0)
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
      case 'HIGH': return 'bg-gradient-to-r from-red-500 to-red-600';
      case 'MEDIUM': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'LOW': return 'bg-gradient-to-r from-green-500 to-green-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getRiskDistribution = () => {
    if (!recentPredictions.length) {
      return { high: 18, medium: 32, low: 50 };
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading real-time dashboard data...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your insights</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 mb-4 text-lg">Failed to load dashboard data</p>
          <button 
            onClick={loadDashboardData}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const riskDistribution = getRiskDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-600 text-sm">
                  Real-time analytics • Last update: <span className="font-semibold text-gray-800">{lastUpdate}</span>
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={loadDashboardData}
            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200 flex items-center space-x-3 group"
          >
            <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <div className="text-3xl font-bold mb-2">
                  {analytics.total_predictions.toLocaleString()}
                </div>
                <div className="text-blue-100 font-medium">Total Predictions</div>
                <div className="absolute bottom-0 right-0 text-4xl opacity-20">📊</div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <div className="text-3xl font-bold mb-2">
                  {(analytics.churn_rate * 100).toFixed(1)}%
                </div>
                <div className="text-emerald-100 font-medium">Churn Rate</div>
                <div className="absolute bottom-0 right-0 text-4xl opacity-20">📈</div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <div className="text-3xl font-bold mb-2">
                  {(analytics.avg_confidence * 100).toFixed(1)}%
                </div>
                <div className="text-purple-100 font-medium">Avg Confidence</div>
                <div className="absolute bottom-0 right-0 text-4xl opacity-20">🎯</div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <div className="text-3xl font-bold mb-2">
                  {analytics.high_risk_customers}
                </div>
                <div className="text-red-100 font-medium">High Risk Customers</div>
                <div className="absolute bottom-0 right-0 text-4xl opacity-20">⚠️</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Churn Chart - Prend 2/3 de l'espace */}
          <div className="xl:col-span-2">
            <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly Churn Trends</h3>
                <p className="text-gray-600 mb-6">Real-time churn analysis and predictions</p>
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
              </div>
            </Card>
          </div>

          {/* Risk Distribution - Prend 1/3 de l'espace */}
          <div className="xl:col-span-1">
            <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Risk Distribution (Recent)</h3>
                <div className="space-y-6">
                  {/* High Risk */}
                  <div className="group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                        <span>High Risk</span>
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {riskDistribution.high}% ({recentPredictions.filter(p => p.risk_level === 'HIGH').length})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500 group-hover:from-red-600 group-hover:to-red-700"
                        style={{ width: `${riskDistribution.high}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Medium Risk */}
                  <div className="group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"></div>
                        <span>Medium Risk</span>
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {riskDistribution.medium}% ({recentPredictions.filter(p => p.risk_level === 'MEDIUM').length})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500 group-hover:from-yellow-600 group-hover:to-yellow-700"
                        style={{ width: `${riskDistribution.medium}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Low Risk */}
                  <div className="group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                        <span>Low Risk</span>
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {riskDistribution.low}% ({recentPredictions.filter(p => p.risk_level === 'LOW').length})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 group-hover:from-green-600 group-hover:to-green-700"
                        style={{ width: `${riskDistribution.low}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Based on {recentPredictions.length} recent predictions
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl text-white">📅</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {analytics.predictions_today}
              </div>
              <div className="text-gray-600 font-medium">Predictions Today</div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl text-white">📉</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.round(analytics.predictions_today * analytics.churn_rate)}
              </div>
              <div className="text-gray-600 font-medium">Expected Churns Today</div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl text-white">⏰</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Object.entries(analytics.hourly_distribution).reduce((max, [hour, count]) => 
                  count > max.count ? { hour, count } : max, { hour: '0', count: 0 }
                ).hour}:00
              </div>
              <div className="text-gray-600 font-medium">Peak Hour</div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl text-white">📊</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.round(analytics.total_predictions / 30)}
              </div>
              <div className="text-gray-600 font-medium">Avg Daily Predictions</div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Recent Predictions</h3>
                <p className="text-gray-600">Latest customer churn predictions and risk assessments</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl border border-blue-100">
                <span className="text-sm font-medium text-gray-700">
                  Showing {recentPredictions.length} of {analytics.total_predictions} total
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {recentPredictions.length > 0 ? (
                recentPredictions.map((prediction, index) => (
                  <div 
                    key={prediction.prediction_id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${getRiskColor(prediction.risk_level)}`}></div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {prediction.customer_name ? `Customer ${prediction.customer_name}` : 'Anonymous Customer'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {prediction.risk_level.toLowerCase().replace('_', ' ')} risk • 
                          {(prediction.churn_probability * 100).toFixed(1)}% churn probability
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 block mb-1">
                        {formatTimeAgo(prediction.timestamp)}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        prediction.prediction === 1 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {prediction.prediction === 1 ? 'CHURN' : 'NO CHURN'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-gray-400">📊</span>
                  </div>
                  <p className="text-gray-500">No recent predictions available</p>
                  <p className="text-gray-400 text-sm mt-1">Predictions will appear here as they are generated</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};