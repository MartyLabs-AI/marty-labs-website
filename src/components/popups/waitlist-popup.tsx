"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface WaitlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistPopup({ isOpen, onClose }: WaitlistPopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    videoGenerations: "",
    companySize: "",
    whatsapp: "",
    email: "",
    linkedin: "",
    company: "",
    useCase: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to Google Sheets via API
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'website_waitlist'
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setFormData({
            name: "",
            role: "",
            videoGenerations: "",
            companySize: "",
            whatsapp: "",
            email: "",
            linkedin: "",
            company: "",
            useCase: ""
          });
        }, 2000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting waitlist:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg mx-auto bg-background/95 backdrop-blur-xl border border-border/50 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-300">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">You&apos;re on the list!</h3>
            <p className="text-muted-foreground text-sm">
              We&apos;ll reach out soon with early access to Producer Agent.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg mx-auto bg-background/95 backdrop-blur-xl border border-border/50 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-300 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-medium text-foreground">
            Join Producer Agent Waitlist
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Get early access to our AI-powered video creation tool
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-sm font-medium text-foreground">
                Role *
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                  <SelectItem value="c-suite">C-Suite</SelectItem>
                  <SelectItem value="creative-lead">Creative Lead</SelectItem>
                  <SelectItem value="marketing-lead">Marketing Lead</SelectItem>
                  <SelectItem value="agency-owner">Agency Owner</SelectItem>
                  <SelectItem value="startup-founder">Startup Founder</SelectItem>
                  <SelectItem value="hobbyist">Hobbyist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="video-generations" className="text-sm font-medium text-foreground">
                Monthly Videos *
              </Label>
              <Select value={formData.videoGenerations} onValueChange={(value) => handleInputChange('videoGenerations', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="10-100">10-100</SelectItem>
                  <SelectItem value="100-500">100-500</SelectItem>
                  <SelectItem value="500-1000">500-1000</SelectItem>
                  <SelectItem value="1000+">1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="company-size" className="text-sm font-medium text-foreground">
                Company Size *
              </Label>
              <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="10-50">10-50</SelectItem>
                  <SelectItem value="50-200">50-200</SelectItem>
                  <SelectItem value="200-1000">200-1000</SelectItem>
                  <SelectItem value="1000+">1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="whatsapp" className="text-sm font-medium text-foreground">
                WhatsApp *
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                placeholder="+91 98765 43210"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-sm font-medium text-foreground">
                Company *
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="useCase" className="text-sm font-medium text-foreground">
                Use Case *
              </Label>
              <Select value={formData.useCase} onValueChange={(value) => handleInputChange('useCase', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select use case" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="advertising">Advertising</SelectItem>
                  <SelectItem value="content-creation">Content Creation</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="e-commerce">E-commerce</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="linkedin" className="text-sm font-medium text-foreground">
                LinkedIn Profile (optional)
              </Label>
              <Input
                id="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="mt-1"
              />
            </div>

          <Button
            type="submit"
            className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining Waitlist...
              </>
            ) : (
              'Join Waitlist'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}