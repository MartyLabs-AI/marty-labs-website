import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate upload URL for file uploads
export const generateUploadUrl = mutation(async (ctx) => {
  // Check if user is authenticated
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  // Generate upload URL that expires in 1 hour
  return await ctx.storage.generateUploadUrl();
});

// Get file URL by storage ID
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Store file metadata after upload
export const saveFileMetadata = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    size: v.number(),
    contentType: v.string(),
    purpose: v.optional(v.string()), // "avatar", "input", "output", etc.
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Store file metadata (optional - for tracking)
    return await ctx.db.insert("fileMetadata", {
      storageId: args.storageId,
      filename: args.filename,
      size: args.size,
      contentType: args.contentType,
      purpose: args.purpose,
      uploadedBy: identity.subject,
      uploadedAt: Date.now(),
    });
  },
});

// Upload external URL to Convex storage
export const uploadFromUrl = mutation({
  args: {
    url: v.string(),
    filename: v.string(),
    purpose: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Fetch the file from the external URL
      const response = await fetch(args.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      // Get file data
      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get("content-type") || "application/octet-stream";
      
      // Upload to Convex storage
      const blob = new Blob([arrayBuffer], { type: contentType });
      const storageId = await ctx.storage.store(blob);

      // Save metadata
      const identity = await ctx.auth.getUserIdentity();
      if (identity) {
        await ctx.db.insert("fileMetadata", {
          storageId,
          filename: args.filename,
          size: arrayBuffer.byteLength,
          contentType,
          purpose: args.purpose || "output",
          uploadedBy: identity.subject,
          uploadedAt: Date.now(),
        });
      }

      // Get the Convex URL for the file
      const convexUrl = await ctx.storage.getUrl(storageId);

      return {
        storageId,
        url: convexUrl,
        filename: args.filename,
        size: arrayBuffer.byteLength,
        contentType,
      };
    } catch (error) {
      console.error("Failed to upload from URL:", error);
      throw new Error(`Failed to upload file from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Delete file
export const deleteFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.storage.delete(args.storageId);
    
    // Also delete metadata if it exists
    const metadata = await ctx.db
      .query("fileMetadata")
      .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
      .first();
    
    if (metadata) {
      await ctx.db.delete(metadata._id);
    }
  },
});