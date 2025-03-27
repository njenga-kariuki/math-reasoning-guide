
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedPanel from './AnimatedPanel';

const Hero = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-0" />
      
      {/* Abstract background elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animate-delay-200" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animate-delay-300" />
      
      <div className="max-w-6xl mx-auto z-10 text-center">
        <AnimatedPanel animation="fade-in">
          <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            Mathematical Reasoning Annotation
          </span>
        </AnimatedPanel>
        
        <AnimatedPanel animation="fade-in" delay={100}>
          <h1 className="mt-6 font-medium">
            Guide AI Through Mathematical Reasoning
          </h1>
        </AnimatedPanel>
        
        <AnimatedPanel animation="fade-in" delay={200}>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            An elegant tool for annotating and improving AI mathematical reasoning through 
            structured feedback and guidance. Help build better AI that can solve complex 
            mathematical problems with human-like reasoning.
          </p>
        </AnimatedPanel>
        
        <AnimatedPanel animation="fade-in" delay={300}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 py-6">
              <Link to="/annotation">
                Start Annotating
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 py-6">
              <Link to="/">
                Learn More
              </Link>
            </Button>
          </div>
        </AnimatedPanel>
      </div>
      
      <AnimatedPanel animation="slide-in-up" delay={400} className="mt-16 max-w-5xl mx-auto w-full z-10">
        <div className="glass-card p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Identify Errors</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Analyze step-by-step solutions and identify the first mistake in the reasoning process.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Provide Guidance</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Offer structured feedback to guide AI in understanding and correcting its mathematical mistakes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Verify Solutions</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Review revised solutions to ensure accurate mathematical reasoning and proper error correction.
              </p>
            </div>
          </div>
        </div>
      </AnimatedPanel>
    </div>
  );
};

export default Hero;
