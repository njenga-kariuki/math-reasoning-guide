
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { X } from 'lucide-react';

interface WalkthroughTooltipProps {
  steps: {
    target: string;
    content: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
  }[];
  onComplete?: () => void;
  isOpen?: boolean;
}

const WalkthroughTooltip = ({ steps, onComplete, isOpen = true }: WalkthroughTooltipProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(isOpen);
  const [tooltipOpen, setTooltipOpen] = useState(isOpen);

  useEffect(() => {
    if (!isActive) return;
    
    // Find the target element
    const targetEl = document.querySelector(steps[currentStep].target);
    if (targetEl) {
      // Scroll to the element
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Add temporary highlight
      targetEl.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
      
      return () => {
        // Clean up
        targetEl.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
      };
    }
  }, [currentStep, isActive, steps]);

  // Set tooltip open state when active changes
  useEffect(() => {
    setTooltipOpen(isActive);
  }, [isActive]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete the walkthrough
      setIsActive(false);
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleDismiss = () => {
    setIsActive(false);
    onComplete?.();
  };

  if (!isActive || steps.length === 0) return null;

  const currentTargetEl = document.querySelector(steps[currentStep].target);
  const position = steps[currentStep].position || 'bottom';

  return (
    <div className="walkthrough-tooltip">
      {currentTargetEl && (
        <Tooltip open={tooltipOpen}>
          <TooltipTrigger asChild>
            <div className="fixed inset-0 pointer-events-none" />
          </TooltipTrigger>
          <TooltipContent
            side={position}
            sideOffset={8}
            className="p-0 w-80 max-w-[90vw]"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">Step {currentStep + 1} of {steps.length}</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={handleDismiss}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm mb-4">{steps[currentStep].content}</p>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button 
                  size="sm"
                  onClick={handleNext}
                >
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default WalkthroughTooltip;
