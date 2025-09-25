"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";

interface HiringPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HiringPopup({ isOpen, onClose }: HiringPopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    experienceLevel: "",
    resume: null as File | null,
    roleDescription: "",
    achievements: "",
    linkedin: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create form data for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('department', formData.department);
      submitData.append('experienceLevel', formData.experienceLevel);
      submitData.append('roleDescription', formData.roleDescription);
      submitData.append('achievements', formData.achievements);
      submitData.append('linkedin', formData.linkedin);
      submitData.append('timestamp', new Date().toISOString());
      submitData.append('source', 'website_hiring');
      
      if (formData.resume) {
        submitData.append('resume', formData.resume);
      }

      // Submit to Google Sheets via API
      const response = await fetch('/api/hiring', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            department: "",
            experienceLevel: "",
            resume: null,
            roleDescription: "",
            achievements: "",
            linkedin: ""
          });
        }, 2000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
    }
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
            <h3 className="text-xl font-medium text-foreground mb-2">Application Received!</h3>
            <p className="text-muted-foreground text-sm">
              Thanks for applying. We&apos;ll review your application and get back to you soon.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-[95vw] max-w-[95vw] sm:w-full mx-auto bg-background/95 backdrop-blur-xl border border-border/50 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-300 max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-border/30">
          <DialogTitle className="text-xl font-medium text-foreground">
            Work at Marty Labs
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Join our team of creative professionals and AI innovators
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Phone *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="department" className="text-sm font-medium text-foreground">
                  Department *
                </Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design & Creative</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="customer-success">Customer Success</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="business-development">Business Development</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="experienceLevel" className="text-sm font-medium text-foreground">
                  Experience Level *
                </Label>
                <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry-level">Entry Level (0-1 years)</SelectItem>
                    <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                    <SelectItem value="mid-level">Mid Level (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5-8 years)</SelectItem>
                    <SelectItem value="lead">Lead (8+ years)</SelectItem>
                    <SelectItem value="executive">Executive/C-Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="resume" className="text-sm font-medium text-foreground">
                Resume/Portfolio *
              </Label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col items-center justify-center py-4">
                    <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {formData.resume ? (
                        <span className="font-medium text-foreground">{formData.resume.name}</span>
                      ) : (
                        <>
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (MAX. 10MB)</p>
                  </div>
                  <input
                    id="resume"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="role-description" className="text-sm font-medium text-foreground">
                Role Description *
              </Label>
              <Textarea
                id="role-description"
                value={formData.roleDescription}
                onChange={(e) => handleInputChange('roleDescription', e.target.value)}
                placeholder="Tell us about the position you're interested in..."
                className="mt-2 min-h-[60px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="achievements" className="text-sm font-medium text-foreground">
                Portfolio Links *
              </Label>
              <Textarea
                id="achievements"
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                placeholder="Share links to your portfolio, projects, or work..."
                className="mt-2 min-h-[60px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="linkedin" className="text-sm font-medium text-foreground">
                LinkedIn Profile *
              </Label>
              <Input
                id="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="mt-2"
                required
              />
            </div>
          </form>
        </div>

        <div className="flex-shrink-0 pt-4 border-t border-border/30">
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting Application...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}