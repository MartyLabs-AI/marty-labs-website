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

    // Prepare data for Google Sheets Apps Script
    const hiringData = {
      timestamp: timestamp || new Date().toISOString(),
      name,
      phone,
      department,
      roleDescription,
      achievements: achievements || '',
      linkedin: linkedin || '',
      resumeInfo,
      source: 'website'
    };

    // Log data to console (Google Sheets integration will work in production)
    console.log('=== HIRING APPLICATION RECEIVED ===');
    console.log(hiringData);
    console.log('=====================================');

    // Try to send to Google Sheets, but don't fail if it doesn't work
    try {
      if (process.env.GOOGLE_SHEETS_HIRING_URL) {
        const response = await fetch(process.env.GOOGLE_SHEETS_HIRING_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(hiringData)
        });
        
        if (!response.ok) {
          console.log('Google Sheets error, but continuing...');
        }
      }
    } catch (error) {
      console.log('Google Sheets unavailable, data logged to console');
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