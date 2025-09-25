import { useState, useEffect, useRef } from 'react';

export const useMouseRotation = (isActive = true) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (event) => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(() => {
        setMousePosition({ x: event.clientX, y: event.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isActive]);

  const getRotation = () => {
    if (typeof window === 'undefined' || !isActive) {
      return { rotateX: 0, rotateY: 0 };
    }
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const rotateY = (mousePosition.x - centerX) / centerX * 8; // Rotate up to 8 degrees
    const rotateX = (mousePosition.y - centerY) / centerY * -8; // Invert for natural feel

    return { rotateX, rotateY };
  };

  return { getRotation };
};