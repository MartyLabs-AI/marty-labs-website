"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Clock, Download, RefreshCw, AlertCircle, RotateCcw, StopCircle } from "lucide-react";
import { Id } from "@/../convex/_generated/dataModel";
import { toast } from "sonner";

interface GenerationStatusProps {
  generationId: Id<"generations">;
  onRetry?: () => void;
}

export function GenerationStatus({ generationId, onRetry }: GenerationStatusProps) {
  const generation = useQuery(api.generations.getGenerationById, { generationId });
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>("");
  const cancelGeneration = useMutation(api.generations.updateGenerationStatus);

  useEffect(() => {
    if (!generation || generation.status === "completed" || generation.status === "failed") {
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - generation.createdAt) / 1000);
      setTimeElapsed(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [generation]);

  // Fallback polling for stuck generations
  useEffect(() => {
    if (!generation || generation.status !== "processing" || !generation.n8nExecutionId) {
      return;
    }

    // Start polling after 5 minutes of processing
    const shouldStartPolling = Date.now() - generation.updatedAt > 5 * 60 * 1000;
    if (!shouldStartPolling) return;

    const pollInterval = setInterval(async () => {
      try {
        // Only poll if still processing and has been a while since last update
        const timeSinceUpdate = Date.now() - generation.updatedAt;
        if (timeSinceUpdate > 2 * 60 * 1000) { // 2 minutes since last update
          await fetch('/api/check-n8n-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              generationId: generation._id,
              n8nExecutionId: generation.n8nExecutionId,
            }),
          });
        }
      } catch (error) {
        console.error('Fallback status check failed:', error);
      }
    }, 60 * 1000); // Poll every minute

    return () => clearInterval(pollInterval);
  }, [generation]);

  // Update current step based on progress
  useEffect(() => {
    if (!generation) return;
    
    const progress = generation.progress || 0;
    if (progress < 20) setCurrentStep("Initializing workflow...");
    else if (progress < 40) setCurrentStep("Processing input files...");
    else if (progress < 60) setCurrentStep("Running AI processing...");
    else if (progress < 80) setCurrentStep("Generating output...");
    else if (progress < 100) setCurrentStep("Finalizing results...");
    else setCurrentStep("Complete!");
  }, [generation]);

  if (!generation) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2">Loading generation status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (generation.status) {
      case "queued":
        return <Clock className="w-5 h-5 text-chart-3" />;
      case "processing":
        return <RefreshCw className="w-5 h-5 animate-spin text-secondary" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-chart-1" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (generation.status) {
      case "queued": return "bg-chart-3/10 text-chart-3 border-chart-3/20";
      case "processing": return "bg-secondary/10 text-secondary border-secondary/20";
      case "completed": return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      case "failed": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/50 text-muted-foreground border-border";
    }
  };

  const handleDownload = async (asset: {
    url: string;
    filename: string;
    type: string;
    size: number;
    format: string;
  }) => {
    try {
      let downloadUrl = asset.url;
      
      // If the URL is a Convex storage ID, resolve it to actual URL
      if (asset.url && asset.url.startsWith('j')) { // Convex IDs start with letters
        // In a real implementation, you'd use a query to get the actual URL
        // For now, we'll construct the URL based on the storage pattern
        downloadUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/file?storageId=${asset.url}`;
      }
      
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = asset.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Downloaded ${asset.filename}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download file");
    }
  };

  const handleDownloadAll = async () => {
    if (!generation.outputAssets) return;
    
    for (const asset of generation.outputAssets) {
      await handleDownload(asset);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelGeneration({
        generationId,
        status: "failed",
        errorMessage: "Cancelled by user",
      });
      toast.success("Generation cancelled");
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error("Failed to cancel generation");
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  const isStuck = () => {
    if (!generation) return false;
    const maxTime = 15 * 60; // 15 minutes in seconds
    return timeElapsed > maxTime && (generation.status === "processing" || generation.status === "queued");
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-lg">
                {generation.flow?.title || "Generation"}
              </CardTitle>
              <CardDescription>
                Started {new Date(generation.createdAt).toLocaleString()}
              </CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor()}>
            {generation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        {(generation.status === "processing" || generation.status === "queued") && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{generation.progress}%</span>
            </div>
            <Progress value={generation.progress} className="w-full" />
            
            {/* Current Step */}
            {generation.status === "processing" && currentStep && (
              <div className="flex items-center space-x-2 text-sm text-secondary">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{currentStep}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Time elapsed: {formatTime(timeElapsed)}</span>
              {generation.flow?.estimatedProcessingTime && (
                <span>Est. total: {formatTime(generation.flow.estimatedProcessingTime)}</span>
              )}
            </div>
            
            {/* N8N Execution ID for debugging */}
            {generation.n8nExecutionId && (
              <div className="text-xs text-muted-foreground">
                Execution ID: {generation.n8nExecutionId}
              </div>
            )}
            
            {/* Action buttons for processing/stuck generations */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <StopCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              {isStuck() && (
                <Badge variant="destructive" className="ml-2">
                  Workflow may be stuck ({formatTime(timeElapsed)} elapsed)
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Processing Time */}
        {generation.status === "completed" && generation.processingStartedAt && generation.processingCompletedAt && (
          <div className="text-sm text-muted-foreground">
            Processing completed in {formatTime(
              Math.floor((generation.processingCompletedAt - generation.processingStartedAt) / 1000)
            )}
          </div>
        )}

        {/* Error Message */}
        {generation.status === "failed" && generation.errorMessage && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Generation Failed</p>
                <p className="text-sm text-destructive/80 mt-1">{generation.errorMessage}</p>
                {onRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="mt-2 text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Output Assets */}
        {generation.status === "completed" && generation.outputAssets && (
          <div className="space-y-3">
            <Separator />
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Generated Assets ({generation.outputAssets.length})</h4>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadAll}
              >
                <Download className="w-4 h-4 mr-1" />
                Download All
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {generation.outputAssets.map((asset, index) => (
                <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
                  {/* Preview Section */}
                  <div className="bg-muted/30 p-4">
                    {asset.type === 'video' && (
                      <video 
                        controls 
                        className="w-full max-h-80 rounded-lg bg-black"
                        preload="metadata"
                      >
                        <source src={asset.url} type={`video/${asset.format}`} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {asset.type === 'image' && (
                      <img 
                        src={asset.url} 
                        alt={asset.filename}
                        className="w-full max-h-80 object-contain rounded-lg"
                      />
                    )}
                    {asset.type !== 'video' && asset.type !== 'image' && (
                      <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
                        <div className="text-center">
                          <Download className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">File ready for download</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Info and Download Section */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{asset.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {asset.format.toUpperCase()} • {(asset.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(asset)}
                        className="ml-4"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Credits used: {generation.creditsUsed}
          </div>
          {generation.status === "failed" && onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}