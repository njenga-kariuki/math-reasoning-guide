import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { annotationService, problemService } from '../services/supabaseService';
import claudeService from '../services/claude';

// Get all annotations
export const getAnnotations = async (req: Request, res: Response) => {
  try {
    const { problem_id, complete } = req.query;
    
    // Build filter object based on query parameters
    const filter: any = {};
    
    if (problem_id) filter.problem_id = problem_id;
    if (complete !== undefined) filter.is_complete = complete === 'true';
    
    const annotations = await annotationService.getAnnotations(filter);
    
    res.status(200).json({
      success: true,
      count: annotations.length,
      data: annotations
    });
  } catch (error) {
    console.error('Error getting annotations:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get a single annotation
export const getAnnotation = async (req: Request, res: Response) => {
  try {
    const annotation = await annotationService.getAnnotation(req.params.id);
    
    if (!annotation) {
      return res.status(404).json({
        success: false,
        error: 'Annotation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: annotation
    });
  } catch (error) {
    console.error('Error getting annotation:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Start a new annotation process
export const startAnnotation = async (req: Request, res: Response) => {
  try {
    const { problem_id } = req.body;
    
    // Validate input
    if (!problem_id) {
      return res.status(400).json({
        success: false,
        error: 'Problem ID is required'
      });
    }
    
    // Find the problem
    const problem = await problemService.getProblem(problem_id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found'
      });
    }
    
    // Check if problem is already annotated or discarded
    if (problem.is_annotated) {
      return res.status(400).json({
        success: false,
        error: 'Problem is already annotated'
      });
    }
    
    if (problem.is_discarded) {
      return res.status(400).json({
        success: false,
        error: 'Problem is already discarded'
      });
    }
    
    // Get initial solution from Claude
    const initialSolutionSteps = await claudeService.getInitialSolution(problem.problem_text);
    
    // Create a new annotation
    const annotation = await annotationService.createAnnotation({
      problem_id: problem.problem_id,
      problem_category: problem.problem_category,
      difficulty_level: problem.difficulty_level,
      problem_text: problem.problem_text,
      initial_solution_steps: initialSolutionSteps,
      // These fields will be populated later
      error_index: 0,
      error_step_content: '',
      error_type: 'calculation_error',
      guidance_provided: '',
      guidance_type: 'calculation_correction',
      revised_solution_steps: [],
      revision_outcome: 'STILL_WRONG',
      intervention_count: 0,
      is_complete: false
    });
    
    res.status(201).json({
      success: true,
      data: annotation
    });
  } catch (error) {
    console.error('Error starting annotation:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Submit guidance and get revised solution
export const submitGuidance = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { 
      error_index, 
      error_step_content, 
      error_type, 
      guidance_provided, 
      guidance_type 
    } = req.body;
    
    // Find the annotation
    const annotation = await annotationService.getAnnotation(req.params.id);
    
    if (!annotation) {
      return res.status(404).json({
        success: false,
        error: 'Annotation not found'
      });
    }
    
    // Check if annotation is already complete
    if (annotation.is_complete) {
      return res.status(400).json({
        success: false,
        error: 'Annotation is already complete'
      });
    }
    
    // Determine which attempt this is
    const attemptNumber = annotation.intervention_count + 1;
    
    // Get the appropriate solution steps to revise
    const stepsToRevise = attemptNumber === 1 
      ? annotation.initial_solution_steps 
      : (annotation.revised_solution_steps.length > 0 
          ? annotation.revised_solution_steps 
          : annotation.initial_solution_steps);
    
    // Get revised solution from Claude
    const revisedSolutionSteps = await claudeService.getRevisedSolution(
      annotation.problem_text,
      stepsToRevise,
      error_index,
      guidance_provided,
      attemptNumber
    );
    
    // Update the annotation based on the attempt number
    if (attemptNumber === 1) {
      // First attempt
      annotation.error_index = error_index;
      annotation.error_step_content = error_step_content;
      annotation.error_type = error_type;
      annotation.guidance_provided = guidance_provided;
      annotation.guidance_type = guidance_type;
      annotation.revised_solution_steps = revisedSolutionSteps;
      annotation.revision_outcome = 'STILL_WRONG'; // Default, will be updated when marked
      annotation.intervention_count = attemptNumber;
    } else if (attemptNumber === 2) {
      // Second attempt
      annotation.error_index_2 = error_index;
      annotation.error_step_content_2 = error_step_content;
      annotation.error_type_2 = error_type;
      annotation.guidance_provided_2 = guidance_provided;
      annotation.guidance_type_2 = guidance_type;
      annotation.revised_solution_steps_2 = revisedSolutionSteps;
      annotation.revision_outcome_2 = 'STILL_WRONG'; // Default, will be updated when marked
      annotation.intervention_count = attemptNumber;
    } else {
      // Third attempt (additional guidance)
      annotation.additional_guidance_2 = guidance_provided;
      annotation.additional_guidance_type_2 = guidance_type;
      annotation.revised_solution_steps_3 = revisedSolutionSteps;
      annotation.revision_outcome_3 = 'STILL_WRONG'; // Default, will be updated when marked
      annotation.intervention_count = attemptNumber;
    }
    
    // Update the annotation using the service
    const updatedAnnotation = await annotationService.updateAnnotation(annotation.id, annotation);
    
    res.status(200).json({
      success: true,
      data: updatedAnnotation
    });
  } catch (error) {
    console.error('Error submitting guidance:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Mark solution as correct and finalize annotation
export const markAsCorrect = async (req: Request, res: Response) => {
  try {
    const { outcome } = req.body;
    
    // Validate outcome
    if (!outcome || !['CORRECTED', 'STILL_WRONG', 'DIFFERENT_ERROR'].includes(outcome)) {
      return res.status(400).json({
        success: false,
        error: 'Valid outcome is required (CORRECTED, STILL_WRONG, DIFFERENT_ERROR)'
      });
    }
    
    // Find the annotation
    const annotation = await annotationService.getAnnotation(req.params.id);
    
    if (!annotation) {
      return res.status(404).json({
        success: false,
        error: 'Annotation not found'
      });
    }
    
    // Check which attempt this is
    const attemptNumber = annotation.intervention_count;
    
    // Update the appropriate revision outcome
    if (attemptNumber === 1) {
      annotation.revision_outcome = outcome;
    } else if (attemptNumber === 2) {
      annotation.revision_outcome_2 = outcome;
    } else {
      annotation.revision_outcome_3 = outcome;
    }
    
    // Set final solution steps based on the latest revision
    if (attemptNumber === 1) {
      annotation.final_solution_steps = annotation.revised_solution_steps;
    } else if (attemptNumber === 2) {
      annotation.final_solution_steps = annotation.revised_solution_steps_2 || annotation.revised_solution_steps;
    } else {
      annotation.final_solution_steps = annotation.revised_solution_steps_3 || 
                                        annotation.revised_solution_steps_2 || 
                                        annotation.revised_solution_steps;
    }
    
    // Mark annotation as complete
    annotation.is_complete = true;
    
    // Update the annotation
    await annotationService.updateAnnotation(annotation.id!, annotation);
    
    // Update the problem as annotated
    await problemService.updateProblem(annotation.problem_id, { is_annotated: true });
    
    res.status(200).json({
      success: true,
      data: annotation,
      message: 'Annotation completed successfully'
    });
  } catch (error) {
    console.error('Error marking as correct:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Discard a problem during annotation
export const discardProblem = async (req: Request, res: Response) => {
  try {
    const { problem_id } = req.body;
    
    // Validate input
    if (!problem_id) {
      return res.status(400).json({
        success: false,
        error: 'Problem ID is required'
      });
    }
    
    // Update the problem as discarded
    const problem = await problemService.discardProblem(problem_id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: problem,
      message: 'Problem discarded successfully'
    });
  } catch (error) {
    console.error('Error discarding problem:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
