import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Service type constants
export const SERVICE_TYPES = {
  IMAGE: 'image' as const,
  VIDEO: 'video' as const, 
  TALKING_HEAD: 'talking_head' as const
} as const;

export type ServiceType = typeof SERVICE_TYPES[keyof typeof SERVICE_TYPES];

// Refund credits for failed generations
export async function refundGenerationCredits(
  clerkId: string,
  generationId: string,
  reason: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Get the generation details to find out how many credits to refund
    const generation = await convex.query(api.generations.getGenerationById, {
      generationId
    });

    if (!generation) {
      return { success: false, message: "Generation not found" };
    }

    // Determine credits to refund based on service type or use a default
    let creditsToRefund = 1; // default
    
    // Get user's subscription to determine credit costs
    const creditCheck = await convex.query(api.subscriptions.checkCreditAvailability, {
      clerkId,
      serviceType: generation.serviceType || 'image'
    });

    if (creditCheck.requiredCredits > 0) {
      creditsToRefund = creditCheck.requiredCredits;
    }

    // Perform the refund
    const refundResult = await convex.mutation(api.subscriptions.refundCredits, {
      clerkId,
      generationId: generation._id,
      creditsToRefund,
      reason
    });

    return { 
      success: true, 
      message: `Refunded ${creditsToRefund} credits. New balance: ${refundResult.newBalance}` 
    };
  } catch (error) {
    console.error('Refund credits error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to refund credits" 
    };
  }
}

// Update generation statistics and usage tracking
export async function updateGenerationStats(
  clerkId: string,
  serviceType: ServiceType,
  processingTime: number,
  success: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    // Record usage event
    const now = Date.now();
    
    await convex.mutation(api.usageEvents.createEvent, {
      clerkId,
      eventType: 'generation_completed',
      serviceType,
      metadata: {
        processingTime,
        success,
        timestamp: now
      }
    });

    return { 
      success: true, 
      message: `Updated stats for ${serviceType} generation (${processingTime}ms, success: ${success})` 
    };
  } catch (error) {
    console.error('Update generation stats error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to update stats" 
    };
  }
}

// Helper function to check user credits
export async function checkUserCredits(
  clerkId: string, 
  serviceType: ServiceType
): Promise<{
  hasCredits: boolean;
  currentCredits: number;
  requiredCredits: number;
  error?: string;
}> {
  try {
    const creditCheck = await convex.query(api.subscriptions.checkCreditAvailability, {
      clerkId,
      serviceType
    });

    return creditCheck;
  } catch (error) {
    console.error('Check user credits error:', error);
    return {
      hasCredits: false,
      currentCredits: 0,
      requiredCredits: 0,
      error: error instanceof Error ? error.message : "Failed to check credits"
    };
  }
}

// Helper function to deduct credits for generation
export async function deductGenerationCredits(
  clerkId: string,
  generationId: string,
  serviceType: ServiceType
): Promise<{ success: boolean; remainingCredits: number; message: string }> {
  try {
    // First check credit availability
    const creditCheck = await checkUserCredits(clerkId, serviceType);
    
    if (!creditCheck.hasCredits) {
      return {
        success: false,
        remainingCredits: creditCheck.currentCredits,
        message: `Insufficient credits. Required: ${creditCheck.requiredCredits}, Available: ${creditCheck.currentCredits}`
      };
    }

    // Deduct the credits
    const result = await convex.mutation(api.subscriptions.deductCredits, {
      clerkId,
      generationId: generationId as any, // Type conversion for Convex ID
      serviceType,
      creditsRequired: creditCheck.requiredCredits
    });

    return {
      success: true,
      remainingCredits: result.remainingCredits,
      message: `Deducted ${creditCheck.requiredCredits} credits. Remaining: ${result.remainingCredits}`
    };
  } catch (error) {
    console.error('Deduct generation credits error:', error);
    return {
      success: false,
      remainingCredits: 0,
      message: error instanceof Error ? error.message : "Failed to deduct credits"
    };
  }
}