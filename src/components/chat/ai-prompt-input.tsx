"use client";

import { ArrowRight, Bot, Check, ChevronDown, Paperclip, FileImage, FileVideo, FileAudio, X } from "lucide-react";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import Anthropic from "@/components/icons/anthropic";
import AnthropicDark from "@/components/icons/anthropic-dark";

interface AIPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string, files: File[]) => void;
  attachedFiles: File[];
  onFileUpload: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  disabled?: boolean;
  placeholder?: string;
}

const OPENAI_SVG = (
    <div>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="256"
            height="260"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 260"
            aria-label="OpenAI icon"
            className="dark:hidden block w-4 h-4"
        >
            <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
        </svg>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="256"
            height="260"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 260"
            aria-label="OpenAI icon"
            className="hidden dark:block w-4 h-4"
        >
            <path
                fill="#fff"
                d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
            />
        </svg>
    </div>
);

export default function AIPromptInput({
  value,
  onChange,
  onSend,
  attachedFiles,
  onFileUpload,
  onRemoveFile,
  disabled = false,
  placeholder = "Describe what you'd like me to create... Upload files and let's make something amazing."
}: AIPromptInputProps) {
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedAgent, setSelectedAgent] = useState("Producer Agent");

    const AI_AGENTS = [
        "Producer Agent",
        "Image Generator",
        "Video Creator",
        "Lipsync Specialist",
        "Content Enhancer",
    ];

    const AGENT_ICONS: Record<string, React.ReactNode> = {
        "Producer Agent": (
            <div>
                <Anthropic className="h-4 w-4 text-black dark:hidden" />
                <AnthropicDark className="h-4 w-4 hidden dark:block" />
            </div>
        ),
        "Image Generator": OPENAI_SVG,
        "Video Creator": (
            <FileVideo className="w-4 h-4 text-purple-500" />
        ),
        "Lipsync Specialist": (
            <Bot className="w-4 h-4 text-green-500" />
        ),
        "Content Enhancer": (
            <svg
                height="1em"
                style={{ flex: "none", lineHeight: "1" }}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
            >
                <title>Gemini</title>
                <defs>
                    <linearGradient
                        id="lobe-icons-gemini-fill"
                        x1="0%"
                        x2="68.73%"
                        y1="100%"
                        y2="30.395%"
                    >
                        <stop offset="0%" stopColor="#1C7DFF" />
                        <stop offset="52.021%" stopColor="#1C69FF" />
                        <stop offset="100%" stopColor="#F0DCD6" />
                    </linearGradient>
                </defs>
                <path
                    d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
                    fill="url(#lobe-icons-gemini-fill)"
                    fillRule="nonzero"
                />
            </svg>
        ),
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !disabled) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (!value.trim() || disabled) return;
        onSend(value.trim(), attachedFiles);
        onChange("");
        adjustHeight(true);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const validFiles = files.filter(file => {
          return file.type.startsWith('image/') || 
                 file.type.startsWith('video/') || 
                 file.type.startsWith('audio/');
        });
        onFileUpload(validFiles);
        event.target.value = '';
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return FileImage;
        if (file.type.startsWith('video/')) return FileVideo;
        if (file.type.startsWith('audio/')) return FileAudio;
        return FileImage;
    };

    return (
        <div className="w-full py-4">
            {/* File Attachments Preview */}
            {attachedFiles.length > 0 && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-3">
                        {attachedFiles.map((file, index) => {
                            const isImage = file.type.startsWith('image/');
                            const IconComponent = getFileIcon(file);
                            
                            return (
                                <div key={index} className="relative group">
                                    {isImage ? (
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => onRemoveFile(index)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-2 border-white"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm">
                                            <IconComponent className="w-4 h-4 text-purple-400" />
                                            <span className="truncate max-w-20 text-slate-200">{file.name}</span>
                                            <button
                                                onClick={() => onRemoveFile(index)}
                                                className="w-4 h-4 text-muted-foreground hover:text-foreground rounded transition-all flex items-center justify-center"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="relative rounded-2xl p-1.5 pt-4 border-2 border-primary/30 bg-gradient-to-br from-card/95 via-background/90 to-card/95 backdrop-blur-sm shadow-2xl shadow-primary/20 ring-1 ring-primary/10 hover:ring-primary/20 transition-all duration-300">
                {/* Sharp sleek inner gradient border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/15 to-primary/10 p-[1px]">
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-background/95 to-card/90"></div>
                </div>
                <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2.5 mx-2">
                    <div className="flex-1 flex items-center gap-2">
                        <Anthropic className="h-3.5 w-3.5 text-black dark:hidden" />
                        <AnthropicDark className="h-3.5 w-3.5 hidden dark:block" />
                        <h3 className="text-slate-200 dark:text-white/90 text-xs tracking-tighter">
                            AI Creative Studio
                        </h3>
                    </div>
                    <p className="text-slate-300 dark:text-white/90 text-xs tracking-tighter">
                        Producer Agent Beta
                    </p>
                </div>
                
                <div className="relative">
                    <div className="relative flex flex-col">
                        <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
                            <Textarea
                                value={value}
                                placeholder={placeholder}
                                className={cn(
                                    "w-full rounded-xl rounded-b-none px-4 py-3 border-none text-foreground placeholder:text-muted-foreground resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                                    "min-h-[72px]"
                                )}
                                ref={textareaRef}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                    onChange(e.target.value);
                                    adjustHeight();
                                }}
                                disabled={disabled}
                            />
                        </div>

                        <div className="h-14 rounded-b-xl flex items-center">
                            <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="flex items-center gap-1 h-8 pl-1 pr-2 text-xs rounded-md text-foreground focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary"
                                                disabled={disabled}
                                            >
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={selectedAgent}
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 5 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="flex items-center gap-1"
                                                    >
                                                        {AGENT_ICONS[selectedAgent]}
                                                        {selectedAgent}
                                                        <ChevronDown className="w-3 h-3 opacity-50" />
                                                    </motion.div>
                                                </AnimatePresence>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className={cn(
                                                "min-w-[10rem]",
                                                "border-border",
                                                "bg-popover backdrop-blur-xl"
                                            )}
                                        >
                                            {AI_AGENTS.map((agent) => (
                                                <DropdownMenuItem
                                                    key={agent}
                                                    onSelect={() => setSelectedAgent(agent)}
                                                    className="flex items-center justify-between gap-2 text-foreground hover:bg-accent"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {AGENT_ICONS[agent]}
                                                        <span>{agent}</span>
                                                    </div>
                                                    {selectedAgent === agent && (
                                                        <Check className="w-4 h-4 text-blue-500" />
                                                    )}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    
                                    <div className="h-4 w-px bg-border mx-0.5" />
                                    
                                    <label
                                        className={cn(
                                            "rounded-lg p-2 cursor-pointer",
                                            "hover:bg-accent focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary",
                                            "text-slate-400 dark:text-white/40 hover:text-slate-200 dark:hover:text-white",
                                            disabled && "opacity-50 cursor-not-allowed"
                                        )}
                                        aria-label="Attach file"
                                    >
                                        <input 
                                            ref={fileInputRef}
                                            type="file" 
                                            className="hidden" 
                                            multiple
                                            accept="image/*,video/*,audio/*"
                                            onChange={handleFileUpload}
                                            disabled={disabled}
                                        />
                                        <Paperclip className="w-4 h-4 transition-colors" />
                                    </label>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={handleSend}
                                    className={cn(
                                        "rounded-lg p-2",
                                        "hover:bg-accent focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary",
                                        disabled && "opacity-50 cursor-not-allowed"
                                    )}
                                    aria-label="Send message"
                                    disabled={!value.trim() || disabled}
                                >
                                    <ArrowRight
                                        className={cn(
                                            "w-4 h-4 text-slate-200 dark:text-white transition-opacity duration-200",
                                            value.trim() && !disabled ? "opacity-100" : "opacity-30"
                                        )}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}