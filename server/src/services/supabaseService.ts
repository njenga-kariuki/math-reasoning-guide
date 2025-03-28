import supabase from '../config/supabase';

// Define types directly in this file to avoid import issues
type ProblemCategory = 
  | 'Algebra' 
  | 'Calculus' 
  | 'Geometry' 
  | 'Probability' 
  | 'Statistics' 
  | 'Number Theory' 
  | 'Combinatorics' 
  | 'Other';

type DifficultyLevel = 
  | 'Beginner' 
  | 'Intermediate' 
  | 'Advanced' 
  | 'Expert';

type ErrorType = 
  | 'calculation_error'
  | 'conceptual_misunderstanding'
  | 'approach_selection_error'
  | 'logical_reasoning_error'
  | 'domain_constraint_error'
  | 'formula_application_error'
  | 'notation_error'
  | 'other_error';

type GuidanceType = 
  | 'calculation_correction'
  | 'concept_clarification'
  | 'approach_redirection'
  | 'logical_flow_correction'
  | 'domain_reminder'
  | 'formula_clarification'
  | 'direct_correction'
  | 'other_correction';

type RevisionOutcome = 
  | 'CORRECTED'
  | 'STILL_WRONG'
  | 'DIFFERENT_ERROR';

interface Problem {
  id?: string;
  problem_id: string;
  problem_category: ProblemCategory;
  difficulty_level: DifficultyLevel;
  problem_text: string;
  is_annotated: boolean;
  is_discarded: boolean;
  created_at?: string;
}

interface Annotation {
  id?: string;
  problem_id: string;
  problem_category: ProblemCategory;
  difficulty_level: DifficultyLevel;
  problem_text: string;
  initial_solution_steps: string[];
  error_index: number;
  error_step_content: string;
  error_type: ErrorType;
  guidance_provided: string;
  guidance_type: GuidanceType;
  revised_solution_steps: string[];
  revision_outcome: RevisionOutcome;
  error_index_2?: number;
  error_step_content_2?: string;
  error_type_2?: ErrorType;
  guidance_provided_2?: string;
  guidance_type_2?: GuidanceType;
  revised_solution_steps_2?: string[];
  revision_outcome_2?: RevisionOutcome;
  additional_guidance_2?: string;
  additional_guidance_type_2?: GuidanceType;
  revised_solution_steps_3?: string[];
  revision_outcome_3?: RevisionOutcome;
  final_solution_steps?: string[];
  intervention_count: number;
  created_at?: string;
  updated_at?: string;
  is_complete: boolean;
}

// Problem service functions
export const problemService = {
  // Get all problems with optional filters
  getProblems: async (filters: any = {}) => {
    console.log('getProblems called with filters:', filters);
    
    let query = supabase.from('problems').select('*');
    
    // Apply filters if provided
    if (filters.problem_category) {
      query = query.eq('problem_category', filters.problem_category);
    }
    
    if (filters.difficulty_level) {
      query = query.eq('difficulty_level', filters.difficulty_level);
    }
    
    if (filters.is_annotated !== undefined) {
      query = query.eq('is_annotated', filters.is_annotated);
    }
    
    if (filters.is_discarded !== undefined) {
      query = query.eq('is_discarded', filters.is_discarded);
    }
    
    // Order by created_at
    query = query.order('created_at', { ascending: false });
    
    console.log('Executing Supabase query with filters:', filters);
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    
    console.log(`Query returned ${data?.length || 0} problems`);
    
    return data || [];
  },
  
  // Get a single problem by ID
  getProblem: async (problemId: string) => {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('problem_id', problemId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  // Create a new problem
  createProblem: async (problemData: Problem) => {
    const { data, error } = await supabase
      .from('problems')
      .insert([problemData])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  // Update a problem
  updateProblem: async (problemId: string, updateData: Partial<Problem>) => {
    const { data, error } = await supabase
      .from('problems')
      .update(updateData)
      .eq('problem_id', problemId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  // Mark a problem as discarded
  discardProblem: async (problemId: string) => {
    return problemService.updateProblem(problemId, { is_discarded: true });
  },
  
  // Get a random unannotated and undiscarded problem
  getRandomProblem: async (filters: any = {}) => {
    console.log('getRandomProblem service called with filters:', filters);
    
    // Build filter for unannotated and undiscarded problems
    const baseFilters = {
      is_annotated: false,
      is_discarded: false,
      ...filters
    };
    
    console.log('Using base filters:', baseFilters);
    
    // Get all matching problems
    const problems = await problemService.getProblems(baseFilters);
    
    console.log(`Found ${problems.length} problems matching criteria`);
    
    if (problems.length === 0) {
      console.log('No problems found, returning null');
      return null;
    }
    
    // Select a random problem
    const randomIndex = Math.floor(Math.random() * problems.length);
    console.log(`Selected random problem at index ${randomIndex} out of ${problems.length}`);
    
    return problems[randomIndex];
  },
  
  // Count problems matching filters
  countProblems: async (filters: any = {}) => {
    let query = supabase.from('problems').select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (filters.problem_category) {
      query = query.eq('problem_category', filters.problem_category);
    }
    
    if (filters.difficulty_level) {
      query = query.eq('difficulty_level', filters.difficulty_level);
    }
    
    if (filters.is_annotated !== undefined) {
      query = query.eq('is_annotated', filters.is_annotated);
    }
    
    if (filters.is_discarded !== undefined) {
      query = query.eq('is_discarded', filters.is_discarded);
    }
    
    const { count, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return count || 0;
  }
};

// Annotation service functions
export const annotationService = {
  // Get all annotations with optional filters
  getAnnotations: async (filters: any = {}) => {
    let query = supabase.from('annotations').select('*');
    
    // Apply filters if provided
    if (filters.problem_id) {
      query = query.eq('problem_id', filters.problem_id);
    }
    
    if (filters.is_complete !== undefined) {
      query = query.eq('is_complete', filters.is_complete);
    }
    
    // Order by created_at
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    if (!data) return [];
    
    // Convert JSON back to arrays for each annotation
    return data.map(item => ({
      ...item,
      initial_solution_steps: JSON.parse(item.initial_solution_steps || '[]'),
      revised_solution_steps: JSON.parse(item.revised_solution_steps || '[]'),
      revised_solution_steps_2: item.revised_solution_steps_2 ? JSON.parse(item.revised_solution_steps_2) : undefined,
      revised_solution_steps_3: item.revised_solution_steps_3 ? JSON.parse(item.revised_solution_steps_3) : undefined,
      final_solution_steps: item.final_solution_steps ? JSON.parse(item.final_solution_steps) : undefined
    }));
  },
  
  // Get a single annotation by ID
  getAnnotation: async (annotationId: string) => {
    const { data, error } = await supabase
      .from('annotations')
      .select('*')
      .eq('id', annotationId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) return null;
    
    // Convert JSON back to arrays for the response
    return {
      ...data,
      initial_solution_steps: JSON.parse(data.initial_solution_steps || '[]'),
      revised_solution_steps: JSON.parse(data.revised_solution_steps || '[]'),
      revised_solution_steps_2: data.revised_solution_steps_2 ? JSON.parse(data.revised_solution_steps_2) : undefined,
      revised_solution_steps_3: data.revised_solution_steps_3 ? JSON.parse(data.revised_solution_steps_3) : undefined,
      final_solution_steps: data.final_solution_steps ? JSON.parse(data.final_solution_steps) : undefined
    };
  },
  
  // Create a new annotation
  createAnnotation: async (annotationData: Annotation) => {
    // Convert string arrays to JSON for Supabase
    const formattedData: any = {
      ...annotationData,
      initial_solution_steps: JSON.stringify(annotationData.initial_solution_steps || []),
      revised_solution_steps: JSON.stringify(annotationData.revised_solution_steps || []),
      revised_solution_steps_2: annotationData.revised_solution_steps_2 ? JSON.stringify(annotationData.revised_solution_steps_2) : null,
      revised_solution_steps_3: annotationData.revised_solution_steps_3 ? JSON.stringify(annotationData.revised_solution_steps_3) : null,
      final_solution_steps: annotationData.final_solution_steps ? JSON.stringify(annotationData.final_solution_steps) : null
    };

    const { data, error } = await supabase
      .from('annotations')
      .insert([formattedData])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Convert JSON back to arrays for the response
    return {
      ...data,
      initial_solution_steps: JSON.parse(data.initial_solution_steps || '[]'),
      revised_solution_steps: JSON.parse(data.revised_solution_steps || '[]'),
      revised_solution_steps_2: data.revised_solution_steps_2 ? JSON.parse(data.revised_solution_steps_2) : undefined,
      revised_solution_steps_3: data.revised_solution_steps_3 ? JSON.parse(data.revised_solution_steps_3) : undefined,
      final_solution_steps: data.final_solution_steps ? JSON.parse(data.final_solution_steps) : undefined
    };
  },
  
  // Update an annotation
  updateAnnotation: async (annotationId: string, updateData: Partial<Annotation>) => {
    // Convert string arrays to JSON for Supabase
    const formattedData: any = { ...updateData };
    
    if (formattedData.initial_solution_steps) {
      formattedData.initial_solution_steps = JSON.stringify(formattedData.initial_solution_steps);
    }
    
    if (formattedData.revised_solution_steps) {
      formattedData.revised_solution_steps = JSON.stringify(formattedData.revised_solution_steps);
    }
    
    if (formattedData.revised_solution_steps_2) {
      formattedData.revised_solution_steps_2 = JSON.stringify(formattedData.revised_solution_steps_2);
    }
    
    if (formattedData.revised_solution_steps_3) {
      formattedData.revised_solution_steps_3 = JSON.stringify(formattedData.revised_solution_steps_3);
    }
    
    if (formattedData.final_solution_steps) {
      formattedData.final_solution_steps = JSON.stringify(formattedData.final_solution_steps);
    }

    const { data, error } = await supabase
      .from('annotations')
      .update(formattedData)
      .eq('id', annotationId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Convert JSON back to arrays for the response
    return {
      ...data,
      initial_solution_steps: JSON.parse(data.initial_solution_steps || '[]'),
      revised_solution_steps: JSON.parse(data.revised_solution_steps || '[]'),
      revised_solution_steps_2: data.revised_solution_steps_2 ? JSON.parse(data.revised_solution_steps_2) : undefined,
      revised_solution_steps_3: data.revised_solution_steps_3 ? JSON.parse(data.revised_solution_steps_3) : undefined,
      final_solution_steps: data.final_solution_steps ? JSON.parse(data.final_solution_steps) : undefined
    };
  }
};

export default {
  problemService,
  annotationService
};
