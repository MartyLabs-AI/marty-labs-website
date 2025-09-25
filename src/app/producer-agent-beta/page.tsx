"use client";

import { useUser, SignIn, SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sparkles, Bot, Zap, ArrowRight, Clock, CreditCard } from "lucide-react";

export default function ProducerAgentBetaPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Redirect authenticated users to the chat interface
  useEffect(() => {
    if (isLoaded && user) {
      router.push("/chat/producer-agent-beta");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    // This should not render due to redirect, but just in case
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Bot className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Redirecting...</h3>
            <p className="text-muted-foreground mb-4">Taking you to Producer Agent Beta</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Beta Badge */}
            <div className="inline-flex items-center justify-center mb-6">
              <Badge variant="secondary" className="text-sm font-medium px-4 py-2 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Beta Access
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Producer Agent
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {" "}Beta
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              The most advanced AI creative assistant. Upload any content, describe your vision, 
              and watch as Producer Agent transforms it into professional-grade videos, images, 
              and multimedia experiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="min-w-[200px] text-lg py-6"
                onClick={() => setShowSignUp(true)}
              >
                <Bot className="w-5 h-5 mr-2" />
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="min-w-[200px] text-lg py-6"
                onClick={() => setShowSignIn(true)}
              >
                Sign In
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Lightning Fast</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Generate professional content in seconds, not hours. Our advanced AI processes your requests instantly.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/10 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-6 h-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">AI-Powered</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Powered by cutting-edge AI models that understand context, style, and creative intent.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Studio Quality</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Professional-grade outputs ready for commercial use, social media, and presentations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* What You Can Create Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">What You Can Create</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload images, videos, audio, or just describe your idea. Producer Agent handles the rest.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Video Content", desc: "Transform images into engaging videos", icon: "🎬" },
            { title: "Image Variations", desc: "Generate multiple versions of any image", icon: "🎨" },
            { title: "Style Transfer", desc: "Apply artistic styles to your content", icon: "✨" },
            { title: "Content Remixing", desc: "Blend multiple assets into new creations", icon: "🔄" },
          ].map((item, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Beta Access Section */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of creators already using Producer Agent Beta to transform their creative workflow.
            </p>
            
            <div className="flex items-center justify-center gap-8 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>30-90 second processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Credit-based pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Professional results</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="min-w-[200px]"
                onClick={() => setShowSignUp(true)}
              >
                Create Free Account
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="min-w-[200px]"
                onClick={() => setShowSignIn(true)}
              >
                Sign In to Continue
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modals */}
      <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none">
          <SignIn 
            afterSignInUrl="/chat/producer-agent-beta"
            afterSignUpUrl="/chat/producer-agent-beta"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none">
          <SignUp 
            afterSignInUrl="/chat/producer-agent-beta"
            afterSignUpUrl="/chat/producer-agent-beta"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}