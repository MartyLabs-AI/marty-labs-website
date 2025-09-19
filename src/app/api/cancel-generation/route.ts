import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { generationId } = await request.json();

    if (!generationId) {
      return NextResponse.json(
        { error: "Missing generationId" },
        { status: 400 }
      );
    }

    console.log('Cancelling generation:', generationId);

    // Get generation details first
    const generation = await convex.query(api.generations.getGenerationById, {
      generationId: generationId as Id<"generations">,
    });

    if (!generation) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    // Cancel the generation in Convex
    await convex.mutation(api.generations.cancelGeneration, {
      generationId: generationId as Id<"generations">,
      clerkId: userId,
    });

    // Try to cancel the N8N execution if we have an execution ID
    if (generation.n8nExecutionId) {
      try {
        const cancelResponse = await fetch(`${process.env.N8N_API_URL}/executions/${generation.n8nExecutionId}/stop`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!cancelResponse.ok) {
          console.warn(`Failed to cancel N8N execution ${generation.n8nExecutionId}: ${cancelResponse.status}`);
        } else {
          console.log(`Successfully cancelled N8N execution ${generation.n8nExecutionId}`);
        }
      } catch (error) {
        console.error('Error cancelling N8N execution:', error);
        // Don't fail the entire request if N8N cancel fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Generation cancelled successfully",
    });

  } catch (error) {
    console.error("Cancel generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to cancel generation" },
      { status: 500 }
    );
  }
}