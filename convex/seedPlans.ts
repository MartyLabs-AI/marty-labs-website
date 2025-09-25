import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Seed initial plans with optimized pricing
export const seedInitialPlans = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Check if plans already exist
    const existingPlans = await ctx.db
      .query("plans")
      .collect();

    if (existingPlans.length > 0) {
      console.log("Plans already exist, skipping seed");
      return { message: "Plans already exist" };
    }

    const plans = [
      {
        planId: "standard",
        name: "Standard",
        description: "Perfect for individual creators and small projects",
        
        // Pricing (INR) - ₹999/month, ₹9,990/year (17% discount)
        monthlyPrice: 999,
        annualPrice: 9990,
        creditValue: 9.99, // ₹9.99 per credit monthly
        
        // Credits and Usage
        monthlyCredits: 100, // 100 credits per month
        annualCredits: 1200, // 1200 credits per year (200 bonus)
        
        // Service Costs (in credits) - Higher for free tier
        imageGenerationCost: 2, // 2 credits per image (5 images with 10 credits)
        videoGenerationCost: 0, // No video for free tier
        talkingHeadCost: 0, // No talking heads for free tier
        
        // Features
        maxConcurrency: 1,
        retentionDays: 7, // Keep files for 7 days
        hasWatermark: true, // Watermarked outputs
        hasPriorityProcessing: false,
        hasAPIAccess: false,
        hasCommercialLicense: false,
        hasWhiteLabel: false,
        
        // Razorpay Plan IDs (None for free)
        razorpayMonthlyPlanId: null,
        razorpayAnnualPlanId: null,
        
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
      },
      
      {
        planId: "freelancer",
        name: "Freelancer",
        description: "For freelancers and small businesses",
        
        // Pricing (INR) - ₹1,249/month, ₹9,999/year (33% discount)
        monthlyPrice: 1249,
        annualPrice: 9999,
        creditValue: 12.49, // ₹12.49 per credit monthly
        
        // Credits and Usage
        monthlyCredits: 100, // 100 credits per month
        annualCredits: 1200, // 1200 credits per year (same rate)
        
        // Service Costs (in credits) - Optimized for profit
        imageGenerationCost: 1, // 1 credit per image (₹12.49 user pays, ₹6.24 cost = 100% margin)
        videoGenerationCost: 8, // 8 credits per video (₹99.92 user pays, ₹37.5 cost = 166% margin)
        talkingHeadCost: 10, // 10 credits per talking head (₹124.9 user pays, ₹47.25 cost = 164% margin)
        
        // Features
        maxConcurrency: 2,
        retentionDays: 30,
        hasWatermark: false, // No watermarks
        hasPriorityProcessing: false,
        hasAPIAccess: false,
        hasCommercialLicense: true,
        hasWhiteLabel: false,
        
        // Razorpay Plan IDs (to be updated after Razorpay setup)
        razorpayMonthlyPlanId: "plan_freelancer_monthly",
        razorpayAnnualPlanId: "plan_freelancer_annual",
        
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
      },
      
      {
        planId: "agency",
        name: "Agency",
        description: "For agencies and growing teams",
        
        // Pricing (INR) - ₹3,749/month, ₹29,999/year (33% discount)
        monthlyPrice: 3749,
        annualPrice: 29999,
        creditValue: 9.37, // ₹9.37 per credit monthly (better rate)
        
        // Credits and Usage
        monthlyCredits: 400, // 400 credits per month
        annualCredits: 4800, // 4800 credits per year
        
        // Service Costs (in credits) - Better rates
        imageGenerationCost: 1, // 1 credit per image (₹9.37 user pays, ₹6.24 cost = 50% margin)
        videoGenerationCost: 6, // 6 credits per video (₹56.22 user pays, ₹37.5 cost = 50% margin)
        talkingHeadCost: 8, // 8 credits per talking head (₹74.96 user pays, ₹47.25 cost = 58% margin)
        
        // Features
        maxConcurrency: 5,
        retentionDays: 90,
        hasWatermark: false,
        hasPriorityProcessing: true, // Priority processing
        hasAPIAccess: true, // API access
        hasCommercialLicense: true,
        hasWhiteLabel: false,
        
        // Razorpay Plan IDs
        razorpayMonthlyPlanId: "plan_agency_monthly",
        razorpayAnnualPlanId: "plan_agency_annual",
        
        isActive: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now,
      },
      
      {
        planId: "enterprise",
        name: "Enterprise",
        description: "For large organizations with custom needs",
        
        // Pricing (INR) - ₹10,749/month, ₹99,999/year (22% discount)
        monthlyPrice: 10749,
        annualPrice: 99999,
        creditValue: 7.17, // ₹7.17 per credit monthly (best rate)
        
        // Credits and Usage
        monthlyCredits: 1500, // 1500 credits per month
        annualCredits: 18000, // 18000 credits per year
        
        // Service Costs (in credits) - Best rates
        imageGenerationCost: 1, // 1 credit per image (₹7.17 user pays, ₹6.24 cost = 15% margin - volume play)
        videoGenerationCost: 5, // 5 credits per video (₹35.85 user pays, ₹37.5 cost = slight loss, made up on volume)
        talkingHeadCost: 6, // 6 credits per talking head (₹43.02 user pays, ₹47.25 cost = slight loss, made up on volume)
        
        // Features
        maxConcurrency: 10,
        retentionDays: 365,
        hasWatermark: false,
        hasPriorityProcessing: true,
        hasAPIAccess: true,
        hasCommercialLicense: true,
        hasWhiteLabel: true, // White-label options
        
        // Razorpay Plan IDs
        razorpayMonthlyPlanId: "plan_enterprise_monthly",
        razorpayAnnualPlanId: "plan_enterprise_annual",
        
        isActive: true,
        sortOrder: 4,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Insert all plans
    const planIds = [];
    for (const plan of plans) {
      const planId = await ctx.db.insert("plans", plan);
      planIds.push(planId);
    }

    return {
      message: "Successfully seeded plans",
      plansCreated: planIds.length,
      planIds: planIds,
    };
  },
});

// Update Razorpay plan IDs after creation
export const updateRazorpayPlanIds = mutation({
  args: {
    planId: v.string(),
    razorpayMonthlyPlanId: v.optional(v.string()),
    razorpayAnnualPlanId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db
      .query("plans")
      .withIndex("by_planId", (q) => q.eq("planId", args.planId))
      .first();

    if (!plan) {
      throw new Error("Plan not found");
    }

    await ctx.db.patch(plan._id, {
      razorpayMonthlyPlanId: args.razorpayMonthlyPlanId,
      razorpayAnnualPlanId: args.razorpayAnnualPlanId,
      updatedAt: Date.now(),
    });

    return plan._id;
  },
});

// Get pricing summary for display
export const getPricingSummary = mutation({
  args: {},
  handler: async (ctx) => {
    const plans = await ctx.db
      .query("plans")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();

    return plans.map(plan => ({
      planId: plan.planId,
      name: plan.name,
      monthlyPrice: plan.monthlyPrice,
      annualPrice: plan.annualPrice,
      monthlyCredits: plan.monthlyCredits,
      annualCredits: plan.annualCredits,
      imageGenCost: plan.imageGenerationCost,
      videoGenCost: plan.videoGenerationCost,
      talkingHeadCost: plan.talkingHeadCost,
      // Calculate value propositions
      monthlyImagesIncluded: Math.floor(plan.monthlyCredits / plan.imageGenerationCost),
      monthlyVideosIncluded: plan.videoGenerationCost > 0 ? Math.floor(plan.monthlyCredits / plan.videoGenerationCost) : 0,
      monthlyTalkingHeadsIncluded: plan.talkingHeadCost > 0 ? Math.floor(plan.monthlyCredits / plan.talkingHeadCost) : 0,
      features: {
        hasWatermark: plan.hasWatermark,
        hasPriorityProcessing: plan.hasPriorityProcessing,
        hasAPIAccess: plan.hasAPIAccess,
        hasCommercialLicense: plan.hasCommercialLicense,
        hasWhiteLabel: plan.hasWhiteLabel,
      }
    })).sort((a, b) => plans.find(p => p.planId === a.planId)!.sortOrder - plans.find(p => p.planId === b.planId)!.sortOrder);
  },
});