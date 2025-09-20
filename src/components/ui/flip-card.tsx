"use client";

import React, { ReactNode } from 'react';

interface FlipCardProps {
  frontContent: ReactNode;
  backContent: ReactNode;
  className?: string;
}

export function FlipCard({ frontContent, backContent, className = "" }: FlipCardProps) {
  return (
    <div className={`group h-64 w-full perspective-1000 ${className}`}>
      <div className="relative h-full w-full transition-transform duration-700 preserve-3d group-hover:rotate-y-180">
        {/* Front of card */}
        <div className="absolute inset-0 h-full w-full backface-hidden rounded-lg border border-border/50 bg-background/95 backdrop-blur-xl">
          {frontContent}
        </div>
        
        {/* Back of card */}
        <div className="absolute inset-0 h-full w-full backface-hidden rotate-y-180 rounded-lg border border-border/50 bg-background/95 backdrop-blur-xl">
          {backContent}
        </div>
      </div>
    </div>
  );
}