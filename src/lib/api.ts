/**
 * API client for the math annotation tool
 */

// Configure API URL based on environment
const API_URL = import.meta.env.PROD 
  ? '/api'  // Production: Use relative path
  : import.meta.env.VITE_API_URL || 'http://0.0.0.0:3001/api'; // Development: Connect to dev server

console.log('Using API_URL:', API_URL);

// Problem API
export const fetchProblems = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters as Record<string, string>);
  const response = await fetch(`${API_URL}/problems?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch problems');
  }
  return response.json();
};

export const fetchProblem = async (id: string) => {
  const response = await fetch(`${API_URL}/problems/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch problem');
  }
  return response.json();
};

export const fetchRandomProblem = async (filters = {}) => {
  try {
    console.log('Fetching random problem with filters:', filters);
    const queryParams = new URLSearchParams(filters as Record<string, string>);
    const response = await fetch(`${API_URL}/problems/random?${queryParams}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response from server:', errorData);
      
      if (response.status === 404) {
        throw new Error('No unannotated problems found. Please add more problems or reset existing ones.');
      }
      
      throw new Error(`Failed to fetch random problem: ${errorData.error || response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in fetchRandomProblem:', error);
    throw error;
  }
};

export const createProblem = async (problemData: any) => {
  const response = await fetch(`${API_URL}/problems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(problemData),
  });
  if (!response.ok) {
    throw new Error('Failed to create problem');
  }
  return response.json();
};

export const discardProblem = async (id: string) => {
  const response = await fetch(`${API_URL}/problems/${id}/discard`, {
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error('Failed to discard problem');
  }
  return response.json();
};

// Annotation API
export const fetchAnnotations = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters as Record<string, string>);
  const response = await fetch(`${API_URL}/annotations?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch annotations');
  }
  return response.json();
};

export const fetchAnnotation = async (id: string) => {
  const response = await fetch(`${API_URL}/annotations/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch annotation');
  }
  return response.json();
};

export const startAnnotation = async (problemId: string) => {
  const response = await fetch(`${API_URL}/annotations/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ problem_id: problemId }),
  });
  if (!response.ok) {
    throw new Error('Failed to start annotation');
  }
  return response.json();
};

export const submitGuidance = async (id: string, guidanceData: any) => {
  console.log(`Submitting guidance for annotation ${id}:`, guidanceData);
  
  const response = await fetch(`${API_URL}/annotations/${id}/guidance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(guidanceData),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error submitting guidance: Status ${response.status}`, errorText);
    throw new Error(`Failed to submit guidance: ${response.status} ${errorText}`);
  }
  
  const responseData = await response.json();
  console.log("Guidance submission response:", responseData);
  return responseData;
};

export const markAsCorrect = async (id: string, outcome: string) => {
  const response = await fetch(`${API_URL}/annotations/${id}/mark-correct`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ outcome }),
  });
  if (!response.ok) {
    throw new Error('Failed to mark as correct');
  }
  return response.json();
};

export const discardAnnotationProblem = async (problemId: string) => {
  const response = await fetch(`${API_URL}/annotations/discard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ problem_id: problemId }),
  });
  if (!response.ok) {
    throw new Error('Failed to discard problem');
  }
  return response.json();
};
