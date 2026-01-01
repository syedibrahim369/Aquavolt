/*
  # AquaVolt Aquaculture Monitoring System Schema

  ## Overview
  Creates tables for storing aquaculture sensor data, alerts, predictions, 
  feeding recommendations, and marine waste detections for the AquaVolt platform.

  ## New Tables
  
  ### 1. sensor_data
  Stores time-series water quality and environmental measurements:
  - `id` (uuid, primary key)
  - `timestamp` (timestamptz) - measurement time
  - `temperature_c` (decimal) - water temperature in Celsius
  - `dissolved_oxygen_mgl` (decimal) - dissolved oxygen in mg/L
  - `ph` (decimal) - pH level
  - `ammonia_mgl` (decimal) - ammonia concentration in mg/L
  - `turbidity_ntu` (decimal) - water turbidity in NTU
  - `feeding_rate_gmin` (decimal) - feeding rate in g/min
  - `fish_activity_index` (decimal) - fish activity score (0-1)
  - `current_speed_ms` (decimal) - water current speed in m/s
  - `created_at` (timestamptz) - record creation time

  ### 2. alerts
  Stores system-generated alerts when parameters exceed thresholds:
  - `id` (uuid, primary key)
  - `timestamp` (timestamptz) - alert time
  - `alert_type` (text) - type of alert (low_oxygen, high_turbidity, etc.)
  - `severity` (text) - critical, warning, info
  - `message` (text) - alert description
  - `parameter_name` (text) - affected parameter
  - `parameter_value` (decimal) - measured value
  - `threshold` (decimal) - threshold that was crossed
  - `acknowledged` (boolean) - whether alert was acknowledged
  - `created_at` (timestamptz)

  ### 3. predictions
  Stores AI model predictions for water quality parameters:
  - `id` (uuid, primary key)
  - `prediction_time` (timestamptz) - when prediction was made
  - `target_time` (timestamptz) - future time being predicted
  - `parameter_name` (text) - predicted parameter
  - `predicted_value` (decimal) - predicted value
  - `confidence_score` (decimal) - model confidence (0-1)
  - `model_type` (text) - LSTM, RandomForest, etc.
  - `created_at` (timestamptz)

  ### 4. feeding_recommendations
  Stores feeding optimization recommendations:
  - `id` (uuid, primary key)
  - `timestamp` (timestamptz)
  - `recommended_rate_gmin` (decimal) - suggested feeding rate
  - `adjustment_percentage` (decimal) - % change from baseline
  - `reason` (text) - explanation for recommendation
  - `environment_score` (decimal) - overall environment health (0-1)
  - `feed_conversion_ratio` (decimal) - FCR metric
  - `feed_waste_ratio` (decimal) - waste percentage
  - `applied` (boolean) - whether recommendation was applied
  - `created_at` (timestamptz)

  ### 5. waste_detections
  Stores marine debris and pollution detection results:
  - `id` (uuid, primary key)
  - `timestamp` (timestamptz)
  - `detection_type` (text) - plastic, net, oil_slick, etc.
  - `confidence_score` (decimal) - detection confidence (0-1)
  - `location` (text) - cage location or coordinates
  - `image_url` (text) - reference to detection image
  - `bbox_data` (jsonb) - bounding box coordinates
  - `action_taken` (boolean)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Allow public read access for demo purposes
  - In production, restrict to authenticated users only
*/

-- Create sensor_data table
CREATE TABLE IF NOT EXISTS sensor_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL,
  temperature_c decimal(5,2) NOT NULL,
  dissolved_oxygen_mgl decimal(5,2) NOT NULL,
  ph decimal(4,2) NOT NULL,
  ammonia_mgl decimal(5,3) NOT NULL,
  turbidity_ntu decimal(5,2) NOT NULL,
  feeding_rate_gmin decimal(6,2) NOT NULL,
  fish_activity_index decimal(3,2) NOT NULL,
  current_speed_ms decimal(4,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data(timestamp DESC);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL,
  alert_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  message text NOT NULL,
  parameter_name text NOT NULL,
  parameter_value decimal(10,3),
  threshold decimal(10,3),
  acknowledged boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_time timestamptz NOT NULL,
  target_time timestamptz NOT NULL,
  parameter_name text NOT NULL,
  predicted_value decimal(10,3) NOT NULL,
  confidence_score decimal(3,2) NOT NULL,
  model_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_predictions_target_time ON predictions(target_time DESC);

-- Create feeding_recommendations table
CREATE TABLE IF NOT EXISTS feeding_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL,
  recommended_rate_gmin decimal(6,2) NOT NULL,
  adjustment_percentage decimal(6,2) NOT NULL,
  reason text NOT NULL,
  environment_score decimal(3,2) NOT NULL,
  feed_conversion_ratio decimal(4,2),
  feed_waste_ratio decimal(5,2),
  applied boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feeding_recommendations_timestamp ON feeding_recommendations(timestamp DESC);

-- Create waste_detections table
CREATE TABLE IF NOT EXISTS waste_detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL,
  detection_type text NOT NULL,
  confidence_score decimal(3,2) NOT NULL,
  location text NOT NULL,
  image_url text,
  bbox_data jsonb,
  action_taken boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_waste_detections_timestamp ON waste_detections(timestamp DESC);

-- Enable RLS on all tables
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_detections ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for demo purposes
-- In production, these should be restricted to authenticated users

CREATE POLICY "Allow public read access to sensor_data"
  ON sensor_data FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to sensor_data"
  ON sensor_data FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to alerts"
  ON alerts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to alerts"
  ON alerts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to predictions"
  ON predictions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to predictions"
  ON predictions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to feeding_recommendations"
  ON feeding_recommendations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to feeding_recommendations"
  ON feeding_recommendations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to waste_detections"
  ON waste_detections FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to waste_detections"
  ON waste_detections FOR INSERT
  TO anon
  WITH CHECK (true);