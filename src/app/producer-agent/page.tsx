"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MiniNavbar } from "@/components/ui/mini-navbar";
import { HiringPopup } from "@/components/popups/hiring-popup";
import { WaitlistPopup } from "@/components/popups/waitlist-popup";
import { WaveAnimation } from "@/components/ui/wave-animation-1";
import { Features } from "@/components/ui/features-8";
import { BlurFade } from "@/components/ui/blur-fade";
import SmoothScrollWrapper from "@/components/ui/smooth-scroll-wrapper";
import { ShinyButton } from "@/components/ui/shiny-button";
import ScrambleTextCascading from "@/components/ui/scramble-text-cascading";
import { IconHover3D } from "@/components/ui/icon-3d-hover";
import { BackgroundPlus } from "@/components/ui/background-plus";
import { 
  Play, 
  Sparkles, 
  Brain, 
  Zap, 
  Film, 
  Palette, 
  Wand2, 
  Upload,
  Download,
  Settings,
  Users,
  CheckCircle,
  ArrowRight
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
                  className="min-w-[240px] h-[56px] text-lg px-12 py-4 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Watch Demo</span>
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

const StatsSection: React.FC = () => {
  const stats = [
    { value: "10x", label: "Faster Creation", icon: Zap },
    { value: "4K", label: "Resolution Output", icon: Film },
    { value: "99%", label: "Accuracy Rate", icon: CheckCircle },
    { value: "∞", label: "Creative Possibilities", icon: Sparkles }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <BlurFade key={index} delay={0.2 * index} inView>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const WorkflowSection: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload & Describe",
      description: "Upload content or describe your vision. AI understands context and style."
    },
    {
      icon: Brain,
      title: "AI Processing", 
      description: "Neural networks analyze and generate content with precision."
    },
    {
      icon: Settings,
      title: "Smart Editing",
      description: "Intelligent tools adapt to your preferences and requirements."
    },
    {
      icon: Download,
      title: "Export & Scale",
      description: "Download in multiple formats with 4K upscaling quality."
    }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <BlurFade delay={0.2} inView>
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-white">
              How Producer Agent Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Four simple steps to transform your creative process and deliver professional results in minutes, not hours.
            </p>
          </BlurFade>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            return (
              <BlurFade key={index} delay={0.3 + (0.2 * index)} inView>
                <div className="flex justify-center">
                  <div className="w-[500px] h-[200px] overflow-hidden">
                    <IconHover3D 
                      heading={`${index + 1}. ${step.title}`}
                      text={step.description}
                      width={500}
                      height={200}
                    />
                  </div>
                </div>
              </BlurFade>
            );
          })}
        </div>
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
        
        <StatsSection />
        
        <Features />
        
        <WorkflowSection />
        
        <CTASection setWaitlistOpen={setWaitlistOpen} />

        {/* Footer */}
        <footer className="py-16 px-6 bg-black border-t border-gray-800">
          <div className="container mx-auto text-left">
            <div className="text-gray-400">
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
                  text="Unleash your creative potential with AI-powered precision."
                  className="text-xs"
                  useIntersectionObserver={true}
                  retriggerOnIntersection={true}
                  speed={120}
                  delay={500}
                />
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