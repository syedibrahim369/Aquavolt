import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect } from 'react';
import type { FarmLocation } from '../types/aquaculture';

interface FarmMapProps {
  farms: FarmLocation[];
  selectedFarm: string;
  onFarmSelect: (id: string) => void;
}

function MapView({ selectedFarm, farms }: { selectedFarm: string; farms: FarmLocation[] }) {
  const map = useMap();

  useEffect(() => {
    const farm = farms.find(f => f.id === selectedFarm);
    if (farm) {
      map.setView([farm.lat, farm.lng], 8);
    }
  }, [selectedFarm, map, farms]);

  return null;
}

export function FarmMap({ farms, selectedFarm, onFarmSelect }: FarmMapProps) {
  const createFarmIcon = (isSelected: boolean) => {
    const color = isSelected ? '#38bdf8' : '#22c07a';
    const size = isSelected ? 48 : 36;
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="gradient${isSelected}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.2" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#gradient${isSelected})" opacity="0.4">
        <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="24" cy="24" r="14" fill="${color}" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="24" cy="24" r="9" fill="${color}" filter="url(#glow)">
        <animate attributeName="r" values="9;10;9" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="24" cy="24" r="4" fill="#ffffff" opacity="0.9"/>
    </svg>`;

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  return (
    <div className="page-transition" style={{ position: 'relative' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '0.5rem' }}>
          Farm Locations
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
          Interactive map of Omani aquaculture facilities
        </p>
      </div>

      <div className="map-container-enhanced" style={{ position: 'relative', height: '600px', marginBottom: '1.5rem', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(56, 189, 248, 0.4), 0 0 40px rgba(56, 189, 248, 0.2), inset 0 0 0 2px rgba(56, 189, 248, 0.3)', animation: 'map-glow 3s ease-in-out infinite' }}>
        <MapContainer
          center={[20.5, 57]}
          zoom={6}
          style={{ height: '100%', width: '100%', borderRadius: '20px', position: 'relative', zIndex: 1 }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='OpenStreetMap'
          />
          <MapView selectedFarm={selectedFarm} farms={farms} />
          {farms.map(farm => (
            <Marker
              key={farm.id}
              position={[farm.lat, farm.lng]}
              icon={createFarmIcon(farm.id === selectedFarm)}
              eventHandlers={{
                click: () => onFarmSelect(farm.id),
              }}
            >
              <Popup>
                <div style={{ padding: '1rem', minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                      <svg width="40" height="40" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="3" />
                        <circle cx="20" cy="20" r="18" fill="none" stroke="var(--cy)" strokeWidth="3" strokeDasharray="113" strokeDashoffset="25" className="gauge-fill" />
                      </svg>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--cy)' }}>85</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: 'var(--cy)', marginBottom: '0.25rem', fontSize: '1.125rem', fontWeight: 'bold', letterSpacing: '-0.01em' }}>{farm.name}</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>
                        {farm.lat.toFixed(3)}°N, {farm.lng.toFixed(3)}°E
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(34, 192, 122, 0.1)', borderRadius: '6px', border: '1px solid rgba(34, 192, 122, 0.3)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Health</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--ok)', fontWeight: 'bold' }}>Optimal</div>
                    </div>
                    <div style={{ padding: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--cy)', fontWeight: 'bold' }}>Active</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(12, 30, 44, 0.5)', borderRadius: '6px' }}>
                      <div style={{ color: 'var(--muted)', marginBottom: '0.25rem' }}>DO Level</div>
                      <div style={{ color: 'var(--cy)', fontWeight: 'bold' }}>7.2 mg/L</div>
                    </div>
                    <div style={{ padding: '0.5rem', background: 'rgba(12, 30, 44, 0.5)', borderRadius: '6px' }}>
                      <div style={{ color: 'var(--muted)', marginBottom: '0.25rem' }}>Temp</div>
                      <div style={{ color: 'var(--cy)', fontWeight: 'bold' }}>26.5°C</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onFarmSelect(farm.id)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.25rem',
                      background: 'linear-gradient(135deg, var(--cy), rgba(56, 189, 248, 0.8))',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(56, 189, 248, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.3)';
                    }}
                  >
                    Open Dashboard
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="glass-overlay farm-list-enhanced" style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '1rem', borderRadius: '12px', minWidth: '220px', maxHeight: '550px', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="var(--cy)" strokeWidth="2" fill="none">
                <animate attributeName="r" values="7;8;7" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="8" cy="8" r="3" fill="var(--cy)">
                <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
            <h3 style={{ fontSize: '0.875rem', color: 'var(--cy)', margin: 0, fontWeight: 'bold', letterSpacing: '0.05em' }}>ACTIVE FARMS</h3>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="status-indicator status-ok" style={{ width: '6px', height: '6px', margin: 0 }}></span>
            {farms.length} farms online
          </div>
          {farms.map(farm => (
            <button
              key={farm.id}
              onClick={() => onFarmSelect(farm.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '0.625rem 0.75rem',
                marginBottom: '0.5rem',
                background: farm.id === selectedFarm ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(56, 189, 248, 0.15))' : 'rgba(12, 30, 44, 0.4)',
                border: farm.id === selectedFarm ? '1px solid var(--cy)' : '1px solid rgba(56, 189, 248, 0.1)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '0.8125rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: farm.id === selectedFarm ? '0 4px 12px rgba(56, 189, 248, 0.3)' : 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (farm.id !== selectedFarm) {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                  e.currentTarget.style.transform = 'translateX(-4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (farm.id !== selectedFarm) {
                  e.currentTarget.style.background = 'rgba(12, 30, 44, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.1)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                  <span className="status-indicator status-ok" style={{ width: '6px', height: '6px', margin: 0, flexShrink: 0 }}></span>
                  <span style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{farm.name}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--ok)', fontWeight: 'bold', padding: '0.125rem 0.375rem', background: 'rgba(34, 192, 122, 0.2)', borderRadius: '4px', flexShrink: 0 }}>85%</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {farms.map(farm => (
          <div
            key={farm.id}
            className="glass-panel"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: farm.id === selectedFarm ? '2px solid var(--cy)' : '1px solid rgba(56, 189, 248, 0.2)',
              transition: 'all 0.3s ease',
            }}
            onClick={() => onFarmSelect(farm.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text)' }}>{farm.name}</h3>
              <span className="status-indicator status-ok"></span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
              {farm.lat.toFixed(3)}°N, {farm.lng.toFixed(3)}°E
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
              <div>
                <div style={{ color: 'var(--muted)' }}>Health</div>
                <div style={{ color: 'var(--ok)', fontWeight: 'bold' }}>Optimal</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)' }}>Status</div>
                <div style={{ color: 'var(--cy)', fontWeight: 'bold' }}>Active</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
