"use client";

import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { GridPatternCard, GridPatternCardBody } from '@/components/ui/card-with-grid-ellipsis-pattern';
import { ShinyButton } from '@/components/ui/shiny-button';

interface VideoPlayerProps {
  src: string;
  className?: string;
  isVertical?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, className = "", isVertical = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const handleMouseEnter = async () => {
    setIsHovered(true);
    if (videoRef.current) {
      try {
        // Wait for any existing play promise to resolve
        if (playPromiseRef.current) {
          await playPromiseRef.current.catch(() => {});
        }
        playPromiseRef.current = videoRef.current.play();
        await playPromiseRef.current;
        setIsPlaying(true);
      } catch (error) {
        // Ignore play interruption errors
        console.debug('Video play interrupted:', error);
      } finally {
        playPromiseRef.current = null;
      }
    }
  };

  const handleMouseLeave = async () => {
    setIsHovered(false);
    if (videoRef.current) {
      // Wait for any pending play promise before pausing
      if (playPromiseRef.current) {
        await playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        // Wait for any pending play promise before pausing
        if (playPromiseRef.current) {
          await playPromiseRef.current.catch(() => {});
          playPromiseRef.current = null;
        }
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          // Wait for any existing play promise to resolve
          if (playPromiseRef.current) {
            await playPromiseRef.current.catch(() => {});
          }
          playPromiseRef.current = videoRef.current.play();
          await playPromiseRef.current;
          setIsPlaying(true);
        } catch (error) {
          // Ignore play interruption errors
          console.debug('Video play interrupted:', error);
        } finally {
          playPromiseRef.current = null;
        }
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        muted={isMuted}
        loop
        playsInline
        className={`w-full h-full object-cover rounded-2xl ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}
      />
      
      {/* Controls overlay - only visible on hover */}
      <div className={`absolute bottom-4 left-4 flex gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={togglePlayPause}
          className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <button
          onClick={toggleMute}
          className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const SimpleVideoPlayer: React.FC<VideoPlayerProps> = ({ src, className = "", isVertical = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const handleMouseEnter = async () => {
    if (videoRef.current) {
      try {
        // Wait for any existing play promise to resolve
        if (playPromiseRef.current) {
          await playPromiseRef.current.catch(() => {});
        }
        playPromiseRef.current = videoRef.current.play();
        await playPromiseRef.current;
      } catch (error) {
        // Ignore play interruption errors
        console.debug('Video play interrupted:', error);
      } finally {
        playPromiseRef.current = null;
      }
    }
  };

  const handleMouseLeave = async () => {
    if (videoRef.current) {
      // Wait for any pending play promise before pausing
      if (playPromiseRef.current) {
        await playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }
      videoRef.current.pause();
    }
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        className={`w-full h-full object-cover rounded-2xl ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}
      />
    </div>
  );
};

export const AdFilmsSection: React.FC = () => {
  return (
    <section className="py-24 px-6 relative bg-black">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-8 text-white">
            Our Work
          </h2>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Video on the left */}
            <div className="w-full lg:w-1/2">
              <VideoPlayer 
                src="https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/durex%20final%20final%20final%20fake%20ad%20please%20(2).mov"
                className="w-full max-w-lg mx-auto"
              />
            </div>
            
            {/* Text on the right */}
            <div className="w-full lg:w-1/2">
              <GridPatternCard className="bg-white/5 border-white/10">
                <GridPatternCardBody>
                  <h3 className="text-3xl md:text-4xl font-light mb-6 text-white">Ad Films</h3>
                  <p className="text-lg md:text-xl leading-relaxed text-white/90">
                    &ldquo;A Condom in Teabag&rdquo; concept as part &lsquo;Fake-Ads&rsquo; Series by the internal creative team. 
                    One of our earliest experiments with Producer Agent. We asked a really bad question that 
                    no one wanted answers to, because free will.
                  </p>
                </GridPatternCardBody>
              </GridPatternCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ShortFormAdsSection: React.FC = () => {
  const videos = [
    {
      id: 1,
      src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/SETU%20DISNEY%20FINAL.mp4",
      title: "¹ \"Defy Ageing\" for Setu Nutrition."
    },
    {
      id: 2,
      src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/Newton%20ITC%20(2).mp4",
      title: "² \"If a coconut fell on Newton.\" for B-Naturals, ITC."
    },
    {
      id: 3,
      src: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/flower%20garden%20(1).mp4",
      title: "³ \"Tulips\" for Ethera Diamonds."
    }
  ];

  return (
    <section className="py-24 px-6 relative bg-black">
      <div className="container mx-auto max-w-7xl">
        {/* Section Title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-light text-white">Short-Form Ads</h3>
        </motion.div>
        
        {/* Videos Grid - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              className="flex flex-col items-center space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Video */}
              <div className="w-full flex justify-center">
                <VideoPlayer 
                  src={video.src}
                  className="w-full max-w-xs"
                  isVertical={true}
                />
              </div>
              
              {/* Text Box */}
              <GridPatternCard className="bg-white/5 border-white/10 w-full">
                <GridPatternCardBody className="text-center">
                  <p className="text-base md:text-lg leading-relaxed text-white/90">
                    {video.title}
                  </p>
                </GridPatternCardBody>
              </GridPatternCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const DVCsSection: React.FC = () => {
  return (
    <section className="py-24 px-6 relative bg-black">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Video on the left */}
          <div className="w-full lg:w-1/2">
            <div className="flex justify-center">
              <VideoPlayer 
                src="https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/RUMIK%20COLLEGE%20FINAL%20AUG%2020%20draft%20.mp4"
                className="w-full"
                isVertical={false}
              />
            </div>
          </div>
          
          {/* Text on the right */}
          <div className="w-full lg:w-1/2">
            <GridPatternCard className="bg-white/5 border-white/10">
              <GridPatternCardBody>
                <h3 className="text-3xl md:text-4xl font-light mb-8 text-white">DVCs</h3>
                <p className="text-lg md:text-xl leading-relaxed text-white/90">
                  &ldquo;Ira&rdquo; for Rumik.ai. Rumik, is on a mission to create an ai friend for 1.4b indians. They aimed to target tier-2, male, 18-23 yo target groups and wanted our help as part of their campaign.
                </p>
              </GridPatternCardBody>
            </GridPatternCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CreateWithNoLimitsBanner: React.FC = () => {
  const handleCalendlyClick = () => {
    window.open(
      'https://calendly.com/martymartincalls/discovery?utm_source=website&utm_medium=website_banner&utm_campaign=website_book_call_create_no_limits',
      '_blank'
    );
  };

  return (
    <motion.section 
      className="py-24 px-6 relative bg-background"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Video Section */}
            <motion.div 
              className="w-full lg:w-1/2 p-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <SimpleVideoPlayer 
                src="https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/J2iP5SsqgVFBqFtCMRlwe_output%20(1).mp4"
                className="w-full"
                isVertical={false}
              />
            </motion.div>
            
            {/* Content Section */}
            <motion.div 
              className="w-full lg:w-1/2 p-6 lg:p-12 flex flex-col justify-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <motion.h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-tight"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Create with <span className="font-medium">no limits</span>
                </motion.h2>
                
                <motion.p 
                  className="text-lg text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  We are a team with more than organic 100m+ views cumulated in the last one year. We love working with matured marketing teams, to create something out of the box. With Producer Agent, we have no limits. Quite literally. Anything that can be seen, can be made.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <ShinyButton 
                    onClick={handleCalendlyClick}
                    className="mt-4"
                  >
                    Schedule a Call
                  </ShinyButton>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

