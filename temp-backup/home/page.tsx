"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { useUser, UserButton } from "@clerk/nextjs";
import { api } from "@/../convex/_generated/api";
import { FlowCard } from "@/components/flows/flow-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { BetaSignupModal } from "@/components/beta-signup/beta-signup-modal";
import { 
  Sparkles, 
  Zap, 
  Clock, 
  TrendingUp, 
  CreditCard,
  History,
  Search,
  Filter,
  Star,
  Wand2,
  Rocket
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showBetaSignup, setShowBetaSignup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  const userWithSubscription = useQuery(
    api.users.getUserWithSubscription,
    user ? { clerkId: user.id } : "skip"
  );

  const flows = useQuery(api.flows.getPublicFlows, {
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchQuery || undefined,
    limit: 20
  });

  const categories = useQuery(api.flows.getFlowCategories, {});

  const recentGenerations = useQuery(
    api.generations.getUserGenerations,
    user ? { clerkId: user.id, limit: 3 } : "skip"
  );

  // Show welcome animation for new users
  useEffect(() => {
    if (user && userWithSubscription) {
      const isNewUser = Date.now() - user.createdAt! < 5 * 60 * 1000; // 5 minutes
      setShowWelcome(isNewUser);
    }
  }, [user, userWithSubscription]);

  // Check if user needs to complete beta signup
  useEffect(() => {
    if (user && userWithSubscription) {
      const needsBetaSignup = !userWithSubscription.hasCompletedBetaSignup;
      setShowBetaSignup(needsBetaSignup);
    }
  }, [user, userWithSubscription]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background font-mono">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Welcome to Marty Labs!</h3>
            <p className="text-muted-foreground mb-4">Please sign in to access your creative workspace.</p>
            <Link href="/sign-in">
              <Button className="w-full">Sign In to Continue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subscription = userWithSubscription?.subscription;
  const isLoading = flows === undefined || userWithSubscription === undefined;

  return (
    <div className="min-h-screen bg-background font-mono">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Marty Labs
                  </h1>
                  <p className="text-xs text-muted-foreground">AI Creative Studio</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              {subscription && (
                <div className="hidden md:flex items-center space-x-6 text-sm bg-card/60 border border-border px-4 py-2 rounded-full backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="font-medium">{subscription.credits} credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    <span>{recentGenerations?.length || 0} generated</span>
                  </div>
                </div>
              )}
              
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner for New Users */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-8 animate-fadeIn">
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/20 rounded-2xl mb-4">
              <Rocket className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome to Marty Labs, {user.firstName || 'Creator'}! 🎉
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              You&apos;re all set up with <strong>{subscription?.credits || 50} free credits</strong> to start creating amazing content. 
              Pick a workflow below and let&apos;s make something incredible!
            </p>
            <Button 
              variant="outline" 
              className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setShowWelcome(false)}
            >
              Let&apos;s Get Started! ✨
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        {/* User Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {showWelcome ? "Choose Your First Workflow" : `Welcome back, ${user.firstName || 'Creator'}! 👋`}
          </h1>
          <p className="text-muted-foreground">
            {showWelcome 
              ? "Start your creative journey with any of these AI-powered workflows:"
              : "Ready to create something amazing? Pick a workflow and let's get started."
            }
          </p>
        </div>

        {/* Quick Actions & Recent Activity */}
        {!showWelcome && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Credits remaining</span>
                    <span className="font-semibold">{subscription?.credits || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total generations</span>
                    <span className="font-semibold">{recentGenerations?.length || 0}</span>
                  </div>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      <History className="w-4 h-4 mr-2" />
                      View Full History
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Generations */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Creations</CardTitle>
              </CardHeader>
              <CardContent>
                {recentGenerations && recentGenerations.length > 0 ? (
                  <div className="space-y-2">
                    {recentGenerations.slice(0, 3).map((gen) => (
                      <div key={gen._id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{gen.flowId.replace('-', ' ')}</p>
                            <p className="text-xs text-muted-foreground">{new Date(gen.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={gen.status === 'completed' ? 'bg-chart-1/10 text-chart-1 border-chart-1/20' : 'bg-secondary/10 text-secondary border-secondary/20'}>
                          {gen.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Wand2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No creations yet. Time to make your first one!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            {['all', ...(categories || [])].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Workflows Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedCategory === 'all' ? 'All Workflows' : `${selectedCategory} Workflows`}
            </h2>
            <Badge variant="secondary">
              {flows?.length || 0} available
            </Badge>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : flows && flows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {flows.map((flow) => (
                <div key={flow.id} className="animate-fadeIn">
                  <FlowCard flow={flow} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="py-12">
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">No workflows found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or category filter.
                </p>
                <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                  Show All Workflows
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Beta Signup Modal */}
      <BetaSignupModal
        isOpen={showBetaSignup}
        onClose={() => setShowBetaSignup(false)}
        userEmail={user?.emailAddresses[0]?.emailAddress || ''}
        userName={user?.fullName || user?.firstName || 'User'}
      />
    </div>
  );
}