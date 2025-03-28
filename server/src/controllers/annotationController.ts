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
  const startTime = performance.now();
  try {
    const { problem_id } = req.body;

    // Validate input
    if (!problem_id) {
      return res.status(400).json({
        success: false,
        error: 'Problem ID is required'
      });
    }

    // Find the problem first - we need this before we can generate the solution
    const problemFetchStart = performance.now();
    const problem = await problemService.getProblem(problem_id);
    console.log(`[Performance] Problem fetch took ${performance.now() - problemFetchStart}ms`);

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

    // Get initial solution from Claude - since we have the problem now, we can start this
    // and create the annotation in parallel
    const claudeStart = performance.now();
    
    // Run the Claude API call and database creation in parallel
    const [initialSolutionSteps] = await Promise.all([
      claudeService.getInitialSolution(problem.problem_text),
      // We could add more parallel tasks here if needed
    ]);
    
    console.log(`[Performance] Claude API call for initial solution took ${performance.now() - claudeStart}ms`);

    // Create a new annotation
    const dbInsertStart = performance.now();
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
    console.log(`[Performance] DB insert for annotation took ${performance.now() - dbInsertStart}ms`);

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
  console.log(`[Performance] Total startAnnotation request took ${performance.now() - startTime}ms`);
};

// Submit guidance and get revised solution
export const submitGuidance = async (req: Request, res: Response) => {
  const startTime = performance.now();
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors in guidance submission:", errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const annotationId = req.params.id;
    console.log(`Processing guidance submission for annotation ID: ${annotationId}`);

    const { 
      error_index, 
      error_step_content, 
      error_type, 
      guidance_provided, 
      guidance_type 
    } = req.body;

    console.log(`Received guidance submission for annotation ${annotationId}:`, {
      error_index,
      error_type,
      guidance_type,
      guidanceLength: guidance_provided?.length
    });

    // Find the annotation
    const fetchAnnotationStart = performance.now();
    const annotation = await annotationService.getAnnotation(annotationId);
    console.log(`[Performance] Annotation fetch took ${performance.now() - fetchAnnotationStart}ms`);

    if (!annotation) {
      console.error(`Annotation ${annotationId} not found`);
      return res.status(404).json({
        success: false,
        error: 'Annotation not found'
      });
    }

    console.log(`Found annotation ${annotationId}:`, {
      problem_id: annotation.problem_id,
      interventionCount: annotation.intervention_count,
      hasInitialSteps: !!annotation.initial_solution_steps.length,
      hasRevisedSteps: !!annotation.revised_solution_steps.length
    });

    // Check if annotation is already complete
    if (annotation.is_complete) {
      console.error(`Annotation ${annotationId} is already complete`);
      return res.status(400).json({
        success: false,
        error: 'Annotation is already complete'
      });
    }

    // Determine which attempt this is
    const attemptNumber = annotation.intervention_count + 1;
    console.log(`Processing guidance submission for annotation ${annotationId}, attempt number ${attemptNumber}`);

    // Get the appropriate solution steps to revise
    const stepsToRevise = attemptNumber === 1 
      ? annotation.initial_solution_steps 
      : (annotation.revised_solution_steps.length > 0 
          ? annotation.revised_solution_steps 
          : annotation.initial_solution_steps);
    
    console.log("Steps to revise:", {
      count: stepsToRevise.length,
      source: attemptNumber === 1 ? 'initial_solution_steps' : 
        (annotation.revised_solution_steps.length > 0 ? 'revised_solution_steps' : 'initial_solution_steps')
    });

    // Get revised solution from Claude
    try {
      console.log("Calling Claude service for revised solution...");
      const claudeStart = performance.now();
      const revisedSolutionSteps = await claudeService.getRevisedSolution(
        annotation.problem_text,
        stepsToRevise,
        error_index,
        guidance_provided,
        attemptNumber
      );
      console.log(`[Performance] Claude API call for revised solution took ${performance.now() - claudeStart}ms`);
      
      console.log("Claude service response:", {
        responseType: typeof revisedSolutionSteps,
        isArray: Array.isArray(revisedSolutionSteps),
        length: Array.isArray(revisedSolutionSteps) ? revisedSolutionSteps.length : 'N/A',
        sample: Array.isArray(revisedSolutionSteps) && revisedSolutionSteps.length > 0 
          ? revisedSolutionSteps[0].substring(0, 100) + '...' 
          : 'No content'
      });
      
      // Validate that we actually got a valid response
      if (!Array.isArray(revisedSolutionSteps) || revisedSolutionSteps.length === 0) {
        console.error('Claude service returned empty or invalid solution steps');
        return res.status(500).json({
          success: false,
          error: 'Failed to generate revised solution steps'
        });
      }

      // Create a copy of the annotation to update
      const annotationToUpdate = { ...annotation };

      // Update the annotation based on the attempt number
      if (attemptNumber === 1) {
        // First attempt
        annotationToUpdate.error_index = error_index;
        annotationToUpdate.error_step_content = error_step_content;
        annotationToUpdate.error_type = error_type;
        annotationToUpdate.guidance_provided = guidance_provided;
        annotationToUpdate.guidance_type = guidance_type;
        annotationToUpdate.revised_solution_steps = revisedSolutionSteps;
        annotationToUpdate.revision_outcome = 'STILL_WRONG'; // Default, will be updated when marked
        annotationToUpdate.intervention_count = attemptNumber;
      } else if (attemptNumber === 2) {
        // Second attempt
        annotationToUpdate.error_index_2 = error_index;
        annotationToUpdate.error_step_content_2 = error_step_content;
        annotationToUpdate.error_type_2 = error_type;
        annotationToUpdate.guidance_provided_2 = guidance_provided;
        annotationToUpdate.guidance_type_2 = guidance_type;
        annotationToUpdate.revised_solution_steps_2 = revisedSolutionSteps;
        annotationToUpdate.revision_outcome_2 = 'STILL_WRONG'; // Default, will be updated when marked
        annotationToUpdate.intervention_count = attemptNumber;
      } else {
        // Third attempt (additional guidance)
        annotationToUpdate.additional_guidance_2 = guidance_provided;
        annotationToUpdate.additional_guidance_type_2 = guidance_type;
        annotationToUpdate.revised_solution_steps_3 = revisedSolutionSteps;
        annotationToUpdate.revision_outcome_3 = 'STILL_WRONG'; // Default, will be updated when marked
        annotationToUpdate.intervention_count = attemptNumber;
      }

      console.log(`Updating annotation ${annotationId} for attempt ${attemptNumber} with ${revisedSolutionSteps.length} steps`);
      
      // Update the annotation in the database
      const dbUpdateStart = performance.now();
      const updatedAnnotation = await annotationService.updateAnnotation(annotationId, annotationToUpdate);
      console.log(`[Performance] DB update for annotation took ${performance.now() - dbUpdateStart}ms`);

      // Get the updated annotation to make sure we have all fields
      const refreshedAnnotation = await annotationService.getAnnotation(annotationId);
      
      if (!refreshedAnnotation) {
        console.error(`Failed to retrieve refreshed annotation ${annotationId} after update`);
        return res.status(500).json({
          success: false,
          error: 'Failed to retrieve updated annotation'
        });
      }
      
      console.log("Sending refreshed annotation with complete data:", {
        id: refreshedAnnotation.id,
        interventionCount: refreshedAnnotation.intervention_count,
        revisedStepsCount: attemptNumber === 1 
          ? refreshedAnnotation.revised_solution_steps?.length
          : attemptNumber === 2
            ? refreshedAnnotation.revised_solution_steps_2?.length
            : refreshedAnnotation.revised_solution_steps_3?.length
      });

      res.status(200).json({
        success: true,
        data: refreshedAnnotation
      });
    } catch (error) {
      console.error('Error processing guidance:', error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  } catch (error) {
    console.error('Error submitting guidance:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
  console.log(`[Performance] Total submitGuidance request took ${performance.now() - startTime}ms`);
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