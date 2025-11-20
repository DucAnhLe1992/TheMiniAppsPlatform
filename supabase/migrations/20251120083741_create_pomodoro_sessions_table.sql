/*
  # Create pomodoro_sessions table for productivity tracking

  ## Overview
  This migration creates a table to track Pomodoro timer sessions, allowing users
  to monitor their productivity over time and see statistics about their focus periods.

  ## New Tables
  
  ### `pomodoro_sessions`
  Stores completed Pomodoro timer sessions for each user.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each session
  - `user_id` (uuid, foreign key) - References auth.users(id), owner of the session
  - `session_type` (text) - Type of session: 'work', 'short_break', or 'long_break'
  - `duration_minutes` (integer) - Planned duration in minutes
  - `completed_at` (timestamptz) - When the session was completed (default: now())
  - `notes` (text, optional) - Optional notes about what was accomplished

  ## Security
  
  ### Row Level Security (RLS)
  - Enabled on `pomodoro_sessions` table
  - Users can only access their own sessions
  
  ### Policies
  1. **"Users can view own sessions"** - SELECT policy
     - Allows authenticated users to view only their own sessions
  
  2. **"Users can create own sessions"** - INSERT policy
     - Allows authenticated users to create sessions for themselves
     - Ensures user_id matches authenticated user
  
  3. **"Users can delete own sessions"** - DELETE policy
     - Allows users to delete only their own sessions

  ## Indexes
  - Primary key index on `id`
  - Foreign key index on `user_id` for efficient user queries
  - Index on `completed_at` for date-based queries
  - Composite index on `user_id, completed_at` for session history

  ## Notes
  - All timestamps use timezone-aware types (timestamptz)
  - Cascading delete if user is deleted (ON DELETE CASCADE)
  - Session types should be: 'work', 'short_break', or 'long_break'
  - Duration is stored in minutes for easy querying and statistics
  - Sessions are only recorded when completed, not when started
*/

-- Create pomodoro_sessions table
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_type text NOT NULL CHECK (session_type IN ('work', 'short_break', 'long_break')),
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  completed_at timestamptz DEFAULT now() NOT NULL,
  notes text
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_completed_at ON pomodoro_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_completed ON pomodoro_sessions(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_type ON pomodoro_sessions(session_type);

-- Enable Row Level Security
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON pomodoro_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own sessions
CREATE POLICY "Users can create own sessions"
  ON pomodoro_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own sessions
CREATE POLICY "Users can delete own sessions"
  ON pomodoro_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);