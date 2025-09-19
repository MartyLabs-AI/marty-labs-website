"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WaitlistPopup } from "@/components/popups/waitlist-popup";
import { HiringPopup } from "@/components/popups/hiring-popup";
import { Beaker, ExternalLink } from "lucide-react";
import Link from "next/link";

export function MinimalisticHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [hiringOpen, setHiringOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTalkToUs = () => {
    window.open(
      'https://calendly.com/martymartincalls/discovery?utm_source=website&utm_medium=website_header&utm_campaign=website_book_call_marty_martin',
      '_blank'
    );
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg shadow-md">
                <Beaker className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-medium text-black dark:text-white tracking-tight">
                  Marty Labs
                </span>
              </div>
            </Link>

            {/* Navigation - Updated with black text and more spacing */}
            <nav className="hidden md:flex items-center space-x-12">
              <button
                onClick={() => setHiringOpen(true)}
                className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm font-light"
              >
                hiring
              </button>
              
              <button
                onClick={handleTalkToUs}
                className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm font-light flex items-center gap-1"
              >
                commission us work
                <ExternalLink className="w-3 h-3" />
              </button>
              
              <button
                onClick={() => setWaitlistOpen(true)}
                className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm font-light"
              >
                waitlist
              </button>
            </nav>

            {/* Talk to Us CTA - Featured */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleTalkToUs}
                variant="outline"
                size="sm"
                className="hidden sm:flex bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Talk to Us
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>

              {/* Mobile menu button - simplified */}
              <div className="md:hidden flex items-center space-x-2">
                <Button
                  onClick={handleTalkToUs}
                  size="sm"
                  className="bg-primary text-primary-foreground shadow-md"
                >
                  Talk to Us
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
            <div className="flex justify-center space-x-8">
              <button
                onClick={() => setHiringOpen(true)}
                className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm"
              >
                hiring
              </button>
              
              <button
                onClick={handleTalkToUs}
                className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm flex items-center gap-1"
              >
                commission us work
                <ExternalLink className="w-3 h-3" />
              </button>
              
              <button
                onClick={() => setWaitlistOpen(true)}
                className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm"
              >
                waitlist
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Popups */}
      <WaitlistPopup isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      <HiringPopup isOpen={hiringOpen} onClose={() => setHiringOpen(false)} />
    </>
  );
}