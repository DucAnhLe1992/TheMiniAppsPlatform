/*
  # Add Advanced Calendar Features

  1. Modify events table
    - Add recurrence_rule (text) - RRULE format for recurring events
    - Add parent_event_id (uuid) - For recurring event instances
    - Add reminder_minutes (integer) - Minutes before event to send reminder

  2. New Tables
    - `event_participants`
      - id (uuid, primary key)
      - event_id (uuid, foreign key to events)
      - email (text)
      - name (text, nullable)
      - status (text: pending, accepted, declined, tentative)
      - created_at (timestamptz)

    - `availability_settings`
      - id (uuid, primary key)
      - user_id (uuid, foreign key to auth.users)
      - day_of_week (integer, 0-6)
      - start_time (time)
      - end_time (time)
      - is_available (boolean)

    - `external_calendar_connections`
      - id (uuid, primary key)
      - user_id (uuid, foreign key to auth.users)
      - provider (text: google, outlook)
      - access_token (text)
      - refresh_token (text)
      - token_expiry (timestamptz)
      - calendar_id (text)
      - last_sync (timestamptz)
      - created_at (timestamptz)

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Add columns to events table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'recurrence_rule'
  ) THEN
    ALTER TABLE events ADD COLUMN recurrence_rule text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'parent_event_id'
  ) THEN
    ALTER TABLE events ADD COLUMN parent_event_id uuid REFERENCES events(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'reminder_minutes'
  ) THEN
    ALTER TABLE events ADD COLUMN reminder_minutes integer DEFAULT 15;
  END IF;
END $$;

-- Create event_participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants of their events"
  ON event_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_participants.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add participants to their events"
  ON event_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_participants.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update participants of their events"
  ON event_participants FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_participants.event_id
      AND events.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_participants.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete participants from their events"
  ON event_participants FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_participants.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Create availability_settings table
CREATE TABLE IF NOT EXISTS availability_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, day_of_week, start_time)
);

ALTER TABLE availability_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own availability"
  ON availability_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own availability"
  ON availability_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own availability"
  ON availability_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own availability"
  ON availability_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create external_calendar_connections table
CREATE TABLE IF NOT EXISTS external_calendar_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('google', 'outlook')),
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  token_expiry timestamptz NOT NULL,
  calendar_id text NOT NULL,
  last_sync timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider)
);

ALTER TABLE external_calendar_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calendar connections"
  ON external_calendar_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own calendar connections"
  ON external_calendar_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar connections"
  ON external_calendar_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar connections"
  ON external_calendar_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_availability_user_day ON availability_settings(user_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_external_calendars_user ON external_calendar_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_events_recurrence ON events(parent_event_id) WHERE parent_event_id IS NOT NULL;
