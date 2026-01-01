import { WasteDetection } from '../types/aquaculture';
import { AlertCircle, MapPin } from 'lucide-react';

interface WasteDetectionPanelProps {
  detections: WasteDetection[];
}

export function WasteDetectionPanel({ detections }: WasteDetectionPanelProps) {
  const recentDetections = [...detections]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  const getDetectionIcon = (type: string) => {
    const icons: Record<string, string> = {
      plastic_bottle: '🧴',
      plastic_bag: '🛍️',
      fishing_net: '🕸️',
      oil_slick: '🛢️',
      debris: '🗑️',
      microplastics: '⚠️',
    };
    return icons[type] || '🗑️';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return 'bg-green-100 text-green-800 border-green-300';
    if (confidence >= 0.75) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalDetections = detections.length;
  const avgConfidence = detections.length > 0
    ? (detections.reduce((sum, d) => sum + d.confidence_score, 0) / detections.length * 100)
    : 0;

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Marine Waste Detection</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <AlertCircle size={16} />
          <span>{totalDetections} detections</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gradient-to-r from-red-50 to-orange-50 p-4 border border-red-200">
          <p className="text-sm text-gray-600">Total Detections</p>
          <p className="text-3xl font-bold text-gray-900">{totalDetections}</p>
          <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
        </div>
        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Avg Confidence</p>
          <p className="text-3xl font-bold text-gray-900">{avgConfidence.toFixed(0)}%</p>
          <p className="text-xs text-gray-500 mt-1">Detection accuracy</p>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {recentDetections.map((detection, index) => (
          <div
            key={detection.id || index}
            className="rounded-lg border border-gray-200 bg-gray-50 p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{getDetectionIcon(detection.detection_type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 capitalize">
                    {detection.detection_type.replace('_', ' ')}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getConfidenceColor(detection.confidence_score)}`}>
                    {(detection.confidence_score * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin size={12} />
                  <span>{detection.location}</span>
                  <span className="text-gray-400">•</span>
                  <span>{formatTime(detection.timestamp)}</span>
                </div>
                {detection.bbox_data && (
                  <div className="mt-2 text-xs text-gray-500">
                    Position: ({detection.bbox_data.x}, {detection.bbox_data.y}) •
                    Size: {detection.bbox_data.width}×{detection.bbox_data.height}px
                  </div>
                )}
              </div>
            </div>
            {detection.image_url && (
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={detection.image_url}
                  alt={detection.detection_type}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {recentDetections.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No debris detected - waters are clear</p>
        </div>
      )}
    </div>
  );
}
