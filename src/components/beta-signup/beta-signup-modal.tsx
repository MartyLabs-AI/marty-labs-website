"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BetaSignupData {
  userType: 'hobbyist' | 'creative-professional' | 'company';
  profession?: string;
  position?: string;
  companyName?: string;
  companySize?: string;
  linkedinProfile?: string;
}

interface BetaSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
}

export function BetaSignupModal({ isOpen, onClose, userEmail, userName }: BetaSignupModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BetaSignupData>();
  
  const userType = watch('userType');

  const validateLinkedInURL = (url?: string) => {
    if (!url) return true; // Optional field
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/(in|pub|profile)\/[a-zA-Z0-9\-]+\/?$/;
    return linkedinPattern.test(url) || "Please enter a valid LinkedIn URL";
  };

  const onSubmit = async (data: BetaSignupData) => {
    setIsSubmitting(true);
    
    try {
      // Prepare data for Google Sheets
      const submissionData = {
        timestamp: new Date().toISOString(),
        name: userName,
        email: userEmail,
        userType: data.userType,
        profession: data.profession || '',
        position: data.position || '',
        companyName: data.companyName || '',
        companySize: data.companySize || '',
        linkedinProfile: data.linkedinProfile || '',
      };

      // Send to Google Sheets via API
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit beta signup');
      }

      toast.success("Welcome to the Marty Martin Beta! 🎉");
      onClose();
    } catch (error) {
      console.error('Beta signup error:', error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to the Marty Martin Beta!
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600 dark:text-gray-400">
            Help us personalize your experience by telling us a bit about yourself.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Primary Question - User Type */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">How would you describe yourself? *</Label>
            <RadioGroup
              value={userType}
              onValueChange={(value) => setValue('userType', value as any)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RadioGroupItem value="hobbyist" id="hobbyist" />
                <Label htmlFor="hobbyist" className="flex-1 cursor-pointer font-medium">
                  🎨 Hobbyist
                  <span className="block text-sm text-gray-500 font-normal">
                    Creating for fun and personal projects
                  </span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RadioGroupItem value="creative-professional" id="creative-professional" />
                <Label htmlFor="creative-professional" className="flex-1 cursor-pointer font-medium">
                  💼 Creative Professional
                  <span className="block text-sm text-gray-500 font-normal">
                    Working independently in creative fields
                  </span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RadioGroupItem value="company" id="company" />
                <Label htmlFor="company" className="flex-1 cursor-pointer font-medium">
                  🏢 Part of a Company
                  <span className="block text-sm text-gray-500 font-normal">
                    Working within an organization or team
                  </span>
                </Label>
              </div>
            </RadioGroup>
            {errors.userType && (
              <p className="text-sm text-red-500">Please select how you would describe yourself</p>
            )}
          </div>

          {/* Conditional Fields */}
          {userType === 'creative-professional' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="profession" className="text-lg font-semibold">What is your profession? *</Label>
              <Select onValueChange={(value) => setValue('profession', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your profession" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="artist">Artist</SelectItem>
                  <SelectItem value="musician">Musician</SelectItem>
                  <SelectItem value="photographer">Photographer</SelectItem>
                  <SelectItem value="videographer">Videographer</SelectItem>
                  <SelectItem value="copywriter">Copywriter</SelectItem>
                  <SelectItem value="marketer">Marketer</SelectItem>
                  <SelectItem value="consultant">Consultant</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.profession && (
                <p className="text-sm text-red-500">Please select your profession</p>
              )}
            </div>
          )}

          {userType === 'company' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-3">
                <Label htmlFor="position" className="text-lg font-semibold">Your Position *</Label>
                <Input
                  id="position"
                  placeholder="e.g., Marketing Manager, Creative Director, CEO"
                  {...register('position', { 
                    required: userType === 'company' ? 'Position is required' : false 
                  })}
                />
                {errors.position && (
                  <p className="text-sm text-red-500">{errors.position.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="companyName" className="text-lg font-semibold">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Your company name"
                  {...register('companyName', { 
                    required: userType === 'company' ? 'Company name is required' : false 
                  })}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">{errors.companyName.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="companySize" className="text-lg font-semibold">Company Size *</Label>
                <Select onValueChange={(value) => setValue('companySize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="200+">200+ employees</SelectItem>
                  </SelectContent>
                </Select>
                {errors.companySize && (
                  <p className="text-sm text-red-500">Please select your company size</p>
                )}
              </div>
            </div>
          )}

          {/* Optional LinkedIn Field - Always Visible */}
          <div className="space-y-3">
            <Label htmlFor="linkedin" className="text-lg font-semibold">
              LinkedIn Profile <span className="text-gray-500 font-normal">(Optional)</span>
            </Label>
            <Input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              {...register('linkedinProfile', { 
                validate: validateLinkedInURL 
              })}
            />
            {errors.linkedinProfile && (
              <p className="text-sm text-red-500">{errors.linkedinProfile.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Skip for now
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !userType}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Joining Beta...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Join the Beta
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}