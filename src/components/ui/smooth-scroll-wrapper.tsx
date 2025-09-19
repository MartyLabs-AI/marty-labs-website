'use client';
import { ReactLenis } from 'lenis/react';
import React, { forwardRef, ReactNode } from 'react';

interface SmoothScrollWrapperProps {
  children: ReactNode;
  className?: string;
}

const SmoothScrollWrapper = forwardRef<HTMLElement, SmoothScrollWrapperProps>(({ children, className = "", ...props }, ref) => {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <main ref={ref} className={className} {...props}>
        {children}
      </main>
    </ReactLenis>
  );
});

SmoothScrollWrapper.displayName = 'SmoothScrollWrapper';

export default SmoothScrollWrapper;