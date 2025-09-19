import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles with Clerk integration
  users: defineTable({
    clerkId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    hasCompletedBetaSignup: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  // Subscription and billing data
  subscriptions: defineTable({
    userId: v.id("users"),
    clerkId: v.string(),
    planId: v.string(), // "creator", "freelancer", "agency", "enterprise"
    status: v.string(), // "active", "canceled", "past_due", "trialing"
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
    
    // Razorpay Integration
    razorpaySubscriptionId: v.optional(v.string()),
    razorpayCustomerId: v.optional(v.string()),
    razorpayPlanId: v.optional(v.string()),
    
    // Credit System
    credits: v.number(), // Available credits
    totalCredits: v.number(), // Total credits for this billing period
    creditsUsed: v.number(), // Credits used this period
    creditValue: v.number(), // Price per credit in INR
    
    // Plan Features
    maxConcurrency: v.number(), // Max concurrent generations
    retentionDays: v.number(), // Asset retention period
    hasWatermark: v.boolean(), // Watermark on outputs
    hasPriorityProcessing: v.boolean(),
    hasAPIAccess: v.boolean(),
    hasCommercialLicense: v.boolean(),
    hasWhiteLabel: v.boolean(),
    
    // Billing
    amount: v.number(), // Subscription amount in INR
    currency: v.string(), // "INR"
    billingCycle: v.string(), // "monthly", "annual"
    nextBillingDate: v.optional(v.number()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_clerkId", ["clerkId"])
    .index("by_razorpaySubscriptionId", ["razorpaySubscriptionId"]),

  // Flow definitions (templates/configurations)
  flows: defineTable({
    id: v.string(), // Unique flow identifier
    title: v.string(),
    description: v.string(),
    category: v.string(), // "E-commerce", "Marketing", "Social", "Design"
    thumbnail: v.optional(v.string()),
    previewVideo: v.optional(v.string()),
    isActive: v.boolean(),
    isPublic: v.boolean(),
    tags: v.array(v.string()),
    
    // JSON Schema for input validation
    inputSchema: v.any(), // JSON Schema object
    
    // n8n workflow configuration
    n8nWorkflowId: v.string(),
    estimatedProcessingTime: v.number(), // Seconds
    
    // Pricing and limits
    creditsPerGeneration: v.number(),
    requiredPlan: v.string(), // "free", "pro", "business"
    
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_category", ["category"])
    .index("by_isPublic", ["isPublic"])
    .searchIndex("search_flows", {
      searchField: "title",
      filterFields: ["category", "isActive", "isPublic"]
    }),

  // Generation jobs and results
  generations: defineTable({
    userId: v.id("users"),
    clerkId: v.string(),
    flowId: v.string(),
    
    // Input data
    inputData: v.any(), // User-provided parameters
    inputAssets: v.array(v.object({
      url: v.string(),
      storageId: v.optional(v.string()), // Convex storage ID
      type: v.string(), // "image", "video", "audio"
      filename: v.string(),
      size: v.number(),
    })),
    
    // Processing status
    status: v.string(), // "queued", "processing", "completed", "failed", "cancelled"
    progress: v.number(), // 0-100
    
    // n8n integration
    n8nExecutionId: v.optional(v.string()),
    
    // Results
    outputAssets: v.optional(v.array(v.object({
      url: v.string(),
      type: v.string(),
      filename: v.string(),
      size: v.number(),
      format: v.string(), // Output format/dimension
    }))),
    response: v.optional(v.string()), // Agent response text
    
    // Error handling
    errorMessage: v.optional(v.string()),
    errorDetails: v.optional(v.any()),
    
    // Metadata
    processingStartedAt: v.optional(v.number()),
    processingCompletedAt: v.optional(v.number()),
    cancelledAt: v.optional(v.number()),
    retryCount: v.number(),
    creditsUsed: v.number(),
    
    createdAt: v.number(),
    updatedAt: v.number(),
    expiresAt: v.optional(v.number()), // Asset retention expiry
  }).index("by_userId", ["userId"])
    .index("by_clerkId", ["clerkId"])
    .index("by_status", ["status"])
    .index("by_flowId", ["flowId"])
    .index("by_createdAt", ["createdAt"]),

  // Usage tracking for billing and analytics
  usageEvents: defineTable({
    userId: v.id("users"),
    clerkId: v.string(),
    eventType: v.string(), // "generation_started", "generation_completed", "credit_consumed"
    generationId: v.optional(v.id("generations")),
    flowId: v.optional(v.string()),
    credits: v.number(), // Credits consumed/refunded
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_clerkId", ["clerkId"])
    .index("by_eventType", ["eventType"])
    .index("by_createdAt", ["createdAt"]),

  // System configuration and feature flags
  systemConfig: defineTable({
    key: v.string(),
    value: v.any(),
    description: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  // File metadata for tracking uploads
  fileMetadata: defineTable({
    storageId: v.id("_storage"),
    filename: v.string(),
    size: v.number(),
    contentType: v.string(),
    purpose: v.optional(v.string()), // "avatar", "input", "output"
    uploadedBy: v.string(), // User ID
    uploadedAt: v.number(),
  }).index("by_storageId", ["storageId"])
    .index("by_uploadedBy", ["uploadedBy"]),

  // Conversation sessions for chat history
  conversations: defineTable({
    userId: v.id("users"),
    clerkId: v.string(),
    flowId: v.string(),
    title: v.optional(v.string()), // Auto-generated from first message
    lastMessageAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerkId", ["clerkId"])
    .index("by_flowId", ["flowId"])
    .index("by_lastMessageAt", ["lastMessageAt"]),

  // Individual messages within conversations
  messages: defineTable({
    conversationId: v.id("conversations"),
    clerkId: v.string(),
    type: v.string(), // "user", "assistant", "system"
    content: v.string(),
    generationId: v.optional(v.id("generations")),
    outputAssets: v.optional(v.array(v.object({
      url: v.string(),
      type: v.string(),
      filename: v.string(),
    }))),
    inputAssets: v.optional(v.array(v.object({
      url: v.string(),
      type: v.string(),
      filename: v.string(),
    }))),
    createdAt: v.number(),
  }).index("by_conversationId", ["conversationId"])
    .index("by_clerkId", ["clerkId"])
    .index("by_generationId", ["generationId"]),

  // Plan definitions and pricing
  plans: defineTable({
    planId: v.string(), // "creator", "freelancer", "agency", "enterprise"
    name: v.string(),
    description: v.string(),
    
    // Pricing
    monthlyPrice: v.number(), // INR
    annualPrice: v.number(), // INR (with discount)
    creditValue: v.number(), // Price per credit in INR
    
    // Credits and Usage
    monthlyCredits: v.number(),
    annualCredits: v.number(), // Usually monthly * 12 + bonus
    
    // Service Costs (in credits)
    imageGenerationCost: v.number(), // Credits per image
    videoGenerationCost: v.number(), // Credits per video
    talkingHeadCost: v.number(), // Credits per talking head
    
    // Features
    maxConcurrency: v.number(),
    retentionDays: v.number(),
    hasWatermark: v.boolean(),
    hasPriorityProcessing: v.boolean(),
    hasAPIAccess: v.boolean(),
    hasCommercialLicense: v.boolean(),
    hasWhiteLabel: v.boolean(),
    
    // Razorpay Plan IDs
    razorpayMonthlyPlanId: v.optional(v.string()),
    razorpayAnnualPlanId: v.optional(v.string()),
    
    isActive: v.boolean(),
    sortOrder: v.number(), // For display ordering
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_planId", ["planId"])
    .index("by_isActive", ["isActive"]),

  // Credit transactions for detailed tracking
  creditTransactions: defineTable({
    userId: v.id("users"),
    clerkId: v.string(),
    subscriptionId: v.id("subscriptions"),
    generationId: v.optional(v.id("generations")),
    
    // Transaction Details
    type: v.string(), // "debit", "credit", "refund", "bonus"
    amount: v.number(), // Number of credits
    balance: v.number(), // Remaining balance after transaction
    
    // Context
    description: v.string(), // "Image generation", "Video creation", "Monthly refill", etc.
    serviceType: v.optional(v.string()), // "image", "video", "talking_head"
    
    createdAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_clerkId", ["clerkId"])
    .index("by_subscriptionId", ["subscriptionId"])
    .index("by_generationId", ["generationId"])
    .index("by_createdAt", ["createdAt"]),

  // Billing history and invoices
  billingHistory: defineTable({
    userId: v.id("users"),
    clerkId: v.string(),
    subscriptionId: v.id("subscriptions"),
    
    // Razorpay Details
    razorpayPaymentId: v.optional(v.string()),
    razorpayOrderId: v.optional(v.string()),
    razorpayInvoiceId: v.optional(v.string()),
    
    // Transaction Details
    amount: v.number(), // Amount in INR
    currency: v.string(), // "INR"
    status: v.string(), // "paid", "failed", "pending", "refunded"
    
    // Plan Details
    planId: v.string(),
    billingCycle: v.string(), // "monthly", "annual"
    creditsGranted: v.number(), // Credits added to account
    
    // Dates
    billingPeriodStart: v.number(),
    billingPeriodEnd: v.number(),
    paidAt: v.optional(v.number()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_clerkId", ["clerkId"])
    .index("by_subscriptionId", ["subscriptionId"])
    .index("by_razorpayPaymentId", ["razorpayPaymentId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // Usage analytics and limits
  usageLimits: defineTable({
    userId: v.id("users"),
    clerkId: v.string(),
    
    // Monthly limits and usage
    month: v.string(), // "2025-01" format
    planId: v.string(),
    
    // Credit Usage
    creditsLimit: v.number(),
    creditsUsed: v.number(),
    
    // Service Usage
    imagesGenerated: v.number(),
    videosGenerated: v.number(),
    talkingHeadsGenerated: v.number(),
    
    // Performance Metrics
    avgProcessingTime: v.number(), // Milliseconds
    successRate: v.number(), // Percentage
    
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_clerkId", ["clerkId"])
    .index("by_month", ["month"])
    .index("by_clerkId_month", ["clerkId", "month"]),
});