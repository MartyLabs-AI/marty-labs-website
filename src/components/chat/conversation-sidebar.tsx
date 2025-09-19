"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  Trash2, 
  User, 
  Bot,
  Sparkles,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationSidebarProps {
  flowId: string;
  currentConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
}

export function ConversationSidebar({
  flowId,
  currentConversationId,
  onConversationSelect,
  onNewConversation,
}: ConversationSidebarProps) {
  const { user } = useUser();
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);

  const conversations = useQuery(
    api.conversations.getFlowConversations,
    user ? { clerkId: user.id, flowId } : "skip"
  );

  const deleteConversation = useMutation(api.conversations.deleteConversation);

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation({ conversationId, clerkId: user?.id || "" });
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  return (
    <div className="w-80 h-full flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Chat History</h3>
              <p className="text-xs text-muted-foreground">Producer Agent</p>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={onNewConversation}
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {conversations && conversations.length > 0 ? (
            conversations.map((conversation) => {
              const isActive = conversation._id === currentConversationId;
              const lastMessageTime = conversation.updatedAt || conversation.createdAt;
              const messageCount = conversation.messageCount || 0;
              
              return (
                <div
                  key={conversation._id}
                  className={cn(
                    "group relative p-4 cursor-pointer transition-all duration-300",
                    isActive
                      ? "bg-primary/5"
                      : "hover:bg-muted/30"
                  )}
                  onClick={() => onConversationSelect(conversation._id)}
                  onMouseEnter={() => setHoveredConversation(conversation._id)}
                  onMouseLeave={() => setHoveredConversation(null)}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={cn(
                        "w-8 h-8 flex items-center justify-center flex-shrink-0"
                      )}>
                        <Bot className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium text-sm truncate",
                          isActive ? "text-primary" : "text-foreground"
                        )}>
                          {conversation.title || "New Conversation"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {messageCount} messages
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={cn(
                      "transition-opacity duration-200",
                      hoveredConversation === conversation._id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteConversation(conversation._id, e)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Last activity */}
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatDistanceToNow(lastMessageTime, { addSuffix: true })}</span>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 ml-auto text-primary" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-sm font-medium mb-2">No conversations yet</p>
              <p className="text-xs leading-relaxed">
                Start your first conversation to see it appear here.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="w-6 h-6 flex items-center justify-center">
            <User className="w-3 h-3 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{user?.fullName || "User"}</p>
            <p>{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}