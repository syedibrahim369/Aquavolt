import { Video as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status?: 'good' | 'warning' | 'critical';
  subtitle?: string;
}

export function MetricCard({ title, value, unit, icon: Icon, status = 'good', subtitle }: MetricCardProps) {
  const statusColors = {
    good: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    critical: 'bg-red-50 border-red-200',
  };

  const iconColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600',
  };

  const valueColors = {
    good: 'text-gray-900',
    warning: 'text-yellow-900',
    critical: 'text-red-900',
  };

  return (
    <div className={`rounded-lg border-2 p-4 transition-all hover:shadow-md ${statusColors[status]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline">
            <p className={`text-3xl font-bold ${valueColors[status]}`}>
              {typeof value === 'number' ? value.toFixed(2) : value}
            </p>
            {unit && <span className="ml-2 text-sm text-gray-500">{unit}</span>}
          </div>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`rounded-full p-2 ${iconColors[status]} bg-white`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
