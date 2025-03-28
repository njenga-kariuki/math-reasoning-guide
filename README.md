# Math Reasoning Annotation Tool

## Project Overview

This is a test implementation of a hypothetical math annotation workflow designed to improve AI mathematical reasoning capabilities. The tool demonstrates how human feedback could be used to enhance LLM performance on complex math problems through a structured annotation process.

This prototype is not intended for production use but rather serves as a proof-of-concept for how human annotators might interact with AI-generated solutions to identify errors, provide guidance, and track improvement through iterations.

## Functionality

This prototype demonstrates the following workflow:

- **Problem Library**: A collection of sample math problems across various categories (Algebra, Calculus, Geometry, Probability) with different difficulty levels
- **AI Solution Generation**: Integration with Claude AI to generate step-by-step solutions to math problems
- **Error Identification**: Interface for annotators to identify and classify specific errors in the AI's reasoning
- **Guided Feedback**: Structured protocol for providing increasingly detailed guidance across multiple iterations
- **Solution Revision**: Demonstration of how AI can revise solutions based on human feedback
- **Annotation Tracking**: Recording the full annotation history including all interventions and outcomes

## Setup Guide

### Prerequisites

- Node.js & npm installed
- A Supabase account (free tier)
- Anthropic API key for Claude integration

### Quick Start

1. **Clone and Install**
   ```sh
   git clone https://github.com/your-username/math-annotation-tool.git
   cd math-annotation-tool
   npm install
   cd server && npm install
   ```

2. **Environment Setup**
   Create `.env` files:

   Root directory `.env`:
   ```
   VITE_API_URL=http://localhost:3001/api
   ```

   Server directory `.env`:
   ```
   PORT=3001
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_KEY=your_supabase_anon_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

3. **Supabase Configuration**
   - Create a new Supabase project
   - Disable Row Level Security (RLS) for both the `problems` and `annotations` tables
   - Run the setup script to create tables:
     ```sh
     cd server
     npx ts-node src/scripts/setupSupabase.ts
     ```
   - Seed the database with sample problems:
     ```sh
     npx ts-node src/scripts/seedSupabase.ts
     ```

4. **Launch the Application**
   ```sh
   # Terminal 1: Start the backend
   cd server && npm run dev
   
   # Terminal 2: Start the frontend
   cd .. && npm run dev
   ```

   Access the application at http://localhost:8080

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

## Deployment

This prototype can be deployed using any standard web hosting service that supports Node.js applications. For demonstration purposes, services like Vercel, Netlify, or Render would be suitable options.

For a production implementation, additional security measures and proper authentication would need to be implemented.
