import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    console.log("Seeding flows...");
    
    // Call the Convex seedFlows mutation
    const result = await convex.mutation(api.flows.seedFlows, {});
    
    console.log("Flows seeded successfully:", result);
    
    return NextResponse.json({ 
      success: true, 
      message: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Flow seeding error:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to seed flows",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Allow GET requests too for easy browser testing
  return POST(request);
}