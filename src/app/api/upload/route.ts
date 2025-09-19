import { NextRequest, NextResponse } from "next/server";

// This route is now deprecated - use Convex file upload directly from the frontend
// Keep it for backward compatibility, but redirect to use the new Convex system

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "This endpoint is deprecated. Use Convex file upload directly from the frontend.",
      migration: "Use the useFileUpload hook instead"
    }, 
    { status: 410 }
  );
}