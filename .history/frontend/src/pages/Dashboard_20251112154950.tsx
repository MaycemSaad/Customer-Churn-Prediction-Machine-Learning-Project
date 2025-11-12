import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChurnChart } from '../components/charts/ChurnChart';
import { RiskDistributionChart } from '../components/charts/';
import { apiService } from '../services/api';
import { AnalyticsResponse, PredictionResponse } from '../types';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Target,
  RefreshCw,
  Clock,
  BarChart3,
  Shield
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [recentPredictions, setRecentPredictions] = useState<PredictionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    
    // Rafraîchir les données toutes les 30 secondes
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Charger toutes les données en parallèle
      const [analyticsData, predictionsData] = await Promise.all([
        apiService.getAdvancedAnalytics(),
        apiService.getPredictionHistory(8, 0)
      ]);
      
      setAnalytics(analyticsData);
      setRecentPredictions(predictionsData.predictions);
      setLastUpdate(new Date().toLocaleTimeString());
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return <AlertTriangle className="w-4 h-4" />;
      case 'MEDIUM': return <Shield className="w-4 h-4" />;
      case 'LOW': return <Target className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
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
      low: Math.round((low / total) * 100),
      counts: { high, medium, low }
    };
  };

  const formatTimeAgo = (timestamp: string) => {
    try {
      const now = new Date();
      const predictionTime = new Date(timestamp);
      const diffInMinutes = Math.floor((now.getTime() - predictionTime.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const getPeakHour = () => {
    if (!analytics) return 'N/A';
    
    const peak = Object.entries(analytics.hourly_distribution).reduce(
      (max, [hour, count]) => count > max.count ? { hour, count } : max,
      { hour: '9', count: 0 }
    );
    
    return `${peak.hour}:00`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Gathering real-time insights...</p>
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={() => loadDashboardData(true)}
            loading={refreshing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const riskDistribution = getRiskDistribution();
  const expectedChurns = Math.round(analytics.predictions_today * analytics.churn_rate);
  const avgDailyPredictions = Math.round(analytics.total_predictions / 30);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Churn Analytics Dashboard
            </h1>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>Last updated: {lastUpdate}</span>
              {refreshing && (
                <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
              )}
            </div>
          </div>
          <Button 
            onClick={() => loadDashboardData(true)}
            loading={refreshing}
            variant="secondary"
            className="bg-white hover:bg-gray-50 border border-gray-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-600" />
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {analytics.total_predictions.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-blue-600">Total Predictions</div>
              <div className="text-xs text-gray-500 mt-1">
                +{analytics.predictions_today} today
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-green-600" />
                <div className={`text-sm font-semibold ${
                  analytics.churn_rate < 0.1 ? 'text-green-500' : 
                  analytics.churn_rate < 0.2 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {analytics.churn_rate < 0.1 ? 'Low' : analytics.churn_rate < 0.2 ? 'Medium' : 'High'}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {(analytics.churn_rate * 100).toFixed(1)}%
              </div>
              <div className="text-sm font-medium text-green-600">Churn Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                {expectedChurns} expected today
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <div className="text-sm font-semibold text-purple-500">
                  {analytics.avg_confidence > 0.8 ? 'High' : 'Good'}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {(analytics.avg_confidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm font-medium text-purple-600">Model Confidence</div>
              <div className="text-xs text-gray-500 mt-1">
                Average prediction accuracy
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div className="text-sm font-semibold text-red-500">
                  {analytics.high_risk_customers > 10 ? 'Critical' : 'Monitor'}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {analytics.high_risk_customers}
              </div>
              <div className="text-sm font-medium text-red-600">High Risk Customers</div>
              <div className="text-xs text-gray-500 mt-1">
                Need immediate attention
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Churn Trends - 2/3 width */}
          <Card className="xl:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Churn Trends & Analytics</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Last 24 hours
                </div>
              </div>
              <ChurnChart data={{
                totalCustomers: analytics.total_predictions,
                churnRate: analytics.churn_rate * 100,
                predictionAccuracy: analytics.avg_confidence * 100,
                monthlyTrends: Object.entries(analytics.hourly_distribution).map(([hour, count]) => ({
                  month: `${hour.padStart(2, '0')}:00`,
                  churn: Math.round(count * analytics.churn_rate),
                  retained: Math.round(count * (1 - analytics.churn_rate))
                }))
              }} />
            </div>
          </Card>

          {/* Risk Distribution - 1/3 width */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
                <div className="text-sm text-gray-500">
                  {recentPredictions.length} recent
                </div>
              </div>
              <RiskDistributionChart data={riskDistribution} />
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">High Risk</span>
                  </div>
                  <span className="text-sm font-semibold text-red-800">
                    {riskDistribution.counts.high} customers
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">Medium Risk</span>
                  </div>
                  <span className="text-sm font-semibold text-yellow-800">
                    {riskDistribution.counts.medium} customers
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Low Risk</span>
                  </div>
                  <span className="text-sm font-semibold text-green-800">
                    {riskDistribution.counts.low} customers
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Stats & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Stats */}
          <Card className="lg:col-span-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-700">Today's Predictions</span>
                  <span className="text-lg font-bold text-blue-700">{analytics.predictions_today}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-orange-700">Peak Activity</span>
                  <span className="text-lg font-bold text-orange-700">{getPeakHour()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-purple-700">Daily Average</span>
                  <span className="text-lg font-bold text-purple-700">{avgDailyPredictions}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-700">Retention Rate</span>
                  <span className="text-lg font-bold text-green-700">
                    {((1 - analytics.churn_rate) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Predictions</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {recentPredictions.length} of {analytics.total_predictions} total
                </div>
              </div>
              
              <div className="space-y-3">
                {recentPredictions.length > 0 ? (
                  recentPredictions.map((prediction) => (
                    <div 
                      key={prediction.prediction_id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getRiskColor(prediction.risk_level)}`}>
                          {getRiskIcon(prediction.risk_level)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {prediction.customer_id ? `Customer ${prediction.customer_id}` : 'Anonymous Customer'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {(prediction.churn_probability * 100).toFixed(1)}% churn probability
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-sm text-gray-500 block mb-1">
                          {formatTimeAgo(prediction.timestamp)}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          prediction.prediction === 1 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {prediction.prediction === 1 ? (
                            <>
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              CHURN RISK
                            </>
                          ) : (
                            <>
                              <Target className="w-3 h-3 mr-1" />
                              RETAINED
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No recent predictions</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Make some predictions to see data here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};