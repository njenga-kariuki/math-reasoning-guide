
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  animation?: 
    | 'fade-in' 
    | 'slide-in-right' 
    | 'slide-in-left' 
    | 'slide-in-up' 
    | 'scale-in';
  glass?: boolean;
}

const AnimatedPanel = ({ 
  children, 
  delay = 0, 
  animation = 'fade-in',
  glass = false,
  className,
  ...props 
}: AnimatedPanelProps) => {
  const delayClass = delay > 0 ? `animate-delay-${delay}` : '';
  
  return (
    <div
      className={cn(
        `animate-${animation}`,
        delayClass,
        glass && 'glass-panel',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedPanel;
