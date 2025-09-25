"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MiniNavbar } from "@/components/ui/mini-navbar";
import { WaitlistPopup } from "@/components/popups/waitlist-popup";
import { HiringPopup } from "@/components/popups/hiring-popup";
import { Component as AnimatedBackground } from "@/components/ui/open-ai-codex-animated-background";
import { BlurFade } from "@/components/ui/blur-fade";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { InViewMediaGrid } from "@/components/ui/in-view-media-grid";
import { AdFilmsSection, ShortFormAdsSection, DVCsSection, CreateWithNoLimitsBanner } from "@/components/ui/work-sections";
import { HeroGrid } from "@/components/hero/HeroGrid";
import SmoothScrollWrapper from "@/components/ui/smooth-scroll-wrapper";
import ScrambleTextCascading from "@/components/ui/scramble-text-cascading";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ProducerAgentBanner } from "@/components/ui/producer-agent-banner";
import CardFlip from "@/components/ui/card-flip";
import MartyLabsLogoCloud from "@/components/ui/marty-labs-logo-cloud";
import { ExternalLink, ArrowDownRight } from "lucide-react";

const HeroSection: React.FC<{ setWaitlistOpen: (open: boolean) => void }> = ({ setWaitlistOpen }) => {
  const handleCalendlyClick = () => {
    window.open(
      'https://calendly.com/martymartincalls/discovery?utm_source=website&utm_medium=website_header&utm_campaign=website_book_call_marty_martin',
      '_blank'
    );
  };

  return (
    <section className="h-screen flex items-center justify-center overflow-hidden relative">
      {/* Animated Background Layer */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatedBackground />
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Copy */}
          <div className="mb-12">
            <BlurFade delay={1.5} inView>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight">
                <span className="block text-black dark:text-white mb-4 drop-shadow-lg">what would you create,</span>
              </h1>
            </BlurFade>
            <BlurFade delay={2.0} inView>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight">
                <span className="text-black dark:text-white font-medium drop-shadow-lg">
                  if you could create anything?
                </span>
              </h1>
            </BlurFade>
          </div>
          
          {/* CTA Buttons */}
          <BlurFade delay={2.5} inView>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                onClick={handleCalendlyClick}
                size="lg"
                className="text-lg px-10 py-6 bg-red-600 hover:bg-red-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-full"
              >
                Create with Marty Labs
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
              
              <ShinyButton
                onClick={() => setWaitlistOpen(true)}
                className=""
              >
                Join Waitlist for Producer Agent
              </ShinyButton>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-black text-white py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-8 text-white">
            Brand and Enterprise Solutions
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light mb-8">
            We are a brutally creative team of technologists. We partner with brands and enterprises to create compelling visual narratives that resonate with their audiences.
          </p>
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
            <span>scroll for solutions</span>
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [hiringOpen, setHiringOpen] = useState(false);
  
  const handleWaitlistClose = useCallback(() => {
    setWaitlistOpen(false);
  }, []);

  const handleHiringClose = useCallback(() => {
    setHiringOpen(false);
  }, []);

  const handleCalendlyClick = () => {
    window.open(
      'https://calendly.com/martymartincalls/discovery?utm_source=website&utm_medium=website_header&utm_campaign=website_book_call_marty_martin',
      '_blank'
    );
  };

  // Converted video data from bento-video-gallery with proper aspect ratios
  const mediaItems = [
    {
      id: 1,
      type: 'video',
      title: 'Brand Identity Campaign',
      desc: 'Motion Graphics',
      url: 'https://drive.google.com/file/d/1CqaNsaC4Egi1CfNXciMXHDGdOrMYKzl_/view',
      span: 'col-span-2 row-span-2' // Large square - hero piece
    },
    {
      id: 2,
      type: 'video',
      title: 'Product Showcase',
      desc: 'Commercial',
      url: 'https://drive.google.com/file/d/1TME3qng8CjN9o3KvGrK_eqOjIQC3qrOI/view',
      span: 'col-span-1 row-span-1' // Small square
    },
    {
      id: 3,
      type: 'video',
      title: 'Creative Campaign',
      desc: 'Advertisement',
      url: 'https://drive.google.com/file/d/1l8AaHKpREjuRd7wVkSzUq8pNJObqtV-d/view',
      span: 'col-span-2 row-span-1' // Wide rectangle
    },
    {
      id: 4,
      type: 'video',
      title: 'Digital Content',
      desc: 'Social Media',
      url: 'https://drive.google.com/file/d/1JucX4T-T80rffvRcLsl7nxlFZTOcrs7K/view',
      span: 'col-span-1 row-span-2' // Tall rectangle
    },
    {
      id: 5,
      type: 'video',
      title: 'Visual Storytelling',
      desc: 'Narrative',
      url: 'https://drive.google.com/file/d/1ABgQJcREV3Zcbdz3u2CsIbfBbpbWiSn1/view',
      span: 'col-span-1 row-span-1' // Small square
    },
    {
      id: 6,
      type: 'video',
      title: 'Motion Design',
      desc: 'Animation',
      url: 'https://drive.google.com/file/d/1vCVMguU8AcCz5FbNpS-e7BnnvXjeeoZd/view',
      span: 'col-span-2 row-span-1' // Wide rectangle
    },
    {
      id: 7,
      type: 'video',
      title: 'Brand Film',
      desc: 'Corporate',
      url: 'https://drive.google.com/file/d/1UGJi-guqIndz1WcdUh9fv1MP66POKmYF/view',
      span: 'col-span-1 row-span-1' // Small square
    },
    {
      id: 8,
      type: 'video',
      title: 'Creative Vision',
      desc: 'Concept',
      url: 'https://drive.google.com/file/d/1giD9v_AFAYW2WhkxQI_v_moBo-zhcPIr/view',
      span: 'col-span-2 row-span-2' // Large square - another hero piece
    },
    {
      id: 9,
      type: 'video',
      title: 'Digital Art',
      desc: 'Experimental',
      url: 'https://drive.google.com/file/d/1g2_Qmu2N6gAxrsm03o6o2ETN2Txniitc/view',
      span: 'col-span-1 row-span-2' // Tall rectangle
    },
    {
      id: 10,
      type: 'video',
      title: 'Content Strategy',
      desc: 'Marketing',
      url: 'https://drive.google.com/file/d/10jA7uXnB6vlA-ptak9pHCYcp_3rehCN6/view',
      span: 'col-span-1 row-span-1' // Small square
    },
    {
      id: 11,
      type: 'video',
      title: 'Visual Identity',
      desc: 'Branding',
      url: 'https://drive.google.com/file/d/13SPqJZONYD5lv7OdhdVVAXYMdMU-X0qb/view',
      span: 'col-span-2 row-span-1' // Wide rectangle
    },
    {
      id: 12,
      type: 'video',
      title: 'Media Production',
      desc: 'Production',
      url: 'https://drive.google.com/file/d/1zpk-L96otnzqF6wzUQVvZhGudJtu1npM/view',
      span: 'col-span-1 row-span-1' // Small square
    },
    {
      id: 13,
      type: 'video',
      title: 'Creative Direction',
      desc: 'Artistic',
      url: 'https://drive.google.com/file/d/1qD26vcqyi19VJGFwt78tXDNmbeghDD6t/view',
      span: 'col-span-1 row-span-2' // Tall rectangle
    },
    {
      id: 14,
      type: 'video',
      title: 'AI Innovation Lab',
      desc: 'Technology',
      url: 'https://drive.google.com/file/d/1tYuNDUml-f-wbdM8bItOY3BOl3-BGyx4/view',
      span: 'col-span-2 row-span-1' // Wide rectangle
    }
  ];

  return (
    <>
      {/* Mini Navbar */}
      <MiniNavbar 
        onWaitlistOpen={() => setWaitlistOpen(true)}
        onHiringOpen={() => setHiringOpen(true)}
      />
      
      <SmoothScrollWrapper>
        <HeroGrid />
        <MartyLabsLogoCloud />
        <ProducerAgentBanner />
        <FeaturesSection />


        {/* Our Work Sections */}
        <AdFilmsSection />
        <ShortFormAdsSection />
        <DVCsSection />
        <CreateWithNoLimitsBanner />


        {/* Footer */}
        <footer className="py-12 px-6 bg-background border-t border-border/50">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="text-muted-foreground">
                {/* Spicy Ventures Logo */}
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src="https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/Group%2043.png"
                    alt="Spicy Ventures Logo"
                    className="w-8 h-8 object-contain"
                  />
                  <p className="text-xs text-muted-foreground">Spicy Ventures™</p>
                </div>
                <ScrambleTextCascading 
                  text="© 2025 Marty Labs. All rights reserved."
                  className="text-sm"
                  useIntersectionObserver={true}
                  retriggerOnIntersection={true}
                  speed={120}
                  delay={0}
                />
                <div className="mt-2">
                  <ScrambleTextCascading 
                    text="Empowering creativity with artificial intelligence."
                    className="text-xs"
                    useIntersectionObserver={true}
                    retriggerOnIntersection={true}
                    speed={120}
                    delay={500}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => window.open('mailto:brian@martylabs.ai', '_blank')}
                  variant="outline"
                  size="sm"
                  className="text-sm hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/20 dark:hover:border-red-800/30 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </SmoothScrollWrapper>

      {/* Popups */}
      <WaitlistPopup isOpen={waitlistOpen} onClose={handleWaitlistClose} />
      <HiringPopup isOpen={hiringOpen} onClose={handleHiringClose} />
    </>
  );
}