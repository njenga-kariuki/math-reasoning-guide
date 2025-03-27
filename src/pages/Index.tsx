
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AnimatedPanel from '@/components/AnimatedPanel';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header transparent />
      <Hero />
      
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedPanel animation="fade-in" className="text-center mb-16">
            <h2 className="text-3xl font-medium mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our annotation tool helps improve AI mathematical reasoning through structured feedback and iterative guidance.
            </p>
          </AnimatedPanel>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedPanel animation="slide-in-up" delay={100} className="glass-card p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <span className="font-medium text-lg">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Review Solutions</h3>
              <p className="text-gray-600">
                Analyze AI-generated step-by-step solutions to complex mathematical problems.
              </p>
            </AnimatedPanel>
            
            <AnimatedPanel animation="slide-in-up" delay={200} className="glass-card p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <span className="font-medium text-lg">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Identify Errors</h3>
              <p className="text-gray-600">
                Pinpoint the first incorrect step in the reasoning process and classify the error type.
              </p>
            </AnimatedPanel>
            
            <AnimatedPanel animation="slide-in-up" delay={300} className="glass-card p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <span className="font-medium text-lg">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Provide Guidance</h3>
              <p className="text-gray-600">
                Offer constructive feedback to help the AI understand and correct its mistakes.
              </p>
            </AnimatedPanel>
          </div>
        </div>
      </section>
      
      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedPanel animation="fade-in" className="text-center mb-12">
            <h2 className="text-3xl font-medium mb-4">Get Started Today</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Join us in improving mathematical reasoning in AI systems through structured annotation and guidance.
            </p>
          </AnimatedPanel>
          
          <AnimatedPanel animation="scale-in" delay={100} className="glass-card p-8 max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-medium mb-4">Ready to Start Annotating?</h3>
            <p className="text-gray-600 mb-6">
              Our intuitive interface makes it easy to provide valuable feedback on AI mathematical reasoning.
            </p>
            <a 
              href="/annotation" 
              className="inline-block bg-primary text-white font-medium px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              Go to Annotation Tool
            </a>
          </AnimatedPanel>
        </div>
      </section>
      
      <footer className="bg-white py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Math Reasoning Guide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
