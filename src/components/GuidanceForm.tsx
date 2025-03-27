
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Guidance types as defined in the specification
const GUIDANCE_TYPES = [
  { value: 'calculation_correction', label: 'Calculation Correction' },
  { value: 'concept_clarification', label: 'Concept Clarification' },
  { value: 'approach_redirection', label: 'Approach Redirection' },
  { value: 'logical_flow_correction', label: 'Logical Flow Correction' },
  { value: 'domain_reminder', label: 'Domain Reminder' },
  { value: 'formula_clarification', label: 'Formula Clarification' },
  { value: 'direct_correction', label: 'Direct Correction' }
];

interface GuidanceFormProps {
  guidanceText: string;
  selectedGuidanceType: string | null;
  onGuidanceTextChange: (value: string) => void;
  onGuidanceTypeChange: (value: string) => void;
  onSubmitGuidance: () => void;
  currentAttemptNumber: number;
  className?: string;
}

const GuidanceForm = ({ 
  guidanceText, 
  selectedGuidanceType, 
  onGuidanceTextChange, 
  onGuidanceTypeChange, 
  onSubmitGuidance,
  currentAttemptNumber,
  className 
}: GuidanceFormProps) => {
  
  const getPlaceholderText = () => {
    if (currentAttemptNumber === 1) {
      return "Provide a concise hint that points towards the underlying issue without giving the direct calculation or answer...";
    } else if (currentAttemptNumber === 2) {
      return "Provide more directive guidance. Suggest specific formulas, methods, or steps to consider...";
    } else {
      return "Provide the direct correction or the explicit next step needed to move forward...";
    }
  };

  return (
    <Card className={cn('overflow-hidden shadow-md', className)}>
      <CardHeader className="bg-secondary/50 p-4">
        <CardTitle className="text-xl">Guidance Form</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guidance-type">Guidance Type</Label>
          <Select value={selectedGuidanceType || undefined} onValueChange={onGuidanceTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a guidance type" />
            </SelectTrigger>
            <SelectContent>
              {GUIDANCE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="guidance-text">Guidance for LLM</Label>
          <Textarea
            id="guidance-text"
            value={guidanceText}
            onChange={(e) => onGuidanceTextChange(e.target.value)}
            placeholder={getPlaceholderText()}
            className="min-h-32 resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Attempt {currentAttemptNumber}: {
              currentAttemptNumber === 1 
                ? "Provide a hint without giving the answer" 
                : currentAttemptNumber === 2 
                  ? "Provide more specific guidance" 
                  : "Provide direct correction"
            }
          </p>
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <Button 
          onClick={onSubmitGuidance} 
          disabled={!guidanceText.trim() || !selectedGuidanceType}
          className="w-full"
        >
          Submit Guidance
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GuidanceForm;
