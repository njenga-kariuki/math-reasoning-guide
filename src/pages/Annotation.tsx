import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, HelpCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import * as api from '@/lib/api';
import { Problem, Annotation as AnnotationType, ErrorType, GuidanceType, RevisionOutcome, GUIDANCE_TYPES, ERROR_TYPES } from '@/types';

const walkthroughSteps = [
  {
    target: ".problem-card",
    content: "Start by reviewing the problem. Understand what's being asked and the context of the problem.",
    position: "bottom" as const
  },
  {
    target: ".solution-steps",
    content: "Review the AI's solution steps carefully, searching for the first error in the reasoning process.",
    position: "right" as const
  },
  {
    target: ".error-selection",
    content: "Once you find an error, select the error type that best describes the mistake.",
    position: "left" as const
  },
  {
    target: ".guidance-form",
    content: "Provide guidance to help the AI correct its reasoning. Remember to be specific but not too revealing in your first hint.",
    position: "left" as const
  },
  {
    target: ".submit-guidance",
    content: "Submit your guidance to get a revised solution. You can then review the new solution and either mark it as correct or provide additional guidance.",
    position: "top" as const
  }
];

const Annotation = () => {
  const queryClient = useQueryClient();
  
  // State for the annotation process
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [guidanceType, setGuidanceType] = useState<GuidanceType | null>(null);
  const [guidanceText, setGuidanceText] = useState('');
  const [currentTab, setCurrentTab] = useState('initial');
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  
  // Get a random problem to annotate - but don't fetch automatically
  const { 
    data: problemData, 
    isLoading: isLoadingProblem,
    error: problemError,
    refetch: refetchProblem
  } = useQuery({
    queryKey: ['randomProblem'],
    queryFn: () => api.fetchRandomProblem(),
    refetchOnWindowFocus: false,
    enabled: false, // Don't fetch automatically
    retry: 3, // Retry failed requests 3 times
  });
  
  // Start annotation when a problem is loaded
  const { 
    data: annotationData, 
    isLoading: isLoadingAnnotation,
    error: annotationError,
    refetch: refetchAnnotation
  } = useQuery({
    queryKey: ['annotation', problemData?.data?.problem_id],
    queryFn: () => api.startAnnotation(problemData?.data?.problem_id),
    enabled: !!problemData?.data?.problem_id,
    refetchOnWindowFocus: false,
    retry: 3, // Retry failed requests 3 times
  });
  
  // Fetch a problem when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetchProblem();
      } catch (error) {
        console.error('Error fetching problem:', error);
        toast({
          title: "Error",
          description: "Failed to fetch a problem. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    fetchData();
  }, [refetchProblem]);
  
  // Get the current annotation
  const annotation = annotationData?.data as AnnotationType | undefined;
  const problem = problemData?.data as Problem | undefined;
  
  // Determine which solution steps to show based on the intervention count
  const getStepsToShow = () => {
    if (!annotation) return [];
    
    if (currentTab === 'initial') {
      return annotation.initial_solution_steps;
    } else if (annotation.intervention_count === 1) {
      return annotation.revised_solution_steps;
    } else if (annotation.intervention_count === 2) {
      return annotation.revised_solution_steps_2 || [];
    } else {
      return annotation.revised_solution_steps_3 || [];
    }
  };
  
  // Determine if the solution has been revised
  const isRevised = annotation?.revised_solution_steps?.length > 0;
  
  // Submit guidance mutation
  const submitGuidanceMutation = useMutation({
    mutationFn: (guidanceData: any) => {
      return api.submitGuidance(annotation?.id || '', guidanceData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['annotation'] });
      setCurrentTab('revised');
      toast({
        title: "Guidance Submitted",
        description: "The AI has revised its solution based on your guidance"
      });
      // Reset form
      setSelectedStepIndex(null);
      setErrorType(null);
      setGuidanceType(null);
      setGuidanceText('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit guidance. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Mark as correct mutation
  const markAsCorrectMutation = useMutation({
    mutationFn: (outcome: RevisionOutcome) => {
      return api.markAsCorrect(annotation?.id || '', outcome);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['annotation'] });
      toast({
        title: "Success",
        description: "Solution marked as correct and annotation finalized",
        variant: "default"
      });
      // Refresh to get a new problem
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark as correct. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Discard problem mutation
  const discardProblemMutation = useMutation({
    mutationFn: (problemId: string) => {
      return api.discardAnnotationProblem(problemId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['randomProblem'] });
      toast({
        title: "Problem Discarded",
        description: "The problem has been discarded and a new one will be loaded."
      });
      // Refresh to get a new problem
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to discard problem. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Load walkthrough preference from localStorage
  useEffect(() => {
    const hasSeenWalkthrough = localStorage.getItem('hasSeenWalkthrough');
    if (!hasSeenWalkthrough) {
      setShowWalkthrough(true);
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
    
    const guidanceData = {
      error_index: selectedStepIndex,
      error_step_content: getStepsToShow()[selectedStepIndex],
      error_type: errorType,
      guidance_provided: guidanceText,
      guidance_type: guidanceType
    };
    
    submitGuidanceMutation.mutate(guidanceData);
  };
  
  const handleMarkCorrect = (outcome: RevisionOutcome) => {
    markAsCorrectMutation.mutate(outcome);
  };
  
  const handleDiscardProblem = () => {
    if (problem?.problem_id) {
      discardProblemMutation.mutate(problem.problem_id);
    }
  };
  
  // Loading state
  if (isLoadingProblem || isLoadingAnnotation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-medium">Loading...</h2>
          <p className="text-gray-600 mt-2">
            Preparing the math problem and initial solution.
          </p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (problemError || annotationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4">
              {problemError ? `Problem error: ${problemError.message}` : ''}
              {annotationError ? `Annotation error: ${annotationError.message}` : ''}
              {!problemError && !annotationError ? 'There was an error loading the annotation data.' : ''}
              {' Please try again.'}
            </p>
            <Button 
              onClick={() => {
                if (problemError) {
                  refetchProblem();
                } else if (annotationError && problemData?.data?.problem_id) {
                  refetchAnnotation();
                } else {
                  window.location.reload();
                }
              }}
              className="w-full"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If no problem is found
  if (!problem || !annotation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="bg-amber-50">
            <CardTitle className="text-amber-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              No Problems Available
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4">
              {problemError?.message?.includes('No unannotated problems found') 
                ? 'All problems have been annotated. Please reset some problems or add new ones to continue.'
                : 'There are no unannotated problems available. Please add more problems to the library.'}
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => window.location.href = '/problems'}
                className="w-full"
                variant="outline"
              >
                Go to Problem Library
              </Button>
              <Button 
                onClick={() => window.location.href = '/guide'}
                className="w-full"
              >
                Go to Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
            <div className="flex gap-2">
              <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Discard Problem
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to discard this problem?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The problem will be marked as discarded and you will be assigned a new problem.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDiscardProblem}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Discard Problem
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleRestartWalkthrough}
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </Button>
            </div>
          </AnimatedPanel>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AnimatedPanel animation="slide-in-up" className="lg:col-span-3 problem-card">
              <ProblemCard 
                id={problem.problem_id}
                category={problem.problem_category}
                difficulty={problem.difficulty_level}
                text={problem.problem_text}
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
                    steps={annotation.initial_solution_steps}
                    title="Initial Solution"
                    selectedStepIndex={selectedStepIndex}
                    onStepSelect={setSelectedStepIndex}
                  />
                </TabsContent>
                
                <TabsContent value="revised" className="mt-0">
                  <SolutionSteps
                    steps={getStepsToShow()}
                    title={`Revised Solution (Attempt ${annotation.intervention_count})`}
                    selectedStepIndex={null}
                  />
                  
                  <div className="mt-6 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentTab('initial')}
                    >
                      View Original Solution
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => handleMarkCorrect('STILL_WRONG')}
                        disabled={markAsCorrectMutation.isPending}
                        className="border-amber-200 text-amber-600 hover:bg-amber-50"
                      >
                        Still Wrong
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => handleMarkCorrect('DIFFERENT_ERROR')}
                        disabled={markAsCorrectMutation.isPending}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        Different Error
                      </Button>
                      
                      <Button 
                        variant="default" 
                        onClick={() => handleMarkCorrect('CORRECTED')}
                        disabled={markAsCorrectMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {markAsCorrectMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                        )}
                        Mark as Correct
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AnimatedPanel>
            
            <AnimatedPanel animation="slide-in-right" delay={200} className="lg:col-span-1 space-y-6">
              <ErrorSelection 
                selectedErrorType={errorType}
                onErrorTypeChange={(value) => setErrorType(value as ErrorType)}
                className="error-selection"
              />
              
              <GuidanceForm 
                guidanceText={guidanceText}
                selectedGuidanceType={guidanceType}
                onGuidanceTextChange={setGuidanceText}
                onGuidanceTypeChange={(value) => setGuidanceType(value as GuidanceType)}
                onSubmitGuidance={handleSubmitGuidance}
                currentAttemptNumber={annotation.intervention_count + 1}
                isSubmitting={submitGuidanceMutation.isPending}
                className="guidance-form"
              />
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
