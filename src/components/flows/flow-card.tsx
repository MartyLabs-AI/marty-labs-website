"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Zap, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface Flow {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  estimatedProcessingTime: number;
  creditsPerGeneration: number;
  requiredPlan: string;
  thumbnail?: string;
  previewVideo?: string;
}

interface FlowCardProps {
  flow: Flow;
}

export function FlowCard({ flow }: FlowCardProps) {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleTryFlow = () => {
    // DEVELOPMENT MODE - Skip sign-in requirement
    // if (!isSignedIn) {
    //   router.push("/sign-in");
    //   return;
    // }
    router.push(`/flow/${flow.id}`);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "free": return "bg-chart-1/10 border-chart-1/30 text-chart-1";
      case "pro": return "bg-secondary/10 border-secondary/30 text-secondary";
      case "business": return "bg-primary/10 border-primary/30 text-primary";
      default: return "bg-muted/50 border-border text-muted-foreground";
    }
  };

  return (
    <Card className="group cursor-pointer h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border/60 hover:border-border bg-card/60 backdrop-blur-sm hover:bg-card">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-start justify-between mb-4">
          <Badge variant="outline" className={`text-xs ${getPlanColor(flow.requiredPlan)}`}>
            {flow.requiredPlan.toUpperCase()}
          </Badge>
          <div className="text-muted-foreground">
            <div className="flex items-center gap-2 text-xs">
              <Zap className="w-3 h-3 text-primary" />
              <span>{flow.creditsPerGeneration}</span>
            </div>
          </div>
        </div>
        
        <CardTitle className="text-lg group-hover:text-primary transition-colors mb-2 leading-tight">
          {flow.title}
        </CardTitle>
        <CardDescription className="leading-relaxed line-clamp-2">
          {flow.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pb-4">
        <div className="aspect-video bg-muted border border-border flex items-center justify-center mb-4 rounded-lg">
          <div className="w-12 h-12 bg-primary border border-primary/30 flex items-center justify-center rounded-md shadow-md">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 flex-1">
          {flow.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mt-auto">
          <span className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-secondary" />
            {Math.round(flow.estimatedProcessingTime / 60)}min
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary" />
            {flow.creditsPerGeneration} credits
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex-shrink-0 pt-0">
        <Button 
          onClick={handleTryFlow}
          variant={flow.requiredPlan === "free" ? "default" : "outline"}
          className="w-full"
          size="sm"
        >
          Try Workflow
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}