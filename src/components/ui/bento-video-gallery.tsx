'use client';
import React, { forwardRef } from 'react';
import HoverPlayCard from '@/components/ui/hover-play-card';

interface VideoWork {
  src: string;
  title: string;
  category: string;
  type: 'video' | 'image';
}

interface BentoVideoGalleryProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

// Your original Marty Labs video portfolio
const videoPortfolio: VideoWork[] = [
  {
    src: 'https://drive.google.com/file/d/1CqaNsaC4Egi1CfNXciMXHDGdOrMYKzl_/view',
    title: 'Brand Identity Campaign',
    category: 'Motion Graphics',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/1TME3qng8CjN9o3KvGrK_eqOjIQC3qrOI/view',
    title: 'Product Showcase',
    category: 'Commercial',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/1l8AaHKpREjuRd7wVkSzUq8pNJObqtV-d/view',
    title: 'Creative Campaign',
    category: 'Advertisement',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/1JucX4T-T80rffvRcLsl7nxlFZTOcrs7K/view',
    title: 'Digital Content',
    category: 'Social Media',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/1ABgQJcREV3Zcbdz3u2CsIbfBbpbWiSn1/view',
    title: 'Visual Storytelling',
    category: 'Narrative',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/1vCVMguU8AcCz5FbNpS-e7BnnvXjeeoZd/view',
    title: 'Motion Design',
    category: 'Animation',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/1UGJi-guqIndz1WcdUh9fv1MP66POKmYF/view',
    title: 'Brand Film',
    category: 'Corporate',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/1giD9v_AFAYW2WhkxQI_v_moBo-zhcPIr/view',
    title: 'Creative Vision',
    category: 'Concept',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/1g2_Qmu2N6gAxrsm03o6o2ETN2Txniitc/view',
    title: 'Digital Art',
    category: 'Experimental',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/10jA7uXnB6vlA-ptak9pHCYcp_3rehCN6/view',
    title: 'Content Strategy',
    category: 'Marketing',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/13SPqJZONYD5lv7OdhdVVAXYMdMU-X0qb/view',
    title: 'Visual Identity',
    category: 'Branding',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/1zpk-L96otnzqF6wzUQVvZhGudJtu1npM/view',
    title: 'Media Production',
    category: 'Production',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/1qD26vcqyi19VJGFwt78tXDNmbeghDD6t/view',
    title: 'Creative Direction',
    category: 'Artistic',
    type: 'video'
  },
  {
    src: 'https://drive.google.com/file/d/1tYuNDUml-f-wbdM8bItOY3BOl3-BGyx4/view',
    title: 'AI Innovation Lab',
    category: 'Technology',
    type: 'video'
  }
];

const BentoVideoGallery = forwardRef<HTMLElement, BentoVideoGalleryProps>(({
  title = "Our Creative Portfolio",
  subtitle = "Explore our collection of AI-driven content and creative productions",
  className = ""
}, ref) => {
  return (
    <section className={`relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black ${className}`} ref={ref}>
      {/* Hero Section */}
      <div className="relative py-24 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm text-white/80 font-medium tracking-wide uppercase">
                Video Portfolio
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white">
              {title}
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              {subtitle}
            </p>
            <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
              <span>{videoPortfolio.length} Projects</span>
              <div className="w-px h-4 bg-white/20"></div>
              <span>Interactive Gallery</span>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-[200px]">
            {videoPortfolio.map((video, index) => {
              // Create varied card sizes for bento layout
              const getCardSize = (index: number) => {
                const patterns = [
                  "md:col-span-2 md:row-span-2", // Large
                  "md:col-span-1 md:row-span-1", // Small
                  "md:col-span-2 md:row-span-1", // Wide
                  "md:col-span-1 md:row-span-2", // Tall
                  "md:col-span-1 md:row-span-1", // Small
                  "md:col-span-2 md:row-span-1", // Wide
                ];
                return patterns[index % patterns.length];
              };

              return (
                <div
                  key={index}
                  className={`${getCardSize(index)} group relative`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <HoverPlayCard
                    src={video.src}
                    loop
                    mutedOnHover
                    className="w-full h-full border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 backdrop-blur-sm bg-slate-800/20"
                  />
                  
                  {/* Video Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-b-xl">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white/90 font-medium">
                          {video.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white leading-tight">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Elegant Footer */}
      <footer className="bg-gradient-to-t from-black to-slate-950 py-24">
        <div className="text-center">
          <h2 className="text-8xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 leading-none tracking-tight">
            MARTY LABS
          </h2>
          <p className="text-white/40 text-lg mt-8">
            Where creativity meets artificial intelligence
          </p>
        </div>
      </footer>
    </section>
  );
});

BentoVideoGallery.displayName = 'BentoVideoGallery';

export default BentoVideoGallery;