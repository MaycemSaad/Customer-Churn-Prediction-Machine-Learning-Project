import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { CustomerForm } from '../components/forms/CustomerForm';
import { usePrediction } from '../hooks/usePrediction';
import { CustomerData } from '../types';

export const Prediction: React.FC = () => {
  const { predict, loading, error, result } = usePrediction();
  const [setCustomerData] = useState<CustomerData | null>(null);

  const handleSubmit = async (data: CustomerData) => {
    setCustomerData(data);
    await predict(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Churn Prediction</h1>
          <p className="text-gray-600">
            Analyze customer data to predict churn probability and get actionable insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card title="Customer Information">
              <CustomerForm onSubmit={handleSubmit} loading={loading} />
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {error && (
              <Card className="border-red-200 bg-red-50">
                <div className="text-red-700">
                  <h4 className="font-semibold mb-2">Prediction Error</h4>
                  <p>{error}</p>
                </div>
              </Card>
            )}

            {result && (
              <Card title="Prediction Results">
                <div className="space-y-4">
                  {/* Churn Probability */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {(result.churn_probability * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Churn Probability</div>
                  </div>

                  {/* Prediction */}
                  <div className={`p-4 rounded-lg text-center ${
                    result.prediction === 1 
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    <div className="font-semibold text-lg mb-1">
                      {result.prediction === 1 ? '🚨 High Churn Risk' : '✅ Low Churn Risk'}
                    </div>
                    <p className="text-sm">{result.message}</p>
                  </div>

                  {/* Confidence */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Confidence</span>
                      <span className="text-sm font-bold text-gray-900">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Recommendations</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {result.prediction === 1 ? (
                        <>
                          <li>• Consider offering retention discounts</li>
                          <li>• Schedule proactive customer service call</li>
                          <li>• Review usage patterns for improvements</li>
                        </>
                      ) : (
                        <>
                          <li>• Continue current engagement strategy</li>
                          <li>• Monitor for any changes in usage</li>
                          <li>• Consider upselling opportunities</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Stats */}
            <Card title="Quick Stats">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Prediction Time</span>
                  <span className="font-medium">~2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model Accuracy</span>
                  <span className="font-medium">87.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Features Analyzed</span>
                  <span className="font-medium">16</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};