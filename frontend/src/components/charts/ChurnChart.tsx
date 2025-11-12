import React from 'react';
import { AnalyticsData } from '../../types';

interface ChurnChartProps {
  data: AnalyticsData;
}

export const ChurnChart: React.FC<ChurnChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.monthlyTrends.map(d => Math.max(d.churn, d.retained)));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Monthly Churn Trends</h3>
      <div className="flex items-end justify-between h-64 space-x-2">
        {data.monthlyTrends.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex flex-col items-center space-y-1 w-full">
              <div
                className="bg-green-500 w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{ height: `${(item.retained / maxValue) * 200}px` }}
                title={`Retained: ${item.retained}`}
              />
              <div
                className="bg-red-500 w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{ height: `${(item.churn / maxValue) * 200}px` }}
                title={`Churn: ${item.churn}`}
              />
            </div>
            <span className="text-sm text-gray-600 mt-2">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Churn</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Retained</span>
        </div>
      </div>
    </div>
  );
};