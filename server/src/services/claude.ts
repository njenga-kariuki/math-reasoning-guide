import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define guidance level types
export enum GuidanceLevel {
  DIRECTIONAL = 'directional',
  TARGETED = 'targeted',
  COMPLETE_CORRECTION = 'complete_correction'
}

// Define structured guidance request interface
export interface GuidanceRequest {
  errorIndex: number;
  guidanceContent: string;
  guidanceLevel: GuidanceLevel;
}

// Standardized guidance templates
const GUIDANCE_TEMPLATES = {
  [GuidanceLevel.DIRECTIONAL]: 'Your solution has an error at Step {step}. {guidance}',
  [GuidanceLevel.TARGETED]: 'You\'re still making an error in Step {step}. {guidance}',
  [GuidanceLevel.COMPLETE_CORRECTION]: 'You\'re still making an error in Step {step}. Here is exactly what Step {step} should be: {guidance}'
};

// Standard completion phrase
const COMPLETION_PHRASE = 'Revise your solution, keeping Steps 1 through {prevStep} exactly as they were, and updating Step {step} and any subsequent steps as needed. Present your complete revised solution with all steps.';

// System prompt for initial problem solving
const SYSTEM_PROMPT_INITIAL = `You are being asked to solve a complex math problem. Please provide a step-by-step solution with detailed explanations of your reasoning at each step. Define a "step" as one logical unit of the solution process (e.g., a single mathematical operation, a deduction or inference, application of a theorem or formula, a conclusion based on previous steps). Number each step clearly and show all work, including any formulas, calculations, or theorems you apply. Try to be as thorough as possible in your explanation.`;

// System prompt for revision
const SYSTEM_PROMPT_REVISION = `You are being asked to revise your solution to a math problem based on feedback. Please carefully consider the guidance provided and update your solution accordingly. Maintain the step-by-step format, and ensure your revised solution is complete.`;

/**
 * Get initial solution from Claude
 * @param problemText The math problem to solve
 * @returns Array of solution steps
 */
export const getInitialSolution = async (problemText: string): Promise<string[]> => {
  console.log(`[Claude Service] Requesting initial solution for problem: "${problemText}"`);
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4000,
      system: SYSTEM_PROMPT_INITIAL,
      messages: [
        {
          role: 'user',
          content: `Problem: ${problemText}`
        }
      ]
    });

    // Log the raw response
    console.log("[Claude Service] Raw response received:", JSON.stringify(response, null, 2));

    // Parse the response to extract steps
    const content = response.content[0]?.type === 'text' ? response.content[0].text : '';
    console.log(`[Claude Service] Extracted content for parsing: "${content.substring(0, 200)}..."`);
    
    const steps = parseSteps(content);
    console.log(`[Claude Service] Parsed steps result:`, steps);
    
    return steps;
  } catch (error) {
    console.error('[Claude Service] Error getting initial solution from Claude:', error);
    // Re-throw the error to be caught by the controller
    throw error;
  }
};

/**
 * Format the prompt for revised solution based on guidance level
 * @param errorIndex The index of the error step
 * @param guidance The guidance content
 * @param guidanceLevel The guidance level
 * @returns Formatted prompt prefix
 */
const formatGuidancePrompt = (errorIndex: number, guidance: string, guidanceLevel: GuidanceLevel): string => {
  const stepNumber = errorIndex + 1;
  
  // Get the template for this guidance level
  let template = GUIDANCE_TEMPLATES[guidanceLevel] || GUIDANCE_TEMPLATES[GuidanceLevel.DIRECTIONAL];
  
  // Fill in the template
  let prompt = template.replace(/{step}/g, stepNumber.toString()).replace('{guidance}', guidance);
  
  // Add the completion phrase
  prompt += ' ' + COMPLETION_PHRASE
    .replace('{prevStep}', errorIndex.toString())
    .replace('{step}', stepNumber.toString());
    
  return prompt;
};

/**
 * Get revised solution from Claude using structured guidance (new method)
 * @param problemText The original problem
 * @param previousSteps The previous solution steps
 * @param guidanceRequest The structured guidance request
 * @returns Array of revised solution steps
 */
export const getRevisedSolutionStructured = async (
  problemText: string,
  previousSteps: string[],
  guidanceRequest: GuidanceRequest
): Promise<string[]> => {
  try {
    // Format the previous steps as a numbered list
    const formattedPreviousSteps = previousSteps
      .map((step, index) => `Step ${index + 1}: ${step}`)
      .join('\n');

    // Create the user prompt with the appropriate guidance structure
    const promptPrefix = formatGuidancePrompt(
      guidanceRequest.errorIndex,
      guidanceRequest.guidanceContent,
      guidanceRequest.guidanceLevel
    );

    const userPrompt = `${promptPrefix}

Original problem: ${problemText}

Your previous solution:
${formattedPreviousSteps}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4000,
      system: SYSTEM_PROMPT_REVISION,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    // Parse the response to extract steps
    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    const steps = parseSteps(content);
    return steps;
  } catch (error) {
    console.error('Error getting revised solution from Claude:', error);
    throw error;
  }
};

/**
 * Get revised solution from Claude based on guidance (original method for backward compatibility)
 * @param problemText The original problem
 * @param previousSteps The previous solution steps
 * @param errorIndex The index of the error step
 * @param guidance The guidance provided
 * @param attemptNumber Which attempt this is (determines guidance level)
 * @returns Array of revised solution steps
 */
export const getRevisedSolution = async (
  problemText: string,
  previousSteps: string[],
  errorIndex: number,
  guidance: string,
  attemptNumber: number
): Promise<string[]> => {
  try {
    // Map attempt number to guidance level
    let guidanceLevel: GuidanceLevel;
    if (attemptNumber === 1) {
      guidanceLevel = GuidanceLevel.DIRECTIONAL;
    } else if (attemptNumber === 2) {
      guidanceLevel = GuidanceLevel.TARGETED;
    } else {
      guidanceLevel = GuidanceLevel.COMPLETE_CORRECTION;
    }

    // Use the structured method internally
    return await getRevisedSolutionStructured(
      problemText,
      previousSteps,
      {
        errorIndex,
        guidanceContent: guidance,
        guidanceLevel
      }
    );
  } catch (error) {
    console.error('Error in getRevisedSolution:', error);
    throw error;
  }
};

/**
 * Parse Claude's response into individual steps
 * @param content The response content from Claude
 * @returns Array of solution steps
 */
const parseSteps = (content: string): string[] => {
  // Split the content by lines
  const lines = content.split('\n');

  // Initialize an array to store the steps
  const steps: string[] = [];

  // Regular expressions to match step patterns
  const stepPatterns = [
    /^Step\s+(\d+):\s*(.*)/i,  // Matches "Step 1: content"
    /^(\d+)\.\s*(.*)/,         // Matches "1. content"
    /^(\d+)\)\s*(.*)/          // Matches "1) content"
  ];

  // Process each line
  let currentStep = '';

  for (const line of lines) {
    let isNewStep = false;
    let stepContent = '';

    // Check if the line starts a new step
    for (const pattern of stepPatterns) {
      const match = line.match(pattern);
      if (match) {
        isNewStep = true;
        stepContent = match[2];
        break;
      }
    }

    // If this is a new step and we have content from a previous step
    if (isNewStep && currentStep) {
      steps.push(currentStep.trim());
      currentStep = stepContent;
    }
    // If this is a new step and we don't have previous content
    else if (isNewStep) {
      currentStep = stepContent;
    }
    // If this is a continuation of the current step
    else if (currentStep) {
      currentStep += ' ' + line.trim();
    }
  }

  // Add the last step if there is one
  if (currentStep) {
    steps.push(currentStep.trim());
  }

  return steps;
};

export default {
  getInitialSolution,
  getRevisedSolution,
  getRevisedSolutionStructured,
  GuidanceLevel
};