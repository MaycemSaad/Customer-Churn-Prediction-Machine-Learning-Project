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
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskGradient = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return 'from-red-500 to-red-600';
      case 'MEDIUM': return 'from-yellow-500 to-yellow-600';
      case 'LOW': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading real-time dashboard data...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest insights</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Issue</h3>
          <p className="text-gray-600 mb-6">We couldn't load the dashboard data. Please check your connection and try again.</p>
          <button 
            onClick={loadDashboardData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const riskDistribution = getRiskDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Real-time customer churn analytics and insights • Last update: {lastUpdate}
            </p>
          </div>
          <button 
            onClick={loadDashboardData}
            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md flex items-center space-x-3"
          >
            <span className="text-lg">🔄</span>
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="text-3xl font-bold mb-2">
                {analytics.total_predictions.toLocaleString()}
              </div>
              <div className="text-blue-100 font-medium">Total Predictions</div>
              <div className="absolute bottom-2 right-4 text-4xl opacity-20">📊</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="text-3xl font-bold mb-2">
                {(analytics.churn_rate * 100).toFixed(1)}%
              </div>
              <div className="text-green-100 font-medium">Churn Rate</div>
              <div className="absolute bottom-2 right-4 text-4xl opacity-20">📈</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="text-3xl font-bold mb-2">
                {(analytics.avg_confidence * 100).toFixed(1)}%
              </div>
              <div className="text-purple-100 font-medium">Avg Confidence</div>
              <div className="absolute bottom-2 right-4 text-4xl opacity-20">🎯</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0">
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="text-3xl font-bold mb-2">
                {analytics.high_risk_customers}
              </div>
              <div className="text-red-100 font-medium">High Risk Customers</div>
              <div className="absolute bottom-2 right-4 text-4xl opacity-20">⚠️</div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Churn Analytics</h3>
                <p className="text-gray-600 mb-6">Real-time churn trends and predictions</p>
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
          
          <div className="xl:col-span-1">
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Risk Distribution</h3>
                <p className="text-gray-600 mb-6">Based on recent predictions</p>
                
                <div className="space-y-6">
                  {[
                    { level: 'HIGH', color: 'red', value: riskDistribution.high, count: recentPredictions.filter(p => p.risk_level === 'HIGH').length },
                    { level: 'MEDIUM', color: 'yellow', value: riskDistribution.medium, count: recentPredictions.filter(p => p.risk_level === 'MEDIUM').length },
                    { level: 'LOW', color: 'green', value: riskDistribution.low, count: recentPredictions.filter(p => p.risk_level === 'LOW').length }
                  ].map((risk) => (
                    <div key={risk.level} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 capitalize">{risk.level.toLowerCase()} Risk</span>
                        <span className="text-sm font-bold text-gray-900">
                          {risk.value}% ({risk.count})
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full bg-gradient-to-r from-${risk.color}-500 to-${risk.color}-600 transition-all duration-1000 ease-out`}
                          style={{ width: `${risk.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">Sample Size</span>
                    <span className="text-sm font-bold text-blue-700">
                      {recentPredictions.length} predictions
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { 
              title: 'Predictions Today', 
              value: analytics.predictions_today, 
              gradient: 'from-orange-500 to-orange-600',
              icon: '📅'
            },
            { 
              title: 'Expected Churns Today', 
              value: Math.round(analytics.predictions_today * analytics.churn_rate), 
              gradient: 'from-indigo-500 to-indigo-600',
              icon: '📉'
            },
            { 
              title: 'Peak Hour', 
              value: `${Object.entries(analytics.hourly_distribution).reduce((max, [hour, count]) => 
                count > max.count ? { hour, count } : max, { hour: '0', count: 0 }
              ).hour}:00`, 
              gradient: 'from-teal-500 to-teal-600',
              icon: '⏰'
            },
            { 
              title: 'Avg Daily Predictions', 
              value: Math.round(analytics.total_predictions / 30), 
              gradient: 'from-pink-500 to-pink-600',
              icon: '📊'
            }
          ].map((metric, index) => (
            <Card key={index} className={`bg-gradient-to-br ${metric.gradient} text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0`}>
              <div className="p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm font-medium opacity-90">{metric.title}</div>
                <div className="absolute bottom-3 right-3 text-2xl opacity-30">{metric.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Predictions</h3>
                <p className="text-gray-600 mt-1">Latest customer churn risk assessments</p>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  Showing {recentPredictions.length} of {analytics.total_predictions} total
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {recentPredictions.length > 0 ? (
                recentPredictions.map((prediction, index) => (
                  <div 
                    key={prediction.prediction_id} 
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-4 h-4 rounded-full ${getRiskColor(prediction.risk_level)} ring-2 ring-white ring-offset-2 group-hover:scale-110 transition-transform`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {prediction.customer_id ? `Customer ${prediction.customer_id}` : 'Anonymous Customer'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="capitalize">{prediction.risk_level.toLowerCase()}</span> risk • 
                          {(prediction.churn_probability * 100).toFixed(1)}% churn probability
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                        {formatTimeAgo(prediction.timestamp)}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
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
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-gray-500 font-medium">No recent predictions available</p>
                  <p className="text-sm text-gray-400 mt-1">Predictions will appear here as they are generated</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Dashboard auto-updates every 30 seconds • Last refresh: {lastUpdate}
          </p>
        </div>
      </div>
    </div>
  );
};