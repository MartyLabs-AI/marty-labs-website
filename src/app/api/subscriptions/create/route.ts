import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";
import { createRazorpayCustomer, createRazorpaySubscription } from '@/lib/razorpay';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, billingCycle, customerInfo } = body;

    // Validate required fields
    if (!planId || !billingCycle || !customerInfo) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, billingCycle, customerInfo' }, 
        { status: 400 }
      );
    }

    // Get plan details from Convex
    const plan = await convex.query(api.subscriptions.getPlan, { planId });
    
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Check if user already has a subscription
    const existingSubscription = await convex.query(api.subscriptions.getUserSubscription, { 
      clerkId: userId 
    });

    let razorpayCustomerId;
    
    if (existingSubscription?.razorpayCustomerId) {
      // Use existing Razorpay customer
      razorpayCustomerId = existingSubscription.razorpayCustomerId;
    } else {
      // Create new Razorpay customer
      const razorpayCustomer = await createRazorpayCustomer({
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.contact,
        clerkId: userId,
      });
      razorpayCustomerId = razorpayCustomer.id;
    }

    // Determine Razorpay plan ID
    const razorpayPlanId = billingCycle === 'annual' 
      ? plan.razorpayAnnualPlanId 
      : plan.razorpayMonthlyPlanId;

    if (!razorpayPlanId) {
      return NextResponse.json(
        { error: 'Razorpay plan not configured for this billing cycle' }, 
        { status: 500 }
      );
    }

    // Calculate subscription parameters
    const totalCount = billingCycle === 'annual' ? 12 : 0; // 0 means infinite for monthly
    const startAt = Math.floor(Date.now() / 1000); // Start immediately

    // Create Razorpay subscription
    const razorpaySubscription = await createRazorpaySubscription({
      planId: razorpayPlanId,
      customerId: razorpayCustomerId,
      totalCount: totalCount,
      customerNotify: true,
      startAt: startAt,
      notes: {
        clerk_id: userId,
        plan_id: planId,
        billing_cycle: billingCycle,
      },
    });

    // Create/update subscription in Convex
    const subscriptionId = await convex.mutation(api.subscriptions.createSubscription, {
      clerkId: userId,
      planId: planId,
      billingCycle: billingCycle,
      razorpaySubscriptionId: razorpaySubscription.id,
      razorpayCustomerId: razorpayCustomerId,
    });

    return NextResponse.json({
      success: true,
      subscriptionId: subscriptionId,
      razorpaySubscriptionId: razorpaySubscription.id,
      shortUrl: razorpaySubscription.short_url,
      status: razorpaySubscription.status,
      amount: billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice,
      credits: billingCycle === 'annual' ? plan.annualCredits : plan.monthlyCredits,
    });

  } catch (error: any) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create subscription', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}