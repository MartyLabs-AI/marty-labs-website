import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create a conversation for a user and flow
export const getOrCreateConversation = mutation({
  args: {
    clerkId: v.string(),
    flowId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Look for existing conversation for this user and flow
    const existingConversation = await ctx.db
      .query("conversations")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .filter((q) => q.eq(q.field("flowId"), args.flowId))
      .order("desc")
      .first();

    if (existingConversation) {
      return existingConversation._id;
    }

    // Create new conversation
    const now = Date.now();
    const conversationId = await ctx.db.insert("conversations", {
      userId: user._id,
      clerkId: args.clerkId,
      flowId: args.flowId,
      lastMessageAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Add system welcome message
    await ctx.db.insert("messages", {
      conversationId,
      clerkId: args.clerkId,
      type: "system",
      content: "👋 Hi! I'm your Producer Agent. I can create images, videos, and lipsync content from your natural language requests. Attach images, videos, or audio files and tell me what you want to create!",
      createdAt: now,
    });

    return conversationId;
  },
});

// Always create a NEW conversation (for "New Chat" button)
export const createNewConversation = mutation({
  args: {
    clerkId: v.string(),
    flowId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Always create new conversation (don't check for existing)
    const now = Date.now();
    const conversationId = await ctx.db.insert("conversations", {
      userId: user._id,
      clerkId: args.clerkId,
      flowId: args.flowId,
      lastMessageAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Add system welcome message
    await ctx.db.insert("messages", {
      conversationId,
      clerkId: args.clerkId,
      type: "system",
      content: "👋 Hi! I'm your Producer Agent. I can create images, videos, and lipsync content from your natural language requests. Attach images, videos, or audio files and tell me what you want to create!",
      createdAt: now,
    });

    return conversationId;
  },
});

// Add a message to a conversation
export const addMessage = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Add the message
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      clerkId: args.clerkId,
      type: args.type,
      content: args.content,
      generationId: args.generationId,
      outputAssets: args.outputAssets,
      inputAssets: args.inputAssets,
      createdAt: now,
    });

    // Update conversation lastMessageAt and title if needed
    const conversation = await ctx.db.get(args.conversationId);
    if (conversation) {
      const updateData: any = {
        lastMessageAt: now,
        updatedAt: now,
      };

      // Auto-generate title from first user message if not set
      if (!conversation.title && args.type === "user") {
        const title = args.content.length > 50 
          ? args.content.substring(0, 47) + "..."
          : args.content;
        updateData.title = title;
      }

      await ctx.db.patch(args.conversationId, updateData);
    }

    return messageId;
  },
});

// Get conversation messages
export const getConversationMessages = query({
  args: {
    conversationId: v.id("conversations"),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify user has access to this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.clerkId !== args.clerkId) {
      return [];
    }

    // Get all messages for this conversation
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();

    return messages.map(msg => ({
      id: msg._id,
      type: msg.type,
      content: msg.content,
      timestamp: msg.createdAt,
      generationId: msg.generationId,
      outputAssets: msg.outputAssets,
    }));
  },
});

// Get user's conversation history
export const getUserConversations = query({
  args: {
    clerkId: v.string(),
    flowId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("conversations")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId));

    if (args.flowId) {
      query = query.filter((q) => q.eq(q.field("flowId"), args.flowId));
    }

    const conversations = await query
      .order("desc")
      .take(args.limit || 20);

    // Get the latest message for each conversation
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conversation) => {
        const latestMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) => q.eq("conversationId", conversation._id))
          .order("desc")
          .first();

        return {
          ...conversation,
          latestMessage: latestMessage ? {
            type: latestMessage.type,
            content: latestMessage.content,
            createdAt: latestMessage.createdAt,
          } : null,
        };
      })
    );

    return conversationsWithMessages;
  },
});

// Get conversations for a specific flow
export const getFlowConversations = query({
  args: {
    clerkId: v.string(),
    flowId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .filter((q) => q.eq(q.field("flowId"), args.flowId))
      .order("desc")
      .take(args.limit || 20);

    // Get message count for each conversation
    const conversationsWithData = await Promise.all(
      conversations.map(async (conversation) => {
        const messageCount = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) => q.eq("conversationId", conversation._id))
          .collect()
          .then(messages => messages.length);

        return {
          ...conversation,
          messageCount,
        };
      })
    );

    return conversationsWithData;
  },
});

// Delete a conversation
export const deleteConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify user has access to this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.clerkId !== args.clerkId) {
      throw new Error("Conversation not found or access denied");
    }

    // Delete all messages in the conversation
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the conversation
    await ctx.db.delete(args.conversationId);

    return { success: true };
  },
});