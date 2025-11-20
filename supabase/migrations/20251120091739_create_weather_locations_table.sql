/*
  # Create weather app saved locations system

  ## Overview
  This migration creates a table to support a weather and local information tool
  that allows users to save their favorite locations for quick weather access.

  ## New Tables
  
  ### `saved_locations`
  Stores user's favorite locations for weather tracking.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users(id)
  - `name` (text, required) - Location display name (e.g., "Home", "Work", "Paris")
  - `city` (text, required) - City name
  - `country` (text, required) - Country name or code
  - `latitude` (numeric, required) - Latitude coordinate
  - `longitude` (numeric, required) - Longitude coordinate
  - `is_default` (boolean) - Whether this is the user's default location (default: false)
  - `created_at` (timestamptz) - When location was added (default: now())
  - `updated_at` (timestamptz) - Last update timestamp (default: now())

  ## Security
  
  ### Row Level Security (RLS)
  - Enabled on all tables
  - Users can only access their own saved locations
  - All operations require authentication
  
  ### Policies
  
  #### saved_locations policies:
  1. **"Users can view own locations"** - SELECT policy
  2. **"Users can add locations"** - INSERT policy
  3. **"Users can update own locations"** - UPDATE policy
  4. **"Users can delete own locations"** - DELETE policy

  ## Indexes
  - Primary key index on id
  - Foreign key index on user_id for efficient user data retrieval
  - Index on is_default for quick default location queries

  ## Notes
  - All timestamps use timezone-aware types (timestamptz)
  - Coordinates use numeric type for precise geolocation
  - Only one default location per user (enforced at application level)
  - Location data can be used with various weather APIs
*/

-- Create saved_locations table
CREATE TABLE IF NOT EXISTS saved_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  latitude numeric(10, 6) NOT NULL,
  longitude numeric(10, 6) NOT NULL,
  is_default boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for saved_locations
CREATE INDEX IF NOT EXISTS idx_saved_locations_user_id ON saved_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_locations_is_default ON saved_locations(is_default) WHERE is_default = true;

-- Enable Row Level Security
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;

-- Policies for saved_locations
CREATE POLICY "Users can view own locations"
  ON saved_locations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add locations"
  ON saved_locations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own locations"
  ON saved_locations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own locations"
  ON saved_locations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_saved_locations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_saved_locations_updated_at
  BEFORE UPDATE ON saved_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_locations_updated_at();