import { useState } from 'react';
import { MapPin, TrendingUp, Plus, Activity, Droplets, Zap, Fish, BarChart3, Gauge } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { FarmLocation } from '../types/aquaculture';
import { AddFarmModal } from '../components/AddFarmModal';

interface FarmSelectionProps {
  farms: FarmLocation[];
  onFarmSelect: (id: string) => void;
  onAddFarm: (farm: {
    name: string;
    latitude: number;
    longitude: number;
    region: string;
  }) => Promise<void>;
}

export function FarmSelection({ farms, onFarmSelect, onAddFarm }: FarmSelectionProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const { t } = useLanguage();
  const createFarmIcon = () => {
    const svg = `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="12" fill="#38bdf8" opacity="0.3"/>
      <circle cx="14" cy="14" r="7" fill="#38bdf8"/>
      <circle cx="14" cy="14" r="3" fill="#ffffff"/>
    </svg>`;

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  return (
    <div className="page-transition" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
      <div style={{
  position: 'relative',
  textAlign: 'center',
  marginBottom: '3rem',
  paddingTop: '3rem',
  paddingBottom: '3rem',
  background: 'radial-gradient(ellipse at top, rgba(56, 189, 248, 0.1) 0%, transparent 50%), linear-gradient(180deg, rgba(12, 30, 44, 0) 0%, rgba(12, 30, 44, 0.6) 100%)',
  overflow: 'hidden'
}}>
  <div style={{
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'repeating-linear-gradient(0deg, rgba(56, 189, 248, 0.03) 0px, transparent 1px, transparent 40px, rgba(56, 189, 248, 0.03) 41px)',
    pointerEvents: 'none',
    opacity: '0.5'
  }}></div>

  {/* --- Logo + AquaVolt --- */}
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    position: 'relative',
    zIndex: 1
  }}>
    <div className="fade-in" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1.5rem'
    }}>
      <img
        src="/image.png"
        alt="Aquavolt Logo"
        style={{
          width: '85px',
          height: '85px',
          filter: 'drop-shadow(0 0 25px rgba(56, 189, 248, 0.6)) drop-shadow(0 0 50px rgba(56, 189, 248, 0.3))',
          animation: 'pulse-glow 3s ease-in-out infinite'
        }}
      />
      <h1 style={{
        fontSize: '4rem',
        fontWeight: '900',
        letterSpacing: '-0.04em',
        lineHeight: '1',
        background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        position: 'relative'
      }}>
        Aqua<span style={{
          background: 'linear-gradient(135deg, #60a5fa 0%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 25px rgba(56, 189, 248, 0.5))'
        }}>Volt</span>
      </h1>
      <div style={{
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #22c07a 0%, #1a9d63 100%)',
        boxShadow: '0 0 0 0 rgba(34, 192, 122, 0.7), 0 0 18px rgba(34, 192, 122, 0.5)',
        animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}></div>
    </div>

    {/* --- White + Blue Heading --- */}
 {/* --- Split Gradient Heading with Glow --- */}
<div
  style={{
    position: 'relative',
    textAlign: 'center',
    maxWidth: '850px',
    margin: '1rem auto 2rem',
  }}
>
  {/* Glowing aura behind text */}
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '70%',
      height: '120%',
      background:
        'radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)',
      filter: 'blur(40px)',
      zIndex: 0,
    }}
  ></div>

  {/* Split-color heading */}
  <h2
    style={{
      fontSize: '3.2rem',
      fontWeight: '900',
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
      marginBottom: '1rem',
      textAlign: 'center',
      position: 'relative',
      zIndex: 1,
    }}
  >
    <span
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow:
          '0 0 10px rgba(255,255,255,0.4), 0 0 25px rgba(255,255,255,0.2)',
        display: 'inline-block',
      }}
    >
      Intelligent Aquaculture
    </span>
    <br />
    <span
      style={{
        background: 'linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #0ea5e9 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow:
          '0 0 12px rgba(56,189,248,0.5), 0 0 30px rgba(56,189,248,0.25)',
        display: 'inline-block',
        marginTop: '0.25rem',
      }}
    >
      Monitoring & Optimization
    </span>
  </h2>

  {/* Subheading / tagline */}
  <p
    style={{
      color: 'rgba(200, 222, 240, 0.9)',
      fontSize: '1.05rem',
      lineHeight: '1.8',
      fontWeight: '400',
      margin: '0 auto',
      maxWidth: '680px',
      position: 'relative',
      zIndex: 1,
    }}
  >
    {t('tagline')}
  </p>
</div>
  </div>

  <style>{`
    @keyframes pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(34, 192, 122, 0.7), 0 0 18px rgba(34, 192, 122, 0.5); }
      50% { box-shadow: 0 0 0 7px rgba(34, 192, 122, 0), 0 0 22px rgba(34, 192, 122, 0.6); }
      100% { box-shadow: 0 0 0 0 rgba(34, 192, 122, 0), 0 0 18px rgba(34, 192, 122, 0.5); }
    }
  `}</style>

       <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '0.5rem',
    maxWidth: '450px',
    margin: '0 auto',
    padding: '0 0.5rem',
    position: 'relative',
    zIndex: 1,
  }}
  className="fade-in"
>
  {/* --- Active Farms --- */}
  <div
    style={{
      position: 'relative',
      padding: '0.4rem 0.6rem',
      background:
        'linear-gradient(135deg, rgba(12,30,44,0.7) 0%, rgba(12,30,44,0.5) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: '10px',
      border: '1px solid rgba(34,192,122,0.3)',
      boxShadow: '0 3px 12px rgba(0,0,0,0.25)',
      overflow: 'hidden',
      height: '65px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.25s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = 'rgba(34,192,122,0.6)';
      e.currentTarget.style.boxShadow = '0 6px 18px rgba(34,192,122,0.25)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'rgba(34,192,122,0.3)';
      e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.25)';
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        marginBottom: '0.15rem',
      }}
    >
      <Activity
        size={12}
        style={{
          color: '#22c07a',
          filter: 'drop-shadow(0 0 3px rgba(34,192,122,0.5))',
        }}
      />
      <div
        style={{
          fontSize: '0.9rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #22c07a 0%, #1a9d63 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1',
        }}
      >
        {farms.length}
      </div>
    </div>
    <div
      style={{
        fontSize: '0.5rem',
        color: 'rgba(200,222,240,0.9)',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      {t('activeFarms')}
    </div>
  </div>

  {/* --- 24/7 Monitoring --- */}
  <div
    style={{
      position: 'relative',
      padding: '0.4rem 0.6rem',
      background:
        'linear-gradient(135deg, rgba(12,30,44,0.7) 0%, rgba(12,30,44,0.5) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: '10px',
      border: '1px solid rgba(56,189,248,0.3)',
      boxShadow: '0 3px 12px rgba(0,0,0,0.25)',
      overflow: 'hidden',
      height: '65px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.25s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = 'rgba(56,189,248,0.6)';
      e.currentTarget.style.boxShadow = '0 6px 18px rgba(56,189,248,0.25)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)';
      e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.25)';
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        marginBottom: '0.15rem',
      }}
    >
      <Droplets
        size={12}
        style={{
          color: '#38bdf8',
          filter: 'drop-shadow(0 0 3px rgba(56,189,248,0.5))',
        }}
      />
      <div
        style={{
          fontSize: '0.9rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1',
        }}
      >
        24/7
      </div>
    </div>
    <div
      style={{
        fontSize: '0.5rem',
        color: 'rgba(200,222,240,0.9)',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      {t('monitoring')}
    </div>
  </div>

  {/* --- AI Powered --- */}
  <div
    style={{
      position: 'relative',
      padding: '0.4rem 0.6rem',
      background:
        'linear-gradient(135deg, rgba(12,30,44,0.7) 0%, rgba(12,30,44,0.5) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: '10px',
      border: '1px solid rgba(167,139,250,0.3)',
      boxShadow: '0 3px 12px rgba(0,0,0,0.25)',
      overflow: 'hidden',
      height: '65px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.25s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = 'rgba(167,139,250,0.6)';
      e.currentTarget.style.boxShadow = '0 6px 18px rgba(167,139,250,0.25)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'rgba(167,139,250,0.3)';
      e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.25)';
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        marginBottom: '0.15rem',
      }}
    >
      <Zap
        size={12}
        style={{
          color: '#a78bfa',
          filter: 'drop-shadow(0 0 3px rgba(167,139,250,0.5))',
        }}
      />
      <div
        style={{
          fontSize: '0.9rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1',
        }}
      >
        AI
      </div>
    </div>
    <div
      style={{
        fontSize: '0.5rem',
        color: 'rgba(200,222,240,0.9)',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      {t('aiPowered')}
    </div>
  </div>
</div>
</div>
        

      <div style={{ maxWidth: '1100px', margin: '0 auto 1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text)', margin: '0 0 1rem 0' }}>
          {t('chooseFarm')}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ height: '400px', position: 'relative' }}>
              <MapContainer
                center={[20.5, 57]}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='OpenStreetMap'
                />
                {farms.map(farm => (
                  <Marker
                    key={farm.id}
                    position={[farm.lat, farm.lng]}
                    icon={createFarmIcon()}
                  />
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(56, 189, 248, 0.2)', textAlign: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '50%', marginBottom: '1rem', border: '2px solid rgba(56, 189, 248, 0.3)' }}>
                <Plus size={40} style={{ color: 'var(--cy)' }} className="glow-cyan" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.5rem' }}>
                {t('addNewFarm')}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                {t('expandNetwork')}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '1rem 2rem',
                background: 'var(--cy)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                color: 'var(--bg)',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(56, 189, 248, 0.4)',
                width: '100%',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(56, 189, 248, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(56, 189, 248, 0.4)';
              }}
            >
              <Plus size={20} />
              {t('addNewFarm')}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {farms.map((farm, index) => (
            <button
              key={farm.id}
              onClick={() => onFarmSelect(farm.id)}
              className="farm-card"
              style={{
                padding: '0',
                cursor: 'pointer',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'left',
                background: 'linear-gradient(135deg, rgba(12, 30, 44, 0.8) 0%, rgba(7, 19, 29, 0.9) 100%)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                animationDelay: `${index * 0.1}s`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cy)';
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 48px rgba(56, 189, 248, 0.35), 0 0 0 1px rgba(56, 189, 248, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--cy), var(--ok), var(--vi))', backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }}></div>
              <div style={{ padding: '1rem', borderBottom: '1px solid rgba(56, 189, 248, 0.15)', background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.05) 0%, transparent 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <Fish size={18} style={{ color: 'var(--cy)' }} className="glow-cyan" />
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text)', margin: 0, letterSpacing: '-0.01em' }}>
                        {farm.name}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--muted)', fontSize: '0.7rem', marginLeft: '1.5rem' }}>
                      <MapPin size={11} style={{ color: 'var(--cy)' }} />
                      <span>{farm.lat.toFixed(3)}°N, {farm.lng.toFixed(3)}°E</span>
                    </div>
                  </div>
                  <div style={{
                    padding: '0.35rem 0.75rem',
                    background: 'rgba(34, 192, 122, 0.2)',
                    borderRadius: '20px',
                    border: '1px solid rgba(34, 192, 122, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(34, 192, 122, 0.2)'
                  }}>
                    <span className="status-indicator status-ok" style={{ margin: 0, width: '6px', height: '6px' }}></span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--ok)', fontWeight: '700', letterSpacing: '0.02em' }}>{t('online')}</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(34, 192, 122, 0.08)', borderRadius: '8px', border: '1px solid rgba(34, 192, 122, 0.2)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.4rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {t('systemStatus')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <TrendingUp size={14} style={{ color: 'var(--ok)' }} className="glow-green" />
                    <span style={{ fontSize: '0.875rem', color: 'var(--ok)', fontWeight: '700' }} className="glow-green">{t('optimal')}</span>
                  </div>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.4rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {t('healthScore')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Gauge size={14} style={{ color: 'var(--cy)' }} className="glow-cyan" />
                    <span style={{ fontSize: '1.25rem', color: 'var(--cy)', fontWeight: '800', lineHeight: '1', letterSpacing: '-0.02em' }} className="glow-cyan">
                      {85 + Math.floor(Math.random() * 15)}%
                    </span>
                  </div>
                </div>
              </div>


              <div style={{ padding: '0.75rem 1rem', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(34, 192, 122, 0.1))', borderTop: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--cy)', letterSpacing: '0.02em' }} className="glow-cyan">
                    {t('openDashboard')}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.3s ease' }} className="arrow-icon">
                    <path d="M7 13L11 9L7 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cy)' }}/>
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showAddModal && (
        <AddFarmModal
          onClose={() => setShowAddModal(false)}
          onAddFarm={async (farm) => {
            await onAddFarm(farm);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
