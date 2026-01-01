import { Alert } from '../types/aquaculture';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertPanelProps {
  alerts: Alert[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const sortedAlerts = [...alerts]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="text-red-600" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={20} />;
      default:
        return <Info className="text-blue-600" size={20} />;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (sortedAlerts.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Alert Feed</h3>
        <div className="flex items-center justify-center py-8 text-gray-400">
          <p>No active alerts - all systems normal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Alert Feed</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedAlerts.map((alert, index) => (
          <div
            key={alert.id || index}
            className={`rounded-lg border p-3 transition-all ${getSeverityStyle(alert.severity)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getAlertIcon(alert.severity)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{alert.message}</p>
                  <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  {alert.parameter_name}: {alert.parameter_value?.toFixed(2)} (threshold: {alert.threshold})
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
