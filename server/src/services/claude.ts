import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key',
});

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
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      system: SYSTEM_PROMPT_INITIAL,
      messages: [
        {
          role: 'user',
          content: `Problem: ${problemText}`
        }
      ]
    });

    // Parse the response to extract steps
    const content = response.content[0].text;
    const steps = parseSteps(content);
    return steps;
  } catch (error) {
    console.error('Error getting initial solution from Claude:', error);
    throw error;
  }
};

/**
 * Get revised solution from Claude based on guidance
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
    // Format the previous steps as a numbered list
    const formattedPreviousSteps = previousSteps
      .map((step, index) => `Step ${index + 1}: ${step}`)
      .join('\n');

    // Determine guidance level based on attempt number
    let promptPrefix;
    if (attemptNumber === 1) {
      promptPrefix = `Your solution has an error at Step ${errorIndex + 1}. ${guidance}`;
    } else if (attemptNumber === 2) {
      promptPrefix = `You're still making an error in Step ${errorIndex + 1}. ${guidance}`;
    } else {
      promptPrefix = `You're still making an error in Step ${errorIndex + 1}. Here is exactly what Step ${errorIndex + 1} should be: ${guidance}`;
    }

    const userPrompt = `${promptPrefix} Revise your solution, keeping Steps 1 through ${errorIndex} exactly as they were, and updating Step ${errorIndex + 1} and any subsequent steps as needed. Present your complete revised solution with all steps.

Original problem: ${problemText}

Your previous solution:
${formattedPreviousSteps}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
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
    const content = response.content[0].text;
    const steps = parseSteps(content);
    return steps;
  } catch (error) {
    console.error('Error getting revised solution from Claude:', error);
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
  getRevisedSolution
};
