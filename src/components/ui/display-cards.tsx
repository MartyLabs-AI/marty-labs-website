"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  onClick?: () => void;
  isActive?: boolean;
  zIndex?: number;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
  onClick,
  isActive = false,
  zIndex = 1,
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-56 w-[32rem] select-none flex-col justify-between rounded-xl border-2 bg-white/5 backdrop-blur-sm px-7 py-5 transition-all duration-700 cursor-pointer hover:border-red-500/40 hover:bg-white/10 shadow-lg hover:shadow-2xl",
        isActive ? "border-red-500/60 bg-white/15 grayscale-0 shadow-2xl" : "border-white/10 grayscale-[80%] hover:grayscale-0",
        className
      )}
      style={{ zIndex }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <span className="relative inline-block rounded-full bg-red-800 p-1">
          {icon}
        </span>
        <p className={cn("text-lg font-medium text-white", titleClassName)}>{title}</p>
      </div>
      <p className="text-lg text-gray-200 leading-tight">{description}</p>
      <p className="text-gray-400 text-sm">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: (DisplayCardProps & { id?: string })[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const [activeCardId, setActiveCardId] = useState<string | number>(0);

  const defaultCards = [
    {
      id: "0",
      className: "[grid-area:stack]",
    },
    {
      id: "1", 
      className: "[grid-area:stack]",
    },
    {
      id: "2",
      className: "[grid-area:stack]",
    },
    {
      id: "3",
      className: "[grid-area:stack]",
    },
  ];

  const displayCards = cards || defaultCards;

  const getCardTransform = (index: number, isActive: boolean) => {
    if (isActive) {
      return "translate-x-0 translate-y-0 hover:-translate-y-2 scale-105";
    }
    
    // Cascading stack pattern with subtle offsets
    const transforms = [
      "translate-x-0 translate-y-0",
      "translate-x-6 translate-y-2 rotate-1", 
      "translate-x-12 translate-y-4 rotate-2",
      "translate-x-18 translate-y-6 rotate-3"
    ];
    
    return `${transforms[index] || transforms[3]} scale-95 hover:scale-100 hover:-translate-y-1 hover:rotate-0`;
  };

  const getZIndex = (index: number, isActive: boolean) => {
    if (isActive) return 50;
    // Reverse z-index so the bottom cards can be clicked
    return 10 + (displayCards.length - index);
  };

  return (
    <div className="relative flex justify-center items-center w-full min-h-80 opacity-100 animate-in fade-in-0 duration-700">
      <div className="relative w-[48rem] h-80">
        {displayCards.map((cardProps, index) => {
          const cardId = cardProps.id || index;
          const isActive = activeCardId === cardId;
          const transform = getCardTransform(index, isActive);
          const zIndex = getZIndex(index, isActive);
          
          return (
            <DisplayCard 
              key={cardId} 
              {...cardProps}
              className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", transform)}
              onClick={() => setActiveCardId(cardId)}
              isActive={isActive}
              zIndex={zIndex}
            />
          );
        })}
      </div>
    </div>
  );
}