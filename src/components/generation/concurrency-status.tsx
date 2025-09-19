"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Zap, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export function ConcurrencyStatus() {
  const { user } = useUser();
  const concurrencyInfo = useQuery(
    api.generations.checkConcurrencyAvailability,
    user ? { clerkId: user.id } : "skip"
  );

  if (!user || !concurrencyInfo) return null;

  const { available, current, maximum, planId, activeGenerations } = concurrencyInfo;
  const planName = planId?.charAt(0).toUpperCase() + planId?.slice(1) || "Unknown";
  const usagePercentage = (current / maximum) * 100;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="w-4 h-4" />
          Generation Capacity
          <Badge variant={available ? "default" : "destructive"} className="ml-auto">
            {planName} Plan
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {current} of {maximum} slots used
            </span>
            <span className={`font-medium ${available ? "text-green-600" : "text-red-600"}`}>
              {available ? "Available" : "At Limit"}
            </span>
          </div>
          <Progress 
            value={usagePercentage} 
            className="h-2"
            // Custom styling based on usage
          />
        </div>

        {/* Status Message */}
        {available ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            You can start {maximum - current} more generation{maximum - current !== 1 ? "s" : ""}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <AlertCircle className="w-4 h-4" />
            You&apos;ve reached your {planName} plan limit
          </div>
        )}

        {/* Active Generations */}
        {activeGenerations && activeGenerations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Active Generations:</h4>
            <div className="space-y-1">
              {activeGenerations.map((gen) => (
                <div key={gen.id} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="font-mono">{gen.flowId}</span>
                  </div>
                  <Badge variant="outline" size="sm">
                    {gen.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade Prompt */}
        {!available && planId === "free" && (
          <div className="pt-2 border-t">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/upgrade">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Pro for More Slots
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}