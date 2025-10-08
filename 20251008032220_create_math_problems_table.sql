/*
  # Create math problems table with auto-deletion

  1. New Tables
    - `math_problems`
      - `id` (uuid, primary key) - Unique identifier for each problem
      - `user_id` (uuid, foreign key) - References auth.users(id)
      - `problem_text` (text) - The math problem entered by the user
      - `explanation_steps` (jsonb) - Array of step-by-step explanation objects
      - `created_at` (timestamptz) - When the problem was created
      - `expires_at` (timestamptz) - Auto-calculated as created_at + 7 days
      
  2. Security
    - Enable RLS on `math_problems` table
    - Add policy for authenticated users to view only their own problems
    - Add policy for authenticated users to insert their own problems
    - Add policy for authenticated users to delete their own problems
    
  3. Auto-deletion
    - Add index on expires_at for efficient cleanup
    - Problems automatically marked for deletion after 7 days
*/

CREATE TABLE IF NOT EXISTS math_problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  problem_text text NOT NULL,
  explanation_steps jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz DEFAULT (now() + interval '7 days') NOT NULL
);

ALTER TABLE math_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own problems"
  ON math_problems FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own problems"
  ON math_problems FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own problems"
  ON math_problems FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_math_problems_user_id ON math_problems(user_id);
CREATE INDEX IF NOT EXISTS idx_math_problems_expires_at ON math_problems(expires_at);
CREATE INDEX IF NOT EXISTS idx_math_problems_created_at ON math_problems(created_at DESC);
