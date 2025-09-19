"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const AnimatedNavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
  const defaultTextColor = 'text-gray-300';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-base';

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a href={href} onClick={handleClick} className={`group relative inline-block overflow-hidden h-6 flex items-center ${textSizeClass} font-medium tracking-tight`}>
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </a>
  );
};

interface MiniNavbarProps {
  onWaitlistOpen?: () => void;
  onHiringOpen?: () => void;
}

export function MiniNavbar({ onWaitlistOpen, onHiringOpen }: MiniNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const handleCalendlyClick = () => {
    window.open(
      'https://calendly.com/martymartincalls/discovery?utm_source=website&utm_medium=website_header&utm_campaign=website_book_call_marty_martin',
      '_blank'
    );
    setIsOpen(false);
  };

  const handleWaitlistClick = () => {
    onWaitlistOpen?.();
    setIsOpen(false);
  };

  const handleHiringClick = () => {
    onHiringOpen?.();
    setIsOpen(false);
  };


  const navLinksData = [
    { 
      label: 'Home', 
      href: '/',
      isActive: pathname === '/'
    },
    { 
      label: 'Commission Work', 
      href: '#commission',
      onClick: handleCalendlyClick
    },
    { 
      label: 'Hiring', 
      href: '#hiring',
      onClick: handleHiringClick
    },
    { 
      label: 'Beta', 
      href: '/producer-agent',
      isActive: pathname === '/producer-agent'
    },
  ];


  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       px-6 py-2.5 backdrop-blur-md
                       ${headerShapeClass}
                       border border-white/10 bg-black/30
                       w-auto
                       transition-[border-radius] duration-0 ease-in-out`}>

      <div className="flex items-center justify-center w-full gap-x-6 sm:gap-x-8">
        <nav className="hidden sm:flex items-center space-x-6 sm:space-x-8">
          {navLinksData.map((link) => {
            const isActive = link.isActive || (link.href === '/' && pathname === '/') || (link.href === '/producer-agent' && pathname === '/producer-agent');
            return (
              <div key={link.href} className="relative">
                {isActive && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-500 rounded-full" />
                )}
                <AnimatedNavLink href={link.href} onClick={link.onClick}>
                  {link.label}
                </AnimatedNavLink>
              </div>
            );
          })}
        </nav>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <a key={link.href} href={link.href} onClick={link.onClick} className="text-gray-300 hover:text-white transition-colors w-full text-center font-medium tracking-tight">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}