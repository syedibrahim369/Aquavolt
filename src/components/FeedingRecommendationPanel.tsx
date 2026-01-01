import { FeedingRecommendation } from '../types/aquaculture';
import { ArrowDown, ArrowUp, Minus, TrendingUp } from 'lucide-react';

interface FeedingRecommendationPanelProps {
  recommendation: FeedingRecommendation | null;
  metrics: {
    avgFCR: number;
    avgWasteRatio: number;
    energyCostPerKg: number;
    feedEfficiency: number;
  };
}

export function FeedingRecommendationPanel({ recommendation, metrics }: FeedingRecommendationPanelProps) {
  if (!recommendation) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Feeding Optimization</h3>
        <p className="text-gray-500">Loading recommendations...</p>
      </div>
    );
  }

  const getAdjustmentIcon = () => {
    if (recommendation.adjustment_percentage > 5) return <ArrowUp className="text-green-600" size={24} />;
    if (recommendation.adjustment_percentage < -5) return <ArrowDown className="text-red-600" size={24} />;
    return <Minus className="text-blue-600" size={24} />;
  };

  const getAdjustmentColor = () => {
    if (recommendation.adjustment_percentage > 5) return 'text-green-700';
    if (recommendation.adjustment_percentage < -5) return 'text-red-700';
    return 'text-blue-700';
  };

  const getEnvironmentColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Feeding Optimization</h3>

      <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border border-blue-200">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white p-3 shadow-sm">
            {getAdjustmentIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Recommended Feeding Rate</p>
            <p className="text-3xl font-bold text-gray-900">
              {recommendation.recommended_rate_gmin.toFixed(0)}
              <span className="text-lg text-gray-500 ml-1">g/min</span>
            </p>
            <p className={`text-sm font-semibold mt-1 ${getAdjustmentColor()}`}>
              {recommendation.adjustment_percentage > 0 ? '+' : ''}
              {recommendation.adjustment_percentage.toFixed(1)}% adjustment
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Environment Score</p>
            <p className={`text-2xl font-bold ${getEnvironmentColor(recommendation.environment_score)}`}>
              {(recommendation.environment_score * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
        <p className="text-sm font-medium text-gray-700">Reasoning:</p>
        <p className="text-sm text-gray-600 mt-1">{recommendation.reason}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-blue-600" />
            <p className="text-xs font-medium text-gray-600">Feed Conversion Ratio</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {metrics.avgFCR.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.avgFCR < 1.5 ? 'Excellent' : metrics.avgFCR < 1.8 ? 'Good' : 'Needs improvement'}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-orange-600" />
            <p className="text-xs font-medium text-gray-600">Feed Waste Ratio</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {metrics.avgWasteRatio.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.avgWasteRatio < 15 ? 'Excellent' : metrics.avgWasteRatio < 25 ? 'Good' : 'High'}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-green-600" />
            <p className="text-xs font-medium text-gray-600">Energy Cost per kg</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${metrics.energyCostPerKg.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">USD per kg fish</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-purple-600" />
            <p className="text-xs font-medium text-gray-600">Feed Efficiency</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {metrics.feedEfficiency.toFixed(0)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.feedEfficiency > 85 ? 'Excellent' : metrics.feedEfficiency > 75 ? 'Good' : 'Fair'}
          </p>
        </div>
      </div>
    </div>
  );
}
