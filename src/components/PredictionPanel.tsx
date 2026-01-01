import { Prediction } from '../types/aquaculture';
import { TrendingUp, Brain } from 'lucide-react';

interface PredictionPanelProps {
  predictions: Prediction[];
}

export function PredictionPanel({ predictions }: PredictionPanelProps) {
  const groupedPredictions = predictions.reduce((acc, pred) => {
    if (!acc[pred.parameter_name]) {
      acc[pred.parameter_name] = [];
    }
    acc[pred.parameter_name].push(pred);
    return acc;
  }, {} as Record<string, Prediction[]>);

  const getParameterLabel = (param: string) => {
    const labels: Record<string, string> = {
      dissolved_oxygen_mgl: 'Dissolved Oxygen',
      ph: 'pH Level',
      turbidity_ntu: 'Turbidity',
      temperature_c: 'Temperature',
    };
    return labels[param] || param;
  };

  const getParameterUnit = (param: string) => {
    const units: Record<string, string> = {
      dissolved_oxygen_mgl: 'mg/L',
      ph: '',
      turbidity_ntu: 'NTU',
      temperature_c: '°C',
    };
    return units[param] || '';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.90) return 'text-green-600';
    if (confidence >= 0.85) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const formatTargetTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <Brain className="text-purple-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">AI Predictions (Next 6 Hours)</h3>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedPredictions).map(([parameter, preds]) => {
          const latestPred = preds[preds.length - 1];
          const avgConfidence = preds.reduce((sum, p) => sum + p.confidence_score, 0) / preds.length;

          return (
            <div key={parameter} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {getParameterLabel(parameter)}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Model: {latestPred.model_type}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${getConfidenceColor(avgConfidence)}`}>
                    {(avgConfidence * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-500">confidence</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {preds.slice(0, 3).map((pred, idx) => (
                  <div
                    key={pred.id || idx}
                    className="rounded bg-white p-2 border border-gray-200"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp size={12} className="text-blue-600" />
                      <p className="text-xs text-gray-500">
                        {formatTargetTime(pred.target_time)}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {pred.predicted_value.toFixed(2)}
                      <span className="text-xs text-gray-500 ml-1">
                        {getParameterUnit(parameter)}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${avgConfidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
        <p className="text-xs font-medium text-blue-900">Model Performance</p>
        <p className="text-xs text-blue-700 mt-1">
          Predictions generated using LSTM neural networks and Random Forest models
          trained on historical aquaculture data patterns.
        </p>
      </div>
    </div>
  );
}
