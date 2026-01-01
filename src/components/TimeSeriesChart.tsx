import { SensorData } from '../types/aquaculture';
import { useEffect, useRef } from 'react';

interface TimeSeriesChartProps {
  data: SensorData[];
  parameter: keyof SensorData;
  title: string;
  unit: string;
  color: string;
  thresholds?: { min?: number; max?: number };
}

export function TimeSeriesChart({ data, parameter, title, unit, color, thresholds }: TimeSeriesChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    ctx.clearRect(0, 0, rect.width, rect.height);

    const padding = { top: 20, right: 40, bottom: 40, left: 50 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    const values = data.map(d => Number(d[parameter]));
    const minValue = Math.min(...values, thresholds?.min || Infinity) * 0.95;
    const maxValue = Math.max(...values, thresholds?.max || -Infinity) * 1.05;
    const valueRange = maxValue - minValue;

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();

      const value = maxValue - (valueRange / 5) * i;
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(1), padding.left - 8, y + 4);
    }

    if (thresholds?.max !== undefined) {
      const y = padding.top + chartHeight - ((thresholds.max - minValue) / valueRange) * chartHeight;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (thresholds?.min !== undefined) {
      const y = padding.top + chartHeight - ((thresholds.min - minValue) / valueRange) * chartHeight;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth;
      const value = Number(point[parameter]);
      const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    const xLabels = 6;
    for (let i = 0; i < xLabels; i++) {
      const dataIndex = Math.floor((i / (xLabels - 1)) * (data.length - 1));
      const x = padding.left + (dataIndex / (data.length - 1)) * chartWidth;
      const time = new Date(data[dataIndex].timestamp);
      const label = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      ctx.fillText(label, x, rect.height - 10);
    }

  }, [data, parameter, color, thresholds]);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      <canvas ref={canvasRef} className="w-full" style={{ height: '250px' }} />
    </div>
  );
}
