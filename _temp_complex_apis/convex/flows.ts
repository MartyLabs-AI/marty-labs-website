import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all public flows with optional filtering
export const getPublicFlows = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.search) {
      let flows = await ctx.db
        .query("flows")
        .withSearchIndex("search_flows", (q) => 
          q.search("title", args.search!)
           .eq("isActive", true)
           .eq("isPublic", true)
        )
        .collect();

      if (args.category) {
        flows = flows.filter((flow) => flow.category === args.category);
      }

      // Sort by creation time desc and limit
      return flows
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, args.limit || 50);
    } else {
      let flowsQuery = ctx.db
        .query("flows")
        .withIndex("by_isPublic", (q) => q.eq("isPublic", true))
        .filter((q) => q.eq(q.field("isActive"), true));

      if (args.category) {
        flowsQuery = flowsQuery.filter((q) => q.eq(q.field("category"), args.category));
      }

      return await flowsQuery
        .order("desc")
        .take(args.limit || 50);
    }
  },
});

// Get flow by ID
export const getFlowById = query({
  args: { flowId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("flows")
      .filter((q) => q.eq(q.field("id"), args.flowId))
      .first();
  },
});

// Get flow categories for filtering
export const getFlowCategories = query({
  args: {},
  handler: async (ctx, args) => {
    const flows = await ctx.db
      .query("flows")
      .withIndex("by_isPublic", (q) => q.eq("isPublic", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const categories = Array.from(
      new Set(flows.map(flow => flow.category))
    ).sort();

    return categories;
  },
});

// Create a new flow (admin function)
export const createFlow = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    thumbnail: v.optional(v.string()),
    previewVideo: v.optional(v.string()),
    tags: v.array(v.string()),
    inputSchema: v.any(),
    n8nWorkflowId: v.string(),
    estimatedProcessingTime: v.number(),
    creditsPerGeneration: v.number(),
    requiredPlan: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.insert("flows", {
      id: args.id,
      title: args.title,
      description: args.description,
      category: args.category,
      thumbnail: args.thumbnail,
      previewVideo: args.previewVideo,
      isActive: true,
      isPublic: true,
      tags: args.tags,
      inputSchema: args.inputSchema,
      n8nWorkflowId: args.n8nWorkflowId,
      estimatedProcessingTime: args.estimatedProcessingTime,
      creditsPerGeneration: args.creditsPerGeneration,
      requiredPlan: args.requiredPlan,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Seed initial flows (for development)
export const seedFlows = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    const flows = [
      {
        id: "i2i-transformer",
        title: "AI Image Transformer",
        description: "Transform and enhance your images using advanced AI. Change styles, add effects, or completely reimagine your visuals with intelligent prompt-based editing.",
        category: "AI Creative",
        tags: ["ai", "image", "transform", "creative", "style", "enhancement"],
        inputSchema: {
          type: "object",
          properties: {
            image: {
              type: "string",
              format: "file",
              accept: "image/*",
              title: "Source Image",
              description: "Upload the image you want to transform"
            },
            prompt: {
              type: "string",
              title: "Transformation Prompt",
              description: "Describe how you want to transform the image (e.g., 'make it cyberpunk style', 'add sunset lighting')",
              placeholder: "Transform this into a cyberpunk art piece with neon colors..."
            },
            aspectRatio: {
              type: "string",
              enum: ["1:1", "4:3", "16:9", "3:4", "9:16", "21:9"],
              default: "16:9",
              title: "Aspect Ratio",
              description: "Choose output dimensions"
            },
            quality: {
              type: "string",
              enum: ["standard", "high", "ultra"],
              default: "high",
              title: "Output Quality",
              description: "Higher quality takes longer but produces better results"
            }
          },
          required: ["image", "prompt"]
        },
        n8nWorkflowId: "i2i-transformer-workflow",
        estimatedProcessingTime: 60,
        creditsPerGeneration: 3,
        requiredPlan: "free",
      },
      {
        id: "producer-agent-beta",
        title: "Producer Agent (Beta)",
        description: "AI agent that creates images, videos, and lipsync content from natural language requests",
        category: "AI Agent",
        tags: ["ai", "agent", "chat", "video", "image", "lipsync", "beta"],
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              title: "What would you like to create?",
              description: "Describe what you want in natural language - images, videos, or lipsync content",
              placeholder: "Create a video of a woman dancing in a garden, then add a voiceover saying 'Hello world'",
              multiline: true
            },
            sourceImage: {
              type: "string",
              format: "file",
              accept: "image/*",
              title: "Source Image (Optional)",
              description: "Upload an image to transform or use as reference for video generation"
            },
            sourceVideo: {
              type: "string", 
              format: "file",
              accept: "video/*",
              title: "Source Video (Optional)",
              description: "Upload a video for lipsync or transformation"
            },
            audioFile: {
              type: "string",
              format: "file", 
              accept: "audio/*",
              title: "Audio File (Optional)",
              description: "Upload audio for lipsync or voiceover generation"
            },
            aspectRatio: {
              type: "string",
              enum: ["1:1", "4:3", "16:9", "3:4", "9:16", "21:9"],
              default: "16:9",
              title: "Aspect Ratio",
              description: "Choose output dimensions for generated content"
            },
            quality: {
              type: "string",
              enum: ["standard", "high", "ultra"],
              default: "high", 
              title: "Output Quality",
              description: "Higher quality takes longer but produces better results"
            },
            duration: {
              type: "number",
              minimum: 1,
              maximum: 30,
              default: 5,
              title: "Video Duration (seconds)",
              description: "Duration for generated videos (1-30 seconds)"
            }
          },
          required: ["prompt"]
        },
        n8nWorkflowId: "producer-agent-workflow",
        estimatedProcessingTime: 180,
        creditsPerGeneration: 15,
        requiredPlan: "free",
      },
      {
        id: "lipsync-producer",
        title: "Lipsync Producer",  
        description: "Generate lip-synced videos from audio and video files",
        category: "Video",
        tags: ["lipsync", "video", "audio", "ai"],
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
        n8nWorkflowId: "lipsync-producer-workflow",
        estimatedProcessingTime: 120,
        creditsPerGeneration: 10,
        requiredPlan: "free",
      }
    ];

    // Delete old flows first (clean slate)
    const existingFlows = await ctx.db.query("flows").collect();
    for (const existingFlow of existingFlows) {
      await ctx.db.delete(existingFlow._id);
    }

    // Insert all flows fresh
    for (const flow of flows) {
      await ctx.db.insert("flows", {
        ...flow,
        isActive: true,
        isPublic: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    return "Flows seeded successfully";
  },
});