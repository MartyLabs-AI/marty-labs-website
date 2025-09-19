"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, FileImage, Zap } from "lucide-react";
import { toast } from "sonner";

interface FlowFormProps {
  flow: {
    id: string;
    title: string;
    description: string;
    category: string;
    creditsPerGeneration: number;
    estimatedProcessingTime: number;
    inputSchema: {
      type: string;
      properties: Record<string, FormField>;
      required?: string[];
    };
  };
  onSubmit: (data: Record<string, unknown>, files: { [key: string]: File[] }) => Promise<void>;
  isSubmitting: boolean;
}

interface FormField {
  type: string;
  format?: string;
  title: string;
  description?: string;
  enum?: string[];
  default?: string | number | boolean;
  minimum?: number;
  maximum?: number;
  accept?: string;
  items?: { enum?: string[] };
}

export function FlowForm({ flow, onSubmit, isSubmitting }: FlowFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({});
  const { register, handleSubmit, watch, setValue } = useForm();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(prev => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] || []), ...files]
      }));
      setValue(fieldName, files.map(f => f.name).join(", "));
      toast.success(`${files.length} file(s) selected`);
    }
  };

  const removeFile = (fieldName: string, fileIndex: number) => {
    setUploadedFiles(prev => {
      const updatedFiles = [...(prev[fieldName] || [])];
      updatedFiles.splice(fileIndex, 1);
      const newState = { ...prev, [fieldName]: updatedFiles };
      
      if (updatedFiles.length === 0) {
        setValue(fieldName, "");
      } else {
        setValue(fieldName, updatedFiles.map(f => f.name).join(", "));
      }
      
      return newState;
    });
    toast.success("File removed");
  };

  const renderFormField = (fieldName: string, field: FormField) => {
    switch (field.type) {
      case "string":
        if (field.format === "file") {
          return (
            <div key={fieldName} className="space-y-3">
              <label className="text-sm font-light text-foreground">
                {field.title}
                {flow.inputSchema.required?.includes(fieldName) && (
                  <span className="text-red-400 ml-1">*</span>
                )}
              </label>
              {field.description && (
                <p className="text-sm text-muted-foreground font-light">{field.description}</p>
              )}
              <div className="border-2 border-dashed border-border bg-muted/20 p-6 text-center hover:border-border/80 transition-all duration-200 cursor-pointer" style={{ borderRadius: '8px' }}>
                <input
                  type="file"
                  id={fieldName}
                  accept={field.accept}
                  multiple
                  onChange={(e) => handleFileUpload(e, fieldName)}
                  className="hidden"
                />
                <label htmlFor={fieldName} className="cursor-pointer">
                  <FileImage className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-foreground font-light">
                    Click to upload or drag and drop
                  </p>
                  {field.accept && (
                    <p className="text-xs text-muted-foreground mt-2 font-light">
                      Accepts: {field.accept}
                    </p>
                  )}
                </label>
              </div>
              {(uploadedFiles[fieldName] || []).map((file, index) => (
                <div key={`${fieldName}-${index}`} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fieldName, index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          );
        }

        if (field.enum) {
          return (
            <div key={fieldName} className="space-y-2">
              <Label htmlFor={fieldName} className="text-sm font-medium">
                {field.title}
                {flow.inputSchema.required?.includes(fieldName) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
              <Select onValueChange={(value) => setValue(fieldName, value)}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field.title.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.enum.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName} className="text-sm font-medium">
              {field.title}
              {flow.inputSchema.required?.includes(fieldName) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Textarea
              id={fieldName}
              placeholder={`Enter ${field.title.toLowerCase()}`}
              {...register(fieldName, { 
                required: flow.inputSchema.required?.includes(fieldName) 
              })}
              className="min-h-[80px]"
            />
          </div>
        );

      case "array":
        if (field.items?.enum) {
          return (
            <div key={fieldName} className="space-y-2">
              <Label className="text-sm font-medium">
                {field.title}
                {flow.inputSchema.required?.includes(fieldName) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {field.items.enum.map((option) => {
                  const isSelected = watch(fieldName)?.includes(option);
                  return (
                    <Badge
                      key={option}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const current = watch(fieldName) || [];
                        const updated = isSelected
                          ? current.filter((item: string) => item !== option)
                          : [...current, option];
                        setValue(fieldName, updated);
                      }}
                    >
                      {option}
                    </Badge>
                  );
                })}
              </div>
            </div>
          );
        }
        break;

      case "number":
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName} className="text-sm font-medium">
              {field.title}
              {flow.inputSchema.required?.includes(fieldName) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Input
              id={fieldName}
              type="number"
              min={field.minimum}
              max={field.maximum}
              defaultValue={field.default as string | number | undefined}
              placeholder={`Enter ${field.title.toLowerCase()}`}
              {...register(fieldName, { 
                required: flow.inputSchema.required?.includes(fieldName),
                min: field.minimum,
                max: field.maximum,
                valueAsNumber: true,
              })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const onFormSubmit = async (data: Record<string, unknown>) => {
    try {
      await onSubmit(data, uploadedFiles);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start generation");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              {flow.title}
            </CardTitle>
            <CardDescription className="mt-2">
              {flow.description}
            </CardDescription>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              {flow.category}
            </Badge>
            <div className="text-sm text-muted-foreground">
              <div>{flow.creditsPerGeneration} credits</div>
              <div>~{flow.estimatedProcessingTime}s</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {flow.inputSchema.properties && 
            Object.entries(flow.inputSchema.properties).map(
              ([fieldName, field]) => renderFormField(fieldName, field)
            )
          }
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              This will consume {flow.creditsPerGeneration} credits
            </div>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}