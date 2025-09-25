"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Clock, 
  Target, 
  Maximize2, 
  Wand2, 
  Palette,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

const examplePrompts = [
  "Redo this building in a line art style. 9:16.",
  "Take these references and create a 1080p video of 5s where the woman in front of the white background is now standing in the room, wearing the beige bodysuit. Her hands are on her face, she poses in front of the camera while standing in the same place.",
  "Slow zoom pan. Show hand slowly immersing itself into the mac desktop monitor's screen. The screen does not glitch but rather accepts the hand. Suddenly the hand flinches and tries to get out. 9:16 aspect ratio. 5s long.",
  "First, replace the child in the image with donald trump. Donald trump lays besides the man in the exact posture as the chlild was laying. Animate the generation into a 720p 4:3 video. In the video, the men are calmly laying down, looking around."
];

export const ProducerAgentSection: React.FC = () => {
  const [currentPrompt, setCurrentPrompt] = useState(0);

  const handleCalendlyClick = () => {
    window.open(
      'https://calendly.com/martymartincalls/discovery?month=2025-09',
      '_blank'
    );
  };

  const nextPrompt = () => {
    setCurrentPrompt((prev) => (prev + 1) % examplePrompts.length);
  };

  const prevPrompt = () => {
    setCurrentPrompt((prev) => (prev - 1 + examplePrompts.length) % examplePrompts.length);
  };

  return (
    <section className="py-24 px-6 relative bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-foreground">
            Transform your Creative Process
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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

        {/* Example Prompts Carousel */}
        <motion.div 
          className="mt-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-light mb-4 text-foreground">
              Example Prompts
            </h3>
            <p className="text-muted-foreground">
              See how simple and natural it is to create with Producer Agent
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevPrompt}
                  className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    Prompt {currentPrompt + 1} of {examplePrompts.length}
                  </span>
                </div>

                <button
                  onClick={nextPrompt}
                  className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <motion.div
                key={currentPrompt}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[120px] flex items-center justify-center"
              >
                <p className="text-lg text-foreground leading-relaxed italic text-center">
                  &ldquo;{examplePrompts[currentPrompt]}&rdquo;
                </p>
              </motion.div>

              <div className="flex justify-center mt-6 space-x-2">
                {examplePrompts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPrompt(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentPrompt ? 'bg-foreground' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={handleCalendlyClick}
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