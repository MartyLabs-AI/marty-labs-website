import { NextRequest, NextResponse } from "next/server";
// TODO: Re-enable when implementing convex backend
// import { ConvexHttpClient } from "convex/browser";
// import { api } from "@/../convex/_generated/api";
// import { 
//   refundGenerationCredits, 
//   updateGenerationStats,
//   SERVICE_TYPES 
// } from "@/lib/subscription-manager";

// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  // TODO: Implement when convex backend is ready
  return NextResponse.json(
    { error: 'N8N callback API not yet implemented' },
    { status: 501 }
  );
  
  /* ORIGINAL IMPLEMENTATION - RESTORE WHEN CONVEX IS READY
  try {
    const body = await request.json();
    const signature = request.headers.get("x-n8n-signature");

    // Verify webhook signature if provided
    if (process.env.N8N_WEBHOOK_SECRET && signature) {
      // Add signature verification logic here if needed
    }

    console.log("N8N callback received:", body);

    const { 
      generationId, 
      status, 
      progress, 
      executionId,
      outputAssets, 
      error: errorMessage,
      step,
      response,
      processingTime,
      serviceType,
      clerkId 
    } = body;

    if (!generationId) {
      return NextResponse.json({ error: "Missing generationId" }, { status: 400 });
    }

    // Map N8N status to our status
    let mappedStatus = status;
    if (status === 'running') mappedStatus = 'processing';
    if (status === 'success') mappedStatus = 'completed';
    if (status === 'error' || status === 'failed') mappedStatus = 'failed';

    // Calculate progress based on step or use provided progress
    let calculatedProgress = progress;
    
    // Convert string progress to number if needed
    if (typeof calculatedProgress === 'string') {
      calculatedProgress = parseFloat(calculatedProgress);
    }
    
    if (step && !calculatedProgress) {
      // Map workflow steps to progress percentages
      const stepProgressMap: { [key: string]: number } = {
        'input_validation': 30,
        'processing_start': 40,
        'image_processing': 60,
        'output_generation': 80,
        'finalization': 90,
        'completed': 100
      };
      calculatedProgress = stepProgressMap[step] || 50;
    }
    
    // Ensure progress is a valid number between 0-100
    if (isNaN(calculatedProgress) || calculatedProgress < 0) {
      calculatedProgress = 0;
    } else if (calculatedProgress > 100) {
      calculatedProgress = 100;
    }

    // Get generation details to extract user info if not provided
    let generationData = null;
    try {
      generationData = await convex.query(api.generations.getGenerationById, {
        generationId
      });
    } catch (error) {
      console.error('Failed to get generation data:', error);
    }

    const userClerkId = clerkId || generationData?.userId;
    
    // Determine service type from generation data if not provided
    let detectedServiceType: 'image' | 'video' | 'talking_head' = 'image';
    if (serviceType) {
      detectedServiceType = serviceType;
    } else if (generationData?.flowId) {
      const flowId = generationData.flowId;
      if (flowId.includes('i2i') || flowId.includes('image')) {
        detectedServiceType = SERVICE_TYPES.IMAGE;
      } else if (flowId.includes('video') || flowId.includes('i2v')) {
        detectedServiceType = SERVICE_TYPES.VIDEO;
      } else if (flowId.includes('talking') || flowId.includes('avatar')) {
        detectedServiceType = SERVICE_TYPES.TALKING_HEAD;
      }
    }
    
    // Calculate processing time if not provided
    const calculatedProcessingTime = processingTime || 
      (generationData?.createdAt ? Date.now() - generationData.createdAt : 0);

    // Update generation status
    try {
      await convex.mutation(api.generations.updateGenerationStatus, {
        generationId,
        status: mappedStatus,
        progress: calculatedProgress,
        ...(executionId && { n8nExecutionId: executionId }),
        ...(outputAssets && { outputAssets }),
        ...(errorMessage && { errorMessage }),
        ...(response && { response }),
      });

      console.log(`✅ Generation ${generationId} updated: ${mappedStatus} (${calculatedProgress}%)`);
    } catch (updateError) {
      console.error(`❌ Failed to update generation ${generationId}:`, updateError);
      throw updateError;
    }

    // Handle completion logic (success or failure)
    if (mappedStatus === 'completed' || mappedStatus === 'failed') {
      console.log(`🏁 Generation ${mappedStatus}: ${generationId}`);
      
      if (userClerkId) {
        try {
          // Update usage statistics
          await updateGenerationStats(
            userClerkId,
            detectedServiceType,
            calculatedProcessingTime,
            mappedStatus === 'completed'
          );
          
          console.log(`📊 Updated usage stats for ${userClerkId}: ${detectedServiceType}, ${calculatedProcessingTime}ms, success: ${mappedStatus === 'completed'}`);
          
          // Refund credits if generation failed
          if (mappedStatus === 'failed') {
            console.log(`💰 Refunding credits for failed generation: ${generationId}`);
            
            const refundResult = await refundGenerationCredits(
              userClerkId,
              generationId,
              `Generation failed: ${errorMessage || 'N8N workflow failed'}`
            );
            
            if (refundResult.success) {
              console.log(`✅ Credits refunded successfully: ${refundResult.message}`);
            } else {
              console.error(`❌ Failed to refund credits: ${refundResult.message}`);
            }
          }
        } catch (statsError) {
          console.error('Failed to update completion stats:', statsError);
        }
      } else {
        console.warn('No clerkId available for updating stats');
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Callback processed successfully",
      generationId,
      status: mappedStatus,
      progress: calculatedProgress,
      ...(mappedStatus === 'failed' && userClerkId && { creditsRefunded: true })
    });

  } catch (error) {
    console.error("N8N callback error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process callback" },
      { status: 500 }
    );
  }
  */
}