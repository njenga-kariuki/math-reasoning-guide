
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ProblemProps {
  id: string;
  category: string;
  difficulty: string;
  text: string;
  className?: string;
}

const ProblemCard = ({ id, category, difficulty, text, className }: ProblemProps) => {
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
      <CardHeader className="bg-secondary/50 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="font-mono bg-white">
              {id}
            </Badge>
            <Badge className={difficultyColor()}>
              {difficulty}
            </Badge>
          </div>
          <Badge variant="secondary" className="font-medium">
            {category}
          </Badge>
        </div>
        <CardTitle className="text-xl mt-3">Problem Statement</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="font-medium text-lg whitespace-pre-line">
          {text}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemCard;
