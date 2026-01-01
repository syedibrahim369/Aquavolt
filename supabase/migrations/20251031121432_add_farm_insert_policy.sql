/*
  # Add Insert Policy for Farms

  ## Changes
  - Add policy to allow public users to insert new farms
  - This enables the "Add Farm" functionality in the application

  ## Security
  - Allows anonymous users to insert farms for demo purposes
  - In production, this should be restricted to authenticated admin users
*/

-- Create policy for public insert access to farms
CREATE POLICY "Allow public insert access to farms"
  ON farms FOR INSERT
  TO anon
  WITH CHECK (true);
