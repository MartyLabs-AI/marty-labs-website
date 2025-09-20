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

    // Prepare data for Google Sheets Apps Script (matching ALL form fields)
    const waitlistData = {
      Name: body.name || 'Not provided',
      Role: body.role || 'Not provided',
      'Video Generations': body.videoGenerations || 'Not provided',
      'Company Size': body.companySize || 'Not provided',
      WhatsApp: body.whatsapp || 'Not provided',
      Email: body.email || 'Not provided',
      Company: body.company || 'Not provided',
      'Use Case': body.useCase || 'Not provided',
      LinkedIn: body.linkedin || 'Not provided'
    };

    // Log data to console
    console.log('=== WAITLIST SIGNUP RECEIVED ===');
    console.log(waitlistData);
    console.log('=================================');

    // Send to Google Apps Script
    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxAgmeMAeA0CNFvBs9hLMzDQaaBQABvDulgL4gHq6E1-nLobKexu4SxxyDvJ-y4J2KTCg/exec';
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(waitlistData)
      });

      if (!response.ok) {
        console.error('Google Apps Script error:', response.status, response.statusText);
      } else {
        console.log('Successfully sent to Google Sheets');
      }
    } catch (error) {
      console.error('Failed to send to Google Sheets:', error);
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