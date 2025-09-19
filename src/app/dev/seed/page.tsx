"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const seedFlows = useMutation(api.flows.seedFlows);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedFlows();
      toast.success("Flows seeded successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to seed flows");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Development Seeding</CardTitle>
            <CardDescription>
              Seed the database with initial flows for development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSeed} 
              disabled={isSeeding}
              className="w-full"
            >
              {isSeeding ? "Seeding..." : "Seed Flows"}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              This will add initial flows to the database. Only run this once.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}