import { supabase } from '../lib/supabase';
import type { Metrics, Alert, Detection } from '../types/aquaculture';

export async function saveSensorData(metrics: Metrics, farmId: string) {
  try {
    const { error } = await supabase
      .from('sensor_data')
      .insert({
        farm_id: farmId,
        timestamp: new Date().toISOString(),
        temperature_c: metrics.temperature,
        dissolved_oxygen_mgl: metrics.dissolvedOxygen,
        ph: metrics.ph,
        ammonia_mgl: metrics.ammonia,
        turbidity_ntu: metrics.turbidity,
        feeding_rate_gmin: 0,
        fish_activity_index: metrics.healthScore / 100,
        current_speed_ms: 0.5
      });

    if (error) {
      console.error('Error saving sensor data:', error);
    }
  } catch (err) {
    console.error('Failed to save sensor data:', err);
  }
}

export async function saveAlert(alert: Alert, farmId: string) {
  try {
    const { error } = await supabase
      .from('alerts')
      .insert({
        farm_id: farmId,
        timestamp: alert.time.toISOString(),
        alert_type: alert.type,
        severity: alert.severity === 'bad' ? 'critical' : alert.severity === 'warn' ? 'warning' : 'info',
        message: alert.message,
        parameter_name: alert.type,
        parameter_value: 0,
        threshold: 0,
        acknowledged: false
      });

    if (error) {
      console.error('Error saving alert:', error);
    }
  } catch (err) {
    console.error('Failed to save alert:', err);
  }
}

export async function saveWasteDetection(detection: Detection, farmId: string) {
  try {
    const { error } = await supabase
      .from('waste_detections')
      .insert({
        farm_id: farmId,
        timestamp: detection.time.toISOString(),
        detection_type: detection.type.toLowerCase().replace(' ', '_'),
        confidence_score: 0.94,
        location: 'Camera 01 - Underwater West',
        bbox_data: {
          x: detection.x,
          y: detection.y,
          width: detection.width,
          height: detection.height
        },
        action_taken: false
      });

    if (error) {
      console.error('Error saving waste detection:', error);
    }
  } catch (err) {
    console.error('Failed to save waste detection:', err);
  }
}

export async function savePrediction(parameterName: string, predictedValue: number, farmId: string) {
  try {
    const now = new Date();
    const targetTime = new Date(now.getTime() + 60 * 60 * 1000);

    const { error } = await supabase
      .from('predictions')
      .insert({
        farm_id: farmId,
        prediction_time: now.toISOString(),
        target_time: targetTime.toISOString(),
        parameter_name: parameterName,
        predicted_value: predictedValue,
        confidence_score: 0.92,
        model_type: 'LSTM'
      });

    if (error) {
      console.error('Error saving prediction:', error);
    }
  } catch (err) {
    console.error('Failed to save prediction:', err);
  }
}

export async function saveFeedingRecommendation(rate: number, reason: string, farmId: string) {
  try {
    const { error } = await supabase
      .from('feeding_recommendations')
      .insert({
        farm_id: farmId,
        timestamp: new Date().toISOString(),
        recommended_rate_gmin: rate,
        adjustment_percentage: 0,
        reason: reason,
        environment_score: 0.87,
        applied: false
      });

    if (error) {
      console.error('Error saving feeding recommendation:', error);
    }
  } catch (err) {
    console.error('Failed to save feeding recommendation:', err);
  }
}

export async function loadRecentSensorData(farmId: string, limit: number = 90) {
  try {
    const { data, error } = await supabase
      .from('sensor_data')
      .select('*')
      .eq('farm_id', farmId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error loading sensor data:', error);
      return [];
    }

    return data.map(d => ({
      temperature: Number(d.temperature_c),
      ph: Number(d.ph),
      dissolvedOxygen: Number(d.dissolved_oxygen_mgl),
      turbidity: Number(d.turbidity_ntu),
      ammonia: Number(d.ammonia_mgl),
      healthScore: Math.round(Number(d.fish_activity_index) * 100)
    })).reverse();
  } catch (err) {
    console.error('Failed to load sensor data:', err);
    return [];
  }
}

export async function loadRecentAlerts(farmId: string, limit: number = 5) {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('farm_id', farmId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error loading alerts:', error);
      return [];
    }

    return data.map((a, idx) => ({
      id: idx + 1,
      type: a.alert_type,
      message: a.message,
      time: new Date(a.timestamp),
      severity: (a.severity === 'critical' ? 'bad' : a.severity === 'warning' ? 'warn' : 'ok') as 'ok' | 'warn' | 'bad'
    }));
  } catch (err) {
    console.error('Failed to load alerts:', err);
    return [];
  }
}
