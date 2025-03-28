import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { problemService } from '../services/supabaseService';

// Get all problems
export const getProblems = async (req: Request, res: Response) => {
  try {
    const { category, difficulty, annotated, discarded } = req.query;
    
    // Build filter object based on query parameters
    const filter: any = {};
    
    if (category) filter.problem_category = category;
    if (difficulty) filter.difficulty_level = difficulty;
    if (annotated !== undefined) filter.is_annotated = annotated === 'true';
    if (discarded !== undefined) filter.is_discarded = discarded === 'true';
    
    const problems = await problemService.getProblems(filter);
    
    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems
    });
  } catch (error) {
    console.error('Error getting problems:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get a single problem
export const getProblem = async (req: Request, res: Response) => {
  try {
    const problem = await problemService.getProblem(req.params.id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (error) {
    console.error('Error getting problem:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create a new problem
export const createProblem = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const problem = await problemService.createProblem(req.body);
    
    res.status(201).json({
      success: true,
      data: problem
    });
  } catch (error) {
    // Check for duplicate key error
    if ((error as any).code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Problem ID already exists'
      });
    }
    
    console.error('Error creating problem:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update a problem
export const updateProblem = async (req: Request, res: Response) => {
  try {
    const problem = await problemService.updateProblem(req.params.id, req.body);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Mark a problem as discarded
export const discardProblem = async (req: Request, res: Response) => {
  try {
    const problem = await problemService.discardProblem(req.params.id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: problem,
      message: 'Problem marked as discarded'
    });
  } catch (error) {
    console.error('Error discarding problem:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get a random unannotated and undiscarded problem
export const getRandomProblem = async (req: Request, res: Response) => {
  try {
    console.log('getRandomProblem called with query params:', req.query);
    
    const { category, difficulty } = req.query;
    
    // Build filter object based on query parameters
    const filter: any = {
      is_annotated: false,
      is_discarded: false
    };
    
    if (category) filter.problem_category = category;
    if (difficulty) filter.difficulty_level = difficulty;
    
    console.log('Using filter criteria:', filter);
    
    // First, let's check how many problems exist in total
    const allProblems = await problemService.getProblems({});
    console.log(`Total problems in database: ${allProblems.length}`);
    
    // Now check how many match our filter
    const filteredProblems = await problemService.getProblems(filter);
    console.log(`Problems matching filter: ${filteredProblems.length}`);
    
    if (filteredProblems.length === 0) {
      console.log('No problems match the filter criteria');
      return res.status(404).json({
        success: false,
        error: 'No unannotated problems found'
      });
    }
    
    // Get a random problem
    const problem = await problemService.getRandomProblem(filter);
    console.log('Random problem selected:', problem ? `ID: ${problem.problem_id}` : 'None found');
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'No unannotated problems found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (error) {
    console.error('Error getting random problem:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
