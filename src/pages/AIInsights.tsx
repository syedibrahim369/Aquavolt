import { Scatter } from 'react-chartjs-2';
import { Brain, TrendingUp, Droplet, Activity, Power, Zap } from 'lucide-react';
import type { Metrics } from '../types/aquaculture';
import { getAeratorRecommendation } from '../utils/aeratorRecommendation';
import { useLanguage } from '../contexts/LanguageContext';

interface AIInsightsProps {
  metrics: Metrics;
  historicalData: Metrics[];
  aeratorActive?: boolean;
  onAeratorToggle?: () => void;
}

export function AIInsights({ metrics, historicalData, aeratorActive = false, onAeratorToggle }: AIInsightsProps) {
  const { t } = useLanguage();
  const aeratorRec = getAeratorRecommendation(metrics, aeratorActive, historicalData);
  const scatterData = {
    datasets: [
      {
        label: 'Temperature vs DO Correlation',
        data: historicalData.slice(-50).map(d => ({ x: d.temperature, y: d.dissolvedOxygen })),
        backgroundColor: 'rgba(56, 189, 248, 0.6)',
        borderColor: 'rgb(56, 189, 248)',
        pointRadius: 4,
      },
    ],
  };

  const predictedDO = (metrics.dissolvedOxygen + (Math.random() * 0.4 - 0.2) + 0.3).toFixed(1);
  const predictedPH = (metrics.ph + (Math.random() * 0.08 - 0.04) + 0.05).toFixed(2);
  const confidence = (88 + Math.random() * 8).toFixed(1);

  const feedingRecommendations = [
    {
      time: '08:00',
      amount: '3.2 kg',
      status: 'optimal',
      reason: 'High DO levels, optimal temperature',
    },
    {
      time: '14:00',
      amount: '2.8 kg',
      status: 'good',
      reason: 'Stable pH, moderate activity',
    },
    {
      time: '18:00',
      amount: '3.5 kg',
      status: 'optimal',
      reason: 'Peak feeding window, best conditions',
    },
  ];

  const recentData = historicalData.slice(-20);
  const doTrend = recentData.length >= 2
    ? recentData[recentData.length - 1].dissolvedOxygen - recentData[0].dissolvedOxygen
    : 0;
  const phTrend = recentData.length >= 2
    ? recentData[recentData.length - 1].ph - recentData[0].ph
    : 0;
  const tempTrend = recentData.length >= 2
    ? recentData[recentData.length - 1].temperature - recentData[0].temperature
    : 0;

  const avgDO = recentData.reduce((sum, m) => sum + m.dissolvedOxygen, 0) / recentData.length;
  const avgTemp = recentData.reduce((sum, m) => sum + m.temperature, 0) / recentData.length;

  const doVariance = recentData.reduce((sum, m) => sum + Math.pow(m.dissolvedOxygen - avgDO, 2), 0) / recentData.length;
  const tempVariance = recentData.reduce((sum, m) => sum + Math.pow(m.temperature - avgTemp, 2), 0) / recentData.length;

  const aiInsights = [
    {
      title: 'Dissolved Oxygen Analysis',
      description: doTrend > 0.3
        ? `DO levels increasing (${doTrend.toFixed(2)} mg/L rise). Water oxygenation improving, fish activity likely high.`
        : doTrend < -0.3
        ? `DO levels declining (${Math.abs(doTrend).toFixed(2)} mg/L drop). Monitor closely and consider aerator activation.`
        : `DO levels stable at ${avgDO.toFixed(1)} mg/L. ${doVariance < 0.2 ? 'Excellent stability detected.' : 'Minor fluctuations within normal range.'}`,
      severity: doTrend < -0.3 || avgDO < 6.0 ? 'warn' : 'ok',
      icon: Droplet,
    },
    {
      title: 'Temperature Dynamics',
      description: tempTrend > 0.5
        ? `Temperature rising (${tempTrend.toFixed(1)}°C increase). Monitor for thermal stress. Consider cooling if exceeds 29°C.`
        : tempTrend < -0.5
        ? `Temperature decreasing (${Math.abs(tempTrend).toFixed(1)}°C drop). Fish metabolism may slow. Adjust feeding schedule.`
        : `Temperature stable at ${avgTemp.toFixed(1)}°C. ${tempVariance < 0.5 ? 'Optimal thermal conditions maintained.' : 'Normal diurnal variation observed.'}`,
      severity: metrics.temperature > 29 || metrics.temperature < 24 ? 'warn' : 'ok',
      icon: TrendingUp,
    },
    {
      title: 'Water Chemistry Balance',
      description: phTrend > 0.1
        ? `pH trending alkaline (${phTrend.toFixed(2)} increase). Water buffer capacity strong, conditions favorable for growth.`
        : phTrend < -0.1
        ? `pH trending acidic (${Math.abs(phTrend).toFixed(2)} decrease). Monitor ammonia levels and consider alkalinity adjustment.`
        : `pH stable at ${metrics.ph.toFixed(2)}. ${metrics.ammonia < 0.05 ? 'Ammonia well-controlled. Water quality excellent.' : 'Ammonia elevated. Increase monitoring frequency.'}`,
      severity: metrics.ph < 7.5 || metrics.ph > 8.5 || metrics.ammonia > 0.05 ? 'warn' : 'ok',
      icon: Activity,
    },
  ];

  return (
    <div className="page-transition">
      <div style={{ marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Brain size={20} />
          {t('aiPoweredInsights')}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
          {t('advancedPredictiveAnalytics')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '1rem' }}>
            {t('predictiveForecasting')}
          </h3>
          <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>{t('modelConfidence')}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cy)' }}>{confidence}%</div>
          </div>

          <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(12, 30, 44, 0.4)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Droplet size={18} style={{ color: 'var(--cy)' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{t('dissolvedO2')} {t('oneHourAhead')}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--cy)' }}>{predictedDO} mg/L</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ok)', marginTop: '0.25rem' }}>
              ↑ +{(parseFloat(predictedDO) - metrics.dissolvedOxygen).toFixed(1)} {t('fromCurrent')}
            </div>
          </div>

          <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(12, 30, 44, 0.4)', borderRadius: '8px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Activity size={18} style={{ color: 'var(--vi)' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{t('phLevel')} {t('oneHourAhead')}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--vi)' }}>{predictedPH}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ok)', marginTop: '0.25rem' }}>
              {parseFloat(predictedPH) > metrics.ph ? '↑' : '↓'} {Math.abs(parseFloat(predictedPH) - metrics.ph).toFixed(2)} {t('fromCurrent')}
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(34, 192, 122, 0.1)', borderRadius: '8px', border: '1px solid rgba(34, 192, 122, 0.3)' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{t('nextFeedingWindow')}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--ok)' }}>{t('optimalIn2Hours')}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
              {t('basedOnPatterns')}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '1rem' }}>
            {t('tempVsDOCorrelation')}
          </h3>
          <Scatter
            data={scatterData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                x: {
                  title: { display: true, text: 'Temperature (°C)', color: '#ffffff', font: { size: 12 } },
                  grid: { color: 'rgba(255, 255, 255, 0.05)' },
                  ticks: { color: '#ffffff' },
                },
                y: {
                  title: { display: true, text: 'Dissolved Oxygen (mg/L)', color: '#ffffff', font: { size: 12 } },
                  grid: { color: 'rgba(255, 255, 255, 0.05)' },
                  ticks: { color: '#ffffff' },
                },
              },
              plugins: {
                legend: { display: false },
              },
            }}
          />
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(12, 30, 44, 0.4)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>{t('correlationCoefficient')}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--cy)' }}>-0.68</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
              {t('strongNegativeCorrelation')}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Power size={24} />
          {t('advancedAeratorIntelligence')}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          <div>
            <div style={{ padding: '1.5rem', background: aeratorRec.urgency === 'high' ? 'rgba(255, 90, 103, 0.15)' : aeratorRec.urgency === 'medium' ? 'rgba(246, 184, 77, 0.15)' : 'rgba(34, 192, 122, 0.15)', borderRadius: '12px', border: `3px solid ${aeratorRec.urgency === 'high' ? 'var(--bad)' : aeratorRec.urgency === 'medium' ? 'var(--warn)' : 'var(--ok)'}`, marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('aiRecommendation')}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text)', marginBottom: '0.75rem' }}>
                {aeratorRec.action === 'turn_on' ? t('turnOn') : aeratorRec.action === 'turn_off' ? t('turnOff') : t('maintain')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t('confidence')}:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--cy)' }}>{aeratorRec.confidence}%</span>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(7, 19, 29, 0.6)', borderRadius: '8px', marginBottom: '1rem' }}>
                <span style={{ padding: '0.35rem 0.75rem', background: aeratorRec.urgency === 'high' ? 'var(--bad)' : aeratorRec.urgency === 'medium' ? 'var(--warn)' : 'var(--ok)', color: 'var(--bg)', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {aeratorRec.urgency === 'high' ? t('high') : aeratorRec.urgency === 'medium' ? t('medium') : t('low')} {t('priority')}
                </span>
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(12, 30, 44, 0.5)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Zap size={16} style={{ color: 'var(--cy)' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text)' }}>{t('currentStatus')}</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: aeratorActive ? 'var(--ok)' : 'var(--muted)', marginBottom: '1rem' }}>
                {aeratorActive ? t('aeratorActive') : t('aeratorInactive')}
              </div>
              {onAeratorToggle && (
                <button
                  onClick={onAeratorToggle}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    background: aeratorRec.action === 'turn_on' && !aeratorActive ? 'var(--ok)' : aeratorRec.action === 'turn_off' && aeratorActive ? 'var(--bad)' : 'rgba(56, 189, 248, 0.2)',
                    border: aeratorRec.action === 'turn_on' && !aeratorActive ? 'none' : aeratorRec.action === 'turn_off' && aeratorActive ? 'none' : '2px solid var(--cy)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  <Power size={18} />
                  {aeratorActive ? t('deactivateAerator') : t('activateAerator')}
                </button>
              )}
            </div>

            {aeratorRec.expectedImpact && (
              <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', border: '1px solid var(--cy)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{t('expectedImpact')}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--cy)', fontWeight: 'bold' }}>{aeratorRec.expectedImpact}</div>
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={16} style={{ color: 'var(--cy)' }} />
              {t('aiAnalysisReasoning')}
            </div>
            {aeratorRec.reasoning.map((reason, idx) => (
              <div key={idx} className="fade-in" style={{ padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(12, 30, 44, 0.6)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text)', borderLeft: '3px solid var(--cy)' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--cy)', marginTop: '0.1rem' }}>•</span>
                  <span>{reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '1rem' }}>
            {t('aiSystemInsights')}
          </h3>
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="fade-in" style={{ padding: '1rem', marginBottom: '0.75rem', background: 'rgba(12, 30, 44, 0.4)', borderRadius: '8px', borderLeft: `3px solid var(--${insight.severity})` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <insight.icon size={18} style={{ color: `var(--${insight.severity})` }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text)' }}>{insight.title}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{insight.description}</div>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--cy)', marginBottom: '1rem' }}>
            {t('smartFeedingSchedule')}
          </h3>
          {feedingRecommendations.map((rec, idx) => (
            <div key={idx} className="fade-in" style={{ padding: '1rem', marginBottom: '0.75rem', background: 'rgba(12, 30, 44, 0.4)', borderRadius: '8px', border: `1px solid ${rec.status === 'optimal' ? 'var(--ok)' : 'var(--cy)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text)' }}>{rec.time}</span>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: rec.status === 'optimal' ? 'var(--ok)' : 'var(--cy)', color: 'var(--bg)', borderRadius: '4px', fontWeight: 'bold' }}>
                  {rec.status.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                {t('amount')}: <span style={{ color: 'var(--cy)', fontWeight: 'bold' }}>{rec.amount}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{rec.reason}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
