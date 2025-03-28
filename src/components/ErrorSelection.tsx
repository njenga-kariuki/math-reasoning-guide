
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { ErrorType, ERROR_TYPES } from '@/types';

interface ErrorSelectionProps {
  selectedErrorType: ErrorType | null;
  onErrorTypeChange: (value: string) => void;
  className?: string;
}

const ErrorSelection = ({ 
  selectedErrorType, 
  onErrorTypeChange,
  className 
}: ErrorSelectionProps) => {
  return (
    <Card className={cn('overflow-hidden shadow-md', className)}>
      <CardHeader className="bg-primary/10 p-4">
        <CardTitle className="text-xl">Error Classification</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            Classify the identified error by selecting the most appropriate type:
          </p>
          
          <RadioGroup 
            value={selectedErrorType || undefined} 
            onValueChange={onErrorTypeChange}
            className="space-y-2.5"
          >
            {ERROR_TYPES.map((type) => (
              <div 
                key={type.value} 
                className={cn(
                  "flex items-center space-x-2 p-2.5 rounded-md hover:bg-secondary/50 transition-colors",
                  selectedErrorType === type.value && "bg-secondary/70"
                )}
              >
                <RadioGroupItem value={type.value} id={type.value} />
                <Label 
                  htmlFor={type.value} 
                  className="flex-1 cursor-pointer font-medium"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorSelection;
