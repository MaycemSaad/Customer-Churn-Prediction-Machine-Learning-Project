import React, { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { ChurnChart } from '../components/charts/ChurnChart'
import { MetricsChart } from '../components/charts/MetricsChart'
import { apiService } from '../services/api'
import { AnalyticsData } from '../types'

export const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await apiService.getAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  const metricsData = [
    { label: 'Feature Importance 1', value: 85, color: '#3b82f6' },
    { label: 'Feature Importance 2', value: 72, color: '#ef4444' },
    { label: 'Feature Importance 3', value: 68, color: '#10b981' },
    { label: 'Feature Importance 4', value: 54, color: '#f59e0b' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Deep insights into customer behavior and churn patterns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChurnChart data={analytics} />
          <MetricsChart data={metricsData} title="Feature Importance" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover-lift">
            <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy</span>
                <span className="font-semibold text-green-600">87.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Precision</span>
                <span className="font-semibold text-blue-600">85.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recall</span>
                <span className="font-semibold text-purple-600">82.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">F1-Score</span>
                <span className="font-semibold text-orange-600">83.6%</span>
              </div>
            </div>
          </Card>

          <Card className="hover-lift">
            <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">High Risk</span>
                  <span className="text-sm font-medium">23%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Medium Risk</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Low Risk</span>
                  <span className="text-sm font-medium">32%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="hover-lift">
            <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>High service calls increase churn risk by 3.2x</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>International plan users have 40% higher retention</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Evening usage patterns are strong predictors</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Account length correlates with loyalty</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}