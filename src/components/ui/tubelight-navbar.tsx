"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  onClick?: () => void;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);

  // Debounced resize handler for better performance
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100); // 100ms debounce
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", debouncedResize);
    
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  // Memoized active item calculation to prevent unnecessary recalculations
  const activeItem = useMemo(() => {
    return items.find(item => {
      if (item.url === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(item.url);
    });
  }, [pathname, items]);

  useEffect(() => {
    if (activeItem) {
      setActiveTab(activeItem.name);
    }
  }, [activeItem]);

  return (
    <nav
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none",
        className,
      )}
    >
      <div 
        className="relative pointer-events-auto"
        style={{
          isolation: 'isolate'
        }}
      >
        <div 
          className="relative shadow-lg rounded-full overflow-hidden bg-black/95"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}
        >
          <div className="flex items-center gap-1 py-1.5 px-1.5 rounded-full">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={(e) => {
                    setActiveTab(item.name);
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className={cn(
                    "relative cursor-pointer text-sm font-medium px-4 py-2 rounded-full transition-all duration-300",
                    "text-black dark:text-white hover:text-black dark:hover:text-white hover:bg-white/40 dark:hover:bg-black/40",
                    isActive && "text-black dark:text-white bg-white/80 dark:bg-black/80",
                  )}
                >
                  <span className="hidden md:inline whitespace-nowrap">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="tubelight"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full shadow-lg"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      style={{
                        boxShadow: '0 0 8px rgba(59, 130, 246, 0.6), 0 0 16px rgba(59, 130, 246, 0.3)'
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}