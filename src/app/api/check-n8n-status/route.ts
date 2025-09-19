import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Fallback endpoint to check N8N execution status when callbacks fail
export async function POST(request: NextRequest) {
  try {
    const { generationId, n8nExecutionId } = await request.json();

    if (!generationId || !n8nExecutionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check N8N API for execution status (if N8N provides status API)
    // This would be N8N-specific implementation
    const n8nApiUrl = `${process.env.N8N_API_BASE_URL}/executions/${n8nExecutionId}`;
    
    try {
      const n8nResponse = await fetch(n8nApiUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
        },
      });

      if (n8nResponse.ok) {
        const executionData = await n8nResponse.json();
        
        // Map N8N status to our status
        let status = "processing";
        let progress = 50;
        
        if (executionData.finished === true && executionData.mode === "manual") {
          if (executionData.stoppedAt && !executionData.error) {
            status = "completed";
            progress = 100;
          } else if (executionData.error) {
            status = "failed";
          }
        } else if (executionData.stoppedAt && executionData.error) {
          status = "failed";
        }

        // Update generation with polled status
        await convex.mutation(api.generations.updateGenerationStatus, {
          generationId,
          status,
          progress,
          ...(status === "failed" && { 
            errorMessage: executionData.error?.message || "N8N workflow failed" 
          }),
        });

        return NextResponse.json({ 
          success: true, 
          status,
          executionData: {
            finished: executionData.finished,
            error: executionData.error?.message,
          }
        });
      }
    } catch {
      console.log("N8N API not available, using fallback timeout logic");
      
      // Fallback: check if generation is too old and mark as failed
      const generation = await convex.query(api.generations.getGenerationById, {
        generationId,
      });

      if (generation) {
        const now = Date.now();
        const maxTime = 15 * 60 * 1000; // 15 minutes
        
        if (now - generation.updatedAt > maxTime) {
          await convex.mutation(api.generations.updateGenerationStatus, {
            generationId,
            status: "failed",
            errorMessage: "Workflow timeout - no response after 15 minutes",
          });
          
          return NextResponse.json({ 
            success: true, 
            status: "failed",
            reason: "timeout" 
          });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Status check completed, no updates needed" 
    });

  } catch (error) {
    console.error("N8N status check error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Status check failed" },
      { status: 500 }
    );
  }
}