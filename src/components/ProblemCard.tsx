import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProblemProps {
  id: string;
  category: string;
  difficulty: string;
  text: string;
  className?: string;
  showDiscardDialog?: boolean;
  setShowDiscardDialog?: (value: boolean) => void;
  onDiscard?: () => void;
}

const ProblemCard = ({ 
  id, 
  category, 
  difficulty, 
  text, 
  className,
  showDiscardDialog,
  setShowDiscardDialog,
  onDiscard
}: ProblemProps) => {
  const difficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={cn('overflow-hidden shadow-md', className)}>
      <CardHeader className="bg-secondary/50 p-3 md:p-4 pb-3">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono bg-white text-xs">
              ID: {id}
            </Badge>
            <Badge className={difficultyColor()} variant="outline">
              {difficulty}
            </Badge>
            <Badge variant="outline" className="font-medium text-xs">
              {category}
            </Badge>
          </div>
          
          {setShowDiscardDialog && onDiscard && (
            <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50 text-xs"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Discard
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to discard this problem?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The problem will be marked as discarded and you will be assigned a new problem.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onDiscard}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Discard Problem
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-4">
        <h3 className="font-medium text-base mb-2">Question:</h3>
        <div className="text-base whitespace-pre-line">
          {text}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemCard;
