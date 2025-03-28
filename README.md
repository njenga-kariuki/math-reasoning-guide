# Math Reasoning Annotation Tool

## Project Overview

This is a test implementation of a hypothetical math annotation workflow designed to improve AI mathematical reasoning capabilities. The tool demonstrates how human feedback could be used to enhance LLM performance on complex math problems through a structured annotation process.

This prototype is not intended for production use but rather serves as a proof-of-concept for how human annotators might interact with AI-generated solutions to identify errors, provide guidance, and track improvement through iterations.

## Functionality

This prototype demonstrates the following workflow:

- **Problem Library**: A collection of sample math problems across various categories (Algebra, Calculus, Geometry, Probability) with different difficulty levels
- **AI Solution Generation**: Integration with Claude to generate step-by-step solutions to math problems
- **Error Identification**: Interface for annotators to identify and classify specific errors in the AI's reasoning
- **Guided Feedback**: Structured protocol for providing increasingly detailed guidance across multiple iterations
- **Solution Revision**: Demonstration of how AI can revise solutions based on human feedback
- **Annotation Tracking**: Recording the full annotation history including all interventions and outcomes

## Annotation Workflow

1. **Guide Page**: Start by reviewing the annotation guidelines and process
2. **Problem Selection**: The system automatically selects an unannotated math problem
3. **Initial Review**: Examine the AI-generated solution and identify the first error in reasoning
4. **Error Classification**: Select the type of error (e.g., calculation error, conceptual misunderstanding)
5. **Guidance Provision**: Provide appropriate guidance without revealing the complete solution
6. **Solution Revision**: Review the AI's revised solution based on your guidance
7. **Iteration**: If errors persist, provide additional guidance with increasing specificity
8. **Completion**: Mark the solution as correct once all errors have been addressed

## Technical Implementation

### Frontend
- React with TypeScript for component-based UI
- Vite for fast development and building
- TailwindCSS and shadcn/ui for responsive design
- React Query for efficient data fetching and state management

### Backend
- Express.js with TypeScript for API endpoints
- Supabase for database storage and management
- Anthropic's Claude API for generating and revising solutions

### Data Flow
1. Problems are stored in Supabase database
2. When a problem is selected, Claude generates an initial solution
3. Annotator feedback is recorded and sent to Claude for solution revision
4. Complete annotation history is stored for future analysis
