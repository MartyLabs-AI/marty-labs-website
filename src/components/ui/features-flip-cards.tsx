"use client";

import React from 'react';
import { FlipCard } from '@/components/ui/flip-card';
import { Shield, Users, Sparkles, Zap, Brain, Palette, Film, Wand2 } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';

const features = [
  {
    icon: Sparkles,
    title: "Advanced AI Generation",
    description: "@producer_agent delivers studio-grade output with model routing, negative prompts, guardrails, and repeatable style control.",
    visual: "✨"
  },
  {
    icon: Zap,
    title: "Lightning-Fast Processing",
    description: "@producer_agent uses parallel batch renders and smart caching to shrink feedback loops from days to minutes.",
    visual: "⚡"
  },
  {
    icon: Brain,
    title: "Context Memory System",
    description: "@producer_agent remembers brand rules, prompts, and past picks to reproduce the same look every time.",
    visual: "🧠"
  },
  {
    icon: Film,
    title: "4K Upscaling & Enhancement",
    description: "@producer_agent cleans plates, sharpens detail, and exports pristine 4K deliverables without re-rendering.",
    visual: "🎬"
  },
  {
    icon: Palette,
    title: "Creative Orchestrator",
    description: "@producer_agent converts intent into scenes and variants, prepping production-ready deliverables in one flow.",
    visual: "🎨"
  },
  {
    icon: Wand2,
    title: "Smart Style Transfer",
    description: "@producer_agent applies consistent visual styling across all your content with intelligent brand recognition.",
    visual: "🪄"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "@producer_agent ensures your content and data are protected with enterprise-grade security protocols.",
    visual: "🛡️"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "@producer_agent enables seamless collaboration with shared workspaces and real-time editing capabilities.",
    visual: "👥"
  }
];

export function FeaturesFlipCards() {
  return (
    <section className="bg-black py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <BlurFade delay={0.2} inView>
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-white">
              Features That Transform
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Discover how @producer_agent revolutionizes your creative workflow with cutting-edge AI capabilities.
            </p>
          </BlurFade>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <BlurFade key={index} delay={0.3 + (0.1 * index)} inView>
                <FlipCard
                  frontContent={
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-red-600" />
                      </div>
                      <div className="text-6xl mb-4">{feature.visual}</div>
                      <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                    </div>
                  }
                  backContent={
                    <div className="flex flex-col justify-center h-full p-6 text-center">
                      <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-3">{feature.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  }
                />
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}