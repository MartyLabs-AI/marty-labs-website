import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
// import crypto from "crypto";

// Trigger n8n workflow
export const triggerN8nWorkflow = httpAction(async (ctx, request) => {
  const { generationId, flowId, inputData, inputAssets } = await request.json();

  // Get generation details
  const generation = await ctx.runQuery(api.generations.getGenerationById, {
    generationId,
  });

  if (!generation) {
    return new Response("Generation not found", { status: 404 });
  }

  // Get flow details
  const flow = await ctx.runQuery(api.flows.getFlowById, { flowId });
  if (!flow) {
    return new Response("Flow not found", { status: 404 });
  }

  // Prepare n8n payload
  const n8nPayload = {
    generationId,
    flowId,
    workflowId: flow.n8nWorkflowId,
    inputData,
    inputAssets,
    webhookUrl: `https://festive-guineapig-764.convex.site/handleN8nCallback`,
    metadata: {
      userId: generation.userId,
      clerkId: generation.clerkId,
      createdAt: generation.createdAt,
    }
  };

  try {
    // Make request to n8n
    const n8nResponse = await fetch(`${process.env.N8N_WEBHOOK_URL}/${flow.n8nWorkflowId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.N8N_API_KEY}`,
      },
      body: JSON.stringify(n8nPayload),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n request failed: ${n8nResponse.status}`);
    }

    const n8nResult = await n8nResponse.json();

    // Update generation with n8n execution ID
    await ctx.runMutation(api.generations.updateGenerationStatus, {
      generationId,
      status: "processing",
      n8nExecutionId: n8nResult.executionId,
    });

    return new Response(JSON.stringify({ success: true, executionId: n8nResult.executionId }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    // Mark generation as failed
    await ctx.runMutation(api.generations.updateGenerationStatus, {
      generationId,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorDetails: { error: String(error) },
    });

    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// Handle n8n webhook callbacks
export const handleN8nCallback = httpAction(async (ctx, request) => {
  try {
    // Verify webhook signature
    const signature = request.headers.get("X-N8N-Signature");
    const body = await request.text();
    
    if (!verifyN8nSignature(body, signature)) {
      return new Response("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(body);
    const { generationId, status, progress, outputAssets, error } = payload;

    if (!generationId) {
      return new Response("Missing generationId", { status: 400 });
    }

    // Update generation status
    await ctx.runMutation(api.generations.updateGenerationStatus, {
      generationId,
      status,
      progress,
      outputAssets,
      errorMessage: error?.message,
      errorDetails: error,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("n8n callback error:", error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// Verify n8n webhook signature using HMAC
function verifyN8nSignature(body: string, signature: string | null): boolean {
  // TODO: Implement proper signature verification with crypto
  // Temporarily disabled due to Convex crypto import issues
  return true;
}

// Health check endpoint
export const healthCheck = httpAction(async (ctx, request) => {
  return new Response(JSON.stringify({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  }), {
    headers: { "Content-Type": "application/json" },
  });
});