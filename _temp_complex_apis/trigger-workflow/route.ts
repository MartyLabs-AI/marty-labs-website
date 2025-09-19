import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { 
  validateWorkflowCredits, 
  refundGenerationCredits,
  updateGenerationStats,
  SERVICE_TYPES 
} from "@/lib/subscription-manager";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  let transactionId: string | undefined;
  let creditsDeducted = 0;
  let clerkId: string | undefined;
  let generationId: string | undefined;
  
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { generationId: genId, flowId, inputData, inputAssets, n8nWorkflowId } = await request.json();
    generationId = genId;
    clerkId = userId;

    if (!generationId || !flowId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 0: Validate credits and deduct before processing
    console.log('🔍 Validating credits for generation:', { generationId, flowId, clerkId });
    
    // Map flowId to service type
    let serviceType: 'image' | 'video' | 'talking_head';
    if (flowId.includes('i2i') || flowId.includes('image')) {
      serviceType = SERVICE_TYPES.IMAGE;
    } else if (flowId.includes('video') || flowId.includes('i2v')) {
      serviceType = SERVICE_TYPES.VIDEO;
    } else if (flowId.includes('talking') || flowId.includes('avatar')) {
      serviceType = SERVICE_TYPES.TALKING_HEAD;
    } else {
      // Default to image for unknown flow types
      serviceType = SERVICE_TYPES.IMAGE;
    }

    const creditValidation = await validateWorkflowCredits(
      clerkId,
      serviceType,
      generationId,
      1 // quantity - could be dynamic based on inputData
    );

    if (!creditValidation.canProceed) {
      console.log('❌ Credit validation failed:', creditValidation.message);
      
      // Update generation status to failed due to insufficient credits
      await convex.mutation(api.generations.updateGenerationStatus, {
        generationId,
        status: "failed",
        errorMessage: creditValidation.message,
      });
      
      return NextResponse.json(
        { 
          error: "Insufficient credits", 
          message: creditValidation.message 
        },
        { status: 402 } // Payment required
      );
    }

    transactionId = creditValidation.transactionId;
    creditsDeducted = creditValidation.creditsDeducted || 0;
    
    console.log('✅ Credits validated and deducted:', {
      transactionId,
      creditsDeducted,
      serviceType
    });

    console.log('Triggering N8N workflow:', { generationId, flowId, n8nWorkflowId });
    console.log('Input assets received:', JSON.stringify(inputAssets, null, 2));

    // Step 1: Update generation status to processing
    await convex.mutation(api.generations.updateGenerationStatus, {
      generationId,
      status: "processing",
      progress: 10,
    });

    // Step 2: Convert storage IDs to public URLs for N8N
    const inputAssetsWithUrls = await Promise.all(
      (inputAssets || []).map(async (asset: { storageId: string; type: string; filename: string }) => {
        console.log(`Converting storageId to URL for asset: ${asset.filename}`, asset.storageId);
        const publicUrl = await convex.query(api.files.getFileUrl, { 
          storageId: asset.storageId as Id<"_storage">
        });
        console.log(`Got public URL for ${asset.filename}:`, publicUrl);
        return {
          ...asset,
          url: publicUrl?.trim(), // Replace storageId with actual public URL and trim any whitespace
        };
      })
    );
    
    console.log('Assets with URLs for N8N:', JSON.stringify(inputAssetsWithUrls, null, 2));

    // Step 3: Prepare webhook data for N8N (flat structure)
    const webhookData = {
      generationId,
      flowId,
      inputData,
      inputAssets: inputAssetsWithUrls,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/n8n-callback`,
      secret: process.env.N8N_WEBHOOK_SECRET,
      clerkId, // Pass user ID for billing statistics
      timestamp: Date.now(), // Start time for processing duration calculation
    };

    // Step 4: Determine the correct N8N webhook URL based on flow
    let webhookUrl = process.env.N8N_WEBHOOK_URL!; // Default
    
    // Route to specific workflow webhooks
    if (flowId === 'i2i-transformer') {
      webhookUrl = process.env.N8N_I2I_WEBHOOK_URL!;
    } else if (flowId === 'producer-agent-beta') {
      // For Producer Agent, we need to add a new webhook URL
      webhookUrl = process.env.N8N_PRODUCER_AGENT_WEBHOOK_URL || 'https://pringlenotpringle.app.n8n.cloud/webhook/55dc1e10-f35e-45f1-a2d6-3505827b141b';
    }
    // Add more workflows here as needed
    
    console.log(`Calling N8N webhook for ${flowId}: ${webhookUrl}`);
    console.log('Webhook payload:', JSON.stringify(webhookData, null, 2));

    // Step 5: Call N8N webhook
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
        'X-Workflow-ID': n8nWorkflowId,
      },
      body: JSON.stringify(webhookData),
    });

    console.log(`N8N Response Status: ${n8nResponse.status}`);
    
    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`N8N webhook failed: ${n8nResponse.status} - ${errorText}`);
      throw new Error(`N8N webhook failed: ${n8nResponse.status} - ${errorText}`);
    }

    const n8nResult = await n8nResponse.json();
    console.log('N8N Response:', n8nResult);
    
    const executionId = n8nResult.executionId || `exec_${Date.now()}`;

    // Step 6: Update generation with execution ID
    await convex.mutation(api.generations.updateGenerationStatus, {
      generationId,
      status: "processing",
      progress: 25,
      n8nExecutionId: executionId,
    });

    // Step 7: Add a safety check - if N8N returns an error immediately, update status and refund credits
    if (n8nResult.error || n8nResult.status === 'failed' || n8nResult.status === 'error') {
      console.log('❌ N8N workflow failed immediately, refunding credits...');
      
      if (clerkId && generationId) {
        await refundGenerationCredits(
          clerkId,
          generationId,
          'N8N workflow failed immediately'
        );
        
        // Update stats with failure
        await updateGenerationStats(
          clerkId,
          serviceType,
          0, // No processing time since it failed immediately
          false // Failed
        );
      }
      
      await convex.mutation(api.generations.updateGenerationStatus, {
        generationId,
        status: "failed",
        errorMessage: n8nResult.error || 'N8N workflow failed immediately',
      });
    }

    return NextResponse.json({
      success: true,
      executionId,
      creditsDeducted,
      transactionId,
      serviceType,
      message: creditValidation.message
    });

  } catch (error) {
    console.error("Workflow trigger error:", error);
    
    // Refund credits if they were deducted
    if (clerkId && generationId && creditsDeducted > 0) {
      console.log('🔄 Refunding credits due to workflow error...');
      try {
        await refundGenerationCredits(
          clerkId,
          generationId,
          `Workflow trigger failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      } catch (refundError) {
        console.error('Failed to refund credits:', refundError);
      }
    }
    
    // Update generation status to failed
    if (generationId) {
      try {
        await convex.mutation(api.generations.updateGenerationStatus, {
          generationId,
          status: "failed",
          errorMessage: error instanceof Error ? error.message : 'Workflow trigger failed',
        });
      } catch (updateError) {
        console.error('Error updating generation status:', updateError);
      }
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to trigger workflow",
        creditsRefunded: creditsDeducted > 0
      },
      { status: 500 }
    );
  }
}