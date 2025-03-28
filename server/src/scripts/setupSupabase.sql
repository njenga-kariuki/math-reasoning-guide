-- SQL script to set up Supabase tables for the Math Annotation Tool

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id TEXT UNIQUE NOT NULL,
  problem_category TEXT NOT NULL CHECK (problem_category IN ('Algebra', 'Calculus', 'Geometry', 'Probability', 'Statistics', 'Number Theory', 'Combinatorics', 'Other')),
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  problem_text TEXT NOT NULL,
  is_annotated BOOLEAN NOT NULL DEFAULT false,
  is_discarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on problem_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_problems_problem_id ON problems(problem_id);

-- Annotations table
CREATE TABLE IF NOT EXISTS annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id TEXT NOT NULL REFERENCES problems(problem_id),
  problem_category TEXT NOT NULL,
  difficulty_level TEXT NOT NULL,
  problem_text TEXT NOT NULL,
  
  -- Initial solution
  initial_solution_steps JSONB NOT NULL,
  
  -- First error and guidance
  error_index INTEGER NOT NULL,
  error_step_content TEXT NOT NULL,
  error_type TEXT NOT NULL,
  guidance_provided TEXT NOT NULL,
  guidance_type TEXT NOT NULL,
  
  -- Revised solution
  revised_solution_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  revision_outcome TEXT,
  
  -- Optional second error and guidance
  error_index_2 INTEGER,
  error_step_content_2 TEXT,
  error_type_2 TEXT,
  guidance_provided_2 TEXT,
  guidance_type_2 TEXT,
  
  -- Optional second revised solution
  revised_solution_steps_2 JSONB DEFAULT '[]'::jsonb,
  revision_outcome_2 TEXT,
  
  -- Optional additional guidance
  additional_guidance_2 TEXT,
  additional_guidance_type_2 TEXT,
  
  -- Optional third revised solution
  revised_solution_steps_3 JSONB DEFAULT '[]'::jsonb,
  revision_outcome_3 TEXT,
  
  -- Final solution
  final_solution_steps JSONB DEFAULT '[]'::jsonb,
  
  -- Intervention count
  intervention_count INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_complete BOOLEAN NOT NULL DEFAULT false,
  
  -- Constraints
  CONSTRAINT valid_error_type CHECK (error_type IN ('calculation_error', 'conceptual_misunderstanding', 'approach_selection_error', 'logical_reasoning_error', 'domain_constraint_error', 'formula_application_error', 'notation_error', 'other_error')),
  CONSTRAINT valid_guidance_type CHECK (guidance_type IN ('calculation_correction', 'concept_clarification', 'approach_redirection', 'logical_flow_correction', 'domain_reminder', 'formula_clarification', 'direct_correction', 'other_correction')),
  CONSTRAINT valid_revision_outcome CHECK (revision_outcome IN ('CORRECTED', 'STILL_WRONG', 'DIFFERENT_ERROR'))
);

-- Create index on problem_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_annotations_problem_id ON annotations(problem_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_annotations_updated_at
BEFORE UPDATE ON annotations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies for security
-- Enable RLS on tables
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow full access to authenticated users" ON problems
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow full access to authenticated users" ON annotations
  FOR ALL
  TO authenticated
  USING (true);
