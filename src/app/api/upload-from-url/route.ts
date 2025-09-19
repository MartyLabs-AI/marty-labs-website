import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const { urls, generationId } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "URLs array is required" },
        { status: 400 }
      );
    }

    if (!generationId) {
      return NextResponse.json(
        { error: "Generation ID is required" },
        { status: 400 }
      );
    }

    // Upload each URL to Convex storage
    const uploadResults = [];
    
    for (const url of urls) {
      try {
        // Extract filename from URL or generate one
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const originalFilename = pathParts[pathParts.length - 1];
        
        // Generate filename based on URL and content type
        let filename = originalFilename || 'generated_file';
        if (!filename.includes('.')) {
          // Try to determine file type from URL patterns
          if (url.includes('fal.ai') || url.includes('.jpg') || url.includes('.jpeg')) {
            filename += '.jpg';
          } else if (url.includes('.png')) {
            filename += '.png';
          } else if (url.includes('.gif')) {
            filename += '.gif';
          } else if (url.includes('.webp')) {
            filename += '.webp';
          } else if (url.includes('.mp4')) {
            filename += '.mp4';
          } else {
            filename += '.jpg'; // default fallback
          }
        }

        console.log(`Uploading ${url} as ${filename} to Convex storage...`);
        
        // Upload to Convex storage
        const result = await convex.mutation(api.files.uploadFromUrl, {
          url,
          filename,
          purpose: "output"
        });

        uploadResults.push({
          originalUrl: url,
          convexUrl: result.url,
          storageId: result.storageId,
          filename: result.filename,
          size: result.size,
          type: result.contentType.startsWith('image/') ? 'image' : 
               result.contentType.startsWith('video/') ? 'video' : 'file'
        });

        console.log(`✅ Successfully uploaded ${filename} to Convex storage`);
      } catch (error) {
        console.error(`❌ Failed to upload ${url}:`, error);
        // Continue with other URLs even if one fails
        uploadResults.push({
          originalUrl: url,
          error: error instanceof Error ? error.message : 'Upload failed'
        });
      }
    }

    // Update generation with the new output assets
    const validResults = uploadResults.filter(result => !result.error);
    
    if (validResults.length > 0) {
      const outputAssets = validResults.map(result => ({
        url: result.convexUrl!,
        type: result.type!,
        filename: result.filename!,
        size: result.size!,
        format: result.type === 'image' ? 'image' : 'video'
      }));

      await convex.mutation(api.generations.updateGenerationAssets, {
        generationId,
        outputAssets
      });

      console.log(`✅ Updated generation ${generationId} with ${validResults.length} assets`);
    }

    return NextResponse.json({
      success: true,
      uploadedCount: validResults.length,
      failedCount: uploadResults.filter(r => r.error).length,
      results: uploadResults
    });

  } catch (error) {
    console.error("Upload from URL API error:", error);
    return NextResponse.json(
      { error: "Failed to process upload request" },
      { status: 500 }
    );
  }
}