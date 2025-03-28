import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { GuidanceType, GUIDANCE_TYPES } from '@/types';
import { Badge } from '@/components/ui/badge';

interface GuidanceFormProps {
  guidanceText: string;
  selectedGuidanceType: GuidanceType | null;
  onGuidanceTextChange: (value: string) => void;
  onGuidanceTypeChange: (value: string) => void;
  onSubmitGuidance: () => void;
  currentAttemptNumber: number;
  isSubmitting?: boolean;
  className?: string;
  isRevisedView?: boolean;
}

const GuidanceForm = ({ 
  guidanceText, 
  selectedGuidanceType, 
  onGuidanceTextChange, 
  onGuidanceTypeChange, 
  onSubmitGuidance,
  currentAttemptNumber,
  isSubmitting = false,
  className,
  isRevisedView = false
}: GuidanceFormProps) => {
  
  const getPlaceholderText = () => {
    if (currentAttemptNumber === 1) {
      return "Hint at the error without revealing the solution...";
    } else if (currentAttemptNumber === 2) {
      return "Provide specific guidance about methods or steps...";
    } else {
      return "Provide direct correction...";
    }
  };

  const getGuidanceLevelLabel = () => {
    if (currentAttemptNumber === 1) {
      return "Level 1";
    } else if (currentAttemptNumber === 2) {
      return "Level 2";
    } else {
      return "Level 3";
    }
  };

  const getGuidanceLevelDescription = () => {
    if (currentAttemptNumber === 1) {
      return "Hint at the error without revealing the solution. Provide a concise hint that points towards the underlying issue.";
    } else if (currentAttemptNumber === 2) {
      return "Provide more specific guidance. Suggest specific formulas, methods, or steps to consider.";
    } else {
      return "Provide direct correction to ensure the solution can continue.";
    }
  };

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guidanceText.trim() && selectedGuidanceType && !isSubmitting) {
      onSubmitGuidance();
    }
  };

  return (
    <Card className={cn('overflow-hidden shadow-md', isRevisedView ? 'bg-blue-50 border-blue-200' : '', className)}>
      <CardHeader className={cn("p-3", isRevisedView ? "bg-blue-100" : "bg-primary/10")}>
        <CardTitle className="text-base flex items-center justify-between">
          <span>{isRevisedView ? "Additional Guidance" : "Provide Guidance"}</span>
          <Badge variant="outline" className={cn(
            "text-xs px-2 py-0.5 rounded font-medium",
            currentAttemptNumber === 1 ? "bg-blue-50 text-blue-700" :
            currentAttemptNumber === 2 ? "bg-yellow-50 text-yellow-700" :
            "bg-green-50 text-green-700"
          )}>
            {getGuidanceLevelLabel()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-3 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guidance-type" className="text-sm font-medium">Guidance Type</Label>
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
            <Label htmlFor="guidance-text" className="text-sm font-medium">Guidance for LLM</Label>
            <div className="relative">
              <Textarea
                id="guidance-text"
                value={guidanceText}
                onChange={(e) => onGuidanceTextChange(e.target.value)}
                placeholder={getPlaceholderText()}
                className="min-h-[140px] resize-none"
              />
              {!guidanceText && (
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-white px-1 py-0.5 rounded opacity-80 pointer-events-none">
                  {getGuidanceLevelLabel()}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{getGuidanceLevelDescription()}</p>
          </div>
        </CardContent>
        <CardFooter className="px-3 pb-3 pt-0">
          <Button 
            type="submit"
            disabled={!guidanceText.trim() || !selectedGuidanceType || isSubmitting}
            className={cn("w-full", isRevisedView ? "bg-blue-600 hover:bg-blue-700" : "")}
            size="sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              isRevisedView ? 'Submit Additional Guidance' : 'Submit Guidance'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default GuidanceForm;
