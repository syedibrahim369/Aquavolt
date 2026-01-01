import { useState } from 'react';
import { X, MapPin, Plus } from 'lucide-react';

interface AddFarmModalProps {
  onClose: () => void;
  onAddFarm: (farm: {
    name: string;
    latitude: number;
    longitude: number;
    region: string;
  }) => Promise<void>;
}

export function AddFarmModal({ onClose, onAddFarm }: AddFarmModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    region: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    if (!formData.name.trim() || !formData.region.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await onAddFarm({
        name: formData.name.trim(),
        latitude: lat,
        longitude: lng,
        region: formData.region.trim(),
      });
      onClose();
    } catch (err) {
      setError('Failed to add farm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin size={24} style={{ color: 'var(--cy)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text)', margin: 0 }}>
              Add New Farm
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--muted)',
              padding: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
              Farm Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Nizwa Aquaculture"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(12, 30, 44, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '1rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                Latitude
              </label>
              <input
                type="text"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="e.g., 23.614"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(12, 30, 44, 0.6)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '1rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                Longitude
              </label>
              <input
                type="text"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="e.g., 58.545"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(12, 30, 44, 0.6)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '1rem',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
              Region
            </label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="e.g., Ad Dakhiliyah Governorate"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(12, 30, 44, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '1rem',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: '0.75rem',
                background: 'rgba(255, 90, 103, 0.1)',
                border: '1px solid var(--bad)',
                borderRadius: '8px',
                color: 'var(--bad)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: 'var(--cy)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--bg)',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <Plus size={18} />
              {loading ? 'Adding...' : 'Add Farm'}
            </button>
          </div>
        </form>

        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(56, 189, 248, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(56, 189, 248, 0.3)',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            Coordinate Format
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
            Latitude: -90 to 90 (North/South)
            <br />
            Longitude: -180 to 180 (East/West)
          </div>
        </div>
      </div>
    </div>
  );
}
