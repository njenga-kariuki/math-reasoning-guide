import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import AnimatedPanel from '@/components/AnimatedPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, CheckCircle, AlertCircle, HelpCircle, ArrowRightCircle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <main className="pt-20 px-4 md:pt-24 md:px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <AnimatedPanel animation="fade-in" className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-medium mb-3">Math Annotation Guide</h1>
            <p className="text-gray-600 mx-auto text-base max-w-2xl">
              Learn how to effectively identify errors and provide guidance to improve mathematical reasoning.
            </p>
          </AnimatedPanel>
          
          <AnimatedPanel animation="fade-in" delay={100} className="mb-10">
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl md:text-2xl">Annotation Workflow</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                      Follow these steps for effective annotation
                    </CardDescription>
                  </div>
                  <Button asChild size="sm" className="rounded-full px-4 hidden md:flex">
                    <Link to="/annotation" className="flex items-center gap-1">
                      Start Annotating
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-col gap-7">
                  <div className="relative pl-12 pb-1">
                    <div className="absolute left-0 top-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div className="ml-2">
                      <h3 className="text-lg font-medium mb-1.5">Review the Problem and Solution</h3>
                      <p className="text-gray-700 text-sm mb-3">
                        Carefully read the math problem and review each step of the AI's initial solution, looking for errors in the reasoning process.
                      </p>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <div className="flex gap-1.5 items-center text-blue-700 font-medium mb-1 text-sm">
                          <HelpCircle className="h-4 w-4" />
                          <span>For example:</span>
                        </div>
                        <p className="text-xs text-gray-700">
                          When reviewing a calculus problem like "Solve the differential equation y'' + 4y' + 4y = 0", analyze if the characteristic equation is set up correctly, if the factoring is done properly, and if the general solution form is appropriate.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative pl-12 pb-1">
                    <div className="absolute left-0 top-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div className="ml-2">
                      <h3 className="text-lg font-medium mb-1.5">Identify the First Error</h3>
                      <p className="text-gray-700 text-sm mb-3">
                        Click on the first step containing a mistake and select the appropriate error type from the menu.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-1">
                        <div className="bg-green-50 border border-green-100 rounded-lg p-2.5">
                          <div className="flex gap-1.5 items-center text-green-700 font-medium mb-1 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>Do:</span>
                          </div>
                          <p className="text-xs text-gray-700">
                            Select only the first error you find. This allows for step-by-step correction of the reasoning process.
                          </p>
                        </div>
                        <div className="bg-red-50 border border-red-100 rounded-lg p-2.5">
                          <div className="flex gap-1.5 items-center text-red-700 font-medium mb-1 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>Don't:</span>
                          </div>
                          <p className="text-xs text-gray-700">
                            Don't try to address multiple errors at once. Focus on the first mistake in the sequence of steps.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative pl-12 pb-1">
                    <div className="absolute left-0 top-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div className="ml-2">
                      <h3 className="text-lg font-medium mb-1.5">Provide Appropriate Guidance</h3>
                      <p className="text-gray-700 text-sm mb-3">
                        Select a guidance type and write feedback based on the current attempt level.
                      </p>
                      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-1">
                        <h4 className="font-medium text-yellow-700 text-sm mb-2">Guidance Levels:</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <div className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">1</div>
                            <div>
                              <p className="text-xs font-medium text-gray-700">Level 1: Hint at the error</p>
                              <p className="text-xs text-gray-600">
                                Provide a subtle hint without revealing the solution.
                                <br />
                                <em className="text-xs text-gray-500">Example: "Check how you're applying the product rule in this step."</em>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="bg-yellow-100 text-yellow-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">2</div>
                            <div>
                              <p className="text-xs font-medium text-gray-700">Level 2: Suggest a specific approach</p>
                              <p className="text-xs text-gray-600">
                                Provide more specific guidance about methods to apply.
                                <br />
                                <em className="text-xs text-gray-500">Example: "Use the product rule: d/dx[(c₁+c₂x)e^(-2x)] = (c₁+c₂x)·d/dx[e^(-2x)] + e^(-2x)·d/dx[(c₁+c₂x)]"</em>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">3</div>
                            <div>
                              <p className="text-xs font-medium text-gray-700">Level 3: Provide direct correction</p>
                              <p className="text-xs text-gray-600">
                                Give the precise correction needed to continue.
                                <br />
                                <em className="text-xs text-gray-500">Example: "The correct derivative is y' = -2(c₁+c₂x)e^(-2x) + c₂e^(-2x) = c₂e^(-2x) - 2c₁e^(-2x) - 2c₂xe^(-2x)"</em>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative pl-12 pb-1">
                    <div className="absolute left-0 top-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      4
                    </div>
                    <div className="ml-2">
                      <h3 className="text-lg font-medium mb-1.5">Review the Revised Solution</h3>
                      <p className="text-gray-700 text-sm">
                        After submitting your guidance, check the AI's revised solution. Either mark it as correct if the error is fixed, or continue providing guidance for any remaining errors.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t text-center md:hidden">
                  <Button asChild className="rounded-full px-6">
                    <Link to="/annotation" className="flex items-center gap-1 justify-center">
                      Start Annotating
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedPanel>
          
          <AnimatedPanel animation="fade-in" delay={200}>
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-xl md:text-2xl">Error Type Reference</CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  Descriptions of different error types to help with classification
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <h3 className="text-base font-medium text-primary mb-2 pb-1 border-b border-primary/10">Mathematical Errors</h3>
                    <ul className="space-y-3">
                      <li className="rounded-lg p-2 hover:bg-gray-50 transition-colors">
                        <p className="font-medium text-sm">Calculation Error</p>
                        <p className="text-xs text-gray-600">Arithmetic mistakes, computational errors, or incorrect evaluations.</p>
                      </li>
                      <li className="rounded-lg p-2 hover:bg-gray-50 transition-colors">
                        <p className="font-medium text-sm">Formula Application Error</p>
                        <p className="text-xs text-gray-600">Incorrect application of mathematical formulas or equations.</p>
                      </li>
                      <li className="rounded-lg p-2 hover:bg-gray-50 transition-colors">
                        <p className="font-medium text-sm">Domain Constraint Error</p>
                        <p className="text-xs text-gray-600">Overlooking domain restrictions or boundary conditions.</p>
                      </li>
                      <li className="rounded-lg p-2 hover:bg-gray-50 transition-colors">
                        <p className="font-medium text-sm">Notation Error</p>
                        <p className="text-xs text-gray-600">Improper use of mathematical symbols or notation conventions.</p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-primary mb-2 pb-1 border-b border-primary/10">Reasoning Errors</h3>
                    <ul className="space-y-3">
                      <li className="rounded-lg p-2 hover:bg-gray-50 transition-colors">
                        <p className="font-medium text-sm">Conceptual Misunderstanding</p>
                        <p className="text-xs text-gray-600">Fundamental misunderstanding of mathematical concepts or principles.</p>
                      </li>
                      <li className="rounded-lg p-2 hover:bg-gray-50 transition-colors">
                        <p className="font-medium text-sm">Logical Reasoning Error</p>
                        <p className="text-xs text-gray-600">Flawed deductive reasoning or incorrect logical sequence.</p>
                      </li>
                      <li className="rounded-lg p-2 hover:bg-gray-50 transition-colors">
                        <p className="font-medium text-sm">Approach Selection Error</p>
                        <p className="text-xs text-gray-600">Choosing an inefficient or incorrect solution method.</p>
                      </li>
                      <li className="rounded-lg p-2 hover:bg-gray-50 transition-colors">
                        <p className="font-medium text-sm">Other</p>
                        <p className="text-xs text-gray-600">Any error that doesn't clearly fit into the categories above.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedPanel>
        </div>
      </main>
      
      <footer className="bg-white py-6 px-4 border-t">
        <div className="max-w-5xl mx-auto text-center text-gray-500 text-xs">
          <p>Math Annotation Tool</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
