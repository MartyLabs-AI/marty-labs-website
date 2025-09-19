import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new generation job
export const createGeneration = mutation({
  args: {
    clerkId: v.string(),
    flowId: v.string(),
    inputData: v.any(),
    inputAssets: v.array(v.object({
      url: v.string(),
      storageId: v.optional(v.string()),
      type: v.string(),
      filename: v.string(),
      size: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get subscription
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .order("desc")
      .first();

    if (!subscription) {
      throw new Error("No active subscription found");
    }

    // Get flow details
    const flow = await ctx.db
      .query("flows")
      .filter((q) => q.eq(q.field("id"), args.flowId))
      .first();

    if (!flow) {
      throw new Error("Flow not found");
    }

    // Check if user has enough credits - COMMENTED OUT FOR DEVELOPMENT
    // if (subscription.credits < flow.creditsPerGeneration) {
    //   throw new Error("Insufficient credits");
    // }

    // Check plan requirements - COMMENTED OUT FOR DEVELOPMENT
    // const planHierarchy = { "free": 0, "pro": 1, "business": 2 };
    // const userPlanLevel = planHierarchy[subscription.planId as keyof typeof planHierarchy] || 0;
    // const requiredPlanLevel = planHierarchy[flow.requiredPlan as keyof typeof planHierarchy] || 0;
    
    // if (userPlanLevel < requiredPlanLevel) {
    //   throw new Error(`This flow requires ${flow.requiredPlan} plan or higher`);
    // }

    // Check concurrency limit - COMMENTED OUT FOR DEVELOPMENT
    // const activeGenerations = await ctx.db
    //   .query("generations")
    //   .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
    //   .filter((q) => 
    //     q.or(
    //       q.eq(q.field("status"), "queued"),
    //       q.eq(q.field("status"), "processing")
    //     )
    //   )
    //   .collect();

    // if (activeGenerations.length >= subscription.maxConcurrency) {
    //   const planName = subscription.planId.charAt(0).toUpperCase() + subscription.planId.slice(1);
    //   throw new Error(`You've reached your ${planName} plan limit of ${subscription.maxConcurrency} concurrent generation${subscription.maxConcurrency > 1 ? 's' : ''}. Please wait for current generations to complete or upgrade your plan.`);
    // }

    const now = Date.now();
    
    // Create generation record
    const generationId = await ctx.db.insert("generations", {
      userId: user._id,
      clerkId: args.clerkId,
      flowId: args.flowId,
      inputData: args.inputData,
      inputAssets: args.inputAssets,
      status: "queued",
      progress: 0,
      retryCount: 0,
      creditsUsed: flow.creditsPerGeneration,
      createdAt: now,
      updatedAt: now,
      expiresAt: now + (subscription.retentionDays * 24 * 60 * 60 * 1000),
    });

    // Deduct credits - COMMENTED OUT FOR DEVELOPMENT
    // await ctx.db.patch(subscription._id, {
    //   credits: subscription.credits - flow.creditsPerGeneration,
    //   updatedAt: now,
    // });

    // Log usage event
    await ctx.db.insert("usageEvents", {
      userId: user._id,
      clerkId: args.clerkId,
      eventType: "generation_started",
      generationId,
      flowId: args.flowId,
      credits: flow.creditsPerGeneration,
      createdAt: now,
    });

    return generationId;
  },
});

// Update generation status (called from n8n webhook)
export const updateGenerationStatus = mutation({
  args: {
    generationId: v.id("generations"),
    status: v.string(),
    progress: v.optional(v.number()),
    n8nExecutionId: v.optional(v.string()),
    outputAssets: v.optional(v.array(v.object({
      url: v.string(),
      type: v.string(),
      filename: v.string(),
      size: v.number(),
      format: v.string(),
    }))),
    errorMessage: v.optional(v.string()),
    errorDetails: v.optional(v.any()),
    response: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const generation = await ctx.db.get(args.generationId);
    if (!generation) {
      throw new Error("Generation not found");
    }

    const now = Date.now();
    const updateData: any = {
      status: args.status,
      updatedAt: now,
    };

    if (args.progress !== undefined) {
      updateData.progress = args.progress;
    }

    if (args.n8nExecutionId) {
      updateData.n8nExecutionId = args.n8nExecutionId;
    }

    if (args.response) {
      updateData.response = args.response;
    }

    if (args.status === "processing" && !generation.processingStartedAt) {
      updateData.processingStartedAt = now;
    }

    if (args.status === "completed") {
      updateData.processingCompletedAt = now;
      updateData.progress = 100;
      if (args.outputAssets) {
        updateData.outputAssets = args.outputAssets;
      }

      // Log completion event
      await ctx.db.insert("usageEvents", {
        userId: generation.userId,
        clerkId: generation.clerkId,
        eventType: "generation_completed",
        generationId: args.generationId,
        flowId: generation.flowId,
        credits: 0,
        createdAt: now,
      });
    }

    if (args.status === "failed") {
      updateData.errorMessage = args.errorMessage;
      updateData.errorDetails = args.errorDetails;
      
      // Refund credits on failure
      const subscription = await ctx.db
        .query("subscriptions")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", generation.clerkId))
        .order("desc")
        .first();

      if (subscription) {
        await ctx.db.patch(subscription._id, {
          credits: subscription.credits + generation.creditsUsed,
          updatedAt: now,
        });

        // Log refund event
        await ctx.db.insert("usageEvents", {
          userId: generation.userId,
          clerkId: generation.clerkId,
          eventType: "credit_refund",
          generationId: args.generationId,
          flowId: generation.flowId,
          credits: -generation.creditsUsed,
          createdAt: now,
        });
      }
    }

    await ctx.db.patch(args.generationId, updateData);
    return updateData;
  },
});

// Get user's generations with pagination
export const getUserGenerations = query({
  args: {
    clerkId: v.string(),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    status: v.optional(v.string()),
    flowId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("generations")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId));

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    if (args.flowId) {
      query = query.filter((q) => q.eq(q.field("flowId"), args.flowId));
    }

    const generations = await query
      .order("desc")
      .take(args.limit || 20);

    return generations;
  },
});

// Check user's concurrency availability
export const checkConcurrencyAvailability = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .order("desc")
      .first();

    if (!subscription) {
      return { available: false, error: "No subscription found" };
    }

    const activeGenerations = await ctx.db
      .query("generations")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .filter((q) => 
        q.or(
          q.eq(q.field("status"), "queued"),
          q.eq(q.field("status"), "processing")
        )
      )
      .collect();

    const available = activeGenerations.length < subscription.maxConcurrency;
    
    return {
      available,
      current: activeGenerations.length,
      maximum: subscription.maxConcurrency,
      planId: subscription.planId,
      activeGenerations: activeGenerations.map(g => ({
        id: g._id,
        flowId: g.flowId,
        status: g.status,
        createdAt: g.createdAt,
      })),
    };
  },
});

// Cancel a generation
export const cancelGeneration = mutation({
  args: { 
    generationId: v.id("generations"),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const generation = await ctx.db.get(args.generationId);
    if (!generation) {
      throw new Error("Generation not found");
    }

    // Verify ownership
    if (generation.clerkId !== args.clerkId) {
      throw new Error("Unauthorized");
    }

    // Only cancel if generation is in progress or queued
    if (!["queued", "processing"].includes(generation.status)) {
      throw new Error("Cannot cancel a generation that is not in progress");
    }

    const now = Date.now();

    // Update generation status to cancelled
    await ctx.db.patch(args.generationId, {
      status: "cancelled",
      updatedAt: now,
      cancelledAt: now,
    });

    // Refund credits
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", generation.clerkId))
      .order("desc")
      .first();

    if (subscription) {
      await ctx.db.patch(subscription._id, {
        credits: subscription.credits + generation.creditsUsed,
        updatedAt: now,
      });

      // Log refund event
      await ctx.db.insert("usageEvents", {
        userId: generation.userId,
        clerkId: generation.clerkId,
        eventType: "generation_cancelled",
        generationId: args.generationId,
        flowId: generation.flowId,
        credits: -generation.creditsUsed,
        createdAt: now,
      });
    }

    return { success: true };
  },
});

// Update generation assets (for uploaded files from external URLs)
export const updateGenerationAssets = mutation({
  args: {
    generationId: v.id("generations"),
    outputAssets: v.array(v.object({
      url: v.string(),
      type: v.string(),
      filename: v.string(),
      size: v.number(),
      format: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const generation = await ctx.db.get(args.generationId);
    if (!generation) {
      throw new Error("Generation not found");
    }

    const now = Date.now();
    
    await ctx.db.patch(args.generationId, {
      outputAssets: args.outputAssets,
      updatedAt: now,
    });

    return { success: true };
  },
});

// Get generation by ID
export const getGenerationById = query({
  args: { generationId: v.id("generations") },
  handler: async (ctx, args) => {
    const generation = await ctx.db.get(args.generationId);
    if (!generation) return null;

    // Get flow details
    const flow = await ctx.db
      .query("flows")
      .filter((q) => q.eq(q.field("id"), generation.flowId))
      .first();

    return {
      ...generation,
      flow,
    };
  },
});