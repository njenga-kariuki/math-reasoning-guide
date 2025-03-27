
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

// Error types as defined in the specification
const ERROR_TYPES = [
  { value: 'calculation_error', label: 'Calculation Error' },
  { value: 'conceptual_misunderstanding', label: 'Conceptual Misunderstanding' },
  { value: 'approach_selection_error', label: 'Approach Selection Error' },
  { value: 'logical_reasoning_error', label: 'Logical Reasoning Error' },
  { value: 'domain_constraint_error', label: 'Domain Constraint Error' },
  { value: 'formula_application_error', label: 'Formula Application Error' },
  { value: 'notation_error', label: 'Notation Error' }
];

interface ErrorSelectionProps {
  selectedErrorType: string | null;
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
      <CardHeader className="bg-secondary/50 p-4">
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
            className="space-y-2"
          >
            {ERROR_TYPES.map((type) => (
              <div 
                key={type.value} 
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary/50 transition-colors"
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
