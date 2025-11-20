/*
  # Create notes table for note and snippet management

  ## Overview
  This migration creates a comprehensive notes and code snippets management system
  with support for rich text content, markdown, code highlighting, categories, tags,
  and powerful search functionality.

  ## New Tables
  
  ### `notes`
  Main table for storing user notes, code snippets, and rich content.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each note
  - `user_id` (uuid, foreign key) - References auth.users(id), owner of the note
  - `title` (text, required) - Note title/summary
  - `content` (text, required) - Note content (supports markdown, code, plain text)
  - `content_type` (text) - Type: 'note', 'code', or 'markdown' (default: 'note')
  - `language` (text, optional) - Programming language for code snippets (e.g., 'javascript', 'python')
  - `category` (text, optional) - Category for organizing notes
  - `tags` (text array, optional) - Array of tags for flexible organization
  - `is_favorite` (boolean) - Whether note is marked as favorite (default: false)
  - `color` (text, optional) - Color code for visual organization
  - `created_at` (timestamptz) - When the note was created (default: now())
  - `updated_at` (timestamptz) - Last update timestamp (default: now())

  ## Security
  
  ### Row Level Security (RLS)
  - Enabled on `notes` table
  - Users can only access their own notes
  
  ### Policies
  1. **"Users can view own notes"** - SELECT policy
     - Allows authenticated users to view only their own notes
  
  2. **"Users can create own notes"** - INSERT policy
     - Allows authenticated users to create notes for themselves
     - Ensures user_id matches authenticated user
  
  3. **"Users can update own notes"** - UPDATE policy
     - Allows users to update only their own notes
     - Enforces ownership on both read and write
  
  4. **"Users can delete own notes"** - DELETE policy
     - Allows users to delete only their own notes

  ## Indexes
  - Primary key index on `id`
  - Foreign key index on `user_id` for efficient user queries
  - Index on `category` for filtering
  - GIN index on `tags` for array searches
  - Full-text search index on title and content
  - Index on `is_favorite` for quick favorite filtering
  - Composite index on `user_id, updated_at` for sorted lists

  ## Notes
  - All timestamps use timezone-aware types (timestamptz)
  - Cascading delete if user is deleted (ON DELETE CASCADE)
  - Content types should be: 'note', 'code', or 'markdown'
  - Tags stored as text array for flexible tagging
  - Full-text search enabled for powerful searching
  - Color field allows hex color codes for visual organization
*/

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  content_type text DEFAULT 'note' NOT NULL CHECK (content_type IN ('note', 'code', 'markdown')),
  language text,
  category text,
  tags text[] DEFAULT '{}',
  is_favorite boolean DEFAULT false NOT NULL,
  color text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category) WHERE category IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_notes_is_favorite ON notes(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_notes_user_updated ON notes(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_content_type ON notes(content_type);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_notes_search ON notes USING GIN(to_tsvector('english', title || ' ' || content));

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notes
CREATE POLICY "Users can view own notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own notes
CREATE POLICY "Users can create own notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own notes
CREATE POLICY "Users can update own notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own notes
CREATE POLICY "Users can delete own notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_notes_updated_at();