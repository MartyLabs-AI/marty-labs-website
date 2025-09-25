"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, User, Bot, Info } from "lucide-react";
import { MediaPreview } from "./media-preview";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  inputAssets?: Array<{
    url: string;
    type: string;
    filename: string;
  }>;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === "user";
  const isSystem = message.type === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="max-w-md">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <Info className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground font-light leading-relaxed prose prose-sm max-w-none prose-p:my-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] ${isUser ? "order-2" : "order-1"}`}>
        <div>
          <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                {isUser ? (
                  <User className="w-4 h-4 text-primary" />
                ) : (
                  <Bot className="w-4 h-4 text-secondary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm break-words font-light leading-relaxed text-foreground prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-strong:font-semibold">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                      li: ({ children }) => <li className="text-sm">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Media Preview for User Input Assets */}
            {isUser && message.inputAssets && message.inputAssets.length > 0 && (
              <div className="mt-4 space-y-4">
                {message.inputAssets.map((asset, index) => (
                  <MediaPreview key={index} asset={asset} />
                ))}
              </div>
            )}

            {/* Media Preview for Assistant Messages */}
            {!isUser && message.outputAssets && message.outputAssets.length > 0 && (
              <div className="mt-4 space-y-4">
                {message.outputAssets.map((asset, index) => (
                  <MediaPreview key={index} asset={asset} />
                ))}
                
                {/* Download All Button */}
                {message.outputAssets.length > 1 && (
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-foreground font-light"
                      onClick={() => {
                        message.outputAssets?.forEach((asset, index) => {
                          const link = document.createElement('a');
                          link.href = asset.url;
                          link.download = asset.filename || `download-${index + 1}`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        });
                      }}
                    >
                      <Download className="w-3 h-3 mr-2" />
                      Download All
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Timestamp */}
            <div className={`text-xs mt-3 font-light ${
              isUser ? "text-purple-300/80" : "text-slate-400"
            }`}>
              {(typeof message.timestamp === 'number' 
                ? new Date(message.timestamp) 
                : message.timestamp
              ).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}