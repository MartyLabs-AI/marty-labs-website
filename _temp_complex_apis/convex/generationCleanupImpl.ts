import { internalMutation } from "./_generated/server";

export const checkStuckGenerations = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

    // Find generations that are stuck in processing/queued for too long
    const stuckGenerations = await ctx.db
      .query("generations")
      .withIndex("by_status", (q) => q.eq("status", "processing"))
      .filter((q) => {
        // Generation is stuck if it's been processing for more than timeout
        return q.lt(q.field("updatedAt"), now - TIMEOUT_MS);
      })
      .collect();

    const queuedGenerations = await ctx.db
      .query("generations")
      .withIndex("by_status", (q) => q.eq("status", "queued"))
      .filter((q) => {
        // Generation is stuck if it's been queued for more than timeout
        return q.lt(q.field("createdAt"), now - TIMEOUT_MS);
      })
      .collect();

    const allStuckGenerations = [...stuckGenerations, ...queuedGenerations];

    console.log(`Found ${allStuckGenerations.length} stuck generations`);

    // Update stuck generations to failed status
    for (const generation of allStuckGenerations) {
      console.log(`Marking generation ${generation._id} as failed (stuck for ${Math.round((now - generation.updatedAt) / (1000 * 60))} minutes)`);
      
      await ctx.db.patch(generation._id, {
        status: "failed",
        errorMessage: "Workflow timed out - no response from N8N after 15 minutes",
        updatedAt: now,
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
          eventType: "credit_refund_timeout",
          generationId: generation._id,
          flowId: generation.flowId,
          credits: -generation.creditsUsed,
          createdAt: now,
        });
      }
    }

    return {
      cleanedUp: allStuckGenerations.length,
      generationIds: allStuckGenerations.map(g => g._id),
    };
  },
});