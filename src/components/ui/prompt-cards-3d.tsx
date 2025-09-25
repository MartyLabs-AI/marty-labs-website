'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"
import { LucideIcon } from 'lucide-react';

interface PromptCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  iconClassName?: string;
  titleClassName?: string;
}

interface PromptCards3DProps {
  cards: PromptCard[];
  className?: string;
  cardWidth?: number;
  cardHeight?: number;
  spacing?: {
    x?: number;
    y?: number;
  };
}

interface CardProps extends PromptCard {
  index: number;
  isHovered: boolean;
  isMobile: boolean;
  isFront?: boolean;
  frontCardIndex: number | null;
  onClick: (index: number) => void;
  width: number;
  height: number;
  spacing: { x?: number; y?: number };
}

const PromptDisplayCard = ({
  id,
  icon,
  title,
  description,
  category,
  iconClassName = "text-red-500",
  titleClassName = "text-red-500",
  index, 
  isHovered, 
  isMobile,
  isFront,
  frontCardIndex,
  onClick,
  width,
  height,
  spacing
}: CardProps) => {
  return (
    <motion.div
      className={cn(
        "absolute overflow-hidden rounded-2xl shadow-2xl cursor-pointer",
        "bg-gradient-to-br from-white/10 via-white/5 to-transparent",
        "backdrop-blur-xl border border-white/20",
        "before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/10 before:backdrop-blur-3xl",
        isFront 
          ? "border-blue-400/60 bg-gradient-to-br from-blue-500/20 via-white/10 to-transparent shadow-blue-500/20 grayscale-0 z-20" 
          : "border-white/10 grayscale-[80%] hover:grayscale-0 hover:border-blue-300/30"
      )}
      style={{
        width,
        height,
        transformStyle: 'preserve-3d',
        transformOrigin: isMobile ? 'top center' : 'left center',
        zIndex: isFront ? 20 : 5 - index,
        filter: isFront || frontCardIndex === null ? 'none' : 'blur(3px)', 
      }}
      initial={{
        rotateY: 0,
        x: 0,
        y: 0,
        scale: 1,
        boxShadow: '0px 4px 20px rgba(59, 130, 246, 0.1)',
      }}
      animate={isFront
        ? {
            scale: 1.15,
            rotateY: 0,
            x: 0,
            y: isMobile ? 0 : -30,
            z: 50,
            boxShadow: '0px 20px 50px rgba(59, 130, 246, 0.4)',
          }
        : isHovered
        ? {
            rotateY: isMobile ? 0 : -25,
            x: isMobile ? 0 : index * (spacing.x ?? 40),
            y: isMobile ? index * (spacing.y ?? 40) : index * -3,
            z: index * 12,
            scale: 1.02,
            boxShadow: `8px 15px 25px rgba(59, 130, 246, ${0.15 + index * 0.05})`,
            transition: { type: 'spring', stiffness: 400, damping: 60, delay: index * 0.08 }
          }
        : {
            rotateY: 0,
            x: 0,
            y: 0,
            z: 0,
            scale: 1,
            boxShadow: '0px 4px 20px rgba(59, 130, 246, 0.08)',
            transition: { type: 'spring', stiffness: 400, damping: 30, delay: (4 - index) * 0.08 }
          }
      }
      onClick={() => onClick(index)}
      whileHover={{
        borderColor: "rgba(59, 130, 246, 0.5)",
        backgroundColor: "rgba(59, 130, 246, 0.05)",
        boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)"
      }}
    >
      <div className="flex flex-col justify-between h-full p-6 relative">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/5 via-transparent to-purple-400/5 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Header with icon and title */}
        <div className="flex items-center gap-3">
          <div className="relative inline-block rounded-full bg-gradient-to-br from-blue-600/80 to-blue-800/60 p-2 backdrop-blur-sm border border-blue-400/30 shadow-lg shadow-blue-500/20">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-white">
            {title}
          </h3>
        </div>
        
        {/* Description */}
        <p className="text-base text-gray-200 leading-relaxed mt-4 flex-1">
          {description}
        </p>
        
        {/* Category tag */}
        <div className="mt-4 pt-3 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm shadow-sm">
            <span className="text-xs text-blue-300 font-medium uppercase tracking-wide">
              {category}
            </span>
          </div>
        </div>
        </div>
      </div>
    </motion.div>
  );
};

export function PromptCards3D({ 
  cards, 
  className,
  cardWidth = 480,
  cardHeight = 280,
  spacing = { x: 40, y: 40 }
}: PromptCards3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [frontCardIndex, setFrontCardIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={cn("flex justify-center items-center py-16", className)}>
      <div
        className="relative"
        style={{ 
          width: cardWidth + (cards.length * spacing.x!), 
          height: cardHeight + (cards.length * spacing.y!) 
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ 
            width: cardWidth, 
            height: cardHeight,
            perspective: '1200px' 
          }}
        >
          {cards.map((card, index) => (
            <PromptDisplayCard
              key={card.id}
              {...card}
              index={index}
              isHovered={isHovered}
              isMobile={isMobile}
              isFront={frontCardIndex === index}
              frontCardIndex={frontCardIndex}
              onClick={(idx) => setFrontCardIndex(prev => prev === idx ? null : idx)}
              width={cardWidth}
              height={cardHeight}
              spacing={spacing}
            />
          ))}
        </div>
      </div>
    </div>
  );
}