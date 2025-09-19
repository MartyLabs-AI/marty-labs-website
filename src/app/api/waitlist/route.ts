import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields - flexible validation for different form types
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Prepare data for Google Sheets Apps Script
    const waitlistData = {
      email: body.email,
      name: body.name || '',
      company: body.company || '',
      role: body.role || '',
      videoGenerations: body.videoGenerations || '',
      companySize: body.companySize || '',
      whatsapp: body.whatsapp || '',
      linkedin: body.linkedin || '',
      useCase: body.useCase || '',
      priority: body.priority || 'Normal',
      source: body.source || 'website',
      timestamp: new Date().toISOString()
    };

    // Send to Google Sheets Apps Script
    const response = await fetch(process.env.GOOGLE_SHEETS_WAITLIST_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(waitlistData)
    });

    if (!response.ok) {
      console.error('Google Sheets Apps Script error:', response.statusText);
      // Fallback: Log to console if Google Sheets fails
      console.log('Waitlist submission (fallback):', waitlistData);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully joined the Producer Agent waitlist!' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Waitlist API error:', error);
    
    // Log the data even if there's an error
    console.log('Waitlist submission (error fallback):', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}