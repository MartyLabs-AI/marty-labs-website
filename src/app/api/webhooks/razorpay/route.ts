import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";
import { verifyRazorpayWebhook } from '@/lib/razorpay';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    if (!signature) {
      console.error('Missing Razorpay signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const isValidSignature = verifyRazorpayWebhook(body, signature, webhookSecret);
    
    if (!isValidSignature) {
      console.error('Invalid Razorpay signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log('Razorpay webhook event:', event.event, event.payload?.subscription?.entity?.id);

    switch (event.event) {
      case 'subscription.authenticated':
        await handleSubscriptionAuthenticated(event.payload.subscription.entity);
        break;
        
      case 'subscription.activated':
        await handleSubscriptionActivated(event.payload.subscription.entity);
        break;
        
      case 'subscription.charged':
        await handleSubscriptionCharged(event.payload.subscription.entity, event.payload.payment?.entity);
        break;
        
      case 'subscription.completed':
        await handleSubscriptionCompleted(event.payload.subscription.entity);
        break;
        
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.payload.subscription.entity);
        break;
        
      case 'subscription.paused':
        await handleSubscriptionPaused(event.payload.subscription.entity);
        break;
        
      case 'subscription.halted':
        await handleSubscriptionHalted(event.payload.subscription.entity);
        break;
        
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
        
      default:
        console.log('Unhandled Razorpay event:', event.event);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message }, 
      { status: 500 }
    );
  }
}

async function handleSubscriptionAuthenticated(subscription: any) {
  try {
    const clerkId = subscription.notes?.clerk_id;
    if (!clerkId) {
      console.error('No clerk_id in subscription notes');
      return;
    }

    // Update subscription status in Convex
    const userSubscription = await convex.query(api.subscriptions.getUserSubscription, { 
      clerkId 
    });

    if (userSubscription && userSubscription.razorpaySubscriptionId === subscription.id) {
      // Update subscription status (but don't activate credits yet)
      await convex.patch(api.subscriptions.updateSubscriptionStatus, {
        clerkId,
        status: 'authenticated',
        razorpayData: {
          currentStart: subscription.current_start ? subscription.current_start * 1000 : undefined,
          currentEnd: subscription.current_end ? subscription.current_end * 1000 : undefined,
        }
      });
    }

    console.log('Subscription authenticated:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription authenticated:', error);
  }
}

async function handleSubscriptionActivated(subscription: any) {
  try {
    const clerkId = subscription.notes?.clerk_id;
    if (!clerkId) {
      console.error('No clerk_id in subscription notes');
      return;
    }

    // Update subscription to active and grant credits
    await convex.mutation(api.subscriptions.activateSubscription, {
      clerkId,
      razorpaySubscriptionId: subscription.id,
      currentStart: subscription.current_start ? subscription.current_start * 1000 : Date.now(),
      currentEnd: subscription.current_end ? subscription.current_end * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000),
    });

    console.log('Subscription activated and credits granted:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription activated:', error);
  }
}

async function handleSubscriptionCharged(subscription: any, payment: any) {
  try {
    const clerkId = subscription.notes?.clerk_id;
    if (!clerkId) {
      console.error('No clerk_id in subscription notes');
      return;
    }

    // Record billing history
    await convex.mutation(api.billing.recordPayment, {
      clerkId,
      razorpaySubscriptionId: subscription.id,
      razorpayPaymentId: payment?.id,
      amount: payment?.amount || 0,
      status: payment?.status || 'paid',
      paidAt: payment?.created_at ? payment.created_at * 1000 : Date.now(),
    });

    // Refresh credits for the new billing period
    await convex.mutation(api.subscriptions.refreshCredits, {
      clerkId,
      billingPeriodStart: subscription.current_start ? subscription.current_start * 1000 : Date.now(),
      billingPeriodEnd: subscription.current_end ? subscription.current_end * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000),
    });

    console.log('Subscription charged and credits refreshed:', subscription.id, payment?.id);
  } catch (error) {
    console.error('Error handling subscription charged:', error);
  }
}

async function handleSubscriptionCompleted(subscription: any) {
  try {
    const clerkId = subscription.notes?.clerk_id;
    if (!clerkId) {
      console.error('No clerk_id in subscription notes');
      return;
    }

    // Update subscription to completed
    await convex.mutation(api.subscriptions.updateSubscriptionStatus, {
      clerkId,
      status: 'completed',
      endedAt: Date.now(),
    });

    console.log('Subscription completed:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription completed:', error);
  }
}

async function handleSubscriptionCancelled(subscription: any) {
  try {
    const clerkId = subscription.notes?.clerk_id;
    if (!clerkId) {
      console.error('No clerk_id in subscription notes');
      return;
    }

    // Update subscription to cancelled (but keep credits until period ends)
    await convex.mutation(api.subscriptions.updateSubscriptionStatus, {
      clerkId,
      status: 'cancelled',
      cancelledAt: Date.now(),
      cancelAtPeriodEnd: true,
    });

    console.log('Subscription cancelled:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
  }
}

async function handleSubscriptionPaused(subscription: any) {
  try {
    const clerkId = subscription.notes?.clerk_id;
    if (!clerkId) {
      console.error('No clerk_id in subscription notes');
      return;
    }

    // Update subscription to paused
    await convex.mutation(api.subscriptions.updateSubscriptionStatus, {
      clerkId,
      status: 'paused',
    });

    console.log('Subscription paused:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription paused:', error);
  }
}

async function handleSubscriptionHalted(subscription: any) {
  try {
    const clerkId = subscription.notes?.clerk_id;
    if (!clerkId) {
      console.error('No clerk_id in subscription notes');
      return;
    }

    // Update subscription to halted (payment failures)
    await convex.mutation(api.subscriptions.updateSubscriptionStatus, {
      clerkId,
      status: 'halted',
    });

    console.log('Subscription halted:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription halted:', error);
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    // Extract subscription info from payment
    const subscriptionId = payment.subscription_id;
    if (!subscriptionId) {
      console.error('No subscription_id in failed payment');
      return;
    }

    // Record failed payment
    await convex.mutation(api.billing.recordFailedPayment, {
      razorpayPaymentId: payment.id,
      razorpaySubscriptionId: subscriptionId,
      amount: payment.amount || 0,
      errorCode: payment.error_code,
      errorDescription: payment.error_description,
      failedAt: payment.created_at ? payment.created_at * 1000 : Date.now(),
    });

    console.log('Payment failed recorded:', payment.id);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}