
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import AnimatedPanel from '@/components/AnimatedPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <main className="pt-24 px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <AnimatedPanel animation="fade-in" className="text-center mb-12">
            <h1 className="text-4xl font-medium mb-4">Math Reasoning Annotation Guide</h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              This guide provides detailed instructions on how to use the annotation tool effectively.
            </p>
          </AnimatedPanel>
          
          <AnimatedPanel animation="fade-in" delay={100} className="mb-12">
            <Card className="shadow-md">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-2xl">Annotation Workflow</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ol className="space-y-8">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Review the Problem and Initial Solution</h3>
                      <p className="text-gray-700 mb-4">
                        Start by carefully reading the math problem and reviewing the AI's initial solution. Pay close attention to each step of the reasoning process.
                      </p>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex gap-2 text-blue-800 font-medium mb-2">
                          <HelpCircle className="h-5 w-5" />
                          <span>Example</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          When reviewing a calculus problem like "Solve the differential equation y'' + 4y' + 4y = 0", analyze each step to verify the characteristic equation, the factoring, and the general form of the solution are all correct.
                        </p>
                      </div>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Identify the First Error</h3>
                      <p className="text-gray-700 mb-4">
                        If you find an error, click on the <strong>first step</strong> that contains a mistake. Then select the error type from the dropdown menu that best describes the nature of the error.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                          <div className="flex gap-2 text-green-800 font-medium mb-1">
                            <CheckCircle className="h-5 w-5" />
                            <span>Do</span>
                          </div>
                          <p className="text-sm text-gray-700">
                            Select only the first error, even if you spot multiple issues. This helps guide the AI through a step-by-step correction process.
                          </p>
                        </div>
                        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                          <div className="flex gap-2 text-red-800 font-medium mb-1">
                            <AlertCircle className="h-5 w-5" />
                            <span>Don't</span>
                          </div>
                          <p className="text-sm text-gray-700">
                            Don't point out all errors at once. The AI needs to learn to correct one issue at a time in a sequential manner.
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Provide Appropriate Guidance</h3>
                      <p className="text-gray-700 mb-4">
                        Select a guidance type and write a helpful hint. Your guidance will follow a 3-level escalation pattern depending on the attempt number.
                      </p>
                      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-yellow-800 mb-2">Escalating Guidance Levels:</h4>
                        <ol className="space-y-4">
                          <li>
                            <p className="text-sm font-medium text-gray-700">Level 1: Directional Guidance (First Attempt)</p>
                            <p className="text-sm text-gray-700 ml-4">
                              Provide a hint pointing to the error without revealing the solution. Identify the specific concept being misapplied and encourage reflection.
                              <br />
                              <em>Example: "When differentiating y = (c₁ + c₂x)e^(-2x), remember to consider the product rule."</em>
                            </p>
                          </li>
                          <li>
                            <p className="text-sm font-medium text-gray-700">Level 2: Targeted Guidance (Second Attempt)</p>
                            <p className="text-sm text-gray-700 ml-4">
                              Offer specific recommendations toward the correct method. Suggest relevant formulas or techniques to apply.
                              <br />
                              <em>Example: "The derivative should use the product rule: (c₁ + c₂x)·(-2e^(-2x)) + (c₂)·(e^(-2x)). Check your calculation."</em>
                            </p>
                          </li>
                          <li>
                            <p className="text-sm font-medium text-gray-700">Level 3: Complete Correction (Final Attempt)</p>
                            <p className="text-sm text-gray-700 ml-4">
                              Provide the precise correction needed to ensure the solution pathway can continue.
                              <br />
                              <em>Example: "The correct derivative is y' = -2(c₁ + c₂x)e^(-2x) + c₂e^(-2x) = c₂e^(-2x) - 2c₁e^(-2x) - 2c₂xe^(-2x)."</em>
                            </p>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Review the Revised Solution</h3>
                      <p className="text-gray-700 mb-4">
                        After submitting your guidance, review the AI's revised solution. If the solution is now correct, mark it as correct. If there are still errors, provide additional guidance.
                      </p>
                    </div>
                  </li>
                </ol>
                
                <div className="mt-8 border-t pt-8 text-center">
                  <Button asChild size="lg" className="rounded-full px-8">
                    <Link to="/annotation" className="flex items-center gap-2">
                      Start Annotating
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedPanel>
          
          <AnimatedPanel animation="fade-in" delay={200}>
            <Card className="shadow-md">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-2xl">Error Type Definitions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-primary mb-3">Mathematical Errors</h3>
                    <ul className="space-y-4">
                      <li>
                        <p className="font-medium">Calculation Error</p>
                        <p className="text-sm text-gray-600">Arithmetic mistakes or computational errors.</p>
                      </li>
                      <li>
                        <p className="font-medium">Formula Application Error</p>
                        <p className="text-sm text-gray-600">Incorrect application or recall of mathematical formulas.</p>
                      </li>
                      <li>
                        <p className="font-medium">Domain Constraint Error</p>
                        <p className="text-sm text-gray-600">Overlooked mathematical constraints or boundary conditions.</p>
                      </li>
                      <li>
                        <p className="font-medium">Notation Error</p>
                        <p className="text-sm text-gray-600">Improper use of mathematical symbols or notation conventions.</p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary mb-3">Reasoning Errors</h3>
                    <ul className="space-y-4">
                      <li>
                        <p className="font-medium">Conceptual Misunderstanding</p>
                        <p className="text-sm text-gray-600">Gaps in understanding fundamental mathematical principles.</p>
                      </li>
                      <li>
                        <p className="font-medium">Logical Reasoning Error</p>
                        <p className="text-sm text-gray-600">Flawed deductive reasoning or sequence errors.</p>
                      </li>
                      <li>
                        <p className="font-medium">Approach Selection Error</p>
                        <p className="text-sm text-gray-600">Selection of inefficient or incorrect solution paths.</p>
                      </li>
                      <li>
                        <p className="font-medium">Other</p>
                        <p className="text-sm text-gray-600">Any error that doesn't fit into the categories above.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedPanel>
        </div>
      </main>
      
      <footer className="bg-white py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Math Reasoning Guide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
