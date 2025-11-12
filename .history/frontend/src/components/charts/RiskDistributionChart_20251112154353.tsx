import React from 'react';

interface RiskDistributionData {
  high: number;
  medium: number;
  low: number;
  counts: {
    high: number;
    medium: number;
    low: number;
  };
}

interface RiskDistributionChartProps {
  data: RiskDistributionData;
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ data }) => {
  const total = data.high + data.medium + data.low;
  
  return (
    <div className="space-y-4">
      {/* Bar Chart */}
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-500"
          style={{ width: `${data.high}%` }}
          title={`High Risk: ${data.high}%`}
        />
        <div 
          className="absolute top-0 h-full bg-yellow-500 transition-all duration-500"
          style={{ left: `${data.high}%`, width: `${data.medium}%` }}
          title={`Medium Risk: ${data.medium}%`}
        />
        <div 
          className="absolute top-0 h-full bg-green-500 transition-all duration-500"
          style={{ left: `${data.high + data.medium}%`, width: `${data.low}%` }}
          title={`Low Risk: ${data.low}%`}
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">High</span>
          </div>
          <div className="text-lg font-bold text-red-600">{data.high}%</div>
          <div className="text-xs text-gray-500">{data.counts.high} customers</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">Medium</span>
          </div>
          <div className="text-lg font-bold text-yellow-600">{data.medium}%</div>
          <div className="text-xs text-gray-500">{data.counts.medium} customers</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">Low</span>
          </div>
          <div className="text-lg font-bold text-green-600">{data.low}%</div>
          <div className="text-xs text-gray-500">{data.counts.low} customers</div>
        </div>
      </div>
    </div>
  );
};