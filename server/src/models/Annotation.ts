import mongoose from 'mongoose';

// Define the schema for math annotations
const AnnotationSchema = new mongoose.Schema({
  // Problem information
  problem_id: {
    type: String,
    required: true,
    ref: 'Problem'
  },
  problem_category: {
    type: String,
    required: true
  },
  difficulty_level: {
    type: String,
    required: true
  },
  problem_text: {
    type: String,
    required: true
  },
  
  // Initial solution
  initial_solution_steps: {
    type: [String],
    required: true
  },
  
  // First error and guidance
  error_index: {
    type: Number,
    required: true
  },
  error_step_content: {
    type: String,
    required: true
  },
  error_type: {
    type: String,
    required: true,
    enum: [
      'calculation_error',
      'conceptual_misunderstanding',
      'approach_selection_error',
      'logical_reasoning_error',
      'domain_constraint_error',
      'formula_application_error',
      'notation_error',
      'other_error'
    ]
  },
  guidance_provided: {
    type: String,
    required: true
  },
  guidance_type: {
    type: String,
    required: true,
    enum: [
      'calculation_correction',
      'concept_clarification',
      'approach_redirection',
      'logical_flow_correction',
      'domain_reminder',
      'formula_clarification',
      'direct_correction',
      'other_correction'
    ]
  },
  
  // Revised solution
  revised_solution_steps: {
    type: [String],
    required: true
  },
  revision_outcome: {
    type: String,
    required: true,
    enum: ['CORRECTED', 'STILL_WRONG', 'DIFFERENT_ERROR']
  },
  
  // Optional second error and guidance
  error_index_2: {
    type: Number
  },
  error_step_content_2: {
    type: String
  },
  error_type_2: {
    type: String,
    enum: [
      'calculation_error',
      'conceptual_misunderstanding',
      'approach_selection_error',
      'logical_reasoning_error',
      'domain_constraint_error',
      'formula_application_error',
      'notation_error',
      'other_error'
    ]
  },
  guidance_provided_2: {
    type: String
  },
  guidance_type_2: {
    type: String,
    enum: [
      'calculation_correction',
      'concept_clarification',
      'approach_redirection',
      'logical_flow_correction',
      'domain_reminder',
      'formula_clarification',
      'direct_correction',
      'other_correction'
    ]
  },
  
  // Optional second revised solution
  revised_solution_steps_2: {
    type: [String]
  },
  revision_outcome_2: {
    type: String,
    enum: ['CORRECTED', 'STILL_WRONG', 'DIFFERENT_ERROR']
  },
  
  // Optional additional guidance
  additional_guidance_2: {
    type: String
  },
  additional_guidance_type_2: {
    type: String,
    enum: [
      'calculation_correction',
      'concept_clarification',
      'approach_redirection',
      'logical_flow_correction',
      'domain_reminder',
      'formula_clarification',
      'direct_correction',
      'other_correction'
    ]
  },
  
  // Optional third revised solution
  revised_solution_steps_3: {
    type: [String]
  },
  revision_outcome_3: {
    type: String,
    enum: ['CORRECTED', 'STILL_WRONG', 'DIFFERENT_ERROR']
  },
  
  // Final solution
  final_solution_steps: {
    type: [String]
  },
  
  // Intervention count
  intervention_count: {
    type: Number,
    required: true,
    default: 1
  },
  
  // Metadata
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  is_complete: {
    type: Boolean,
    default: false
  }
});

// Update the updated_at field on save
AnnotationSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Create and export the model
const Annotation = mongoose.model('Annotation', AnnotationSchema);

export default Annotation;
