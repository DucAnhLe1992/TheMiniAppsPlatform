/*
  # Create currency converter and budget calculator system

  ## Overview
  This migration creates tables to support a currency converter and budget calculator
  application with the ability to save conversion history, create budgets, track
  expenses, and manage multiple currencies.

  ## New Tables
  
  ### `saved_conversions`
  Stores user's conversion history for quick reference.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users(id)
  - `from_currency` (text, required) - Source currency code (e.g., USD, EUR)
  - `to_currency` (text, required) - Target currency code
  - `amount` (numeric, required) - Amount to convert
  - `converted_amount` (numeric, required) - Result of conversion
  - `exchange_rate` (numeric, required) - Exchange rate used
  - `created_at` (timestamptz) - When conversion was saved (default: now())

  ### `budgets`
  User-created budgets for expense tracking.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users(id)
  - `name` (text, required) - Budget name (e.g., "Monthly Budget", "Vacation Fund")
  - `description` (text, optional) - Optional description
  - `currency` (text, required) - Budget currency code (default: USD)
  - `total_amount` (numeric, required) - Total budget amount
  - `period` (text, required) - Budget period: monthly, weekly, yearly, one-time
  - `start_date` (date, required) - Budget start date
  - `end_date` (date, optional) - Budget end date (for one-time budgets)
  - `created_at` (timestamptz) - When budget was created (default: now())
  - `updated_at` (timestamptz) - Last update timestamp (default: now())

  ### `budget_expenses`
  Individual expenses tracked against budgets.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `budget_id` (uuid, foreign key) - References budgets(id)
  - `user_id` (uuid, foreign key) - References auth.users(id)
  - `description` (text, required) - Expense description
  - `amount` (numeric, required) - Expense amount
  - `category` (text, optional) - Expense category (e.g., Food, Transport, Entertainment)
  - `date` (date, required) - Date of expense (default: today)
  - `notes` (text, optional) - Additional notes
  - `created_at` (timestamptz) - When expense was added (default: now())
  - `updated_at` (timestamptz) - Last update timestamp (default: now())

  ### `favorite_currencies`
  User's frequently used currency pairs for quick access.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users(id)
  - `from_currency` (text, required) - Source currency code
  - `to_currency` (text, required) - Target currency code
  - `created_at` (timestamptz) - When favorite was added (default: now())

  ## Security
  
  ### Row Level Security (RLS)
  - Enabled on all tables
  - Users can only access their own data
  - All operations require authentication
  
  ### Policies
  
  #### saved_conversions policies:
  1. **"Users can view own conversions"** - SELECT policy
  2. **"Users can save conversions"** - INSERT policy
  3. **"Users can delete own conversions"** - DELETE policy
  
  #### budgets policies:
  1. **"Users can view own budgets"** - SELECT policy
  2. **"Users can create budgets"** - INSERT policy
  3. **"Users can update own budgets"** - UPDATE policy
  4. **"Users can delete own budgets"** - DELETE policy
  
  #### budget_expenses policies:
  1. **"Users can view own expenses"** - SELECT policy
  2. **"Users can add expenses"** - INSERT policy
  3. **"Users can update own expenses"** - UPDATE policy
  4. **"Users can delete own expenses"** - DELETE policy
  
  #### favorite_currencies policies:
  1. **"Users can view own favorites"** - SELECT policy
  2. **"Users can add favorites"** - INSERT policy
  3. **"Users can delete favorites"** - DELETE policy

  ## Indexes
  - Primary key indexes on all tables
  - Foreign key indexes for efficient joins
  - Indexes on user_id for fast user data retrieval
  - Indexes on dates for budget period queries

  ## Notes
  - All timestamps use timezone-aware types (timestamptz)
  - Cascading delete for expenses when budget is deleted
  - Numeric type used for precise financial calculations
  - Currency codes follow ISO 4217 standard (USD, EUR, GBP, etc.)
  - Budget periods support flexible time ranges
*/

-- Create saved_conversions table
CREATE TABLE IF NOT EXISTS saved_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  from_currency text NOT NULL,
  to_currency text NOT NULL,
  amount numeric(15, 2) NOT NULL,
  converted_amount numeric(15, 2) NOT NULL,
  exchange_rate numeric(15, 6) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  currency text DEFAULT 'USD' NOT NULL,
  total_amount numeric(15, 2) NOT NULL,
  period text NOT NULL CHECK (period IN ('monthly', 'weekly', 'yearly', 'one-time')),
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create budget_expenses table
CREATE TABLE IF NOT EXISTS budget_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id uuid REFERENCES budgets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  amount numeric(15, 2) NOT NULL,
  category text,
  date date DEFAULT CURRENT_DATE NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create favorite_currencies table
CREATE TABLE IF NOT EXISTS favorite_currencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  from_currency text NOT NULL,
  to_currency text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, from_currency, to_currency)
);

-- Create indexes for saved_conversions
CREATE INDEX IF NOT EXISTS idx_saved_conversions_user_id ON saved_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_conversions_created_at ON saved_conversions(created_at DESC);

-- Create indexes for budgets
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_start_date ON budgets(start_date);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period);

-- Create indexes for budget_expenses
CREATE INDEX IF NOT EXISTS idx_budget_expenses_budget_id ON budget_expenses(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_expenses_user_id ON budget_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_expenses_date ON budget_expenses(date DESC);

-- Create indexes for favorite_currencies
CREATE INDEX IF NOT EXISTS idx_favorite_currencies_user_id ON favorite_currencies(user_id);

-- Enable Row Level Security
ALTER TABLE saved_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_currencies ENABLE ROW LEVEL SECURITY;

-- Policies for saved_conversions
CREATE POLICY "Users can view own conversions"
  ON saved_conversions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save conversions"
  ON saved_conversions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversions"
  ON saved_conversions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for budgets
CREATE POLICY "Users can view own budgets"
  ON budgets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create budgets"
  ON budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
  ON budgets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
  ON budgets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for budget_expenses
CREATE POLICY "Users can view own expenses"
  ON budget_expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add expenses"
  ON budget_expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON budget_expenses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON budget_expenses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for favorite_currencies
CREATE POLICY "Users can view own favorites"
  ON favorite_currencies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorite_currencies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete favorites"
  ON favorite_currencies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp for budgets
CREATE OR REPLACE FUNCTION update_budgets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp for budget_expenses
CREATE OR REPLACE FUNCTION update_budget_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at for budgets
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_budgets_updated_at();

-- Trigger to automatically update updated_at for budget_expenses
CREATE TRIGGER update_budget_expenses_updated_at
  BEFORE UPDATE ON budget_expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_budget_expenses_updated_at();