"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { toast } from "sonner";

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFileMetadata = useMutation(api.files.saveFileMetadata);

  const uploadFile = async (
    file: File,
    purpose?: string
  ): Promise<{ storageId: string; url: string } | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Step 1: Generate upload URL
      const uploadUrl = await generateUploadUrl();
      setUploadProgress(30);

      // Step 2: Upload file to Convex
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      setUploadProgress(70);

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.status}`);
      }

      const { storageId } = await result.json();
      setUploadProgress(90);

      // Step 3: Save metadata
      await saveFileMetadata({
        storageId,
        filename: file.name,
        size: file.size,
        contentType: file.type,
        purpose,
      });

      setUploadProgress(100);
      toast.success(`File "${file.name}" uploaded successfully`);

      // Return the storage ID and actual URL for immediate use
      return {
        storageId,
        url: storageId, // We'll resolve the actual URL when needed via getFileUrl query
      };

    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadMultipleFiles = async (
    files: File[],
    purpose?: string
  ): Promise<Array<{ storageId: string; url: string; filename: string }>> => {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await uploadFile(file, purpose);
      
      if (result) {
        results.push({
          ...result,
          filename: file.name,
        });
      }
    }

    return results;
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    uploadProgress,
  };
}