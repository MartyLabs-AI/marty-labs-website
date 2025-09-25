import { mutation } from "./_generated/server";

export const updateLipsyncFlow = mutation({
  args: {},
  handler: async (ctx) => {
    // Find the existing lipsync flow
    const existingFlow = await ctx.db
      .query("flows")
      .filter((q) => q.eq(q.field("id"), "lipsync-producer"))
      .first();

    if (existingFlow) {
      // Update with simplified schema
      await ctx.db.patch(existingFlow._id, {
        inputSchema: {
          type: "object",
          properties: {
            video: {
              type: "string",
              format: "file",
              accept: "video/*",
              title: "Video File",
              description: "Upload your video file"
            },
            audio: {
              type: "string", 
              format: "file",
              accept: "audio/*",
              title: "Audio File",
              description: "Upload your audio file"
            }
          },
          required: ["video", "audio"]
        },
        updatedAt: Date.now(),
      });
      
      return "Lipsync flow updated successfully";
    } else {
      return "Lipsync flow not found";
    }
  },
});