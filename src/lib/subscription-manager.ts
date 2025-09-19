/**
 * Subscription Management Utilities
 * 
 * This module provides utilities to integrate the billing system with N8N workflows
 * and manage credit deductions during generation processes.
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export interface CreditCheckResult {
  hasCredits: boolean;
  creditsRequired: number;
  creditsAvailable: number;
  planName: string;
  message: string;
}

export interface ServiceCostConfig {
  image: number;
  video: number;
  talking_head: number;
}

/**
 * Check if user has enough credits for a generation request
 */
export async function checkCreditsAvailability(
  clerkId: string,
  serviceType: 'image' | 'video' | 'talking_head',
  quantity: number = 1
): Promise<CreditCheckResult> {
  try {
    const subscription = await convex.query(api.subscriptions.getUserSubscription, {
      clerkId
    });

    if (!subscription) {
      return {
        hasCredits: false,
        creditsRequired: 0,
        creditsAvailable: 0,
        planName: 'No Plan',
        message: 'No active subscription found. Please subscribe to a plan.'
      };
    }

    // Get plan details for cost calculation
    const plan = await convex.query(api.subscriptions.getPlan, {
      planId: subscription.planId
    });

    if (!plan) {
      return {
        hasCredits: false,
        creditsRequired: 0,
        creditsAvailable: 0,
        planName: 'Unknown Plan',
        message: 'Plan configuration not found.'
      };
    }

    // Calculate credits required based on service type
    const serviceCosts: ServiceCostConfig = {
      image: plan.imageGenerationCost,
      video: plan.videoGenerationCost,
      talking_head: plan.talkingHeadCost
    };

    const creditsRequired = serviceCosts[serviceType] * quantity;

    // Check if service is available for this plan
    if (creditsRequired === 0 && serviceType !== 'image') {
      return {
        hasCredits: false,
        creditsRequired: 0,
        creditsAvailable: subscription.creditsRemaining,
        planName: plan.name,
        message: `${serviceType === 'video' ? 'Video generation' : 'Talking head generation'} is not available on the ${plan.name} plan. Please upgrade your plan.`
      };
    }

    const hasCredits = subscription.creditsRemaining >= creditsRequired;

    return {
      hasCredits,
      creditsRequired,
      creditsAvailable: subscription.creditsRemaining,
      planName: plan.name,
      message: hasCredits 
        ? `✅ Credits available. ${creditsRequired} credits will be deducted.`
        : `❌ Insufficient credits. Need ${creditsRequired} credits, but only ${subscription.creditsRemaining} available.`
    };

  } catch (error) {
    console.error('Credit check failed:', error);
    return {
      hasCredits: false,
      creditsRequired: 0,
      creditsAvailable: 0,
      planName: 'Error',
      message: 'Unable to check credits. Please try again.'
    };
  }
}

/**
 * Deduct credits for a generation (call this BEFORE starting generation)
 */
export async function deductGenerationCredits(
  clerkId: string,
  generationId: string,
  serviceType: 'image' | 'video' | 'talking_head',
  quantity: number = 1
): Promise<{ success: boolean; message: string; transactionId?: string }> {
  try {
    // First check if credits are available
    const creditCheck = await checkCreditsAvailability(clerkId, serviceType, quantity);
    
    if (!creditCheck.hasCredits) {
      return {
        success: false,
        message: creditCheck.message
      };
    }

    // Deduct credits
    const transactionId = await convex.mutation(api.subscriptions.deductCredits, {
      clerkId,
      generationId,
      serviceType,
      creditsRequired: creditCheck.creditsRequired
    });

    // Update usage statistics
    await convex.mutation(api.billing.updateUsageStats, {
      clerkId,
      serviceType,
      processingTime: 0, // Will be updated when generation completes
      success: true // Assume success for now, will update if it fails
    });

    return {
      success: true,
      message: `✅ ${creditCheck.creditsRequired} credits deducted successfully.`,
      transactionId
    };

  } catch (error) {
    console.error('Credit deduction failed:', error);
    return {
      success: false,
      message: 'Failed to deduct credits. Please try again.'
    };
  }
}

/**
 * Refund credits if generation fails (call this if generation fails)
 */
export async function refundGenerationCredits(
  clerkId: string,
  generationId: string,
  reason: string = 'Generation failed'
): Promise<{ success: boolean; message: string }> {
  try {
    const refundId = await convex.mutation(api.subscriptions.refundCredits, {
      clerkId,
      generationId,
      reason
    });

    return {
      success: true,
      message: `✅ Credits refunded successfully. Refund ID: ${refundId}`
    };

  } catch (error) {
    console.error('Credit refund failed:', error);
    return {
      success: false,
      message: 'Failed to refund credits. Please contact support.'
    };
  }
}

/**
 * Update generation completion stats (call this when generation completes)
 */
export async function updateGenerationStats(
  clerkId: string,
  serviceType: 'image' | 'video' | 'talking_head',
  processingTime: number,
  success: boolean
): Promise<void> {
  try {
    await convex.mutation(api.billing.updateUsageStats, {
      clerkId,
      serviceType,
      processingTime,
      success
    });
  } catch (error) {
    console.error('Failed to update generation stats:', error);
  }
}

/**
 * Get user's current plan and usage summary
 */
export async function getUserPlanSummary(clerkId: string) {
  try {
    const subscription = await convex.query(api.subscriptions.getUserSubscription, {
      clerkId
    });

    if (!subscription) {
      return null;
    }

    const plan = await convex.query(api.subscriptions.getPlan, {
      planId: subscription.planId
    });

    const usage = await convex.query(api.billing.getCurrentUsage, {
      clerkId
    });

    const billingHistory = await convex.query(api.billing.getBillingHistory, {
      clerkId,
      limit: 5
    });

    return {
      subscription,
      plan,
      usage,
      recentBilling: billingHistory,
      creditUsagePercentage: subscription.totalCredits > 0 
        ? ((subscription.creditsUsed / subscription.totalCredits) * 100).toFixed(1)
        : 0
    };

  } catch (error) {
    console.error('Failed to get user plan summary:', error);
    return null;
  }
}

/**
 * N8N Workflow Integration Helper
 * 
 * This function should be called from the N8N workflow trigger API
 * to validate credits before starting the workflow
 */
export async function validateWorkflowCredits(
  clerkId: string,
  workflowType: 'image' | 'video' | 'talking_head',
  generationId: string,
  quantity: number = 1
): Promise<{
  canProceed: boolean;
  message: string;
  transactionId?: string;
  creditsDeducted?: number;
}> {
  
  // Check credits availability
  const creditCheck = await checkCreditsAvailability(clerkId, workflowType, quantity);
  
  if (!creditCheck.hasCredits) {
    return {
      canProceed: false,
      message: creditCheck.message
    };
  }

  // Deduct credits
  const deduction = await deductGenerationCredits(clerkId, generationId, workflowType, quantity);
  
  if (!deduction.success) {
    return {
      canProceed: false,
      message: deduction.message
    };
  }

  return {
    canProceed: true,
    message: `✅ Workflow authorized. ${creditCheck.creditsRequired} credits deducted.`,
    transactionId: deduction.transactionId,
    creditsDeducted: creditCheck.creditsRequired
  };
}

// Export service cost configurations for external use
export const SERVICE_TYPES = {
  IMAGE: 'image' as const,
  VIDEO: 'video' as const,
  TALKING_HEAD: 'talking_head' as const
} as const;

export type ServiceType = typeof SERVICE_TYPES[keyof typeof SERVICE_TYPES];