"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { ConvexHttpClient } from "convex/browser";
import { useUser, UserButton } from "@clerk/nextjs";
import { api } from "@/../convex/_generated/api";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertTriangle, Sparkles, Bot, Beaker, CreditCard, Zap } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Id } from "@/../convex/_generated/dataModel";
import { useFileUpload } from "@/lib/use-file-upload";
import { ThemeToggle } from "@/components/theme-toggle";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ProducerAgentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const flowId = "producer-agent-beta"; // Static flowId for this page
  
  const [currentGenerationId, setCurrentGenerationId] = useState<Id<"generations"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<{
    status: string;
    progress: number;
    currentStep?: string;
    response?: string;
    outputAssets?: Array<{
      url: string;
      type: string;
      filename: string;
    }>;
  } | null>(null);

  const flow = useQuery(api.flows.getFlowById, { flowId });
  const userWithSubscription = useQuery(
    api.users.getUserWithSubscription, 
    user ? { clerkId: user.id } : "skip"
  );
  const createGeneration = useMutation(api.generations.createGeneration);
  const { uploadMultipleFiles, isUploading } = useFileUpload();
  
  // Add conversation management
  const [conversationKey, setConversationKey] = useState(0);
  const [forceNewConversation, setForceNewConversation] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Poll generation status
  const generation = useQuery(
    api.generations.getGenerationById,
    currentGenerationId ? { generationId: currentGenerationId } : "skip"
  );

  // Update status when generation changes
  useEffect(() => {
    if (generation) {
      console.log('Generation status update:', generation);
      console.log('Generation response:', generation.response);
      setGenerationStatus({
        status: generation.status,
        progress: generation.progress || 0,
        currentStep: generation.currentStep,
        response: generation.response,
        outputAssets: generation.outputAssets,
      });
      
      // Stop polling when complete, failed, or cancelled
      if (["completed", "failed", "cancelled"].includes(generation.status)) {
        setIsSubmitting(false);
        console.log('Generation completed with response:', generation.response);
        
        // Force update the chat interface with the final status
        if (generation.status === "completed") {
          console.log('Forcing generationStatus update for completed generation');
        }
      }
    }
  }, [generation]);

  // Add timeout handling for stuck generations
  useEffect(() => {
    if (!isSubmitting || !currentGenerationId) return;

    const timeout = setTimeout(async () => {
      console.log('Generation timeout reached, checking status...');
      const gen = await convex.query(api.generations.getGenerationById, {
        generationId: currentGenerationId
      });
      
      if (gen && ["queued", "processing"].includes(gen.status)) {
        console.log('Generation appears stuck, updating to failed status');
        await convex.mutation(api.generations.updateGenerationStatus, {
          generationId: currentGenerationId,
          status: "failed",
          errorMessage: "Generation timed out - no response from workflow"
        });
        setIsSubmitting(false);
      }
    }, 120000); // 2 minute timeout

    return () => clearTimeout(timeout);
  }, [isSubmitting, currentGenerationId]);

  const isLoading = flow === undefined || userWithSubscription === undefined;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background font-mono">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Welcome to Marty Labs!</h3>
            <p className="text-muted-foreground mb-4">Please sign in to access your creative workspace.</p>
            <Link href="/sign-in">
              <Button className="w-full">Sign In to Continue</Button>
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
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  if (!flow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background font-mono">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-chart-3 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Flow Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested flow does not exist or is not available.
            </p>
            <Link href="/home">
              <Button>Browse Flows</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userWithSubscription?.subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background font-mono">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-chart-3 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Subscription Required</h3>
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

  const handleSendMessage = async (message: string, files: File[]) => {
    // DEVELOPMENT MODE - ALL RESTRICTIONS DISABLED
    // if (!hasEnoughCredits) {
    //   toast.error("Insufficient credits. Please upgrade your plan.");
    //   return;
    // }

    // if (!hasPlanAccess) {
    //   toast.error(`This flow requires ${flow.requiredPlan} plan or higher.`);
    //   return;
    // }

    setIsSubmitting(true);

    try {
      // Step 1: Upload files to Convex storage
      let inputAssets = [];
      
      if (files.length > 0) {
        toast.info("Uploading files...");
        const uploadResults = await uploadMultipleFiles(files, "flow-input");
        
        inputAssets = uploadResults.map((result) => ({
          url: result.url, // This is the storageId
          storageId: result.storageId,
          type: files.find(f => f.name === result.filename)?.type.startsWith('image/') ? 'image' : 'file',
          filename: result.filename,
          size: files.find(f => f.name === result.filename)?.size || 0,
        }));
      }

      // Step 2: Create generation record with prompt and files
      const generationId = await createGeneration({
        clerkId: user.id,
        flowId,
        inputData: { prompt: message },
        inputAssets,
      });

      setCurrentGenerationId(generationId);
      toast.success("Producer Agent request started!");

      // Step 3: Trigger N8N workflow
      console.log('About to trigger N8N with inputAssets:', JSON.stringify(inputAssets, null, 2));
      
      await fetch('/api/trigger-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          generationId, 
          flowId, 
          inputData: { prompt: message },
          inputAssets,
          n8nWorkflowId: flow.n8nWorkflowId 
        }),
      });

      return { 
        generationId,
        inputAssets: inputAssets.map(asset => ({
          url: asset.url,
          type: asset.type,
          filename: asset.filename
        }))
      };
    } catch (error) {
      console.error('Chat message error:', error);
      setIsSubmitting(false);
      toast.error(error instanceof Error ? error.message : "Failed to send message");
      throw error;
    }
  };

  const handleCancelGeneration = async (generationId: string) => {
    try {
      const response = await fetch('/api/cancel-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel generation');
      }

      setCurrentGenerationId(null);
      setIsSubmitting(false);
      setGenerationStatus(null);
    } catch (error) {
      console.error('Cancel generation error:', error);
      throw error;
    }
  };

  const handleNewConversation = () => {
    // Reset all states and force ChatInterface to recreate with new conversation
    setCurrentGenerationId(null);
    setIsSubmitting(false);
    setGenerationStatus(null);
    setCurrentConversationId(null);
    setForceNewConversation(true); // Force creating a new conversation
    setConversationKey(prev => prev + 1); // This will force ChatInterface to remount
    toast.success("New conversation started");
    
    // Reset the flags after a brief delay to allow the component to remount
    setTimeout(() => {
      setForceNewConversation(false);
    }, 500);
  };

  const handleConversationSelect = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setCurrentGenerationId(null);
    setIsSubmitting(false);
    setGenerationStatus(null);
    setConversationKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/home">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Flows
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Producer Agent
                  </h1>
                  <p className="text-xs text-muted-foreground">AI Creative Studio</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              {subscription && (
                <div className="hidden md:flex items-center space-x-6 text-sm bg-card/60 border border-border px-4 py-2 rounded-full backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="font-medium">{subscription.credits} credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-secondary" />
                    <span>Cost: {flow.creditsPerGeneration}</span>
                  </div>
                </div>
              )}
              
              <ThemeToggle />
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area with Dot Matrix Background and Left Sidebar */}
      <div className="flex h-[calc(100vh-73px)] relative">
        {/* Dot Matrix Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.3) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px'
          }}
        />
        
        {/* Left Sidebar */}
        <div className="relative z-10">
          <ConversationSidebar
            flowId={flowId}
            currentConversationId={currentConversationId}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
          />
        </div>

        {/* Main Chat Interface */}
        <div className="flex-1 p-6 relative z-10">
          <div className="h-full">
            <ChatInterface
              key={conversationKey}
              onSendMessage={handleSendMessage}
              onCancelGeneration={handleCancelGeneration}
              isProcessing={isSubmitting}
              flowId={flowId}
              forceNewConversation={forceNewConversation}
              currentStatus={generationStatus ? {
                status: generationStatus.status,
                progress: generationStatus.progress,
                currentStep: generationStatus.currentStep,
                response: generationStatus.response,
                outputAssets: generationStatus.outputAssets
              } : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}