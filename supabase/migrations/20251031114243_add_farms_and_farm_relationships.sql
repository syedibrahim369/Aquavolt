/*
  # Add Farms Table and Farm Relationships
  
  ## Overview
  Creates a farms table to store aquaculture farm locations and adds farm_id 
  foreign key relationships to all existing tables for multi-farm support.

  ## New Tables
  
  ### farms
  Stores aquaculture farm location and metadata:
  - `id` (text, primary key) - unique farm identifier
  - `name` (text) - farm display name
  - `latitude` (decimal) - geographic latitude
  - `longitude` (decimal) - geographic longitude  
  - `region` (text) - geographic region/area
  - `status` (text) - operational status (active, inactive, maintenance)
  - `created_at` (timestamptz) - record creation time

  ## Table Modifications
  
  Adds `farm_id` foreign key column to:
  - sensor_data
  - alerts
  - predictions
  - feeding_recommendations
  - waste_detections
  
  ## Data Seeding
  
  Seeds the database with 5 Omani aquaculture farm locations:
  1. Muscat Marine (23.614°N, 58.545°E)
  2. Sur Coastal (22.567°N, 59.529°E)
  3. Sohar Blue (24.347°N, 56.709°E)
  4. Salalah Deep (17.015°N, 54.092°E)
  5. Khasab Ocean (26.180°N, 56.239°E)

  ## Security
  
  - Enable RLS on farms table
  - Add public read access policy for demo purposes
  - Maintain existing RLS policies on related tables
*/

-- Create farms table
CREATE TABLE IF NOT EXISTS farms (
  id text PRIMARY KEY,
  name text NOT NULL,
  latitude decimal(9,6) NOT NULL,
  longitude decimal(9,6) NOT NULL,
  region text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_farms_status ON farms(status);

-- Enable RLS on farms table
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to farms
CREATE POLICY "Allow public read access to farms"
  ON farms FOR SELECT
  TO anon
  USING (true);

-- Seed farms data with Omani aquaculture locations
INSERT INTO farms (id, name, latitude, longitude, region, status) VALUES
  ('1', 'Muscat Marine', 23.614, 58.545, 'Muscat Governorate', 'active'),
  ('2', 'Sur Coastal', 22.567, 59.529, 'Ash Sharqiyah South', 'active'),
  ('3', 'Sohar Blue', 24.347, 56.709, 'Al Batinah North', 'active'),
  ('4', 'Salalah Deep', 17.015, 54.092, 'Dhofar Governorate', 'active'),
  ('5', 'Khasab Ocean', 26.180, 56.239, 'Musandam Governorate', 'active')
ON CONFLICT (id) DO NOTHING;

-- Add farm_id column to sensor_data if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sensor_data' AND column_name = 'farm_id'
  ) THEN
    ALTER TABLE sensor_data ADD COLUMN farm_id text REFERENCES farms(id);
    CREATE INDEX idx_sensor_data_farm_id ON sensor_data(farm_id);
  END IF;
END $$;

-- Add farm_id column to alerts if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'alerts' AND column_name = 'farm_id'
  ) THEN
    ALTER TABLE alerts ADD COLUMN farm_id text REFERENCES farms(id);
    CREATE INDEX idx_alerts_farm_id ON alerts(farm_id);
  END IF;
END $$;

-- Add farm_id column to predictions if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'predictions' AND column_name = 'farm_id'
  ) THEN
    ALTER TABLE predictions ADD COLUMN farm_id text REFERENCES farms(id);
    CREATE INDEX idx_predictions_farm_id ON predictions(farm_id);
  END IF;
END $$;

-- Add farm_id column to feeding_recommendations if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'feeding_recommendations' AND column_name = 'farm_id'
  ) THEN
    ALTER TABLE feeding_recommendations ADD COLUMN farm_id text REFERENCES farms(id);
    CREATE INDEX idx_feeding_recommendations_farm_id ON feeding_recommendations(farm_id);
  END IF;
END $$;

-- Add farm_id column to waste_detections if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waste_detections' AND column_name = 'farm_id'
  ) THEN
    ALTER TABLE waste_detections ADD COLUMN farm_id text REFERENCES farms(id);
    CREATE INDEX idx_waste_detections_farm_id ON waste_detections(farm_id);
  END IF;
END $$;