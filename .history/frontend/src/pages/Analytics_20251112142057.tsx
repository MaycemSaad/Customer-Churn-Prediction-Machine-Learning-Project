import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { apiService } from '../services/api';
import { ModelMetricsResponse, AnalyticsResponse } from '../types';

export const AdvancedAnalytics: React.FC = () => {
  const [modelMetrics, setModelMetrics] = useState<ModelMetricsResponse | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metrics, analyticsData] = await Promise.all([
        apiService.getModelMetrics(),
        apiService.getAnalytics()
      ]);
      setModelMetrics(metrics);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Advanced Analytics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Model Performance */}
          <Card title="Model Performance">
            {modelMetrics && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {(modelMetrics.accuracy * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-600">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(modelMetrics.precision * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-green-600">Precision</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Feature Importance</h4>
                  {Object.entries(modelMetrics.feature_importance)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([feature, importance]) => (
                      <div key={feature} className="flex justify-between">
                        <span className="text-sm text-gray-600">{feature}</span>
                        <span className="text-sm font-medium">{(importance * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </Card>

          {/* Real-time Analytics */}
          <Card title="Real-time Analytics">
            {analytics && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {analytics.total_predictions}
                    </div>
                    <div className="text-sm text-purple-600">Total Predictions</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {(analytics.churn_rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-orange-600">Churn Rate</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Predictions Today</span>
                    <span className="font-semibold">{analytics.predictions_today}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Risk Customers</span>
                    <span className="font-semibold text-red-600">{analytics.high_risk_customers}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};