"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sparkles, Bot, Zap } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProducerAgentPageSimple() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    targetAudience: "",
    keyFeatures: "",
    marketingGoals: "",
    email: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Thanks for your interest! We'll be in touch soon.");
      setFormData({
        productName: "",
        productDescription: "",
        targetAudience: "",
        keyFeatures: "",
        marketingGoals: "",
        email: ""
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Producer Agent Beta
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get personalized marketing content for your product with our AI-powered Producer Agent.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our AI analyzes your product to create targeted marketing strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Fast Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get marketing content generated in minutes, not hours.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Beta Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Be among the first to try our cutting-edge Producer Agent.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Beta Form */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Join the Beta</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get you early access to our Producer Agent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    placeholder="What's your product called?"
                    value={formData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productDescription">Product Description</Label>
                  <Textarea
                    id="productDescription"
                    placeholder="Describe your product in a few sentences..."
                    rows={4}
                    value={formData.productDescription}
                    onChange={(e) => handleInputChange("productDescription", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    placeholder="Who is your ideal customer?"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keyFeatures">Key Features</Label>
                  <Textarea
                    id="keyFeatures"
                    placeholder="What are the main features of your product?"
                    rows={3}
                    value={formData.keyFeatures}
                    onChange={(e) => handleInputChange("keyFeatures", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marketingGoals">Marketing Goals</Label>
                  <Textarea
                    id="marketingGoals"
                    placeholder="What do you want to achieve with your marketing?"
                    rows={3}
                    value={formData.marketingGoals}
                    onChange={(e) => handleInputChange("marketingGoals", e.target.value)}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Request Beta Access
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Coming Soon Notice */}
          <div className="text-center mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">🚀 Coming Soon</h3>
            <p className="text-muted-foreground">
              The Producer Agent is currently in development. Join our beta to be the first to try it!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}