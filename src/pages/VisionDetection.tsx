import { Camera, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Detection } from '../types/aquaculture';

interface VisionDetectionProps {
  detections: Detection[];
}

export function VisionDetection({ detections }: VisionDetectionProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    plastic: 0,
    debris: 0,
    oil: 0,
    net: 0,
  });

  useEffect(() => {
    const counts = {
      plastic: detections.filter(d => d.type.includes('Plastic')).length,
      debris: detections.filter(d => d.type === 'Debris').length,
      oil: detections.filter(d => d.type.includes('Oil')).length,
      net: detections.filter(d => d.type.includes('Net')).length,
    };
    setStats(counts);
  }, [detections]);

  const recentDetections = detections.slice(0, 5);
  const activeDetections = detections.slice(0, 3);

  return (
    <div className="page-transition">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Camera size={28} />
          Vision AI Detection System
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
          Real-time underwater waste and anomaly detection
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="metric-card fade-in">
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Plastic Detected</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--bad)' }}>{stats.plastic}</div>
        </div>
        <div className="metric-card fade-in">
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Debris Found</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warn)' }}>{stats.debris}</div>
        </div>
        <div className="metric-card fade-in">
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Oil Sheen</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--bad)' }}>{stats.oil}</div>
        </div>
        <div className="metric-card fade-in">
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Net Fragments</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warn)' }}>{stats.net}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--cy)' }}>Live Camera Feed</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="status-indicator status-bad" style={{ animation: 'pulse-dot 1s ease-in-out infinite' }}></span>
              <span style={{ fontSize: '0.75rem', color: 'var(--bad)' }}>RECORDING</span>
            </div>
          </div>

          <div
            ref={canvasRef}
            style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              background: 'linear-gradient(180deg, #0a1929, #071320)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'url(https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.5,
              }}
            />

            <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(7, 19, 29, 0.9)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--cy)' }}>
                Camera 01 - Underwater West
              </div>
              <div style={{ padding: '0.5rem', background: 'rgba(7, 19, 29, 0.9)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--muted)' }}>
                Depth: 8.5m | Visibility: Good
              </div>
            </div>

            <div style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem', background: 'rgba(7, 19, 29, 0.9)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--ok)' }}>
              AI Model: YOLOv8 Marine
            </div>

            {activeDetections.map(det => (
              <div
                key={det.id}
                className="detection-box"
                style={{
                  left: `${det.x}%`,
                  top: `${det.y}%`,
                  width: `${det.width}%`,
                  height: `${det.height}%`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-24px',
                    left: '0',
                    fontSize: '0.75rem',
                    color: 'var(--cy)',
                    background: 'rgba(7, 19, 29, 0.95)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                    border: '1px solid var(--cy)',
                  }}
                >
                  {det.type} • 94%
                </div>
              </div>
            ))}

            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
              <div style={{ flex: 1, padding: '0.5rem', background: 'rgba(7, 19, 29, 0.9)', borderRadius: '6px', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--muted)' }}>Objects Detected:</span>{' '}
                <span style={{ color: 'var(--cy)', fontWeight: 'bold' }}>{activeDetections.length}</span>
              </div>
              <div style={{ flex: 1, padding: '0.5rem', background: 'rgba(7, 19, 29, 0.9)', borderRadius: '6px', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--muted)' }}>FPS:</span>{' '}
                <span style={{ color: 'var(--ok)', fontWeight: 'bold' }}>30</span>
              </div>
              <div style={{ flex: 1, padding: '0.5rem', background: 'rgba(7, 19, 29, 0.9)', borderRadius: '6px', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--muted)' }}>Latency:</span>{' '}
                <span style={{ color: 'var(--ok)', fontWeight: 'bold' }}>45ms</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            Detection Log
          </h3>
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {recentDetections.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem', fontSize: '0.875rem' }}>
                No detections yet
              </div>
            ) : (
              recentDetections.map(det => (
                <div
                  key={det.id}
                  className="slide-in"
                  style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: 'rgba(12, 30, 44, 0.4)',
                    borderRadius: '8px',
                    borderLeft: `3px solid ${det.type.includes('Plastic') || det.type.includes('Oil') ? 'var(--bad)' : 'var(--warn)'}`,
                  }}
                >
                  <div style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                    {det.type}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                    Position: {det.x.toFixed(0)}%, {det.y.toFixed(0)}%
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
                    {det.time.toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '0.75rem' }}>
            Detection Accuracy
          </h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--ok)', marginBottom: '0.5rem' }}>
            94.2%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            Average confidence score across all detections
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '0.75rem' }}>
            Processing Speed
          </h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '0.5rem' }}>
            45ms
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            Real-time inference latency per frame
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '0.75rem' }}>
            Total Scanned
          </h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--vi)', marginBottom: '0.5rem' }}>
            {detections.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            Objects analyzed since session start
          </div>
        </div>
      </div>
    </div>
  );
}
