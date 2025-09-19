import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Record successful payment
export const recordPayment = mutation({
  args: {
    clerkId: v.string(),
    razorpaySubscriptionId: v.string(),
    razorpayPaymentId: v.optional(v.string()),
    amount: v.number(),
    status: v.string(),
    paidAt: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    // Get plan details for credits
    const plan = await ctx.db
      .query("plans")
      .withIndex("by_planId", (q) => q.eq("planId", subscription.planId))
      .first();

    if (!plan) {
      throw new Error("Plan not found");
    }

    const creditsGranted = subscription.billingCycle === "annual" 
      ? plan.annualCredits 
      : plan.monthlyCredits;

    // Record in billing history
    const billingId = await ctx.db.insert("billingHistory", {
      userId: user._id,
      clerkId: args.clerkId,
      subscriptionId: subscription._id,
      razorpayPaymentId: args.razorpayPaymentId,
      razorpayOrderId: undefined,
      razorpayInvoiceId: undefined,
      amount: args.amount,
      currency: "INR",
      status: args.status,
      planId: subscription.planId,
      billingCycle: subscription.billingCycle,
      creditsGranted: creditsGranted,
      billingPeriodStart: subscription.currentPeriodStart,
      billingPeriodEnd: subscription.currentPeriodEnd,
      paidAt: args.paidAt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return billingId;
  },
});

// Record failed payment
export const recordFailedPayment = mutation({
  args: {
    razorpayPaymentId: v.string(),
    razorpaySubscriptionId: v.string(),
    amount: v.number(),
    errorCode: v.optional(v.string()),
    errorDescription: v.optional(v.string()),
    failedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Find subscription by Razorpay ID
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_razorpaySubscriptionId", (q) => q.eq("razorpaySubscriptionId", args.razorpaySubscriptionId))
      .first();

    if (!subscription) {
      console.error("Subscription not found for failed payment:", args.razorpaySubscriptionId);
      return;
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), subscription.userId))
      .first();

    if (!user) {
      console.error("User not found for subscription:", subscription._id);
      return;
    }

    // Record failed payment in billing history
    const billingId = await ctx.db.insert("billingHistory", {
      userId: user._id,
      clerkId: user.clerkId,
      subscriptionId: subscription._id,
      razorpayPaymentId: args.razorpayPaymentId,
      razorpayOrderId: undefined,
      razorpayInvoiceId: undefined,
      amount: args.amount,
      currency: "INR",
      status: "failed",
      planId: subscription.planId,
      billingCycle: subscription.billingCycle,
      creditsGranted: 0,
      billingPeriodStart: subscription.currentPeriodStart,
      billingPeriodEnd: subscription.currentPeriodEnd,
      paidAt: undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return billingId;
  },
});

// Get user's billing history
export const getBillingHistory = query({
  args: {
    clerkId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const billingHistory = await ctx.db
      .query("billingHistory")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .order("desc")
      .take(args.limit || 12);

    return billingHistory;
  },
});

// Get current month's usage analytics
export const getCurrentUsage = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentMonth = new Date().toISOString().slice(0, 7); // "2025-01" format
    
    const usage = await ctx.db
      .query("usageLimits")
      .withIndex("by_clerkId_month", (q) => q.eq("clerkId", args.clerkId).eq("month", currentMonth))
      .first();

    if (!usage) {
      // Create initial usage record for the month
      const subscription = await ctx.db
        .query("subscriptions")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
        .first();

      if (!subscription) {
        return null;
      }

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
        .first();

      if (!user) {
        return null;
      }

      const newUsageId = await ctx.db.insert("usageLimits", {
        userId: user._id,
        clerkId: args.clerkId,
        month: currentMonth,
        planId: subscription.planId,
        creditsLimit: subscription.totalCredits,
        creditsUsed: subscription.creditsUsed,
        imagesGenerated: 0,
        videosGenerated: 0,
        talkingHeadsGenerated: 0,
        avgProcessingTime: 0,
        successRate: 100,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return await ctx.db.get(newUsageId);
    }

    return usage;
  },
});

// Update usage statistics
export const updateUsageStats = mutation({
  args: {
    clerkId: v.string(),
    serviceType: v.string(), // "image", "video", "talking_head"
    processingTime: v.number(),
    success: v.boolean(),
  },
  handler: async (ctx, args) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const usage = await ctx.db
      .query("usageLimits")
      .withIndex("by_clerkId_month", (q) => q.eq("clerkId", args.clerkId).eq("month", currentMonth))
      .first();

    if (!usage) {
      // Create usage record first
      const subscription = await ctx.db
        .query("subscriptions")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
        .first();

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
        .first();

      if (!subscription || !user) {
        return;
      }

      await ctx.db.insert("usageLimits", {
        userId: user._id,
        clerkId: args.clerkId,
        month: currentMonth,
        planId: subscription.planId,
        creditsLimit: subscription.totalCredits,
        creditsUsed: subscription.creditsUsed,
        imagesGenerated: args.serviceType === "image" ? 1 : 0,
        videosGenerated: args.serviceType === "video" ? 1 : 0,
        talkingHeadsGenerated: args.serviceType === "talking_head" ? 1 : 0,
        avgProcessingTime: args.processingTime,
        successRate: args.success ? 100 : 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      // Update existing usage record
      const totalGenerations = usage.imagesGenerated + usage.videosGenerated + usage.talkingHeadsGenerated;
      const newAvgProcessingTime = ((usage.avgProcessingTime * totalGenerations) + args.processingTime) / (totalGenerations + 1);
      const newSuccessRate = args.success 
        ? ((usage.successRate * totalGenerations) + 100) / (totalGenerations + 1)
        : ((usage.successRate * totalGenerations) + 0) / (totalGenerations + 1);

      await ctx.db.patch(usage._id, {
        creditsUsed: usage.creditsUsed,
        imagesGenerated: usage.imagesGenerated + (args.serviceType === "image" ? 1 : 0),
        videosGenerated: usage.videosGenerated + (args.serviceType === "video" ? 1 : 0),
        talkingHeadsGenerated: usage.talkingHeadsGenerated + (args.serviceType === "talking_head" ? 1 : 0),
        avgProcessingTime: newAvgProcessingTime,
        successRate: newSuccessRate,
        updatedAt: Date.now(),
      });
    }
  },
});

// Get usage analytics for multiple months
export const getUsageAnalytics = query({
  args: {
    clerkId: v.string(),
    months: v.number(), // Number of months to fetch
  },
  handler: async (ctx, args) => {
    const usage = await ctx.db
      .query("usageLimits")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .order("desc")
      .take(args.months);

    return usage;
  },
});