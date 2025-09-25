"use client";

import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Asset {
  url: string;
  type: string;
  filename: string;
}

interface MediaPreviewProps {
  asset: Asset;
}

export function MediaPreview({ asset }: MediaPreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(asset.url);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = asset.filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    }
  };

  const handleOpenInNewTab = () => {
    window.open(asset.url, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  // Image preview
  if ((asset.type.startsWith('image/') || asset.type === 'image') && !imageError) {
    return (
      <div className="relative group bg-slate-900/20 rounded-2xl overflow-hidden border border-slate-700/40">
        {/* Image */}
        <div className="relative">
          <img
            src={asset.url}
            alt="Generated content"
            className="w-full h-auto rounded-2xl"
            onError={() => setImageError(true)}
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          
          {/* Overlay with actions - appears on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3 rounded-2xl">
            <Button
              onClick={handleOpenInNewTab}
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-slate-900 shadow-lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </Button>
            <Button
              onClick={handleDownload}
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-slate-900 shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleCopyLink}
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-slate-900 shadow-lg"
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Video preview
  if ((asset.type.startsWith('video/') || asset.type === 'video') && !videoError) {
    return (
      <div className="relative group bg-slate-900/20 rounded-2xl overflow-hidden border border-slate-700/40">
        {/* Video */}
        <div className="relative">
          <video
            src={asset.url}
            controls
            className="w-full h-auto rounded-2xl"
            style={{ maxHeight: '400px' }}
            onError={() => setVideoError(true)}
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Actions overlay - always visible for video */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              onClick={handleOpenInNewTab}
              size="sm"
              variant="secondary"
              className="bg-black/70 hover:bg-black/90 text-white border-0 shadow-lg backdrop-blur-sm"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button
              onClick={handleDownload}
              size="sm"
              variant="secondary"
              className="bg-black/70 hover:bg-black/90 text-white border-0 shadow-lg backdrop-blur-sm"
            >
              <Download className="w-3 h-3" />
            </Button>
            <Button
              onClick={handleCopyLink}
              size="sm"
              variant="secondary"
              className="bg-black/70 hover:bg-black/90 text-white border-0 shadow-lg backdrop-blur-sm"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for errors or unknown types
  return (
    <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/40 text-center">
      <div className="text-slate-400 text-sm mb-4">
        Unable to preview this file type
      </div>
      <div className="flex justify-center gap-2">
        <Button
          onClick={handleOpenInNewTab}
          size="sm"
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <ExternalLink className="w-3 h-3 mr-2" />
          Open
        </Button>
        <Button
          onClick={handleDownload}
          size="sm"
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <Download className="w-3 h-3 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}