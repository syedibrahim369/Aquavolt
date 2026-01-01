import { Line } from 'react-chartjs-2';
import type { Metrics } from '../types/aquaculture';

interface ParameterChartProps {
  title: string;
  data: number[];
  labels: string[];
  color: string;
  unit: string;
  currentValue: number;
  icon: React.ReactNode;
  trend?: number;
  status?: 'ok' | 'warn' | 'bad';
}

export function ParameterChart({
  title,
  data,
  labels,
  color,
  unit,
  currentValue,
  icon,
  trend,
  status = 'ok'
}: ParameterChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
          drawBorder: false,
        },
        ticks: {
          color: '#ffffff',
          font: { size: 11 },
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#ffffff',
          font: { size: 10 },
          maxTicksLimit: 8,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(7, 19, 29, 0.95)',
        titleColor: color,
        bodyColor: '#ffffff',
        borderColor: color,
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y.toFixed(2)} ${unit}`;
          }
        }
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
    },
  };

  const statusColor = status === 'ok' ? 'var(--ok)' : status === 'warn' ? 'var(--warn)' : 'var(--bad)';

  return (
    <div className="glass-panel fade-in" style={{ padding: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {icon}
          <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: color, margin: 0 }}>
            {title}
          </h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: statusColor }}>
            {currentValue.toFixed(title === 'Ammonia NH₃' ? 3 : title === 'pH Level' ? 2 : 1)}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{unit}</div>
        </div>
      </div>

      {trend !== undefined && (
        <div style={{ marginBottom: '0.4rem', padding: '0.35rem', background: 'rgba(12, 30, 44, 0.5)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>1h Trend:</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: trend > 0 ? 'var(--cy)' : trend < 0 ? 'var(--warn)' : 'var(--ok)' }}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend).toFixed(2)} {unit}
          </span>
        </div>
      )}

      <div style={{ height: '120px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
