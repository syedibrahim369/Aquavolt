import { SensorData, Alert, ParameterThresholds } from '../types/aquaculture';

export const PARAMETER_THRESHOLDS: ParameterThresholds = {
  temperature_c: { min: 24, max: 31, critical_min: 22, critical_max: 33 },
  dissolved_oxygen_mgl: { min: 6, max: 8, critical_min: 5, critical_max: 9 },
  ph: { min: 7.5, max: 8.5, critical_min: 6.5, critical_max: 8.8 },
  ammonia_mgl: { max: 0.25, critical_max: 0.5 },
  turbidity_ntu: { max: 25, critical_max: 30 },
  feeding_rate_gmin: { min: 150, max: 350 },
  fish_activity_index: { min: 0.6, critical_min: 0.5 },
  current_speed_ms: { min: 0.3, critical_min: 0.2 },
};

export class AlertSystem {
  generateAlerts(data: SensorData): Alert[] {
    const alerts: Alert[] = [];
    const timestamp = data.timestamp;

    if (data.dissolved_oxygen_mgl < PARAMETER_THRESHOLDS.dissolved_oxygen_mgl.critical_min) {
      alerts.push({
        timestamp,
        alert_type: 'low_oxygen',
        severity: 'critical',
        message: 'Critical low oxygen alert! Immediate action required.',
        parameter_name: 'dissolved_oxygen_mgl',
        parameter_value: data.dissolved_oxygen_mgl,
        threshold: PARAMETER_THRESHOLDS.dissolved_oxygen_mgl.critical_min,
        acknowledged: false,
      });
    } else if (data.dissolved_oxygen_mgl < PARAMETER_THRESHOLDS.dissolved_oxygen_mgl.min) {
      alerts.push({
        timestamp,
        alert_type: 'low_oxygen',
        severity: 'warning',
        message: 'Low oxygen levels detected. Monitor closely.',
        parameter_name: 'dissolved_oxygen_mgl',
        parameter_value: data.dissolved_oxygen_mgl,
        threshold: PARAMETER_THRESHOLDS.dissolved_oxygen_mgl.min,
        acknowledged: false,
      });
    }

    if (data.dissolved_oxygen_mgl > PARAMETER_THRESHOLDS.dissolved_oxygen_mgl.critical_max) {
      alerts.push({
        timestamp,
        alert_type: 'high_oxygen',
        severity: 'warning',
        message: 'Oxygen oversaturation detected.',
        parameter_name: 'dissolved_oxygen_mgl',
        parameter_value: data.dissolved_oxygen_mgl,
        threshold: PARAMETER_THRESHOLDS.dissolved_oxygen_mgl.critical_max,
        acknowledged: false,
      });
    }

    if (data.ph < PARAMETER_THRESHOLDS.ph.critical_min) {
      alerts.push({
        timestamp,
        alert_type: 'acidic_water',
        severity: 'critical',
        message: 'Acidic water detected! pH critically low.',
        parameter_name: 'ph',
        parameter_value: data.ph,
        threshold: PARAMETER_THRESHOLDS.ph.critical_min,
        acknowledged: false,
      });
    } else if (data.ph > PARAMETER_THRESHOLDS.ph.critical_max) {
      alerts.push({
        timestamp,
        alert_type: 'alkaline_water',
        severity: 'warning',
        message: 'Water pH too alkaline.',
        parameter_name: 'ph',
        parameter_value: data.ph,
        threshold: PARAMETER_THRESHOLDS.ph.critical_max,
        acknowledged: false,
      });
    }

    if (data.turbidity_ntu > PARAMETER_THRESHOLDS.turbidity_ntu.critical_max) {
      alerts.push({
        timestamp,
        alert_type: 'high_waste',
        severity: 'warning',
        message: 'High waste detected! Elevated turbidity levels.',
        parameter_name: 'turbidity_ntu',
        parameter_value: data.turbidity_ntu,
        threshold: PARAMETER_THRESHOLDS.turbidity_ntu.critical_max,
        acknowledged: false,
      });
    }

    if (data.ammonia_mgl > PARAMETER_THRESHOLDS.ammonia_mgl.critical_max) {
      alerts.push({
        timestamp,
        alert_type: 'high_ammonia',
        severity: 'critical',
        message: 'Toxic ammonia levels detected!',
        parameter_name: 'ammonia_mgl',
        parameter_value: data.ammonia_mgl,
        threshold: PARAMETER_THRESHOLDS.ammonia_mgl.critical_max,
        acknowledged: false,
      });
    }

    if (data.temperature_c < PARAMETER_THRESHOLDS.temperature_c.critical_min) {
      alerts.push({
        timestamp,
        alert_type: 'low_temperature',
        severity: 'warning',
        message: 'Water temperature critically low. Fish growth may slow.',
        parameter_name: 'temperature_c',
        parameter_value: data.temperature_c,
        threshold: PARAMETER_THRESHOLDS.temperature_c.critical_min,
        acknowledged: false,
      });
    } else if (data.temperature_c > PARAMETER_THRESHOLDS.temperature_c.critical_max) {
      alerts.push({
        timestamp,
        alert_type: 'high_temperature',
        severity: 'critical',
        message: 'Critical high temperature! Oxygen depletion risk.',
        parameter_name: 'temperature_c',
        parameter_value: data.temperature_c,
        threshold: PARAMETER_THRESHOLDS.temperature_c.critical_max,
        acknowledged: false,
      });
    }

    if (data.fish_activity_index < PARAMETER_THRESHOLDS.fish_activity_index.critical_min) {
      alerts.push({
        timestamp,
        alert_type: 'low_activity',
        severity: 'warning',
        message: 'Low fish activity detected. Check for stress or disease.',
        parameter_name: 'fish_activity_index',
        parameter_value: data.fish_activity_index,
        threshold: PARAMETER_THRESHOLDS.fish_activity_index.critical_min,
        acknowledged: false,
      });
    }

    if (data.current_speed_ms < PARAMETER_THRESHOLDS.current_speed_ms.critical_min) {
      alerts.push({
        timestamp,
        alert_type: 'low_flow',
        severity: 'info',
        message: 'Low water flow. May affect oxygen mixing.',
        parameter_name: 'current_speed_ms',
        parameter_value: data.current_speed_ms,
        threshold: PARAMETER_THRESHOLDS.current_speed_ms.critical_min,
        acknowledged: false,
      });
    }

    return alerts;
  }

  getParameterStatus(value: number, parameterName: keyof ParameterThresholds): 'good' | 'warning' | 'critical' {
    const thresholds = PARAMETER_THRESHOLDS[parameterName];

    if (!thresholds) return 'good';

    if ('min' in thresholds && 'max' in thresholds) {
      if (value < thresholds.critical_min || value > thresholds.critical_max) {
        return 'critical';
      }
      if (value < thresholds.min || value > thresholds.max) {
        return 'warning';
      }
      return 'good';
    }

    if ('max' in thresholds) {
      if (value > thresholds.critical_max) return 'critical';
      if (value > thresholds.max) return 'warning';
      return 'good';
    }

    return 'good';
  }
}
