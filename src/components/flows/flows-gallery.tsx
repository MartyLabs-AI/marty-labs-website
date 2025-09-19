"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { FlowCard } from "./flow-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";

export function FlowsGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const flows = useQuery(api.flows.getPublicFlows, {
    search: searchQuery || undefined,
    category: selectedCategory || undefined,
    limit: 50,
  });

  const categories = useQuery(api.flows.getFlowCategories);

  const isLoading = flows === undefined || categories === undefined;

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-background border-input"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("")}
            >
              All
            </Button>
            {categories?.map((category) => (
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
      </div>

      {/* Results */}
      {!isLoading && flows && flows.length > 0 && (searchQuery || selectedCategory) && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Flows Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="p-6 h-full animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-muted/60 rounded w-full mb-4"></div>
              <div className="aspect-video bg-muted rounded-lg mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-5 bg-muted/60 rounded-full w-12"></div>
                <div className="h-5 bg-muted/60 rounded-full w-16"></div>
                <div className="h-5 bg-muted/60 rounded-full w-14"></div>
              </div>
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-muted/60 rounded w-16"></div>
                <div className="h-4 bg-muted/60 rounded w-20"></div>
              </div>
              <div className="h-10 bg-muted rounded w-full"></div>
            </Card>
          ))
        ) : flows?.length === 0 ? (
          // No results
          <div className="col-span-full">
            <Card className="border-2 border-dashed border-border p-12 text-center">
              <CardContent className="p-0">
                <Search className="w-12 h-12 mx-auto mb-6 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-3 text-foreground">No workflows found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters to find what you&apos;re looking for.</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Flow cards
          flows?.map((flow) => (
            <FlowCard key={flow.id} flow={flow} />
          ))
        )}
      </div>
    </div>
  );
}