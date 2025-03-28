
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { GuidanceType, GUIDANCE_TYPES } from '@/types';

interface GuidanceFormProps {
  guidanceText: string;
  selectedGuidanceType: GuidanceType | null;
  onGuidanceTextChange: (value: string) => void;
  onGuidanceTypeChange: (value: string) => void;
  onSubmitGuidance: () => void;
  currentAttemptNumber: number;
  isSubmitting?: boolean;
  className?: string;
}

const GuidanceForm = ({ 
  guidanceText, 
  selectedGuidanceType, 
  onGuidanceTextChange, 
  onGuidanceTypeChange, 
  onSubmitGuidance,
  currentAttemptNumber,
  isSubmitting = false,
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

  const getGuidanceLevelLabel = () => {
    if (currentAttemptNumber === 1) {
      return "Level 1: Directional Guidance";
    } else if (currentAttemptNumber === 2) {
      return "Level 2: Targeted Guidance";
    } else {
      return "Level 3: Complete Correction";
    }
  };

  const getGuidanceLevelDescription = () => {
    if (currentAttemptNumber === 1) {
      return "Hint at the error without revealing the solution";
    } else if (currentAttemptNumber === 2) {
      return "Provide more specific guidance toward the correct method";
    } else {
      return "Provide direct correction to ensure the solution can continue";
    }
  };

  return (
    <Card className={cn('overflow-hidden shadow-md', className)}>
      <CardHeader className="bg-primary/10 p-4">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Guidance Form</span>
          <span className="text-sm font-normal bg-primary/15 text-primary-foreground px-3 py-1 rounded-full">
            {getGuidanceLevelLabel()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-5">
        <div className="p-3 bg-secondary/30 rounded-md border border-secondary">
          <p className="text-sm text-primary-foreground/80 font-medium">
            {getGuidanceLevelDescription()}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="guidance-type" className="font-medium">Guidance Type</Label>
          <Select value={selectedGuidanceType || undefined} onValueChange={onGuidanceTypeChange}>
            <SelectTrigger className="w-full">
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
          <Label htmlFor="guidance-text" className="font-medium">Guidance for LLM</Label>
          <Textarea
            id="guidance-text"
            value={guidanceText}
            onChange={(e) => onGuidanceTextChange(e.target.value)}
            placeholder={getPlaceholderText()}
            className="min-h-[160px] resize-none text-base"
          />
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <Button 
          onClick={onSubmitGuidance} 
          disabled={!guidanceText.trim() || !selectedGuidanceType || isSubmitting}
          className="w-full py-5 text-base font-medium"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Guidance'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GuidanceForm;
