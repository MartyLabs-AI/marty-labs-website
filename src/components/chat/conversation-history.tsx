"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Clock, MessageSquare, Image, Video, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ConversationHistoryProps {
  clerkId: string;
  flowId: string;
}

export function ConversationHistory({ clerkId, flowId }: ConversationHistoryProps) {
  const conversations = useQuery(api.conversations.getUserConversations, {
    clerkId,
    flowId,
    limit: 10,
  });
  
  const deleteConversation = useMutation(api.conversations.deleteConversation);
  
  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    try {
      await deleteConversation({ conversationId, clerkId });
      toast.success("Conversation deleted");
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast.error("Failed to delete conversation");
    }
  };

  if (conversations === undefined) {
    return (
      <div className="p-4 space-y-4">
        {/* Loading skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-800/40 rounded-lg p-4">
              <div className="h-4 bg-slate-700/60 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-700/40 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center text-slate-400 text-sm font-light py-8">
          Your conversation history will appear here as you interact with the Producer Agent.
        </div>
      </div>
    );
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getAssetCount = (conversation: any) => {
    // Count assets from all messages in the conversation
    // This is a simplified approach - in a real implementation,
    // you might want to get this data from the API
    return 0; // Placeholder for now
  };

  return (
    <div className="p-4 space-y-3">
      {conversations.map((conversation) => (
        <Card
          key={conversation._id}
          className="bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer"
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Conversation Title */}
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-medium text-slate-200 line-clamp-2 flex-1 pr-2">
                  {conversation.title || "New Conversation"}
                </h4>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {formatTime(conversation.lastMessageAt)}
                  </div>
                  <Button
                    onClick={(e) => handleDeleteConversation(conversation._id, e)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-red-800/20 hover:text-red-400 text-slate-500"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Latest Message Preview */}
              {conversation.latestMessage && (
                <div className="text-xs text-slate-400 line-clamp-2">
                  <span className="capitalize">
                    {conversation.latestMessage.type === "user" ? "You" : 
                     conversation.latestMessage.type === "assistant" ? "Agent" : "System"}:
                  </span>{" "}
                  {conversation.latestMessage.content}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>Chat</span>
                </div>
                {getAssetCount(conversation) > 0 && (
                  <div className="flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    <span>{getAssetCount(conversation)} assets</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}