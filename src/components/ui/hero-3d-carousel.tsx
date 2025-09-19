"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface VideoItem {
  id: number;
  url: string;
  title: string;
  desc: string;
}

interface Hero3DCarouselProps {
  videos: VideoItem[];
  className?: string;
}

// Helper function to convert Google Drive URLs to preview URLs (no auto-download)
const convertGoogleDriveUrl = (url: string) => {
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
};

const Hero3DCarousel: React.FC<Hero3DCarouselProps> = ({ videos, className = "" }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Take only first 12 videos for the carousel
  const carouselVideos = videos.slice(0, 12);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = (event.clientX - centerX) / rect.width;
        const y = (event.clientY - centerY) / rect.height;
        
        setMousePosition({ x: x * 40, y: y * 20 }); // Enhanced sensitivity for better 3D effect
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className={`relative min-h-screen bg-black overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">

        {/* 3D Carousel Container */}
        <motion.div
          ref={containerRef}
          className="relative w-full max-w-4xl h-96 md:h-[500px] flex items-center justify-center"
          style={{ perspective: '1200px' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          {/* Carousel */}
          <motion.div
            className="relative w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${0.8 + mousePosition.y}deg) rotateY(${63 + mousePosition.x}deg)`,
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          >
            {/* Videos Container */}
            <motion.div
              className="relative w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'scale(0.8) rotateX(-40deg) rotateZ(-20deg)',
              }}
              animate={{
                rotateY: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {carouselVideos.map((video, index) => {
                const angle = (index * 360) / carouselVideos.length;
                const radius = 300;
                
                return (
                  <motion.div
                    key={video.id}
                    className="absolute top-1/2 left-1/2 w-48 h-32 md:w-56 md:h-36"
                    style={{
                      transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                      transformOrigin: '0% 50% 0px',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 + index * 0.1 }}
                  >
                    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg bg-black">
                      <iframe
                        src={convertGoogleDriveUrl(video.url)}
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                        title={video.title}
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
          
          {/* Central Hero Text - Positioned behind the carousel */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-tight drop-shadow-2xl opacity-30">
                <div>Turning Creative</div>
                <div>Visions Into</div>
                <div>Viral Reality.</div>
              </h1>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          className="text-center mt-8 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience our portfolio of viral campaigns and creative content that has generated over 500M organic views worldwide.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero3DCarousel;