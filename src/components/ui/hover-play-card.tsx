"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type HoverPlayCardProps = {
  src: string;
  poster?: string;
  className?: string;
  loop?: boolean;
  mutedOnHover?: boolean; // default true to satisfy autoplay policy
};

// Helper function to convert Google Drive URLs to embed URLs
const convertGoogleDriveUrl = (url: string) => {
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
};

export default function HoverPlayCard({
  src,
  poster,
  className,
  loop = false,
  mutedOnHover = true,
}: HoverPlayCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden shadow-sm group",
        className,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Use iframe for Google Drive videos */}
      <iframe
        src={convertGoogleDriveUrl(src)}
        className="w-full h-full border-0"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        title="Video content"
        onLoad={() => setIsLoading(false)}
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />

      {/* Loading overlay for better UX */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span className="text-xs text-white/70">Loading video...</span>
          </div>
        </div>
      )}

      {/* Hover overlay with play indicator */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}