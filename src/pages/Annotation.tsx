
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProblemCard from '@/components/ProblemCard';
import SolutionSteps from '@/components/SolutionSteps';
import ErrorSelection from '@/components/ErrorSelection';
import GuidanceForm from '@/components/GuidanceForm';
import AnimatedPanel from '@/components/AnimatedPanel';
import WalkthroughTooltip from '@/components/WalkthroughTooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { HelpCircle } from 'lucide-react';

// Sample data for demonstration
const sampleProblem = {
  id: "CALC-LIM-001",
  category: "Calculus",
  difficulty: "Advanced",
  text: "Solve the differential equation y'' + 4y' + 4y = 0 with initial conditions y(0) = 1 and y'(0) = -2.",
};

const sampleInitialSteps = [
  "Step 1: I'll start by finding the characteristic equation of this homogeneous second-order differential equation. The characteristic equation is r² + 4r + 4 = 0.",
  "Step 2: Factoring this equation: (r + 2)² = 0, which gives us r = -2 with multiplicity 2.",
  "Step 3: When we have a repeated root in the characteristic equation, the general solution takes the form y = (c₁ + c₂x)e^(-2x).",
  "Step 4: Now I'll apply the initial conditions. We have y(0) = 1, so: y(0) = (c₁ + c₂·0)e^0 = c₁ = 1.",
  "Step 5: For the second condition, I need y'(0) = -2. The derivative of y is y' = -2(c₁ + c₂x)e^(-2x) + c₂e^(-2x).",
  "Step 6: Simplifying: y' = c₂e^(-2x) - 2c₁e^(-2x) - 2c₂xe^(-2x).",
  "Step 7: Evaluating at x = 0: y'(0) = c₂ - 2c₁ = -2."
];

const sampleRevisedSteps = [
  "Step 1: I'll start by finding the characteristic equation of this homogeneous second-order differential equation. The characteristic equation is r² + 4r + 4 = 0.",
  "Step 2: Factoring this equation: (r + 2)² = 0, which gives us r = -2 with multiplicity 2.",
  "Step 3: When we have a repeated root in the characteristic equation, the general solution takes the form y = (c₁ + c₂x)e^(-2x).",
  "Step 4: Now I'll apply the initial conditions. We have y(0) = 1, so: y(0) = (c₁ + c₂·0)e^0 = c₁ = 1.",
  "Step 5 (revised): For the second condition, I need y'(0) = -2. Using the product rule to differentiate y = (c₁ + c₂x)e^(-2x): y' = (c₁ + c₂x)·(-2e^(-2x)) + (c₂)·(e^(-2x)).",
  "Step 6: Simplifying: y' = -2(c₁ + c₂x)e^(-2x) + c₂e^(-2x) = c₂e^(-2x) - 2c₁e^(-2x) - 2c₂xe^(-2x).",
  "Step 7: Evaluating at x = 0: y'(0) = c₂ - 2c₁ = c₂ - 2(1) = c₂ - 2 = -2.",
  "Step 8: Solving for c₂: c₂ = 0.",
  "Step 9: Therefore, the particular solution is y = e^(-2x)."
];

const walkthroughSteps = [
  {
    target: ".problem-card",
    content: "Start by reviewing the problem. Understand what's being asked and the context of the problem.",
    position: "bottom"
  },
  {
    target: ".solution-steps",
    content: "Review the AI's solution steps carefully, searching for the first error in the reasoning process.",
    position: "right"
  },
  {
    target: ".error-selection",
    content: "Once you find an error, select the error type that best describes the mistake.",
    position: "left"
  },
  {
    target: ".guidance-form",
    content: "Provide guidance to help the AI correct its reasoning. Remember to be specific but not too revealing in your first hint.",
    position: "left"
  },
  {
    target: ".submit-guidance",
    content: "Submit your guidance to get a revised solution. You can then review the new solution and either mark it as correct or provide additional guidance.",
    position: "top"
  }
];

const Annotation = () => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [guidanceType, setGuidanceType] = useState<string | null>(null);
  const [guidanceText, setGuidanceText] = useState('');
  const [currentTab, setCurrentTab] = useState('initial');
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [isRevised, setIsRevised] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  
  // Load walkthrough preference from localStorage
  useEffect(() => {
    const hasSeenWalkthrough = localStorage.getItem('hasSeenWalkthrough');
    if (hasSeenWalkthrough) {
      setShowWalkthrough(false);
    }
  }, []);
  
  const handleWalkthroughComplete = () => {
    setShowWalkthrough(false);
    localStorage.setItem('hasSeenWalkthrough', 'true');
    toast({
      title: "Walkthrough Complete",
      description: "You can restart the walkthrough anytime by clicking the help button in the top right.",
    });
  };
  
  const handleRestartWalkthrough = () => {
    setShowWalkthrough(true);
  };
  
  const handleSubmitGuidance = () => {
    if (!selectedStepIndex && selectedStepIndex !== 0) {
      toast({
        title: "Error",
        description: "Please select a step first",
        variant: "destructive"
      });
      return;
    }
    
    if (!errorType || !guidanceType || !guidanceText.trim()) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send the guidance to the API
    console.log("Submitting guidance:", {
      errorIndex: selectedStepIndex,
      errorStepContent: sampleInitialSteps[selectedStepIndex],
      errorType,
      guidanceProvided: guidanceText,
      guidanceType
    });
    
    // Mock the revised solution response
    setTimeout(() => {
      setIsRevised(true);
      setCurrentTab('revised');
      setAttemptNumber(prev => prev + 1);
      toast({
        title: "Guidance Submitted",
        description: "The AI has revised its solution based on your guidance"
      });
    }, 1500);
  };
  
  const handleMarkCorrect = () => {
    // In a real app, this would finalize the annotation
    toast({
      title: "Success",
      description: "Solution marked as correct and annotation finalized",
      variant: "default"
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-16">
      <Header />
      
      <main className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedPanel animation="fade-in" className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-medium">Math Reasoning Annotation Tool</h1>
              <p className="text-gray-600 mt-2">
                Review solutions, identify errors, and provide guidance to improve mathematical reasoning.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleRestartWalkthrough}
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </Button>
          </AnimatedPanel>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AnimatedPanel animation="slide-in-up" className="lg:col-span-3 problem-card">
              <ProblemCard 
                id={sampleProblem.id}
                category={sampleProblem.category}
                difficulty={sampleProblem.difficulty}
                text={sampleProblem.text}
              />
            </AnimatedPanel>
            
            <AnimatedPanel animation="slide-in-left" delay={100} className="lg:col-span-2 solution-steps">
              <Tabs defaultValue="initial" value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="initial">Initial Solution</TabsTrigger>
                  <TabsTrigger value="revised" disabled={!isRevised}>Revised Solution</TabsTrigger>
                </TabsList>
                
                <TabsContent value="initial" className="mt-0">
                  <SolutionSteps
                    steps={sampleInitialSteps}
                    title="Initial Solution"
                    selectedStepIndex={selectedStepIndex}
                    onStepSelect={setSelectedStepIndex}
                  />
                </TabsContent>
                
                <TabsContent value="revised" className="mt-0">
                  <SolutionSteps
                    steps={sampleRevisedSteps}
                    title="Revised Solution"
                    selectedStepIndex={null}
                    onStepSelect={null}
                  />
                  
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleMarkCorrect} className="w-full sm:w-auto">
                      Mark as Correct
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Still Incorrect
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </AnimatedPanel>
            
            <AnimatedPanel animation="slide-in-right" delay={200} className="space-y-6">
              <div className="error-selection">
                <ErrorSelection 
                  selectedErrorType={errorType}
                  onErrorTypeChange={setErrorType}
                />
              </div>
              
              <div className="guidance-form">
                <GuidanceForm
                  guidanceText={guidanceText}
                  selectedGuidanceType={guidanceType}
                  onGuidanceTextChange={setGuidanceText}
                  onGuidanceTypeChange={setGuidanceType}
                  onSubmitGuidance={handleSubmitGuidance}
                  currentAttemptNumber={attemptNumber}
                />
              </div>
              
              <Card className="shadow-md">
                <CardHeader className="bg-secondary/50 p-4">
                  <CardTitle className="text-xl">Annotation Progress</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Current Attempt</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                        {attemptNumber}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Selected Step</span>
                      <span className="text-sm">
                        {selectedStepIndex !== null ? `Step ${selectedStepIndex + 1}` : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status</span>
                      <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">
                        {isRevised ? 'Revision Pending Review' : 'Initial Review'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedPanel>
          </div>
        </div>
      </main>
      
      {showWalkthrough && (
        <WalkthroughTooltip 
          steps={walkthroughSteps} 
          onComplete={handleWalkthroughComplete}
        />
      )}
    </div>
  );
};

export default Annotation;
