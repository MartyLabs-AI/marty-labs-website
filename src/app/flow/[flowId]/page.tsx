"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { ConvexHttpClient } from "convex/browser";
import { useUser } from "@clerk/nextjs";
import { api } from "@/../convex/_generated/api";
import { FlowForm } from "@/components/flow/flow-form";
import { GenerationStatus } from "@/components/generation/generation-status";
import { ConcurrencyStatus } from "@/components/generation/concurrency-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertTriangle, Zap } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Id } from "@/../convex/_generated/dataModel";
import { useFileUpload } from "@/lib/use-file-upload";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function FlowExecutionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const flowId = params.flowId as string;
  
  const [currentGenerationId, setCurrentGenerationId] = useState<Id<"generations"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const flow = useQuery(api.flows.getFlowById, { flowId });
  const userWithSubscription = useQuery(
    api.users.getUserWithSubscription, 
    user ? { clerkId: user.id } : "skip"
  );
  const createGeneration = useMutation(api.generations.createGeneration);
  const { uploadMultipleFiles, isUploading } = useFileUpload();

  const isLoading = flow === undefined || userWithSubscription === undefined;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-chart-3 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-foreground">Authentication Required</h3>
            <p className="text-muted-foreground mb-4">Please sign in to use this flow.</p>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-mono">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!flow) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-chart-3 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-foreground">Flow Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested flow does not exist or is not available.
            </p>
            <Link href="/">
              <Button>Browse Flows</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userWithSubscription?.subscription) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-chart-3 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-foreground">Subscription Required</h3>
            <p className="text-muted-foreground mb-4">
              You need an active subscription to use this flow.
            </p>
            <Button>Upgrade Plan</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { subscription } = userWithSubscription;

  // Check if user has enough credits
  const hasEnoughCredits = subscription.credits >= flow.creditsPerGeneration;

  // Check plan requirements
  const planHierarchy = { "free": 0, "pro": 1, "business": 2 };
  const userPlanLevel = planHierarchy[subscription.planId as keyof typeof planHierarchy] || 0;
  const requiredPlanLevel = planHierarchy[flow.requiredPlan as keyof typeof planHierarchy] || 0;
  const hasPlanAccess = userPlanLevel >= requiredPlanLevel;

  const handleFormSubmit = async (formData: Record<string, unknown>, filesByField: { [key: string]: File[] }) => {
    // DEVELOPMENT MODE - ALL RESTRICTIONS DISABLED
    // if (!hasEnoughCredits) {
    //   toast.error("Insufficient credits. Please upgrade your plan.");
    //   return;
    // }

    // if (!hasPlanAccess) {
    //   toast.error(`This flow requires ${flow.requiredPlan} plan or higher.`);
    //   return;
    // }

    // Check concurrency limits before starting - COMMENTED OUT FOR DEVELOPMENT
    // try {
    //   const concurrencyCheck = await convex.query(api.generations.checkConcurrencyAvailability, {
    //     clerkId: user.id,
    //   });

    //   if (!concurrencyCheck.available) {
    //     const planName = concurrencyCheck.planId?.charAt(0).toUpperCase() + concurrencyCheck.planId?.slice(1);
    //     toast.error(`You've reached your ${planName} plan limit of ${concurrencyCheck.maximum} concurrent generation${concurrencyCheck.maximum > 1 ? 's' : ''}. Please wait for current generations to complete.`);
    //     return;
    //   }
    // } catch (error) {
    //   console.error("Concurrency check failed:", error);
    //   // Continue anyway - the backend will handle the final check
    // }

    setIsSubmitting(true);

    try {
      // Step 1: Upload files to Convex storage
      let inputAssets = [];
      const allFiles = Object.values(filesByField).flat();
      
      if (allFiles.length > 0) {
        toast.info("Uploading files...");
        const uploadResults = await uploadMultipleFiles(allFiles, "flow-input");
        
        inputAssets = uploadResults.map((result) => ({
          url: result.url, // This is the storageId
          storageId: result.storageId,
          type: allFiles.find(f => f.name === result.filename)?.type.startsWith('image/') ? 'image' : 'file',
          filename: result.filename,
          size: allFiles.find(f => f.name === result.filename)?.size || 0,
        }));
      }

      // Step 2: Create generation record
      const generationId = await createGeneration({
        clerkId: user.id,
        flowId,
        inputData: formData,
        inputAssets,
      });

      setCurrentGenerationId(generationId);
      toast.success("Generation started successfully!");

      // Step 3: Trigger n8n workflow
      await fetch('/api/trigger-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          generationId, 
          flowId, 
          inputData: formData, 
          inputAssets,
          n8nWorkflowId: flow.n8nWorkflowId 
        }),
      });

    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to start generation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setCurrentGenerationId(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/home">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Flows
                </Button>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-border"></div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-medium text-foreground tracking-tight truncate">{flow.title}</h1>
                <p className="text-xs text-muted-foreground">{flow.category}</p>
              </div>
            </div>
            
            {/* Status Panel */}
            <div className="bg-card/60 border border-border rounded-lg backdrop-blur-sm shadow-md">
              <div className="px-4 py-2">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-chart-1 rounded-full ring-2 ring-chart-1/20"></div>
                    <span className="text-card-foreground capitalize hidden sm:inline">{subscription.planId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-medium">{subscription.credits}</span>
                  </div>
                  <div className="text-muted-foreground hidden md:block">
                    Cost: {flow.creditsPerGeneration}
                  </div>
                  {!hasEnoughCredits && (
                    <span className="text-destructive font-medium text-xs">Low credits</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Left Pane - Form */}
        <div className="flex-1 lg:w-1/2 bg-muted/20 border-b lg:border-b-0 lg:border-r border-border">
          <div className="h-full overflow-y-auto scrollbar-thin">
            <div className="max-w-xl mx-auto p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-foreground mb-2">
                  Configure Workflow
                </h2>
                <p className="text-sm text-muted-foreground">
                  Customize the parameters for your AI generation
                </p>
              </div>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <FlowForm 
                    flow={flow} 
                    onSubmit={handleFormSubmit}
                    isSubmitting={isSubmitting || isUploading}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Pane - Preview/Results */}
        <div className="flex-1 lg:w-1/2 bg-muted/10">
          <div className="h-full overflow-y-auto scrollbar-thin">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-foreground mb-2">
                  Generation Results
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your AI-generated content will appear here
                </p>
              </div>

              {currentGenerationId ? (
                <div className="w-full">
                  <GenerationStatus 
                    generationId={currentGenerationId}
                    onRetry={handleRetry}
                  />
                </div>
              ) : (
                <Card className="border-2 border-dashed border-border/60 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 rounded-lg">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-3 text-foreground">
                      Ready to Generate
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Complete the form configuration and click generate to start processing
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}