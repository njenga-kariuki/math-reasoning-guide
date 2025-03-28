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
      <CardHeader className="bg-secondary/50 p-2.5">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[60vh] overflow-y-auto thin-scrollbar p-2.5">
          {steps.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground text-sm">
              No steps available
            </div>
          ) : (
            <ol className="space-y-2">
              {steps.map((step, index) => (
                <li 
                  key={index}
                  onClick={() => onStepSelect && onStepSelect(index)}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    onStepSelect ? 'cursor-pointer' : '',
                    selectedStepIndex === index 
                      ? 'bg-primary/10 border border-primary/30' 
                      : onStepSelect ? 'hover:bg-secondary' : ''
                  )}
                >
                  <div className="flex">
                    <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded mr-2 text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="flex-1 text-sm">
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
