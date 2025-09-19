import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user from Clerk webhook
export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        avatar: args.avatar,
        updatedAt: now,
      });
      return existingUser._id;
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        avatar: args.avatar,
        createdAt: now,
        updatedAt: now,
      });

      // Create default free subscription
      await ctx.db.insert("subscriptions", {
        userId,
        clerkId: args.clerkId,
        planId: "free",
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: now + (30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false,
        credits: 50, // Free tier credits
        maxConcurrency: 1,
        retentionDays: 7,
        createdAt: now,
        updatedAt: now,
      });

      return userId;
    }
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Get user with subscription
export const getUserWithSubscription = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return null;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .order("desc")
      .first();

    return {
      ...user,
      subscription,
    };
  },
});

// Mark user as having completed beta signup
export const markBetaSignupComplete = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        hasCompletedBetaSignup: true,
        updatedAt: Date.now(),
      });
    }
  },
});