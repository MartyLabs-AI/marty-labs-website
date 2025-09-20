import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields - match popup field names
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const department = formData.get('department') as string;
    const roleDescription = formData.get('roleDescription') as string;
    const achievements = formData.get('achievements') as string;
    const linkedin = formData.get('linkedin') as string;
    const timestamp = formData.get('timestamp') as string;
    const resume = formData.get('resume') as File;

    // Validate required fields
    if (!name || !phone || !department || !roleDescription) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, department, and role description are required' },
        { status: 400 }
      );
    }

    // Handle resume file upload (store basic info)
    let resumeInfo = '';
    if (resume) {
      // For now, we'll just store the filename and size
      // In production, you'd upload to cloud storage (Cloudinary, AWS S3, etc.)
      resumeInfo = `${resume.name} (${Math.round(resume.size / 1024)}KB)`;
    }

    // Prepare data for Google Sheets Apps Script (matching your script exactly)
    const hiringData = {
      Name: name,
      Phone: phone,
      Position: department,  // Your script expects "Position", not "department"
      "Role Description": roleDescription,
      LinkedIn: linkedin || '',
      Achievements: achievements || '',
      Resume: resumeInfo || 'No resume uploaded'
    };

    // Log data to console
    console.log('=== HIRING APPLICATION RECEIVED ===');
    console.log(hiringData);
    console.log('=====================================');

    // Send to Google Apps Script
    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwHLZkz7rwBczTlLKFI-aJJfV6Cx3d8kTqxqHoWmUyAQJMI0hJLLFGUZyE-3LLcQDmU/exec';
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hiringData)
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
        message: 'Application submitted successfully! We will review your application and get back to you soon.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Hiring API error:', error);
    
    // Log the data even if there's an error
    console.log('Hiring submission (error fallback):', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Failed to process application. Please try again later.' },
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