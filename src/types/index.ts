/**
 * Type definitions for the math annotation tool
 */

// Problem types
export interface Problem {
  id?: string;
  problem_id: string;
  problem_category: ProblemCategory;
  difficulty_level: DifficultyLevel;
  problem_text: string;
  is_annotated: boolean;
  is_discarded: boolean;
  created_at: string;
}

export type ProblemCategory = 
  | 'Algebra' 
  | 'Calculus' 
  | 'Geometry' 
  | 'Probability' 
  | 'Statistics' 
  | 'Number Theory' 
  | 'Combinatorics' 
  | 'Other';

export type DifficultyLevel = 
  | 'Beginner' 
  | 'Intermediate' 
  | 'Advanced' 
  | 'Expert';

// Error types
export type ErrorType = 
  | 'calculation_error'
  | 'conceptual_misunderstanding'
  | 'approach_selection_error'
  | 'logical_reasoning_error'
  | 'domain_constraint_error'
  | 'formula_application_error'
  | 'notation_error'
  | 'other_error';

export const ERROR_TYPES: { value: ErrorType; label: string }[] = [
  { value: 'calculation_error', label: 'Calculation Error' },
  { value: 'conceptual_misunderstanding', label: 'Conceptual Misunderstanding' },
  { value: 'approach_selection_error', label: 'Approach Selection Error' },
  { value: 'logical_reasoning_error', label: 'Logical Reasoning Error' },
  { value: 'domain_constraint_error', label: 'Domain Constraint Error' },
  { value: 'formula_application_error', label: 'Formula Application Error' },
  { value: 'notation_error', label: 'Notation Error' },
  { value: 'other_error', label: 'Other Error' }
];

// Guidance types
export type GuidanceType = 
  | 'calculation_correction'
  | 'concept_clarification'
  | 'approach_redirection'
  | 'logical_flow_correction'
  | 'domain_reminder'
  | 'formula_clarification'
  | 'direct_correction'
  | 'other_correction';

export const GUIDANCE_TYPES: { value: GuidanceType; label: string }[] = [
  { value: 'calculation_correction', label: 'Calculation Correction' },
  { value: 'concept_clarification', label: 'Concept Clarification' },
  { value: 'approach_redirection', label: 'Approach Redirection' },
  { value: 'logical_flow_correction', label: 'Logical Flow Correction' },
  { value: 'domain_reminder', label: 'Domain Reminder' },
  { value: 'formula_clarification', label: 'Formula Clarification' },
  { value: 'direct_correction', label: 'Direct Correction' },
  { value: 'other_correction', label: 'Other Correction' }
];

// Revision outcome types
export type RevisionOutcome = 
  | 'CORRECTED'
  | 'STILL_WRONG'
  | 'DIFFERENT_ERROR';

// Annotation types
export interface Annotation {
  id?: string;
  // Problem information
  problem_id: string;
  problem_category: ProblemCategory;
  difficulty_level: DifficultyLevel;
  problem_text: string;
  
  // Initial solution
  initial_solution_steps: string[];
  
  // First error and guidance
  error_index: number;
  error_step_content: string;
  error_type: ErrorType;
  guidance_provided: string;
  guidance_type: GuidanceType;
  
  // Revised solution
  revised_solution_steps: string[];
  revision_outcome: RevisionOutcome;
  
  // Optional second error and guidance
  error_index_2?: number;
  error_step_content_2?: string;
  error_type_2?: ErrorType;
  guidance_provided_2?: string;
  guidance_type_2?: GuidanceType;
  
  // Optional second revised solution
  revised_solution_steps_2?: string[];
  revision_outcome_2?: RevisionOutcome;
  
  // Optional additional guidance
  additional_guidance_2?: string;
  additional_guidance_type_2?: GuidanceType;
  
  // Optional third revised solution
  revised_solution_steps_3?: string[];
  revision_outcome_3?: RevisionOutcome;
  
  // Final solution
  final_solution_steps?: string[];
  
  // Intervention count
  intervention_count: number;
  
  // Metadata
  created_at: string;
  updated_at: string;
  is_complete: boolean;
}

// Form data for guidance submission
export interface GuidanceFormData {
  error_index: number;
  error_step_content: string;
  error_type: ErrorType;
  guidance_provided: string;
  guidance_type: GuidanceType;
}
