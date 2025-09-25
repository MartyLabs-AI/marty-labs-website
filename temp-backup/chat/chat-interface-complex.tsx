"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Paperclip, X, FileImage, FileVideo, FileAudio, Square } from "lucide-react";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import AIPromptInput from "./ai-prompt-input";
import AILoadingState from "./ai-loading-state";
import { toast } from "sonner";
// TEMPORARILY COMMENTED FOR DEPLOYMENT - RESTORE WHEN CONVEX IS READY
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/../convex/_generated/api";
// import { Id } from "@/../convex/_generated/dataModel";
// import { useUser } from "@clerk/nextjs";

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date | number;
  generationId?: string;
  outputAssets?: Array<{
    url: string;
    type: string;
    filename: string;
  }>;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string, files: File[]) => Promise<{ 
    generationId: string;
    inputAssets?: Array<{
      url: string;
      type: string;
      filename: string;
    }>;
  }>;
  onCancelGeneration: (generationId: string) => Promise<void>;
  isProcessing: boolean;
  flowId: string;
  forceNewConversation?: boolean; // New prop to force creating a new conversation
  currentStatus?: {
    status: string;
    progress: number;
    currentStep?: string;
    response?: string;
    outputAssets?: Array<{
      url: string;
      type: string;
      filename: string;
    }>;
  };
}

export function ChatInterface({ 
  onSendMessage, 
  onCancelGeneration,
  isProcessing,
  flowId,
  forceNewConversation = false,
  currentStatus 
}: ChatInterfaceProps) {
  const { user } = useUser();
  
  // Conversation state
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null);
  const [completedGenerations, setCompletedGenerations] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convex mutations and queries
  const getOrCreateConversation = useMutation(api.conversations.getOrCreateConversation);
  const createNewConversation = useMutation(api.conversations.createNewConversation);
  const addMessage = useMutation(api.conversations.addMessage);
  const conversationMessages = useQuery(
    api.conversations.getConversationMessages,
    conversationId && user ? { conversationId, clerkId: user.id } : "skip"
  );

  // Initialize conversation on component mount
  useEffect(() => {
    if (user?.id && flowId && !conversationId) {
      // Use createNewConversation if forceNewConversation is true, otherwise use getOrCreateConversation
      const conversationMutation = forceNewConversation ? createNewConversation : getOrCreateConversation;
      
      conversationMutation({ clerkId: user.id, flowId })
        .then(setConversationId)
        .catch(error => {
          console.error("Failed to create conversation:", error);
          toast.error("Failed to load conversation");
        });
    }
  }, [user?.id, flowId, conversationId, forceNewConversation, getOrCreateConversation, createNewConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages, isProcessing]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup any object URLs when component unmounts
      attachedFiles.forEach(file => {
        try {
          const url = URL.createObjectURL(file);
          URL.revokeObjectURL(url);
        } catch (e) {
          // Ignore errors during cleanup
        }
      });
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    console.log('Files selected:', files.length, files.map(f => f.name));
    
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') || 
                     file.type.startsWith('video/') || 
                     file.type.startsWith('audio/');
      if (!isValid) {
        toast.error(`${file.name} is not a supported file type`);
      }
      return isValid;
    });
    
    console.log('Valid files:', validFiles.length, validFiles.map(f => f.name));
    
    setAttachedFiles(prev => {
      const newFiles = [...prev, ...validFiles];
      console.log('Updated attached files:', newFiles.length, newFiles.map(f => f.name));
      return newFiles;
    });
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    console.log('removeFile called with index:', index, 'current files:', attachedFiles.length);
    setAttachedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      console.log('Files after removal:', newFiles.length);
      return newFiles;
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return FileImage;
    if (file.type.startsWith('video/')) return FileVideo;
    if (file.type.startsWith('audio/')) return FileAudio;
    return FileImage;
  };

  const handleSendMessage = async (messageContent: string, filesToSend: File[]) => {
    if (!messageContent.trim() || isProcessing || !conversationId || !user) return;

    // Clear files immediately
    setAttachedFiles([]);

    try {
      // Send message to workflow first to get inputAssets
      const result = await onSendMessage(messageContent, filesToSend);
      setCurrentGenerationId(result.generationId);
      
      // Add user message to conversation with inputAssets
      await addMessage({
        conversationId,
        clerkId: user.id,
        type: "user",
        content: messageContent,
        inputAssets: result.inputAssets || [],
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      
      // Add error message to conversation
      await addMessage({
        conversationId,
        clerkId: user.id,
        type: "assistant", 
        content: "Sorry, I encountered an error processing your request. Please try again.",
      });
      
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCancelGeneration = async () => {
    if (!currentGenerationId || !conversationId || !user) return;
    
    try {
      await onCancelGeneration(currentGenerationId);
      setCurrentGenerationId(null);
      
      // Add cancel message to conversation
      await addMessage({
        conversationId,
        clerkId: user.id,
        type: "system",
        content: "Generation cancelled successfully.",
      });
      
      toast.success("Generation cancelled");
    } catch (error) {
      console.error("Failed to cancel generation:", error);
      toast.error("Failed to cancel generation");
    }
  };

  // Add assistant message when generation completes
  useEffect(() => {
    if (!conversationId || !user || !currentGenerationId) return;

    console.log('ChatInterface currentStatus:', currentStatus);
    
    if (currentStatus?.status === "completed" && !completedGenerations.has(currentGenerationId)) {
      console.log('Creating assistant message with response:', currentStatus.response);
      
      // Extract URLs from response text if outputAssets is empty
      let extractedAssets = currentStatus.outputAssets || [];
      
      // If no outputAssets but response contains URLs, try to extract them
      if ((!extractedAssets || extractedAssets.length === 0) && currentStatus.response) {
        const urlRegex = /https:\/\/[^\s\n]+\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|wav|mp3)|https:\/\/v3\.fal\.media\/files\/[^\s\n]+|https:\/\/replicate\.delivery\/[^\s\n]+/gi;
        const urls = currentStatus.response.match(urlRegex);
        
        if (urls) {
          extractedAssets = urls.map((url, index) => ({
            url: url,
            type: url.includes('.mp4') || url.includes('.mov') || url.includes('.avi') ? 'video' : 'image',
            filename: `generated_content_${index + 1}.${url.includes('.mp4') ? 'mp4' : 'jpg'}`,
          }));
          console.log('Extracted assets from response:', extractedAssets);
        }
      }
      
      // Add assistant message to conversation
      addMessage({
        conversationId,
        clerkId: user.id,
        type: "assistant", 
        content: currentStatus.response || "Here's what I created for you:",
        generationId: currentGenerationId,
        outputAssets: extractedAssets,
      }).catch(error => {
        console.error("Failed to add assistant message:", error);
      });
      
      setCompletedGenerations(prev => new Set([...prev, currentGenerationId]));
      setCurrentGenerationId(null);
    } else if (currentStatus?.status === "failed" && !completedGenerations.has(currentGenerationId)) {
      // Add error message to conversation
      addMessage({
        conversationId,
        clerkId: user.id,
        type: "assistant",
        content: "Sorry, I couldn't complete that request. Please try again with a different prompt.",
      }).catch(error => {
        console.error("Failed to add error message:", error);
      });
      
      setCompletedGenerations(prev => new Set([...prev, currentGenerationId]));
      setCurrentGenerationId(null);
    } else if (currentStatus?.status === "cancelled" && !completedGenerations.has(currentGenerationId)) {
      // Add cancel message to conversation
      addMessage({
        conversationId,
        clerkId: user.id,
        type: "system",
        content: "Generation was cancelled.",
      }).catch(error => {
        console.error("Failed to add cancel message:", error);
      });
      
      setCompletedGenerations(prev => new Set([...prev, currentGenerationId]));
      setCurrentGenerationId(null);
    }
  }, [currentStatus, currentGenerationId, completedGenerations, conversationId, user, addMessage]);

  return (
    <div className="flex flex-col h-full relative">      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {conversationMessages?.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isProcessing && (
          <AILoadingState 
            status={currentStatus?.status || "processing"}
            progress={currentStatus?.progress || 0}
            currentStep={currentStatus?.currentStep}
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="m-6 relative z-10">
        <AIPromptInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          attachedFiles={attachedFiles}
          onFileUpload={(files) => setAttachedFiles(prev => [...prev, ...files])}
          onRemoveFile={removeFile}
          disabled={isProcessing}
          placeholder="Describe what you'd like me to create... Upload files and let's make something amazing."
        />
      </div>
    </div>
  );
}