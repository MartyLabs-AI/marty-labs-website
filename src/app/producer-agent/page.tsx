"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MiniNavbar } from "@/components/ui/mini-navbar";
import { HiringPopup } from "@/components/popups/hiring-popup";
import { WaitlistPopup } from "@/components/popups/waitlist-popup";
import { WaveAnimation } from "@/components/ui/wave-animation-1";
import { FeaturesFlipCards } from "@/components/ui/features-flip-cards";
import { BlurFade } from "@/components/ui/blur-fade";
import SmoothScrollWrapper from "@/components/ui/smooth-scroll-wrapper";
import { ShinyButton } from "@/components/ui/shiny-button";
import ScrambleTextCascading from "@/components/ui/scramble-text-cascading";
import { IconHover3D } from "@/components/ui/icon-3d-hover";
import { BackgroundPlus } from "@/components/ui/background-plus";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import { motion } from "framer-motion";
import { PromptCards3D } from "@/components/ui/prompt-cards-3d";
import { 
  Play, 
  Brain, 
  Palette, 
  Wand2, 
  Users,
  ArrowRight,
  Clock,
  Target,
  Maximize2,
  FileText,
  Image,
  Video,
  Monitor,
  UserIcon,
  ExternalLink
} from "lucide-react";

const HeroSection: React.FC<{ setWaitlistOpen: (open: boolean) => void }> = ({ setWaitlistOpen }) => {
  return (
    <section className="h-screen relative overflow-hidden bg-black">
      {/* Wave Animation Background */}
      <div className="absolute inset-0 z-0">
        <WaveAnimation 
          waveSpeed={1.5}
          waveIntensity={12}
          particleColor="#dc2626"
          pointSize={2}
          gridDistance={3}
        />
      </div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Hero Copy */}
            <div className="mb-16">
              <BlurFade delay={0.5} inView>
                <div className="flex items-center justify-center mb-8">
                  <div className="bg-red-600/10 border border-red-600/20 rounded-full px-6 py-2">
                    <span className="text-red-400 text-sm font-medium">Beta Access Available</span>
                  </div>
                </div>
              </BlurFade>
              
              <BlurFade delay={1.0} inView>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-light leading-tight tracking-tight text-white mb-6">
                  <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
                    Producer Agent
                  </span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={1.5} inView>
                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-4">
                  The future of content creation is here. Harness the power of AI to generate, edit, and enhance 
                  visual content at unprecedented speed and quality.
                </p>
              </BlurFade>
              
              <BlurFade delay={2.0} inView>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  From concept to creation in seconds. Professional-grade results with context-aware intelligence.
                </p>
              </BlurFade>
            </div>
            
            {/* CTA Buttons */}
            <BlurFade delay={2.5} inView>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <ShinyButton
                  onClick={() => setWaitlistOpen(true)}
                  className="min-w-[240px] h-[56px]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    <span>Join Beta Waitlist</span>
                  </div>
                </ShinyButton>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open('https://calendly.com/martymartincalls/discovery?month=2025-09', '_blank')}
                  className="min-w-[240px] h-[56px] text-lg px-12 py-4 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Schedule Demo</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Button>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
};

const TransformCreativeProcessSection: React.FC = () => {
  const features: BentoItem[] = [
    {
      title: "SOTA Models",
      description: "State-of-the-Art AI models curated by our team are always plugged in. Updated regularly.",
      icon: <Brain className="w-4 h-4 text-blue-500" />,
      status: "Latest",
      tags: ["AI", "Models"],
      colSpan: 2,
      hasPersistentHover: true,
    },
    {
      title: "Reduced TAT",
      description: "Generate commercial grade content in minutes, not days. Delight yourself too, not just the clients.",
      icon: <Clock className="w-4 h-4 text-green-500" />,
      status: "Fast",
      tags: ["Speed", "Quality"],
    },
    {
      title: "Context-enabled",
      description: "Producer Agent learns your tastes with you, as you use it.",
      icon: <Target className="w-4 h-4 text-purple-500" />,
      status: "Smart",
      tags: ["Learning", "Personal"],
      colSpan: 2,
    },
    {
      title: "Upto 4k Output",
      description: "Professional-grade quality out of the box. Comes with inbuilt upscaling functionality.",
      icon: <Maximize2 className="w-4 h-4 text-red-500" />,
      status: "4K",
      tags: ["Quality", "Output"],
    },
    {
      title: "Prompt => Anything",
      description: "Producer Agent is powered by 12+ tools that allow it to create anything. Just ask Producer.",
      icon: <Wand2 className="w-4 h-4 text-orange-500" />,
      status: "12+ Tools",
      tags: ["Versatile", "Creation"],
      colSpan: 2,
    },
    {
      title: "Smart Style Transfer",
      description: "Maintain visual consistency across all your content",
      icon: <Palette className="w-4 h-4 text-pink-500" />,
      status: "Consistent",
      tags: ["Style", "Brand"],
    },
    {
      title: "No Prompt Guides",
      description: "No need for referring to prompt guides of different models. Producer Agent gets you.",
      icon: <FileText className="w-4 h-4 text-cyan-500" />,
      status: "Intuitive",
      tags: ["Simple", "Natural"],
    },
    {
      title: "Team Collaboration",
      description: "Real-time collaboration tools for creative teams",
      icon: <Users className="w-4 h-4 text-indigo-500" />,
      status: "Real-time",
      tags: ["Teams", "Collaboration"],
    },
  ];

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
            Transform your Creative Process
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover how Producer Agent revolutionizes your creative workflow with cutting-edge AI capabilities.
          </p>
        </motion.div>

        {/* Features Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <BentoGrid items={features} />
        </motion.div>
      </div>
    </section>
  );
};

const ExamplePromptsSection: React.FC = () => {
  const promptCards = [
    {
      id: "line-art",
      icon: <Image className="size-4 text-blue-200" />,
      title: "Line Art Style",
      description: "Transform any architectural photo into clean, minimal line art. Perfect for presentations and modern design aesthetics.",
      category: "Style Transfer",
      iconClassName: "text-blue-400",
      titleClassName: "text-blue-400",
    },
    {
      id: "video-creation",
      icon: <Video className="size-4 text-blue-200" />,
      title: "Video Creation",
      description: "Generate cinematic 5-second videos from simple descriptions. High-quality motion with professional lighting and composition.",
      category: "Video Generation",
      iconClassName: "text-blue-400",
      titleClassName: "text-blue-400",
    },
    {
      id: "screen-immersion",
      icon: <Monitor className="size-4 text-blue-200" />,
      title: "Screen Immersion",
      description: "Create surreal visual effects where objects break through digital boundaries. Perfect for tech and innovation content.",
      category: "Animation Effects",
      iconClassName: "text-blue-400",
      titleClassName: "text-blue-400",
    },
    {
      id: "character-replacement",
      icon: <UserIcon className="size-4 text-blue-200" />,
      title: "Character Replace",
      description: "Seamlessly swap characters in videos while maintaining natural movement, lighting, and scene consistency.",
      category: "Character AI",
      iconClassName: "text-blue-400",
      titleClassName: "text-blue-400",
    },
  ];

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto max-w-7xl px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-light mb-4 text-white">
            Example Prompts
          </h3>
          <p className="text-gray-400 text-lg">
            See how simple and natural it is to create with Producer Agent
          </p>
        </motion.div>

        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <PromptCards3D 
            cards={promptCards}
            cardWidth={520}
            cardHeight={300}
            spacing={{ x: 45, y: 45 }}
          />
        </motion.div>

        {/* Instructions */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm">
            Hover to expand the stack • Click any card to bring it to the front
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={() => window.open('https://calendly.com/martymartincalls/discovery?month=2025-09', '_blank')}
            size="lg"
            className="text-lg px-10 py-6 bg-red-600 hover:bg-red-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-full"
          >
            Schedule Demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
};



const CTASection: React.FC<{ setWaitlistOpen: (open: boolean) => void }> = ({ setWaitlistOpen }) => {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <BackgroundPlus 
        plusColor="#fb3a5d" 
        plusSize={60} 
        fade={true} 
        backgroundColor="transparent"
      />
      <div className="container mx-auto px-6 text-center relative z-10">
        <BlurFade delay={0.2} inView>
          <h2 className="text-4xl md:text-6xl font-light text-white mb-8">
            Ready to revolutionize your creative workflow?
          </h2>
        </BlurFade>
        
        <BlurFade delay={0.4} inView>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
            Join thousands of creators who are already using Producer Agent to bring their visions to life 
            with unprecedented speed and quality.
          </p>
        </BlurFade>
        
        <BlurFade delay={0.6} inView>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={() => setWaitlistOpen(true)}
              size="lg"
              className="min-w-[240px] h-[56px] text-lg px-12 py-4 bg-red-600 text-white hover:bg-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <div className="flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                <span>Get Beta Access</span>
              </div>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open('https://calendly.com/martymartincalls/discovery?month=2025-09', '_blank')}
              className="min-w-[240px] h-[56px] text-lg px-12 py-4 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <span>Schedule Demo</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </Button>
          </div>
        </BlurFade>
      </div>
    </section>
  );
};

export default function ProducerAgentPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [hiringOpen, setHiringOpen] = useState(false);

  return (
    <>
      <MiniNavbar 
        onWaitlistOpen={() => setWaitlistOpen(true)}
        onHiringOpen={() => setHiringOpen(true)}
      />
      
      <SmoothScrollWrapper>
        <HeroSection setWaitlistOpen={setWaitlistOpen} />
        
        <TransformCreativeProcessSection />
        
        <ExamplePromptsSection />
        
        
        <CTASection setWaitlistOpen={setWaitlistOpen} />

        {/* Footer */}
        <footer className="py-12 px-6 bg-black border-t border-white/10">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="text-gray-300">
                {/* Spicy Ventures Logo */}
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src="https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/Group%2043.png"
                    alt="Spicy Ventures Logo"
                    className="w-8 h-8 object-contain"
                  />
                  <p className="text-xs text-gray-400">Spicy Ventures™</p>
                </div>
                <ScrambleTextCascading 
                  text="© 2025 Marty Labs. Producer Agent - Shaping the future of content creation."
                  className="text-sm"
                  useIntersectionObserver={true}
                  retriggerOnIntersection={true}
                  speed={120}
                  delay={0}
                />
                <div className="mt-2">
                  <ScrambleTextCascading 
                    text="Democratizing Creation."
                    className="text-xs font-medium text-blue-400"
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
                  className="text-sm hover:bg-blue-50/5 hover:border-blue-200/20 transition-colors border-white/20 text-white"
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
      <WaitlistPopup isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      <HiringPopup isOpen={hiringOpen} onClose={() => setHiringOpen(false)} />
    </>
  );
}