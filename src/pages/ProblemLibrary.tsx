import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2, FileEdit, Check, X } from 'lucide-react';
import * as api from '@/lib/api';
import { Problem, ProblemCategory, DifficultyLevel } from '@/types';
import AnimatedPanel from '@/components/AnimatedPanel';

console.log("ProblemLibrary component rendering...");

const ProblemLibrary = () => {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProblem, setNewProblem] = useState<Partial<Problem>>({
    problem_id: '',
    problem_category: 'Algebra',
    difficulty_level: 'Intermediate',
    problem_text: '',
    is_annotated: false,
    is_discarded: false
  });
  
  // Fetch problems
  const { 
    data: problemsData, 
    isLoading: isLoadingProblems,
    error: problemsError 
  } = useQuery({
    queryKey: ['problems'],
    queryFn: () => api.fetchProblems(),
    refetchOnWindowFocus: false,
  });
  
  // Create problem mutation
  const createProblemMutation = useMutation({
    mutationFn: (problemData: Partial<Problem>) => {
      return api.createProblem(problemData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      setShowAddForm(false);
      setNewProblem({
        problem_id: '',
        problem_category: 'Algebra',
        difficulty_level: 'Intermediate',
        problem_text: '',
        is_annotated: false,
        is_discarded: false
      });
      toast({
        title: "Success",
        description: "Problem added successfully",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add problem. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Discard problem mutation
  const discardProblemMutation = useMutation({
    mutationFn: (problemId: string) => {
      return api.discardProblem(problemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      toast({
        title: "Success",
        description: "Problem discarded successfully",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to discard problem. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProblem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewProblem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newProblem.problem_id || !newProblem.problem_text) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    createProblemMutation.mutate(newProblem);
  };
  
  const handleDiscardProblem = (problemId: string) => {
    discardProblemMutation.mutate(problemId);
  };
  
  // Loading state
  if (isLoadingProblems) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-medium">Loading Problems...</h2>
        </div>
      </div>
    );
  }
  
  // Error state
  if (problemsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700 flex items-center gap-2">
              <X className="h-5 w-5" />
              Error Loading Problems
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4">
              There was an error loading the problem library. Please try again.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Reload Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const problems = problemsData?.data || [];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-16">
      <Header />
      
      <main className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedPanel animation="fade-in" className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-medium">Problem Library</h1>
              <p className="text-gray-600 mt-2">
                Manage the collection of math problems for annotation.
              </p>
            </div>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1"
            >
              {showAddForm ? (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Problem
                </>
              )}
            </Button>
          </AnimatedPanel>
          
          {showAddForm && (
            <AnimatedPanel animation="slide-in-up" className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Problem</CardTitle>
                  <CardDescription>
                    Create a new math problem for annotation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="problem_id">Problem ID</Label>
                        <Input
                          id="problem_id"
                          name="problem_id"
                          placeholder="e.g., CALC-LIM-001"
                          value={newProblem.problem_id}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="problem_category">Category</Label>
                        <Select
                          value={newProblem.problem_category}
                          onValueChange={(value) => handleSelectChange('problem_category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Algebra">Algebra</SelectItem>
                            <SelectItem value="Calculus">Calculus</SelectItem>
                            <SelectItem value="Geometry">Geometry</SelectItem>
                            <SelectItem value="Probability">Probability</SelectItem>
                            <SelectItem value="Statistics">Statistics</SelectItem>
                            <SelectItem value="Number Theory">Number Theory</SelectItem>
                            <SelectItem value="Combinatorics">Combinatorics</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="difficulty_level">Difficulty</Label>
                        <Select
                          value={newProblem.difficulty_level}
                          onValueChange={(value) => handleSelectChange('difficulty_level', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="problem_text">Problem Text</Label>
                      <Textarea
                        id="problem_text"
                        name="problem_text"
                        placeholder="Enter the math problem here..."
                        value={newProblem.problem_text}
                        onChange={handleInputChange}
                        className="min-h-[150px]"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={createProblemMutation.isPending}
                        className="flex items-center gap-1"
                      >
                        {createProblemMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Save Problem
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </AnimatedPanel>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem: Problem) => (
              <AnimatedPanel key={problem.problem_id} animation="fade-in">
                <Card className={problem.is_annotated || problem.is_discarded ? 'opacity-60' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{problem.problem_id}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {problem.problem_category}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                            {problem.difficulty_level}
                          </span>
                        </div>
                      </div>
                      
                      {problem.is_annotated && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Annotated
                        </span>
                      )}
                      
                      {problem.is_discarded && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Discarded
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 line-clamp-4">
                      {problem.problem_text}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={problem.is_annotated || problem.is_discarded}
                      onClick={() => window.location.href = `/annotation?problem=${problem.problem_id}`}
                    >
                      <FileEdit className="h-4 w-4 mr-1" />
                      Annotate
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={problem.is_annotated || problem.is_discarded}
                      onClick={() => handleDiscardProblem(problem.problem_id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {discardProblemMutation.isPending && discardProblemMutation.variables === problem.problem_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Discard
                    </Button>
                  </CardFooter>
                </Card>
              </AnimatedPanel>
            ))}
            
            {problems.length === 0 && (
              <div className="col-span-3 py-12 text-center">
                <p className="text-gray-500 mb-4">No problems found in the library.</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Problem
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemLibrary;
