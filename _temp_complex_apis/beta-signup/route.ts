import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.userType || !data.name || !data.email) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    // Prepare data for Google Sheets
    const sheetData = {
      timestamp: data.timestamp,
      name: data.name,
      email: data.email,
      userType: data.userType,
      profession: data.profession || '',
      position: data.position || '',
      companyName: data.companyName || '',
      companySize: data.companySize || '',
      linkedinProfile: data.linkedinProfile || '',
    };

    // Send to Google Sheets
    const googleSheetsResponse = await fetch('https://api.sheetson.com/v2/sheets/' + process.env.GOOGLE_SHEET_ID, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SHEETSON_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Spreadsheet-Id': process.env.GOOGLE_SHEET_ID!
      },
      body: JSON.stringify(sheetData)
    });

    if (!googleSheetsResponse.ok) {
      console.error('Google Sheets error:', await googleSheetsResponse.text());
      
      // Fallback: Send to webhook URL if Google Sheets fails
      if (process.env.BACKUP_WEBHOOK_URL) {
        await fetch(process.env.BACKUP_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetData)
        });
      }
      
      throw new Error('Failed to save to Google Sheets');
    }

    // Mark user as having completed beta signup
    await convex.mutation(api.users.markBetaSignupComplete, {
      clerkId: userId
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Beta signup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit beta signup" },
      { status: 500 }
    );
  }
}