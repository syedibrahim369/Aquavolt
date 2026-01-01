import { useEffect, useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { BarChart3, Brain, Camera, ArrowLeft, Languages } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import { Dashboard } from './pages/Dashboard';
import { AIInsights } from './pages/AIInsights';
import { VisionDetection } from './pages/VisionDetection';
import { FarmSelection } from './pages/FarmSelection';
import type { Metrics, FarmLocation, Detection, Alert } from './types/aquaculture';
import { saveSensorData, saveAlert, saveWasteDetection, loadRecentSensorData, loadRecentAlerts } from './utils/supabaseSync';
import { loadFarms, addFarm } from './utils/farmOperations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type PageType = 'dashboard' | 'insights' | 'vision';

function App() {
  const { t, language, toggleLanguage } = useLanguage();
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null);
  const [farms, setFarms] = useState<FarmLocation[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    temperature: 26.5,
    ph: 7.8,
    dissolvedOxygen: 6.8,
    turbidity: 12.3,
    ammonia: 0.04,
    healthScore: 87
  });
  const [historicalData, setHistoricalData] = useState<Metrics[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [aeratorActive, setAeratorActive] = useState(false);
  const detectionIdRef = useRef(1);
  const alertIdRef = useRef(1);

  const calculateHealthScore = (m: Metrics): number => {
    let score = 100;
    if (m.temperature < 24 || m.temperature > 30) score -= 15;
    if (m.ph < 7.5 || m.ph > 8.5) score -= 15;
    if (m.dissolvedOxygen < 6) score -= 20;
    if (m.turbidity > 20) score -= 10;
    if (m.ammonia > 0.1) score -= 25;
    else if (m.ammonia > 0.05) score -= 10;
    return Math.max(0, Math.min(100, score));
  };

  const generateMetrics = (previous?: Metrics): Metrics => {
    const base = previous || metrics;
    const newMetrics = {
      temperature: Math.max(24, Math.min(31, base.temperature + (Math.random() - 0.5) * 0.3)),
      ph: Math.max(7.0, Math.min(8.8, base.ph + (Math.random() - 0.5) * 0.08)),
      dissolvedOxygen: Math.max(5.0, Math.min(9.0, base.dissolvedOxygen + (Math.random() - 0.5) * 0.2)),
      turbidity: Math.max(5, Math.min(30, base.turbidity + (Math.random() - 0.5) * 1.5)),
      ammonia: Math.max(0, Math.min(0.20, base.ammonia + (Math.random() - 0.5) * 0.01)),
      healthScore: 0
    };

    if (aeratorActive && newMetrics.dissolvedOxygen < 8) {
      newMetrics.dissolvedOxygen += 0.15;
    }

    newMetrics.healthScore = calculateHealthScore(newMetrics);
    return newMetrics;
  };

  const checkAlerts = (m: Metrics) => {
    const newAlerts: Alert[] = [];

    if (m.dissolvedOxygen < 6) {
      newAlerts.push({
        id: alertIdRef.current++,
        type: 'oxygen',
        message: 'Low dissolved oxygen detected. Aerator recommended.',
        time: new Date(),
        severity: 'bad'
      });
    }

    if (m.ammonia > 0.1) {
      newAlerts.push({
        id: alertIdRef.current++,
        type: 'ammonia',
        message: 'Critical ammonia levels! Water change needed.',
        time: new Date(),
        severity: 'bad'
      });
    } else if (m.ammonia > 0.05) {
      newAlerts.push({
        id: alertIdRef.current++,
        type: 'ammonia',
        message: 'Ammonia levels elevated. Monitor closely.',
        time: new Date(),
        severity: 'warn'
      });
    }

    if (m.temperature > 30) {
      newAlerts.push({
        id: alertIdRef.current++,
        type: 'temperature',
        message: 'Water temperature too high. Check cooling system.',
        time: new Date(),
        severity: 'warn'
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 5));
      if (selectedFarm) {
        newAlerts.forEach(alert => saveAlert(alert, selectedFarm));
      }
    }
  };

  const handleFarmSelect = async (farmId: string) => {
    setSelectedFarm(farmId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const farm = farms.find(f => f.id === farmId);
    if (farm) {
      const welcomeAlert = {
        id: alertIdRef.current++,
        type: 'system',
        message: `${t('connectedTo')} ${farm.name}`,
        time: new Date(),
        severity: 'ok' as const
      };
      setAlerts([welcomeAlert]);

      const recentData = await loadRecentSensorData(farmId);
      if (recentData.length > 0) {
        setHistoricalData(recentData);
        setMetrics(recentData[recentData.length - 1]);
      } else {
        setHistoricalData([]);
      }

      const recentAlerts = await loadRecentAlerts(farmId);
      if (recentAlerts.length > 0) {
        setAlerts([welcomeAlert, ...recentAlerts]);
      }
    }
  };

  const handleBackToSelection = () => {
    setSelectedFarm(null);
    setActivePage('dashboard');
  };

  const handleAddFarm = async (farmData: {
    name: string;
    latitude: number;
    longitude: number;
    region: string;
  }) => {
    const result = await addFarm(farmData);
    if (result.success && result.farm) {
      setFarms((prevFarms) => [...prevFarms, result.farm!]);
    } else {
      console.error('Failed to add farm:', result.error);
      throw new Error(result.error || 'Failed to add farm');
    }
  };

  useEffect(() => {
    const initializeFarms = async () => {
      const loadedFarms = await loadFarms();
      setFarms(loadedFarms);
    };
    initializeFarms();
  }, []);

  useEffect(() => {
    const initialData: Metrics[] = [];
    let current: Metrics = {
      temperature: 26.5,
      ph: 7.8,
      dissolvedOxygen: 6.8,
      turbidity: 12.3,
      ammonia: 0.04,
      healthScore: 87
    };

    for (let i = 0; i < 90; i++) {
      current = generateMetrics(current);
      initialData.push({ ...current });
    }
    setHistoricalData(initialData);
    setMetrics(current);
  }, [selectedFarm]);

  useEffect(() => {
    if (!selectedFarm) return;

    const interval = setInterval(() => {
      setHistoricalData(prev => {
        const latest = prev[prev.length - 1] || metrics;
        const newMetric = generateMetrics(latest);
        setMetrics(newMetric);
        checkAlerts(newMetric);

        saveSensorData(newMetric, selectedFarm);

        return [...prev.slice(-89), newMetric];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [aeratorActive, selectedFarm]);

  useEffect(() => {
    if (!selectedFarm) return;

    const interval = setInterval(() => {
      const types = ['Plastic Bottle', 'Debris', 'Oil Sheen', 'Net Fragment'];
      const newDetection: Detection = {
        id: detectionIdRef.current++,
        type: types[Math.floor(Math.random() * types.length)],
        x: Math.random() * 70 + 10,
        y: Math.random() * 70 + 10,
        width: Math.random() * 15 + 10,
        height: Math.random() * 15 + 10,
        time: new Date()
      };
      setDetections(prev => [newDetection, ...prev].slice(0, 10));

      if (selectedFarm) {
        saveWasteDetection(newDetection, selectedFarm);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedFarm]);

  const tabs = [
    { id: 'dashboard' as PageType, label: t('dashboard'), icon: BarChart3 },
    { id: 'insights' as PageType, label: t('aiInsights'), icon: Brain },
    { id: 'vision' as PageType, label: t('visionDetection'), icon: Camera },
  ];

  if (!selectedFarm) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '1rem' }}>
        <button
          onClick={toggleLanguage}
          className="language-toggle-fixed"
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 1000,
            padding: '0.5rem 1rem',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '50px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--cy)',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.15)',
          }}
        >
          <Languages size={16} />
          <span>{language === 'en' ? 'عربي' : 'English'}</span>
        </button>
        <FarmSelection farms={farms} onFarmSelect={handleFarmSelect} onAddFarm={handleAddFarm} />
        <footer style={{ textAlign: 'center', padding: '1rem', color: 'var(--muted)', fontSize: '0.75rem', borderTop: '1px solid rgba(56, 189, 248, 0.1)', marginTop: '1rem' }}>
          <p>{t('footer1')}</p>
          <p style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>{t('footer2')}</p>
        </footer>
      </div>
    );
  }

  const currentFarm = farms.find(f => f.id === selectedFarm);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0.75rem' }}>
      <button
        onClick={toggleLanguage}
        className="language-toggle-fixed"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
          padding: '0.5rem 1rem',
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '50px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: 'var(--cy)',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(56, 189, 248, 0.15)',
        }}
      >
        <Languages size={16} />
        <span>{language === 'en' ? 'عربي' : 'English'}</span>
      </button>
      <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={handleBackToSelection}
                style={{
                  padding: '0.4rem 0.75rem',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid var(--cy)',
                  borderRadius: '8px',
                  color: 'var(--cy)',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <ArrowLeft size={14} />
                {t('changeFarm')}
              </button>
              <div>
                <h1 className="glow-cyan" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                  {currentFarm?.name || 'Aquavolt'}
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: '0.75rem', margin: '0.15rem 0 0 0' }}>
                  {currentFarm?.lat.toFixed(3)}°N, {currentFarm?.lng.toFixed(3)}°E
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="status-indicator status-ok" style={{ display: 'inline-block', marginRight: '0.4rem' }}></span>
              <span style={{ color: 'var(--ok)', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('online')}</span>
            </div>
          </div>
        </header>

        <nav className="tab-navigation" style={{ marginBottom: '0.75rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePage(tab.id)}
              className={`tab-button ${activePage === tab.id ? 'active' : ''}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        {activePage === 'dashboard' && (
          <Dashboard
            metrics={metrics}
            historicalData={historicalData}
            alerts={alerts}
            aeratorActive={aeratorActive}
            onAeratorToggle={() => setAeratorActive(!aeratorActive)}
          />
        )}

        {activePage === 'insights' && (
          <AIInsights
            metrics={metrics}
            historicalData={historicalData}
            aeratorActive={aeratorActive}
            onAeratorToggle={() => setAeratorActive(!aeratorActive)}
          />
        )}

        {activePage === 'vision' && (
          <VisionDetection detections={detections} />
        )}

        <footer style={{ textAlign: 'center', padding: '0.75rem 1rem', color: 'var(--muted)', fontSize: '0.7rem', borderTop: '1px solid rgba(56, 189, 248, 0.1)', marginTop: '0.75rem' }}>
          <p>{t('footer1')}</p>
          <p style={{ fontSize: '0.65rem', marginTop: '0.15rem' }}>{t('footer2')}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
