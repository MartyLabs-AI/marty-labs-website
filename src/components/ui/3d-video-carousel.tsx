'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"

interface VideoAsset {
  id: number;
  title: string;
  desc: string;
  url: string;
}

interface VideoCardStackProps {
  videos: VideoAsset[];
  className?: string;
  cardWidth?: number;
  cardHeight?: number;
  spacing?: {
    x?: number;
    y?: number;
  };
}

interface VideoCardProps extends VideoAsset {
  index: number;
  isHovered: boolean;
  isFirstCard?: boolean;
  isMobile: boolean;
  isFront?: boolean;
  frontCardIndex: number | null;
  onClick: (index: number) => void;
  width: number;
  height: number;
  spacing: { x?: number; y?: number };
}

const VideoCard = ({
  id,
  title,
  desc,
  url,
  index, 
  isHovered, 
  isMobile,
  isFront,
  frontCardIndex,
  onClick,
  width,
  height,
  spacing
}: VideoCardProps) => {
  // Create gradient backgrounds for video placeholders
  const gradients = [
    'bg-gradient-to-br from-red-500 to-orange-500',
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-blue-500 to-cyan-500',
    'bg-gradient-to-br from-green-500 to-teal-500',
    'bg-gradient-to-br from-yellow-500 to-orange-500',
    'bg-gradient-to-br from-indigo-500 to-purple-500',
    'bg-gradient-to-br from-pink-500 to-rose-500',
    'bg-gradient-to-br from-cyan-500 to-blue-500',
    'bg-gradient-to-br from-teal-500 to-green-500',
    'bg-gradient-to-br from-orange-500 to-red-500',
    'bg-gradient-to-br from-violet-500 to-purple-500',
    'bg-gradient-to-br from-emerald-500 to-teal-500'
  ];
  
  const gradient = gradients[index % gradients.length];

  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  const handleVideoClose = () => {
    setIsPlaying(false);
  };

  return (
    <motion.div
      className={cn(
        "absolute overflow-hidden rounded-xl shadow-lg cursor-pointer group",
        isFront && "z-20"
      )}
      style={{
        width,
        height,
        transformStyle: 'preserve-3d',
        transformOrigin: isMobile ? 'top center' : 'left center',
        zIndex: isFront ? 50 : 20 + (5 - index),
        filter: isFront || frontCardIndex === null ? 'none' : 'blur(5px)', 
      }}
      initial={{
        rotateY: 0,
        x: index * 3,
        y: index * 3,
        scale: 1,
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
      }}
      animate={isPlaying
        ? {
            rotateY: 0,
            x: index * 3,
            y: index * 3,
            z: 0,
            scale: 1,
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
            transition: { type: 'spring', stiffness: 400, damping: 30 }
          }
        : isFront
        ? {
            scale: 1.2,
            rotateY: 0,
            x: 0,
            y: isMobile ? 0 : -50,
            z: 50,
            boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.5)',
          }
        : isHovered
        ? {
            rotateY: isMobile ? 0 : -45,
            x: isMobile ? 0 : index * (spacing.x ?? 50),
            y: isMobile ? index * (spacing.y ?? 50) : index * -5,
            z: index * 15,
            scale: 1.05,
            boxShadow: `10px 20px 30px rgba(0, 0, 0, ${0.2 + index * 0.05})`,
            transition: { type: 'spring', stiffness: 300, damping: 50, delay: index * 0.1 }
          }
        : {
            rotateY: 0,
            x: index * 3,
            y: index * 3,
            z: 0,
            scale: 1,
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
            transition: { type: 'spring', stiffness: 300, damping: 20, delay: (4 - index) * 0.1 }
          }
      }
      onClick={() => onClick(index)}
    >
      <div className="w-full h-full relative overflow-hidden rounded-xl bg-black">
        {/* Video Thumbnail */}
        {(() => {
          const fileId = url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
          if (fileId) {
            const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800-h600`;
            return (
              <div className="w-full h-full relative overflow-hidden bg-black">
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            );
          }
          // Fallback to gradient if no valid file ID
          return (
            <div className={`w-full h-full ${gradient} flex items-center justify-center`}>
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                <p className="text-white/80 text-xs">{desc}</p>
              </div>
            </div>
          );
        })()}
        
        {/* Video title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
          <p className="text-white/80 text-xs">{desc}</p>
        </div>
        
        {/* Play button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
          <button 
            onClick={handleVideoClick}
            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg hover:scale-110 transition-transform duration-300 z-20"
          >
            <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </button>
        </div>
        
        {/* Video Modal */}
        {isPlaying && (
          <motion.div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" 
            onClick={handleVideoClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              {/* Close button */}
              <button 
                onClick={handleVideoClose}
                className="absolute -top-12 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-red-400 transition-all duration-200 z-60"
                aria-label="Close video"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {(() => {
                const fileId = url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
                if (fileId) {
                  return (
                    <iframe
                      src={`https://drive.google.com/file/d/${fileId}/preview`}
                      className="w-full aspect-video rounded-lg shadow-2xl"
                      allowFullScreen
                    />
                  );
                }
                return (
                  <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center shadow-2xl">
                    <p className="text-white">Video not available</p>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export function VideoCardStack3D({ 
  videos, 
  className,
  cardWidth = 320,
  cardHeight = 192,
  spacing = { x: 50, y: 50 }
}: VideoCardStackProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [frontCardIndex, setFrontCardIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Click outside to reset
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setFrontCardIndex(null);
        setIsHovered(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Take only first 5 videos for the stack
  const stackVideos = videos.slice(0, 5);

  return (
    <div className={cn("flex justify-center items-center py-32 min-h-[400px]", className)}>
      <div
        ref={containerRef}
        className="relative"
        style={{ 
          width: cardWidth, 
          height: cardHeight,
          perspective: '1000px',
          minHeight: '300px'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {stackVideos.map((video, index) => (
          <VideoCard
            key={video.id}
            {...video}
            index={index}
            isHovered={isHovered}
            isFirstCard={index === 0}
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
  );
}