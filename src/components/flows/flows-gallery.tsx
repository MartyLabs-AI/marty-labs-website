"use client";

import { useState } from "react";
import { FlowCard } from "./flow-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// TEMPORARY SIMPLE FLOWS GALLERY FOR DEPLOYMENT
// This replaces the complex Convex-integrated version during deployment
// TODO: Restore full Convex functionality when available

// Mock flow data for deployment
const mockFlows = [
  {
    id: "1",
    title: "Producer Agent",
    description: "AI-powered content creation and marketing materials generator",
    category: "Marketing",
    tags: ["AI", "Content", "Marketing"],
    estimatedProcessingTime: 120,
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
    creditsPerGeneration: 10,
    requiredPlan: "pro",
    isActive: true,
  },
  {
    id: "2", 
    title: "Brand Identity Kit",
    description: "Complete brand identity package with logos, colors, and guidelines",
    category: "Branding",
    tags: ["Branding", "Logo", "Design"],
    estimatedProcessingTime: 300,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
    creditsPerGeneration: 15,
    requiredPlan: "business", 
    isActive: true,
  },
  {
    id: "3",
    title: "Social Media Pack",
    description: "Ready-to-use social media posts, stories, and templates",
    category: "Social Media",
    tags: ["Social", "Templates", "Posts"],
    estimatedProcessingTime: 90,
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop",
    creditsPerGeneration: 8,
    requiredPlan: "pro",
    isActive: true,
  }
];

export function FlowsGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // For deployment, use mock data instead of Convex
  const flows = mockFlows;
  const isLoading = false;

  const filteredFlows = flows?.filter((flow) => {
    const matchesSearch = flow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         flow.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || flow.category === selectedCategory;
    return matchesSearch && matchesCategory && flow.isActive;
  }) || [];

  const categories = Array.from(new Set(flows?.map(flow => flow.category) || []));

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search flows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Flow Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading flows...</p>
        </div>
      ) : filteredFlows.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-muted-foreground mb-2">
            {searchQuery || selectedCategory ? "No flows found" : "No flows available"}
          </p>
          <p className="text-sm text-muted-foreground">
            {searchQuery || selectedCategory 
              ? "Try adjusting your search or filter criteria"
              : "Check back later for new creative tools"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlows.map((flow) => (
            <FlowCard key={flow.id} flow={flow} />
          ))}
        </div>
      )}

      {/* Development Notice */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Development Mode:</strong> Currently showing sample flows. 
          Full database integration will be restored in the next deployment phase.
        </p>
      </div>
    </div>
  );
}