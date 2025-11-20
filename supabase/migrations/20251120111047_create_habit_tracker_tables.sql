/*
  # Habit Tracker Schema

  1. New Tables
    - `habits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, habit name)
      - `description` (text, optional description)
      - `color` (text, hex color for visual distinction)
      - `icon` (text, emoji icon)
      - `frequency` (text, daily/weekly/custom)
      - `target_days` (jsonb, array of weekdays for weekly habits)
      - `reminder_time` (time, optional reminder time)
      - `created_at` (timestamptz)
      - `archived_at` (timestamptz, null if active)

    - `habit_completions`
      - `id` (uuid, primary key)
      - `habit_id` (uuid, references habits)
      - `user_id` (uuid, references auth.users)
      - `completed_date` (date, the date of completion)
      - `notes` (text, optional notes)
      - `created_at` (timestamptz, when marked complete)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own habits and completions
    - Policies for select, insert, update, delete operations

  3. Indexes
    - Index on user_id for faster queries
    - Index on completed_date for streak calculations
    - Unique constraint on habit_id + completed_date to prevent duplicates

  4. Important Notes
    - Streaks are calculated on-the-fly from completions
    - Archived habits are soft-deleted (archived_at is set)
    - Daily habits have frequency='daily', weekly habits store target days
    - Completions use date type for accurate day tracking
*/

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#3b82f6',
  icon text DEFAULT '✓',
  frequency text DEFAULT 'daily',
  target_days jsonb DEFAULT '[]'::jsonb,
  reminder_time time,
  created_at timestamptz DEFAULT now(),
  archived_at timestamptz
);

-- Create habit_completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_date date NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, completed_date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_archived ON habits(archived_at) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_completions_user_id ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON habit_completions(completed_date);

-- Enable RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Habits policies
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habits"
  ON habits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Habit completions policies
CREATE POLICY "Users can view own completions"
  ON habit_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own completions"
  ON habit_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own completions"
  ON habit_completions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own completions"
  ON habit_completions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
