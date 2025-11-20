/*
  # Platform Schema - Apps Registry & User Data

  ## Overview
  This migration creates the foundational schema for a micro-apps platform where users can
  access multiple AI tools, manage their data, and customize their experience.

  ## New Tables

  ### 1. `apps`
  Registry of all available applications in the platform
  - `id` (uuid, primary key) - Unique identifier for the app
  - `name` (text) - Display name of the app
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Brief description of what the app does
  - `icon` (text) - URL or path to app icon
  - `category` (text) - Category for grouping (e.g., "text", "image", "data")
  - `is_active` (boolean) - Whether the app is available to users
  - `entry_point` (text) - Path to the app's entry component
  - `created_at` (timestamptz) - When the app was registered
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `user_app_data`
  Stores user-specific data for each app (namespaced data storage)
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `app_id` (uuid, foreign key) - References apps table
  - `data` (jsonb) - Flexible JSON storage for app-specific data
  - `created_at` (timestamptz) - When the data was created
  - `updated_at` (timestamptz) - Last update timestamp
  - Unique constraint on (user_id, app_id) - One data record per user per app

  ### 3. `user_preferences`
  User-level settings and preferences
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key, unique) - References auth.users (one per user)
  - `theme` (text) - UI theme preference (light/dark/auto)
  - `favorite_apps` (text[]) - Array of app slugs marked as favorites
  - `created_at` (timestamptz) - When preferences were created
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security (Row Level Security)

  ### Apps Table
  - Enable RLS
  - Public read access for active apps (anyone can see available apps)
  - No insert/update/delete for regular users (admin-only via service role)

  ### User App Data Table
  - Enable RLS
  - Users can only read/write their own data
  - Users can create new data records for themselves
  - Users can update their own data records
  - Users can delete their own data records

  ### User Preferences Table
  - Enable RLS
  - Users can only read their own preferences
  - Users can create their own preferences (on first login)
  - Users can update their own preferences
  - Users cannot delete preferences (soft delete pattern if needed)

  ## Notes
  1. The `apps` table is managed by admins/developers, not end users
  2. `user_app_data` uses JSONB for flexibility - each app can store whatever structure it needs
  3. All tables use UUID for primary keys for better distribution in distributed systems
  4. Timestamps use `timestamptz` for timezone awareness
  5. RLS policies ensure users can only access their own data
  6. Foreign key constraints maintain referential integrity
*/

-- Create apps table
CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  is_active boolean DEFAULT true,
  entry_point text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_app_data table
CREATE TABLE IF NOT EXISTS user_app_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, app_id)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'auto',
  favorite_apps text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_apps_slug ON apps(slug);
CREATE INDEX IF NOT EXISTS idx_apps_category ON apps(category);
CREATE INDEX IF NOT EXISTS idx_apps_is_active ON apps(is_active);
CREATE INDEX IF NOT EXISTS idx_user_app_data_user_id ON user_app_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_app_data_app_id ON user_app_data(app_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable Row Level Security
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_app_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for apps table
CREATE POLICY "Anyone can view active apps"
  ON apps FOR SELECT
  USING (is_active = true);

-- RLS Policies for user_app_data table
CREATE POLICY "Users can view own app data"
  ON user_app_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own app data"
  ON user_app_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own app data"
  ON user_app_data FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own app data"
  ON user_app_data FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_preferences table
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_apps_updated_at
  BEFORE UPDATE ON apps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_app_data_updated_at
  BEFORE UPDATE ON user_app_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
