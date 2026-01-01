import { Thermometer, Activity, Droplet, Wind, Zap, TrendingUp, Power, AlertTriangle } from 'lucide-react';
import type { Metrics, Alert } from '../types/aquaculture';
import { ParameterChart } from '../components/ParameterChart';
import { getAeratorRecommendation } from '../utils/aeratorRecommendation';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  metrics: Metrics;
  historicalData: Metrics[];
  alerts: Alert[];
  aeratorActive: boolean;
  onAeratorToggle: () => void;
}

export function Dashboard({ metrics, historicalData, alerts, aeratorActive, onAeratorToggle }: DashboardProps) {
  const { t } = useLanguage();
  const getStatusColor = (value: number, type: string): string => {
    switch (type) {
      case 'ammonia':
        if (value > 0.1) return 'var(--bad)';
        if (value > 0.05) return 'var(--warn)';
        return 'var(--ok)';
      case 'do':
        if (value < 6) return 'var(--bad)';
        if (value < 6.5) return 'var(--warn)';
        return 'var(--ok)';
      case 'ph':
        if (value < 7.5 || value > 8.5) return 'var(--warn)';
        return 'var(--ok)';
      case 'temperature':
        if (value > 30 || value < 24) return 'var(--warn)';
        return 'var(--ok)';
      default:
        return 'var(--ok)';
    }
  };

  const labels = historicalData.map((_, i) => `${Math.floor(i / 15)}h`).slice(-24);
  const recentData = historicalData.slice(-24);

  const aeratorRec = getAeratorRecommendation(metrics, aeratorActive, historicalData);

  const gaugeValue = metrics.healthScore;
  const gaugeColor = gaugeValue > 75 ? 'var(--ok)' : gaugeValue > 50 ? 'var(--warn)' : 'var(--bad)';
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (gaugeValue / 100) * circumference;

  return (
    <div className="page-transition">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <div className="metric-card fade-in" style={{ padding: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{t('temperature')}</span>
            <Thermometer size={16} style={{ color: 'var(--cy)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getStatusColor(metrics.temperature, 'temperature') }}>
            {metrics.temperature.toFixed(1)}°C
          </div>
        </div>

        <div className="metric-card fade-in" style={{ padding: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{t('phLevel')}</span>
            <Activity size={16} style={{ color: 'var(--vi)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getStatusColor(metrics.ph, 'ph') }}>
            {metrics.ph.toFixed(2)}
          </div>
        </div>

        <div className="metric-card fade-in" style={{ padding: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{t('dissolvedO2')}</span>
            <Droplet size={16} style={{ color: 'var(--cy)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getStatusColor(metrics.dissolvedOxygen, 'do') }}>
            {metrics.dissolvedOxygen.toFixed(1)}
            <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}> mg/L</span>
          </div>
        </div>

        <div className="metric-card fade-in" style={{ padding: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{t('turbidity')}</span>
            <Wind size={16} style={{ color: 'var(--muted)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text)' }}>
            {metrics.turbidity.toFixed(1)}
            <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}> NTU</span>
          </div>
        </div>

        <div className="metric-card fade-in" style={{ padding: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{t('ammoniaNH3')}</span>
            <Zap size={16} style={{ color: 'var(--ok)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getStatusColor(metrics.ammonia, 'ammonia') }} className={metrics.ammonia > 0.1 ? 'pulse-glow' : ''}>
            {metrics.ammonia.toFixed(3)}
            <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}> mg/L</span>
          </div>
        </div>

        <div className="metric-card fade-in" style={{ position: 'relative', padding: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{t('healthScore')}</span>
            <TrendingUp size={16} style={{ color: gaugeColor }} />
          </div>
          <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto' }}>
            <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="rgba(56, 189, 248, 0.2)"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke={gaugeColor}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="gauge-fill"
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: gaugeColor }}>{gaugeValue}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>/ 100</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <ParameterChart
          title={t('temperature')}
          data={recentData.map(d => d.temperature)}
          labels={labels}
          color="rgb(255, 99, 132)"
          unit="°C"
          currentValue={metrics.temperature}
          icon={<Thermometer size={20} style={{ color: 'rgb(255, 99, 132)' }} />}
          trend={recentData.length >= 2 ? metrics.temperature - recentData[0].temperature : 0}
          status={getStatusColor(metrics.temperature, 'temperature') === 'var(--ok)' ? 'ok' : 'warn'}
        />

        <ParameterChart
          title={t('phLevel')}
          data={recentData.map(d => d.ph)}
          labels={labels}
          color="rgb(167, 139, 250)"
          unit="pH"
          currentValue={metrics.ph}
          icon={<Activity size={20} style={{ color: 'rgb(167, 139, 250)' }} />}
          trend={recentData.length >= 2 ? metrics.ph - recentData[0].ph : 0}
          status={getStatusColor(metrics.ph, 'ph') === 'var(--ok)' ? 'ok' : 'warn'}
        />

        <ParameterChart
          title={t('dissolvedO2')}
          data={recentData.map(d => d.dissolvedOxygen)}
          labels={labels}
          color="rgb(56, 189, 248)"
          unit="mg/L"
          currentValue={metrics.dissolvedOxygen}
          icon={<Droplet size={20} style={{ color: 'rgb(56, 189, 248)' }} />}
          trend={recentData.length >= 2 ? metrics.dissolvedOxygen - recentData[0].dissolvedOxygen : 0}
          status={getStatusColor(metrics.dissolvedOxygen, 'do') === 'var(--ok)' ? 'ok' : getStatusColor(metrics.dissolvedOxygen, 'do') === 'var(--warn)' ? 'warn' : 'bad'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <ParameterChart
          title={t('turbidity')}
          data={recentData.map(d => d.turbidity)}
          labels={labels}
          color="rgb(156, 163, 175)"
          unit="NTU"
          currentValue={metrics.turbidity}
          icon={<Wind size={20} style={{ color: 'rgb(156, 163, 175)' }} />}
          trend={recentData.length >= 2 ? metrics.turbidity - recentData[0].turbidity : 0}
          status="ok"
        />

        <ParameterChart
          title={t('ammoniaNH3')}
          data={recentData.map(d => d.ammonia)}
          labels={labels}
          color="rgb(34, 192, 122)"
          unit="mg/L"
          currentValue={metrics.ammonia}
          icon={<Zap size={20} style={{ color: 'rgb(34, 192, 122)' }} />}
          trend={recentData.length >= 2 ? metrics.ammonia - recentData[0].ammonia : 0}
          status={getStatusColor(metrics.ammonia, 'ammonia') === 'var(--ok)' ? 'ok' : getStatusColor(metrics.ammonia, 'ammonia') === 'var(--warn)' ? 'warn' : 'bad'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <div className="glass-panel" style={{ padding: '0.75rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Power size={16} />
            {t('aiAeratorRecommendation')}
          </h3>

          <div style={{ padding: '0.6rem', background: aeratorRec.urgency === 'high' ? 'rgba(255, 90, 103, 0.1)' : aeratorRec.urgency === 'medium' ? 'rgba(246, 184, 77, 0.1)' : 'rgba(34, 192, 122, 0.1)', borderRadius: '6px', border: `2px solid ${aeratorRec.urgency === 'high' ? 'var(--bad)' : aeratorRec.urgency === 'medium' ? 'var(--warn)' : 'var(--ok)'}`, marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text)' }}>
                {aeratorRec.action === 'turn_on' ? t('turnAeratorOn') : aeratorRec.action === 'turn_off' ? t('turnAeratorOff') : t('maintainCurrentState')}
              </span>
              <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: aeratorRec.urgency === 'high' ? 'var(--bad)' : aeratorRec.urgency === 'medium' ? 'var(--warn)' : 'var(--ok)', color: 'var(--bg)', borderRadius: '10px', fontWeight: 'bold' }}>
                {aeratorRec.urgency === 'high' ? t('high') : aeratorRec.urgency === 'medium' ? t('medium') : t('low')}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>{t('confidence')}: <span style={{ color: 'var(--cy)', fontWeight: 'bold' }}>{aeratorRec.confidence}%</span></div>
            {aeratorRec.expectedImpact && (
              <div style={{ fontSize: '0.75rem', color: 'var(--cy)', fontWeight: 'bold', marginBottom: '0.3rem' }}>{aeratorRec.expectedImpact}</div>
            )}
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text)', marginBottom: '0.3rem' }}>{t('reasoning')}:</div>
            {aeratorRec.reasoning.slice(0, 2).map((reason, idx) => (
              <div key={idx} style={{ padding: '0.4rem', marginBottom: '0.2rem', background: 'rgba(12, 30, 44, 0.5)', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--muted)', borderLeft: '2px solid var(--cy)' }}>
                • {reason}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div className="glass-panel" style={{ padding: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '0.5rem' }}>{t('manualControl')}</h3>
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>{t('aeratorStatus')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span className={`status-indicator ${aeratorActive ? 'status-ok' : 'status-warn'}`} style={{ width: '6px', height: '6px' }}></span>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: aeratorActive ? 'var(--ok)' : 'var(--warn)' }}>
                  {aeratorActive ? t('active') : t('inactive')}
                </span>
              </div>
            </div>
            <button
              onClick={onAeratorToggle}
              style={{
                width: '100%',
                padding: '0.6rem',
                background: aeratorActive ? 'var(--ok)' : 'rgba(56, 189, 248, 0.2)',
                border: aeratorActive ? 'none' : '2px solid var(--cy)',
                borderRadius: '6px',
                color: 'var(--text)',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
            >
              <Power size={14} />
              {aeratorActive ? t('deactivate') : t('activate')}
            </button>

            <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(12, 30, 44, 0.5)', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.15rem' }}>{t('currentDraw')}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: aeratorActive ? 'var(--cy)' : 'var(--muted)' }}>
                {aeratorActive ? '2.4 kW' : '0.0 kW'}
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0.75rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={14} />
              {t('activeAlerts')}
            </h3>
            <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
              {alerts.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--ok)', padding: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem' }}>{t('allSystemsNominal')}</div>
                </div>
              ) : (
                alerts.slice(0, 3).map(alert => (
                  <div key={alert.id} className="slide-in" style={{ padding: '0.4rem', marginBottom: '0.3rem', background: 'rgba(12, 30, 44, 0.4)', borderRadius: '4px', borderLeft: `2px solid ${alert.severity === 'bad' ? 'var(--bad)' : 'var(--warn)'}` }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text)', marginBottom: '0.15rem' }}>{alert.message}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>{alert.time.toLocaleTimeString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
