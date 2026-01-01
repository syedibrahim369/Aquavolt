export interface SensorData {
  id?: string;
  timestamp: Date;
  temperature_c: number;
  dissolved_oxygen_mgl: number;
  ph: number;
  ammonia_mgl: number;
  turbidity_ntu: number;
  feeding_rate_gmin: number;
  fish_activity_index: number;
  current_speed_ms: number;
}

export interface Metrics {
  temperature: number;
  ph: number;
  dissolvedOxygen: number;
  turbidity: number;
  ammonia: number;
  healthScore: number;
}

export interface FarmLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Detection {
  id: number;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  time: Date;
}

export interface Alert {
  id: number;
  type: string;
  message: string;
  time: Date;
  severity: 'ok' | 'warn' | 'bad';
}

export interface Prediction {
  id?: string;
  prediction_time: Date;
  target_time: Date;
  parameter_name: string;
  predicted_value: number;
  confidence_score: number;
  model_type: string;
}

export interface FeedingRecommendation {
  id?: string;
  timestamp: Date;
  recommended_rate_gmin: number;
  adjustment_percentage: number;
  reason: string;
  environment_score: number;
  feed_conversion_ratio?: number;
  feed_waste_ratio?: number;
  applied: boolean;
}

export interface WasteDetection {
  id?: string;
  timestamp: Date;
  detection_type: string;
  confidence_score: number;
  location: string;
  image_url?: string;
  bbox_data?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  action_taken: boolean;
}

export interface ParameterThresholds {
  temperature_c: { min: number; max: number; critical_min: number; critical_max: number };
  dissolved_oxygen_mgl: { min: number; max: number; critical_min: number; critical_max: number };
  ph: { min: number; max: number; critical_min: number; critical_max: number };
  ammonia_mgl: { max: number; critical_max: number };
  turbidity_ntu: { max: number; critical_max: number };
  feeding_rate_gmin: { min: number; max: number };
  fish_activity_index: { min: number; critical_min: number };
  current_speed_ms: { min: number; critical_min: number };
}
