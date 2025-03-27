
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  transparent?: boolean;
  className?: string;
}

const Header = ({ transparent = false, className }: HeaderProps) => {
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300',
        transparent ? 'bg-transparent' : 'bg-white/80 backdrop-blur-md shadow-sm',
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            M
          </span>
          <span className="text-xl font-medium">Math Reasoning Guide</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/annotation" className="text-sm font-medium hover:text-primary transition-colors">
            Annotation Tool
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
