import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user's subscription with current credit balance
export const getUserSubscription = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return null;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return subscription;
  },
});

// Get all available plans
export const getAllPlans = query({
  args: {},
  handler: async (ctx) => {
    const plans = await ctx.db
      .query("plans")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .order("asc")
      .collect();

    return plans.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

// Get specific plan details
export const getPlan = query({
  args: {
    planId: v.string(),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db
      .query("plans")
      .withIndex("by_planId", (q) => q.eq("planId", args.planId))
      .first();

    return plan;
  },
});

// Create or update subscription
export const createSubscription = mutation({
  args: {
    clerkId: v.string(),
    planId: v.string(),
    billingCycle: v.string(), // "monthly" | "annual"
    razorpaySubscriptionId: v.optional(v.string()),
    razorpayCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get plan details
    const plan = await ctx.db
      .query("plans")
      .withIndex("by_planId", (q) => q.eq("planId", args.planId))
      .first();

    if (!plan) {
      throw new Error("Plan not found");
    }

    // Calculate subscription details
    const now = Date.now();
    const isAnnual = args.billingCycle === "annual";
    const amount = isAnnual ? plan.annualPrice : plan.monthlyPrice;
    const credits = isAnnual ? plan.annualCredits : plan.monthlyCredits;
    const periodDuration = isAnnual ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;

    // Check for existing subscription
    const existingSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const subscriptionData = {
      userId: user._id,
      clerkId: args.clerkId,
      planId: args.planId,
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: now + periodDuration,
      cancelAtPeriodEnd: false,

      // Razorpay Integration
      razorpaySubscriptionId: args.razorpaySubscriptionId,
      razorpayCustomerId: args.razorpayCustomerId,
      razorpayPlanId: isAnnual ? plan.razorpayAnnualPlanId : plan.razorpayMonthlyPlanId,

      // Credit System
      credits: credits,
      totalCredits: credits,
      creditsUsed: 0,
      creditValue: plan.creditValue,

      // Plan Features
      maxConcurrency: plan.maxConcurrency,
      retentionDays: plan.retentionDays,
      hasWatermark: plan.hasWatermark,
      hasPriorityProcessing: plan.hasPriorityProcessing,
      hasAPIAccess: plan.hasAPIAccess,
      hasCommercialLicense: plan.hasCommercialLicense,
      hasWhiteLabel: plan.hasWhiteLabel,

      // Billing
      amount: amount,
      currency: "INR",
      billingCycle: args.billingCycle,
      nextBillingDate: now + periodDuration,

      createdAt: now,
      updatedAt: now,
    };

    let subscriptionId;
    if (existingSubscription) {
      // Update existing subscription
      await ctx.db.patch(existingSubscription._id, subscriptionData);
      subscriptionId = existingSubscription._id;
    } else {
      // Create new subscription
      subscriptionId = await ctx.db.insert("subscriptions", subscriptionData);
    }

    // Record credit transaction
    await ctx.db.insert("creditTransactions", {
      userId: user._id,
      clerkId: args.clerkId,
      subscriptionId: subscriptionId,
      type: "credit",
      amount: credits,
      balance: credits,
      description: `${plan.name} subscription - ${args.billingCycle} billing`,
      createdAt: now,
    });

    return subscriptionId;
  },
});

// Deduct credits for generation
export const deductCredits = mutation({
  args: {
    clerkId: v.string(),
    generationId: v.id("generations"),
    serviceType: v.string(), // "image", "video", "talking_head"
    creditsRequired: v.number(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!subscription) {
      throw new Error("No active subscription found");
    }

    if (subscription.credits < args.creditsRequired) {
      throw new Error("Insufficient credits");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update subscription credits
    const newCredits = subscription.credits - args.creditsRequired;
    const newCreditsUsed = subscription.creditsUsed + args.creditsRequired;

    await ctx.db.patch(subscription._id, {
      credits: newCredits,
      creditsUsed: newCreditsUsed,
      updatedAt: Date.now(),
    });

    // Record credit transaction
    const transactionId = await ctx.db.insert("creditTransactions", {
      userId: user._id,
      clerkId: args.clerkId,
      subscriptionId: subscription._id,
      generationId: args.generationId,
      type: "debit",
      amount: -args.creditsRequired,
      balance: newCredits,
      description: `${args.serviceType} generation`,
      serviceType: args.serviceType,
      createdAt: Date.now(),
    });

    return {
      remainingCredits: newCredits,
      transactionId: transactionId,
    };
  },
});

// Refund credits (for failed generations)
export const refundCredits = mutation({
  args: {
    clerkId: v.string(),
    generationId: v.id("generations"),
    creditsToRefund: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!subscription) {
      throw new Error("No active subscription found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update subscription credits
    const newCredits = subscription.credits + args.creditsToRefund;
    const newCreditsUsed = Math.max(0, subscription.creditsUsed - args.creditsToRefund);

    await ctx.db.patch(subscription._id, {
      credits: newCredits,
      creditsUsed: newCreditsUsed,
      updatedAt: Date.now(),
    });

    // Record credit transaction
    const transactionId = await ctx.db.insert("creditTransactions", {
      userId: user._id,
      clerkId: args.clerkId,
      subscriptionId: subscription._id,
      generationId: args.generationId,
      type: "refund",
      amount: args.creditsToRefund,
      balance: newCredits,
      description: `Refund: ${args.reason}`,
      createdAt: Date.now(),
    });

    return {
      newBalance: newCredits,
      transactionId: transactionId,
    };
  },
});

// Get user's credit transaction history
export const getCreditHistory = query({
  args: {
    clerkId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("creditTransactions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .order("desc")
      .take(args.limit || 50);

    return transactions;
  },
});

// Check if user has enough credits for a service
export const checkCreditAvailability = query({
  args: {
    clerkId: v.string(),
    serviceType: v.string(), // "image", "video", "talking_head"
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!subscription) {
      return {
        hasCredits: false,
        currentCredits: 0,
        requiredCredits: 0,
        error: "No active subscription",
      };
    }

    // Get plan to determine credit cost
    const plan = await ctx.db
      .query("plans")
      .withIndex("by_planId", (q) => q.eq("planId", subscription.planId))
      .first();

    if (!plan) {
      return {
        hasCredits: false,
        currentCredits: subscription.credits,
        requiredCredits: 0,
        error: "Plan not found",
      };
    }

    let requiredCredits = 0;
    switch (args.serviceType) {
      case "image":
        requiredCredits = plan.imageGenerationCost;
        break;
      case "video":
        requiredCredits = plan.videoGenerationCost;
        break;
      case "talking_head":
        requiredCredits = plan.talkingHeadCost;
        break;
      default:
        requiredCredits = 1;
    }

    return {
      hasCredits: subscription.credits >= requiredCredits,
      currentCredits: subscription.credits,
      requiredCredits: requiredCredits,
      planId: subscription.planId,
      planFeatures: {
        hasWatermark: subscription.hasWatermark,
        hasPriorityProcessing: subscription.hasPriorityProcessing,
        hasAPIAccess: subscription.hasAPIAccess,
        hasCommercialLicense: subscription.hasCommercialLicense,
      },
    };
  },
});

// Cancel subscription
export const cancelSubscription = mutation({
  args: {
    clerkId: v.string(),
    cancelAtPeriodEnd: v.boolean(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!subscription) {
      throw new Error("No active subscription found");
    }

    await ctx.db.patch(subscription._id, {
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      status: args.cancelAtPeriodEnd ? "active" : "canceled",
      updatedAt: Date.now(),
    });

    return subscription._id;
  },
});