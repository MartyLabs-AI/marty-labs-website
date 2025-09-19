// Razorpay integration for subscription billing
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Types for Razorpay (since @types/razorpay doesn't exist)
export interface RazorpayPlan {
  id: string;
  item: {
    id: string;
    name: string;
    description: string;
    amount: number;
    currency: string;
  };
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  created_at: number;
}

export interface RazorpaySubscription {
  id: string;
  entity: string;
  plan_id: string;
  customer_id: string;
  status: 'created' | 'authenticated' | 'active' | 'paused' | 'halted' | 'cancelled' | 'completed' | 'expired';
  current_start?: number;
  current_end?: number;
  ended_at?: number;
  quantity: number;
  notes: Record<string, string>;
  charge_at: number;
  start_at: number;
  end_at: number;
  auth_attempts: number;
  total_count: number;
  paid_count: number;
  customer_notify: boolean;
  created_at: number;
  expire_by?: number;
  short_url: string;
  has_scheduled_changes: boolean;
  change_scheduled_at?: number;
  source: string;
  offer_id?: string;
  remaining_count: number;
}

export interface RazorpayCustomer {
  id: string;
  entity: string;
  name: string;
  email: string;
  contact?: string;
  gstin?: string;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  order_id?: string;
  invoice_id?: string;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status?: string;
  captured: boolean;
  description?: string;
  card_id?: string;
  bank?: string;
  wallet?: string;
  vpa?: string;
  email: string;
  contact: string;
  notes: Record<string, string>;
  fee?: number;
  tax?: number;
  error_code?: string;
  error_description?: string;
  error_source?: string;
  error_step?: string;
  error_reason?: string;
  acquirer_data?: Record<string, any>;
  created_at: number;
}

// Create Razorpay plans for all our subscription tiers
export const createRazorpayPlans = async () => {
  const plans = [
    {
      id: 'freelancer_monthly',
      name: 'Freelancer Monthly',
      amount: 124900, // ₹1,249 in paise
      currency: 'INR',
      interval: 1,
      period: 'monthly' as const,
      description: 'For freelancers and small businesses - 100 credits monthly',
    },
    {
      id: 'freelancer_annual',
      name: 'Freelancer Annual', 
      amount: 99990, // ₹999.9 per month when billed annually (₹11,999/12)
      currency: 'INR',
      interval: 12,
      period: 'monthly' as const,
      description: 'For freelancers and small businesses - 1200 credits annually',
    },
    {
      id: 'agency_monthly',
      name: 'Agency Monthly',
      amount: 374900, // ₹3,749 in paise
      currency: 'INR',
      interval: 1,
      period: 'monthly' as const,
      description: 'For agencies and growing teams - 400 credits monthly',
    },
    {
      id: 'agency_annual',
      name: 'Agency Annual',
      amount: 249992, // ₹2,499.92 per month when billed annually (₹29,999/12)
      currency: 'INR',
      interval: 12,
      period: 'monthly' as const,
      description: 'For agencies and growing teams - 4800 credits annually',
    },
    {
      id: 'enterprise_monthly',
      name: 'Enterprise Monthly',
      amount: 1074900, // ₹10,749 in paise
      currency: 'INR',
      interval: 1,
      period: 'monthly' as const,
      description: 'For large organizations - 1500 credits monthly',
    },
    {
      id: 'enterprise_annual',
      name: 'Enterprise Annual',
      amount: 833325, // ₹8,333.25 per month when billed annually (₹99,999/12)
      currency: 'INR',
      interval: 12,
      period: 'monthly' as const,
      description: 'For large organizations - 18000 credits annually',
    },
  ];

  const createdPlans = [];
  
  for (const planData of plans) {
    try {
      // First create an item
      const item = await razorpay.items.create({
        name: planData.name,
        description: planData.description,
        amount: planData.amount,
        currency: planData.currency,
      });

      // Then create the plan
      const plan = await razorpay.plans.create({
        period: planData.period,
        interval: planData.interval,
        item: {
          name: planData.name,
          amount: planData.amount,
          currency: planData.currency,
          description: planData.description,
        },
        notes: {
          plan_id: planData.id,
          credits: planData.id.includes('freelancer') ? 
            (planData.id.includes('annual') ? '1200' : '100') :
            planData.id.includes('agency') ?
            (planData.id.includes('annual') ? '4800' : '400') :
            (planData.id.includes('annual') ? '18000' : '1500'),
        },
      });

      createdPlans.push({
        localId: planData.id,
        razorpayPlanId: plan.id,
        itemId: item.id,
      });
    } catch (error) {
      console.error(`Failed to create plan ${planData.id}:`, error);
    }
  }

  return createdPlans;
};

// Create Razorpay customer
export const createRazorpayCustomer = async (userData: {
  name: string;
  email: string;
  contact?: string;
  clerkId: string;
}) => {
  try {
    const customer = await razorpay.customers.create({
      name: userData.name,
      email: userData.email,
      contact: userData.contact,
      notes: {
        clerk_id: userData.clerkId,
      },
    });

    return customer;
  } catch (error) {
    console.error('Failed to create Razorpay customer:', error);
    throw error;
  }
};

// Create subscription
export const createRazorpaySubscription = async (subscriptionData: {
  planId: string;
  customerId: string;
  totalCount: number;
  customerNotify: boolean;
  startAt?: number;
  expireBy?: number;
  notes?: Record<string, string>;
}) => {
  try {
    // @ts-ignore - Razorpay SDK type definition issue
    const subscription = await razorpay.subscriptions.create({
      plan_id: subscriptionData.planId,
      customer_id: subscriptionData.customerId,
      total_count: subscriptionData.totalCount,
      customer_notify: subscriptionData.customerNotify,
      start_at: subscriptionData.startAt,
      expire_by: subscriptionData.expireBy,
      notes: subscriptionData.notes || {},
    });

    return subscription;
  } catch (error) {
    console.error('Failed to create Razorpay subscription:', error);
    throw error;
  }
};

// Cancel subscription
export const cancelRazorpaySubscription = async (subscriptionId: string, cancelAtCycleEnd = true) => {
  try {
    const subscription = await razorpay.subscriptions.cancel(subscriptionId, {
      cancel_at_cycle_end: cancelAtCycleEnd ? 1 : 0,
    });

    return subscription;
  } catch (error) {
    console.error('Failed to cancel Razorpay subscription:', error);
    throw error;
  }
};

// Verify webhook signature
export const verifyRazorpayWebhook = (body: string, signature: string, secret: string): boolean => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Failed to verify webhook signature:', error);
    return false;
  }
};

// Get subscription details
export const getRazorpaySubscription = async (subscriptionId: string) => {
  try {
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Failed to fetch subscription:', error);
    throw error;
  }
};

// Get payment details
export const getRazorpayPayment = async (paymentId: string) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Failed to fetch payment:', error);
    throw error;
  }
};