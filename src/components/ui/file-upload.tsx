"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFileUpload } from "@/lib/use-file-upload";
import { Upload, X, FileImage, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  purpose?: string;
  onUploadComplete?: (files: Array<{ storageId: string; url: string; filename: string }>) => void;
  className?: string;
}

export function FileUpload({
  accept = "image/*",
  multiple = false,
  maxSize = 10,
  purpose,
  onUploadComplete,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ storageId: string; url: string; filename: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, uploadMultipleFiles, isUploading, uploadProgress } = useFileUpload();

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type if accept is specified
    if (accept && accept !== "*") {
      const acceptedTypes = accept.split(",").map(type => type.trim());
      const isAccepted = acceptedTypes.some(type => {
        if (type === "image/*") return file.type.startsWith("image/");
        if (type === "video/*") return file.type.startsWith("video/");
        if (type === "audio/*") return file.type.startsWith("audio/");
        return file.type === type || file.name.endsWith(type.replace("*", ""));
      });
      
      if (!isAccepted) {
        return `File type not supported. Accepted: ${accept}`;
      }
    }

    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      // Handle errors (could use toast here)
      console.error("File validation errors:", errors);
      return;
    }

    if (!multiple && validFiles.length > 1) {
      setSelectedFiles([validFiles[0]]);
    } else {
      setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      let results;
      if (multiple) {
        results = await uploadMultipleFiles(selectedFiles, purpose);
      } else {
        const result = await uploadFile(selectedFiles[0], purpose);
        results = result ? [{ ...result, filename: selectedFiles[0].name }] : [];
      }

      setUploadedFiles(prev => [...prev, ...results]);
      setSelectedFiles([]);
      onUploadComplete?.(results);

    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const removeFile = (index: number, isUploaded = false) => {
    if (isUploaded) {
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
          dragActive
            ? "border-primary bg-primary/10"
            : "border-border hover:border-border/70 hover:bg-muted/30"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
            <FileImage className="w-8 h-8 text-muted-foreground" />
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">
              Drop files here or click to upload
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {accept === "image/*" ? "Images only" : `Supported: ${accept}`} • Max {maxSize}MB
            </p>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h5 className="font-medium text-sm">Selected Files:</h5>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileImage className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? "s" : ""}
          </Button>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h5 className="font-medium text-sm">Uploaded Files:</h5>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-chart-1/10 rounded-lg border border-chart-1/20">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-chart-1" />
                <div>
                  <p className="text-sm font-medium">{file.filename}</p>
                  <p className="text-xs text-muted-foreground">Uploaded successfully</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index, true)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}