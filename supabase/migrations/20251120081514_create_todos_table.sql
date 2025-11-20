/*
  # Create todos table for task management

  ## Overview
  This migration creates a comprehensive task management system with support for
  priorities, categories, due dates, and user ownership.

  ## New Tables
  
  ### `todos`
  Main table for storing user tasks and to-do items.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each todo
  - `user_id` (uuid, foreign key) - References auth.users(id), owner of the todo
  - `title` (text, required) - Task title/summary
  - `description` (text, optional) - Detailed description of the task
  - `completed` (boolean) - Whether the task is completed (default: false)
  - `priority` (text) - Priority level: 'low', 'medium', or 'high' (default: 'medium')
  - `category` (text, optional) - Category/tag for organizing tasks
  - `due_date` (timestamptz, optional) - When the task is due
  - `created_at` (timestamptz) - When the todo was created (default: now())
  - `updated_at` (timestamptz) - Last update timestamp (default: now())

  ## Security
  
  ### Row Level Security (RLS)
  - Enabled on `todos` table
  - Users can only access their own todos
  
  ### Policies
  1. **"Users can view own todos"** - SELECT policy
     - Allows authenticated users to view only their own todos
  
  2. **"Users can create own todos"** - INSERT policy
     - Allows authenticated users to create todos for themselves
     - Ensures user_id matches authenticated user
  
  3. **"Users can update own todos"** - UPDATE policy
     - Allows users to update only their own todos
     - Enforces ownership on both read and write
  
  4. **"Users can delete own todos"** - DELETE policy
     - Allows users to delete only their own todos

  ## Indexes
  - Primary key index on `id`
  - Foreign key index on `user_id` for efficient user queries
  - Index on `completed` for filtering
  - Composite index on `user_id, created_at` for sorted lists

  ## Notes
  - All timestamps use timezone-aware types (timestamptz)
  - Cascading delete if user is deleted (ON DELETE CASCADE)
  - Priority values should be: 'low', 'medium', or 'high'
  - Due dates are optional and can be null
*/

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false NOT NULL,
  priority text DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  category text,
  due_date timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_user_created ON todos(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date) WHERE due_date IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own todos
CREATE POLICY "Users can view own todos"
  ON todos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own todos
CREATE POLICY "Users can create own todos"
  ON todos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own todos
CREATE POLICY "Users can update own todos"
  ON todos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own todos
CREATE POLICY "Users can delete own todos"
  ON todos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();