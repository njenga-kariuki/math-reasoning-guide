
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SolutionStepsProps {
  steps: string[];
  title: string;
  selectedStepIndex?: number | null;
  onStepSelect?: (index: number) => void;
  className?: string;
}

const SolutionSteps = ({ 
  steps, 
  title, 
  selectedStepIndex = null, 
  onStepSelect,
  className 
}: SolutionStepsProps) => {
  return (
    <Card className={cn('overflow-hidden h-full shadow-md', className)}>
      <CardHeader className="bg-secondary/50 p-4">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[60vh] overflow-y-auto thin-scrollbar p-4">
          {steps.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No steps available
            </div>
          ) : (
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li 
                  key={index}
                  onClick={() => onStepSelect && onStepSelect(index)}
                  className={cn(
                    'p-3 rounded-lg transition-all cursor-pointer',
                    selectedStepIndex === index 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'hover:bg-secondary'
                  )}
                >
                  <div className="flex">
                    <span className="font-mono text-sm bg-secondary px-2 py-1 rounded mr-3 text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      {step}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SolutionSteps;
