import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMouseRotation } from '../../hooks/useMouseRotation';
import { ArrowDownRight } from 'lucide-react';

// Video loading management
class VideoLoader {
  constructor() {
    this.loadingCount = 0;
    this.queue = [];
    this.MAX_CONCURRENT = 2; // Default value
    
    // Only set mobile detection on client-side
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      this.MAX_CONCURRENT = isMobile ? 1 : 2;
    }
  }
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new VideoLoader();
    }
    return this.instance;
  }
  
  requestLoad(loadFn) {
    if (this.loadingCount < this.MAX_CONCURRENT) {
      this.loadingCount++;
      loadFn();
    } else {
      this.queue.push(loadFn);
    }
  }
  
  onLoadComplete() {
    this.loadingCount--;
    if (this.queue.length > 0) {
      const nextLoadFn = this.queue.shift();
      if (nextLoadFn) {
        this.loadingCount++;
        nextLoadFn();
      }
    }
  }
}

let videoLoader = null;

if (typeof window !== 'undefined') {
  videoLoader = VideoLoader.getInstance();
}

export const VideoTile = ({ src, className = '', aspectRatio = '16/9', showControls = true, autoPlay = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const tileRef = useRef(null);
  const videoRef = useRef(null);
  
  const { getRotation } = useMouseRotation(isHovered);
  const { rotateX, rotateY } = getRotation();
  
  useEffect(() => {
    if (!videoRef.current || !src) return;
    const videoElement = videoRef.current;
    
    const onLoadedData = () => {
      setIsLoaded(true);
      if (videoLoader) videoLoader.onLoadComplete();
      const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (autoPlay && !isMobile) {
        setTimeout(() => {
          videoElement.play().then(() => setIsPlaying(true)).catch(() => {});
        }, 100);
      } else {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    };
    
    const onError = () => {
      setIsError(true);
      setIsLoaded(true);
      if (videoLoader) videoLoader.onLoadComplete();
    };

    videoElement.addEventListener('loadeddata', onLoadedData);
    videoElement.addEventListener('error', onError);
    
    videoElement.loop = true;
    videoElement.playsInline = true;
    videoElement.preload = autoPlay ? "auto" : "metadata";
    videoElement.autoplay = false;
    videoElement.muted = true;

    if (videoLoader) {
      videoLoader.requestLoad(() => {
        videoElement.src = src;
        videoElement.load();
      });
    } else {
      videoElement.src = src;
      videoElement.load();
    }

    return () => {
      videoElement.removeEventListener('loadeddata', onLoadedData);
      videoElement.removeEventListener('error', onError);
    };
  }, [src, autoPlay]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && isLoaded && !isError) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      ref={tileRef}
      className={`rounded-lg overflow-hidden relative transition-all duration-300 ease-out ${className}`}
      style={{
        aspectRatio,
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover transition-all duration-300 ease-out"
        style={{ 
          filter: isHovered ? 'brightness(0.95)' : 'brightness(0.85)', 
          display: isError ? 'none' : 'block' 
        }}
        loop
        muted
        playsInline
      />
      {isError && (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
          <p className="text-white/50 text-xs">Video unavailable</p>
        </div>
      )}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse">
          <div className="w-full h-full bg-zinc-700/50"></div>
        </div>
      )}
    </div>
  );
};

export const ImageTile = ({ src, className = '', aspectRatio = '4/3', alt = "Image" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const tileRef = useRef(null);
  const { getRotation } = useMouseRotation(isHovered);
  const { rotateX, rotateY } = getRotation();
  
  return (
    <div
      ref={tileRef}
      className={`rounded-lg overflow-hidden relative transition-all duration-300 ease-out ${className}`}
      style={{
        aspectRatio,
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-all duration-300 ease-out"
        style={{ filter: isHovered ? 'brightness(0.95)' : 'brightness(0.85)' }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
      />
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse">
          <div className="w-full h-full bg-zinc-700/50"></div>
        </div>
      )}
      {isError && (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
          <p className="text-white/50 text-xs">Image unavailable</p>
        </div>
      )}
    </div>
  );
};

export const TextTile = ({ title, subtitle, icon, buttonText, onClick, className = '', aspectRatio = '4/3' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const tileRef = useRef(null);
  const { getRotation } = useMouseRotation(isHovered);
  const { rotateX, rotateY } = getRotation();
  
  return (
    <div
      ref={tileRef}
      className={`rounded-lg overflow-hidden relative transition-all duration-300 ease-out bg-white/5 backdrop-blur-lg border border-white/20 flex flex-col items-center justify-center text-center p-6 ${className}`}
      style={{
        aspectRatio,
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-xl md:text-2xl lg:text-3xl text-white">{title}</h3>
      {subtitle && <p className="text-white/80 mt-2">{subtitle}</p>}
      {icon && <div className="text-white/80 mt-4">{icon}</div>}
      {buttonText && (
        <button 
          onClick={onClick} 
          className="mt-6 px-6 py-2.5 bg-white text-black font-semibold rounded-full transition-all duration-200 hover:bg-white/90"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

// The special central text tile
export const CentralTextTile = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const tileRef = useRef(null);
  const { getRotation } = useMouseRotation(isHovered);
  const { rotateX, rotateY } = getRotation();

  return (
    <div
      ref={tileRef}
      className={`rounded-2xl overflow-hidden relative transition-all duration-300 ease-out bg-white/5 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center text-center p-8 shadow-2xl ${className}`}
      style={{
        aspectRatio: 'auto',
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 pointer-events-none" />
      
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/95 leading-tight font-light relative z-10">
        what would you create, <br /> 
        <span className="font-medium bg-gradient-to-r from-white to-white/90 bg-clip-text">if you could create anything?</span>
      </h2>
      <div className="mt-6 w-12 h-12 rounded-full border border-white/40 bg-white/5 flex items-center justify-center transition-all duration-300 hover:border-white/60 hover:bg-white/10 relative z-10">
        <ArrowDownRight className="w-6 h-6 text-white/90" />
      </div>
    </div>
  );
};