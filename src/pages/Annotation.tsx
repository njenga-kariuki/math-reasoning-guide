import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import ProblemCard from '@/components/ProblemCard';
import SolutionSteps from '@/components/SolutionSteps';
import ErrorSelection from '@/components/ErrorSelection';
import GuidanceForm from '@/components/GuidanceForm';
import AnimatedPanel from '@/components/AnimatedPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, HelpCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import * as api from '@/lib/api';
import { Problem, Annotation as AnnotationType, ErrorType, GuidanceType, RevisionOutcome, GUIDANCE_TYPES, ERROR_TYPES } from '@/types';

const Annotation = () => {
  const queryClient = useQueryClient();
  
  // State for the annotation process
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [guidanceType, setGuidanceType] = useState<GuidanceType | null>(null);
  const [guidanceText, setGuidanceText] = useState('');
  const [currentTab, setCurrentTab] = useState('initial');
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  
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
  
  // Add state for directly managing annotation data when needed
  const [manualAnnotation, setManualAnnotation] = useState<AnnotationType | null>(null);

  // Use either the query-provided annotation or the manually set one
  const effectiveAnnotation = manualAnnotation || annotation;
  
  // Add effect to log annotation state changes
  useEffect(() => {
    // Log annotation state whenever it changes
    if (effectiveAnnotation) {
      console.log("Current annotation state:", {
        id: effectiveAnnotation.id,
        interventionCount: effectiveAnnotation.intervention_count,
        initialStepsCount: effectiveAnnotation.initial_solution_steps?.length,
        revisedStepsCount: effectiveAnnotation.revised_solution_steps?.length,
        revisedSteps2Count: effectiveAnnotation.revised_solution_steps_2?.length,
        revisedSteps3Count: effectiveAnnotation.revised_solution_steps_3?.length,
        currentTab,
        isManuallySet: !!manualAnnotation
      });
    }
  }, [effectiveAnnotation, currentTab, manualAnnotation]);
  
  // Check if revised steps are available
  const revisedStepsAvailable = effectiveAnnotation && 
    ((effectiveAnnotation.intervention_count === 1 && Array.isArray(effectiveAnnotation.revised_solution_steps) && effectiveAnnotation.revised_solution_steps?.length > 0) ||
    (effectiveAnnotation.intervention_count === 2 && Array.isArray(effectiveAnnotation.revised_solution_steps_2) && effectiveAnnotation.revised_solution_steps_2?.length > 0) ||
    (effectiveAnnotation.intervention_count === 3 && Array.isArray(effectiveAnnotation.revised_solution_steps_3) && effectiveAnnotation.revised_solution_steps_3?.length > 0));
  
  // Determine if the solution has been revised
  const isRevised = revisedStepsAvailable;
  
  console.log(`Revised steps available: ${revisedStepsAvailable}, Current tab: ${currentTab}`);
  
  // Effect to handle tab switching based on data availability
  useEffect(() => {
    if (!revisedStepsAvailable && currentTab === 'revised') {
      console.warn("Tried to show revised tab but no revised steps are available, reverting to initial tab");
      setCurrentTab('initial');
    }
  }, [revisedStepsAvailable, currentTab]);
  
  // Show a reminder toast when users switch from revised to initial tab
  useEffect(() => {
    if (isRevised && currentTab === 'initial') {
      // Don't show on initial load
      if (effectiveAnnotation?.intervention_count > 0) {
        toast({
          title: "Reference View",
          description: "This is the original solution for reference. Please evaluate the revised solution for any remaining errors.",
          duration: 3000
        });
      }
    }
  }, [isRevised, currentTab, effectiveAnnotation?.intervention_count]);
  
  // Determine which solution steps to show based on the intervention count
  const getStepsToShow = () => {
    if (!effectiveAnnotation) {
      console.log("getStepsToShow: No annotation available");
      return [];
    }
    
    console.log("getStepsToShow called:", {
      currentTab,
      interventionCount: effectiveAnnotation.intervention_count,
      initialSteps: effectiveAnnotation.initial_solution_steps?.length,
      revisedSteps: effectiveAnnotation.revised_solution_steps?.length,
      revisedSteps2: effectiveAnnotation.revised_solution_steps_2?.length,
      revisedSteps3: effectiveAnnotation.revised_solution_steps_3?.length,
      isManuallySet: !!manualAnnotation
    });
    
    if (currentTab === 'initial') {
      return effectiveAnnotation.initial_solution_steps || [];
    } 
    
    // For revised tab, explicitly check the intervention count and array existence
    if (effectiveAnnotation.intervention_count === 1 && Array.isArray(effectiveAnnotation.revised_solution_steps) && effectiveAnnotation.revised_solution_steps.length > 0) {
      console.log("Returning revised_solution_steps (attempt 1)");
      return effectiveAnnotation.revised_solution_steps;
    } else if (effectiveAnnotation.intervention_count === 2 && Array.isArray(effectiveAnnotation.revised_solution_steps_2) && effectiveAnnotation.revised_solution_steps_2.length > 0) {
      console.log("Returning revised_solution_steps_2 (attempt 2)");
      return effectiveAnnotation.revised_solution_steps_2;
    } else if (effectiveAnnotation.intervention_count === 3 && Array.isArray(effectiveAnnotation.revised_solution_steps_3) && effectiveAnnotation.revised_solution_steps_3.length > 0) {
      console.log("Returning revised_solution_steps_3 (attempt 3)");
      return effectiveAnnotation.revised_solution_steps_3;
    }
    
    // Fallback to initial if we don't have revised steps
    console.warn("No matching revised steps found for current intervention count, falling back to initial steps");
    return effectiveAnnotation.initial_solution_steps || [];
  };
  
  // Submit guidance mutation
  const submitGuidanceMutation = useMutation({
    mutationFn: (guidanceData: any) => {
      return api.submitGuidance(effectiveAnnotation?.id || '', guidanceData);
    },
    onSuccess: (data) => {
      console.log("Guidance submission successful, received data:", data);

      // Get the updated annotation directly from the response
      const updatedAnnotation = data?.data;
      
      if (!updatedAnnotation || !updatedAnnotation.id) {
        console.error("Missing or invalid annotation in response");
        toast({
          title: "Error",
          description: "Received incomplete data from server. Please refresh.",
          variant: "destructive"
        });
        return;
      }
      
      console.log(`Updated annotation data received with ID: ${updatedAnnotation.id}`);
      
      // Check if the revised steps are actually available
      const interventionCount = updatedAnnotation.intervention_count;
      const hasRevisedSteps = 
        interventionCount === 1 ? Array.isArray(updatedAnnotation.revised_solution_steps) && updatedAnnotation.revised_solution_steps?.length > 0 :
        interventionCount === 2 ? Array.isArray(updatedAnnotation.revised_solution_steps_2) && updatedAnnotation.revised_solution_steps_2?.length > 0 :
        Array.isArray(updatedAnnotation.revised_solution_steps_3) && updatedAnnotation.revised_solution_steps_3?.length > 0;
        
      console.log(`Updated annotation from response - ID: ${updatedAnnotation.id}, intervention count: ${interventionCount}, has revised steps: ${hasRevisedSteps}`);
      
      if (!hasRevisedSteps) {
        console.error("Updated annotation doesn't contain expected revised steps!");
        toast({
          title: "Warning",
          description: "Server returned incomplete data. Try refreshing the page.",
          variant: "destructive"
        });
        return;
      }
      
      // *** CRITICAL FIX: Directly update our component state with the new annotation ***
      setManualAnnotation(updatedAnnotation);
      
      // AFTER setting the annotation, now we can update the UI
      setCurrentTab('revised');
      setSelectedStepIndex(null);
      setErrorType(null);
      setGuidanceType(null);
      setGuidanceText('');
      
      // Update the cache too, but we're not relying on it for the immediate UI update
      queryClient.invalidateQueries({ queryKey: ['annotation'] });
      
      // Also update the specific annotation query
      queryClient.setQueryData(['annotation', updatedAnnotation.id], { success: true, data: updatedAnnotation });
      
      toast({
        title: "Guidance Submitted", 
        description: "The AI has revised its solution based on your guidance"
      });

      // Scroll back to the top of the solution area after a brief delay to allow rendering
      setTimeout(() => {
        document.querySelector('.solution-steps')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (error) => {
      console.error("Error submitting guidance:", error);
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
      return api.markAsCorrect(effectiveAnnotation?.id || '', outcome);
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
  if (!problem || !effectiveAnnotation) {
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
      
      <main className="pt-20 px-3 sm:pt-24 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-5">
            <AnimatedPanel animation="slide-in-up" className="lg:col-span-5 problem-card mb-4">
              <ProblemCard 
                id={problem.problem_id}
                category={problem.problem_category}
                difficulty={problem.difficulty_level}
                text={problem.problem_text}
                showDiscardDialog={showDiscardDialog}
                setShowDiscardDialog={setShowDiscardDialog}
                onDiscard={handleDiscardProblem}
              />
            </AnimatedPanel>
            
            <AnimatedPanel animation="slide-in-left" delay={100} className="lg:col-span-3 solution-steps">
              <Tabs defaultValue="initial" value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="mb-2">
                  <TabsTrigger value="initial" className="font-medium">Initial Solution</TabsTrigger>
                  <TabsTrigger value="revised" disabled={!isRevised} className="font-medium">Revised Solution</TabsTrigger>
                </TabsList>
                
                <TabsContent value="initial" className="mt-0">
                  <SolutionSteps
                    steps={effectiveAnnotation.initial_solution_steps}
                    title={isRevised ? "Initial Solution (Reference Only)" : "Initial Solution"}
                    selectedStepIndex={isRevised ? null : selectedStepIndex}
                    onStepSelect={isRevised ? undefined : setSelectedStepIndex}
                  />
                  {isRevised && (
                    <div className="mt-2 p-2 bg-amber-50 rounded-md border border-amber-200 text-xs text-amber-700">
                      This is the original solution for reference only. Please use the Revised Solution tab to identify any additional errors.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="revised" className="mt-0">
                  <SolutionSteps
                    steps={getStepsToShow()}
                    title={`Revised Solution (Attempt ${effectiveAnnotation.intervention_count})`}
                    selectedStepIndex={selectedStepIndex}
                    onStepSelect={setSelectedStepIndex}
                  />
                  
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="flex justify-center">
                      <Button 
                        variant="default" 
                        onClick={() => handleMarkCorrect('CORRECTED')}
                        disabled={markAsCorrectMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-sm"
                        size="sm"
                      >
                        {markAsCorrectMutation.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        Mark Correct
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AnimatedPanel>
            
            <AnimatedPanel animation="slide-in-right" delay={100} className="lg:col-span-2 space-y-5">
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
                currentAttemptNumber={effectiveAnnotation.intervention_count + 1}
                isSubmitting={submitGuidanceMutation.isPending}
                className="guidance-form"
                isRevisedView={currentTab === 'revised'}
              />
            </AnimatedPanel>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Annotation;
