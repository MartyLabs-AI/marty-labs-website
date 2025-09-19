import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const fixIncompleteSubscriptions = internalMutation({
  handler: async (ctx) => {
    // Get all subscriptions
    const subscriptions = await ctx.db.query("subscriptions").collect();
    
    let fixedCount = 0;
    
    for (const subscription of subscriptions) {
      // Check if subscription is missing required fields
      const needsFix = !subscription.amount || 
                      !subscription.billingCycle || 
                      subscription.creditValue === undefined ||
                      subscription.creditsUsed === undefined ||
                      !subscription.currency ||
                      subscription.totalCredits === undefined ||
                      subscription.hasAPIAccess === undefined ||
                      subscription.hasCommercialLicense === undefined ||
                      subscription.hasPriorityProcessing === undefined ||
                      subscription.hasWatermark === undefined ||
                      subscription.hasWhiteLabel === undefined;
      
      if (needsFix) {
        console.log(`Fixing subscription ${subscription._id} for plan ${subscription.planId}`);
        
        // Define defaults based on plan type
        const planDefaults = {
          free: {
            amount: 0,
            billingCycle: "monthly",
            creditValue: 0,
            creditsUsed: 0,
            currency: "INR",
            totalCredits: 50, // Match existing credits
            hasAPIAccess: false,
            hasCommercialLicense: false,
            hasPriorityProcessing: false,
            hasWatermark: true,
            hasWhiteLabel: false,
          },
          creator: {
            amount: 999,
            billingCycle: "monthly", 
            creditValue: 1.0,
            creditsUsed: 0,
            currency: "INR",
            totalCredits: 1000,
            hasAPIAccess: true,
            hasCommercialLicense: true,
            hasPriorityProcessing: false,
            hasWatermark: false,
            hasWhiteLabel: false,
          }
        };
        
        const defaults = planDefaults[subscription.planId as keyof typeof planDefaults] || planDefaults.free;
        
        // Update the subscription with missing fields
        await ctx.db.patch(subscription._id, {
          amount: subscription.amount ?? defaults.amount,
          billingCycle: subscription.billingCycle ?? defaults.billingCycle,
          creditValue: subscription.creditValue ?? defaults.creditValue,
          creditsUsed: subscription.creditsUsed ?? defaults.creditsUsed,
          currency: subscription.currency ?? defaults.currency,
          totalCredits: subscription.totalCredits ?? (subscription.credits || defaults.totalCredits),
          hasAPIAccess: subscription.hasAPIAccess ?? defaults.hasAPIAccess,
          hasCommercialLicense: subscription.hasCommercialLicense ?? defaults.hasCommercialLicense,
          hasPriorityProcessing: subscription.hasPriorityProcessing ?? defaults.hasPriorityProcessing,
          hasWatermark: subscription.hasWatermark ?? defaults.hasWatermark,
          hasWhiteLabel: subscription.hasWhiteLabel ?? defaults.hasWhiteLabel,
        });
        
        fixedCount++;
      }
    }
    
    return { message: `Fixed ${fixedCount} subscription records`, fixedCount };
  },
});