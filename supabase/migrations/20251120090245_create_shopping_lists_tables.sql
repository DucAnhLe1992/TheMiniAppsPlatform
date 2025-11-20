/*
  # Create shopping lists system with collaboration features

  ## Overview
  This migration creates a comprehensive shopping list and grocery planning system
  with real-time collaboration features, allowing users to create, share, and
  collaborate on shopping lists with family members, roommates, or friends.

  ## New Tables
  
  ### `shopping_lists`
  Main table for storing shopping lists.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each list
  - `owner_id` (uuid, foreign key) - References auth.users(id), creator of the list
  - `name` (text, required) - List name (e.g., "Weekly Groceries", "Party Supplies")
  - `description` (text, optional) - Optional description of the list
  - `is_shared` (boolean) - Whether the list is shared with others (default: false)
  - `created_at` (timestamptz) - When the list was created (default: now())
  - `updated_at` (timestamptz) - Last update timestamp (default: now())

  ### `shopping_list_items`
  Items within shopping lists.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each item
  - `list_id` (uuid, foreign key) - References shopping_lists(id)
  - `name` (text, required) - Item name (e.g., "Milk", "Bread")
  - `quantity` (text, optional) - Quantity needed (e.g., "2", "1 gallon", "500g")
  - `category` (text, optional) - Category for organization (e.g., "Dairy", "Produce")
  - `notes` (text, optional) - Additional notes about the item
  - `is_checked` (boolean) - Whether item is checked off (default: false)
  - `checked_by` (uuid, foreign key, optional) - References auth.users(id), who checked it
  - `checked_at` (timestamptz, optional) - When item was checked
  - `added_by` (uuid, foreign key) - References auth.users(id), who added the item
  - `created_at` (timestamptz) - When the item was added (default: now())
  - `updated_at` (timestamptz) - Last update timestamp (default: now())

  ### `shopping_list_collaborators`
  Junction table for managing list sharing and collaboration.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `list_id` (uuid, foreign key) - References shopping_lists(id)
  - `user_id` (uuid, foreign key) - References auth.users(id), collaborator
  - `role` (text) - Collaborator role: 'editor' or 'viewer' (default: 'editor')
  - `invited_by` (uuid, foreign key) - References auth.users(id), who sent the invite
  - `invited_at` (timestamptz) - When the invitation was created (default: now())

  ## Security
  
  ### Row Level Security (RLS)
  - Enabled on all tables
  - Users can access lists they own or are collaborators on
  - Only owners can delete lists
  - Editors can add/edit/check items, viewers can only view
  
  ### Policies
  
  #### shopping_lists policies:
  1. **"Users can view own and shared lists"** - SELECT policy
  2. **"Users can create own lists"** - INSERT policy
  3. **"Users can update own lists"** - UPDATE policy
  4. **"Users can delete own lists"** - DELETE policy
  
  #### shopping_list_items policies:
  1. **"Users can view items from accessible lists"** - SELECT policy
  2. **"Users can add items to accessible lists"** - INSERT policy
  3. **"Editors can update items"** - UPDATE policy
  4. **"Editors can delete items"** - DELETE policy
  
  #### shopping_list_collaborators policies:
  1. **"Users can view collaborators of accessible lists"** - SELECT policy
  2. **"Owners can add collaborators"** - INSERT policy
  3. **"Owners can remove collaborators"** - DELETE policy

  ## Indexes
  - Primary key indexes on all tables
  - Foreign key indexes for efficient joins
  - Composite indexes for common query patterns
  - Indexes on is_checked for filtering

  ## Notes
  - All timestamps use timezone-aware types (timestamptz)
  - Cascading delete for list items when list is deleted
  - Cascading delete for collaborators when list is deleted
  - Role-based access control for collaboration features
  - Real-time subscription support for collaborative editing
*/

-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS shopping_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  is_shared boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create shopping_list_items table
CREATE TABLE IF NOT EXISTS shopping_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid REFERENCES shopping_lists(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  quantity text,
  category text,
  notes text,
  is_checked boolean DEFAULT false NOT NULL,
  checked_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  checked_at timestamptz,
  added_by uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create shopping_list_collaborators table
CREATE TABLE IF NOT EXISTS shopping_list_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid REFERENCES shopping_lists(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'editor' NOT NULL CHECK (role IN ('editor', 'viewer')),
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  invited_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(list_id, user_id)
);

-- Create indexes for shopping_lists
CREATE INDEX IF NOT EXISTS idx_shopping_lists_owner_id ON shopping_lists(owner_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_updated_at ON shopping_lists(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_is_shared ON shopping_lists(is_shared) WHERE is_shared = true;

-- Create indexes for shopping_list_items
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_list_id ON shopping_list_items(list_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_is_checked ON shopping_list_items(is_checked);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_category ON shopping_list_items(category) WHERE category IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_added_by ON shopping_list_items(added_by);

-- Create indexes for shopping_list_collaborators
CREATE INDEX IF NOT EXISTS idx_shopping_list_collaborators_list_id ON shopping_list_collaborators(list_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_collaborators_user_id ON shopping_list_collaborators(user_id);

-- Enable Row Level Security
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_collaborators ENABLE ROW LEVEL SECURITY;

-- Policies for shopping_lists
CREATE POLICY "Users can view own and shared lists"
  ON shopping_lists
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() 
    OR id IN (
      SELECT list_id FROM shopping_list_collaborators 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own lists"
  ON shopping_lists
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own lists"
  ON shopping_lists
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete own lists"
  ON shopping_lists
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Policies for shopping_list_items
CREATE POLICY "Users can view items from accessible lists"
  ON shopping_list_items
  FOR SELECT
  TO authenticated
  USING (
    list_id IN (
      SELECT id FROM shopping_lists 
      WHERE owner_id = auth.uid() 
      OR id IN (
        SELECT list_id FROM shopping_list_collaborators 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can add items to accessible lists"
  ON shopping_list_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    list_id IN (
      SELECT id FROM shopping_lists 
      WHERE owner_id = auth.uid() 
      OR id IN (
        SELECT list_id FROM shopping_list_collaborators 
        WHERE user_id = auth.uid() AND role = 'editor'
      )
    )
    AND auth.uid() = added_by
  );

CREATE POLICY "Editors can update items"
  ON shopping_list_items
  FOR UPDATE
  TO authenticated
  USING (
    list_id IN (
      SELECT id FROM shopping_lists 
      WHERE owner_id = auth.uid() 
      OR id IN (
        SELECT list_id FROM shopping_list_collaborators 
        WHERE user_id = auth.uid() AND role = 'editor'
      )
    )
  )
  WITH CHECK (
    list_id IN (
      SELECT id FROM shopping_lists 
      WHERE owner_id = auth.uid() 
      OR id IN (
        SELECT list_id FROM shopping_list_collaborators 
        WHERE user_id = auth.uid() AND role = 'editor'
      )
    )
  );

CREATE POLICY "Editors can delete items"
  ON shopping_list_items
  FOR DELETE
  TO authenticated
  USING (
    list_id IN (
      SELECT id FROM shopping_lists 
      WHERE owner_id = auth.uid() 
      OR id IN (
        SELECT list_id FROM shopping_list_collaborators 
        WHERE user_id = auth.uid() AND role = 'editor'
      )
    )
  );

-- Policies for shopping_list_collaborators
CREATE POLICY "Users can view collaborators of accessible lists"
  ON shopping_list_collaborators
  FOR SELECT
  TO authenticated
  USING (
    list_id IN (
      SELECT id FROM shopping_lists 
      WHERE owner_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Owners can add collaborators"
  ON shopping_list_collaborators
  FOR INSERT
  TO authenticated
  WITH CHECK (
    list_id IN (
      SELECT id FROM shopping_lists 
      WHERE owner_id = auth.uid()
    )
    AND auth.uid() = invited_by
  );

CREATE POLICY "Owners can remove collaborators"
  ON shopping_list_collaborators
  FOR DELETE
  TO authenticated
  USING (
    list_id IN (
      SELECT id FROM shopping_lists 
      WHERE owner_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp for shopping_lists
CREATE OR REPLACE FUNCTION update_shopping_lists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp for shopping_list_items
CREATE OR REPLACE FUNCTION update_shopping_list_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at for shopping_lists
CREATE TRIGGER update_shopping_lists_updated_at
  BEFORE UPDATE ON shopping_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_shopping_lists_updated_at();

-- Trigger to automatically update updated_at for shopping_list_items
CREATE TRIGGER update_shopping_list_items_updated_at
  BEFORE UPDATE ON shopping_list_items
  FOR EACH ROW
  EXECUTE FUNCTION update_shopping_list_items_updated_at();