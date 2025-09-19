"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import UnicornScene to avoid SSR issues
const UnicornScene = dynamic(() => import("unicornstudio-react"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-background via-muted/20 to-background" />
});

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const Component = () => {
  const { width, height } = useWindowSize();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className={cn("w-full h-full bg-gradient-to-br from-background via-muted/20 to-background")} />;
  }

  return (
    <div className={cn("flex flex-col items-center w-full h-full")}>
      <UnicornScene 
        production={true} 
        projectId="1grEuiVDSVmyvEMAYhA6" 
        width={width} 
        height={height} 
      />
    </div>
  );
};