"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bot, Loader2 } from "lucide-react";

interface TypingIndicatorProps {
  status: string;
  progress: number;
  currentStep?: string;
}

export function TypingIndicator({ status, progress, currentStep }: TypingIndicatorProps) {
  const getStatusText = () => {
    switch (status) {
      case "processing":
        return "Thinking...";
      case "uploading":
        return "Processing your request...";
      case "generating":
        return "Creating content...";
      default:
        return "Working on it...";
    }
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-[75%]">
        <div className="bg-slate-800/80 border border-slate-700/60 backdrop-blur-sm rounded-xl shadow-lg">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-700/80 ring-2 ring-slate-600/30">
                <Bot className="w-4 h-4 text-blue-300" />
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <p className="text-sm text-slate-200 font-light">
                    {getStatusText()}
                  </p>
                </div>
                
                {progress > 0 && (
                  <div className="space-y-2">
                    <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400 font-light">
                      <span>{currentStep || "Processing"}</span>
                      <span>{progress}%</span>
                    </div>
                  </div>
                )}
                
                {/* Animated dots for when no specific progress */}
                {progress === 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}