"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser, UserButton } from "@clerk/nextjs";
import { api } from "@/../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Zap, 
  Clock, 
  Download, 
  TrendingUp, 
  CreditCard,
  History,
  Settings
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Dashboard() {
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState("overview");
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  const userWithSubscription = useQuery(
    api.users.getUserWithSubscription,
    user ? { clerkId: user.id } : "skip"
  );

  const generations = useQuery(
    api.generations.getUserGenerations,
    user ? { clerkId: user.id, limit: 10 } : "skip"
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4 text-foreground">Please sign in to access your dashboard</h2>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const subscription = userWithSubscription?.subscription;
  const isLoading = userWithSubscription === undefined || generations === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-mono">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where user doesn't have Convex record yet (new signups)
  if (!userWithSubscription) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle>Setting up your account...</CardTitle>
            <CardDescription>
              We&apos;re creating your profile and setting up your free credits. This should only take a moment.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Progress value={75} className="mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Please refresh the page in a few seconds if this doesn&apos;t complete automatically.
            </p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button 
                variant="outline" 
                onClick={async () => {
                  if (user) {
                    try {
                      await createOrUpdateUser({
                        clerkId: user.id,
                        email: user.emailAddresses[0]?.emailAddress || '',
                        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || '',
                        avatar: user.imageUrl
                      });
                      window.location.reload();
                    } catch (error) {
                      console.error('Error creating user:', error);
                    }
                  }
                }}
              >
                Create Account Manually
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      case "processing": return "bg-secondary/10 text-secondary border-secondary/20";
      case "failed": return "bg-destructive/10 text-destructive border-destructive/20";
      case "queued": return "bg-chart-3/10 text-chart-3 border-chart-3/20";
      default: return "bg-muted/50 text-muted-foreground border-border";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-primary" />
                <span className="text-xl font-medium text-foreground">Marty Labs</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/home">
                <Button variant="ghost">Browse Flows</Button>
              </Link>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-foreground mb-2">
            Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}!
          </h1>
          <p className="text-muted-foreground">
            Manage your AI-generated assets and track your usage.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Credits Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span className="text-2xl font-medium text-foreground">{subscription?.credits || 0}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {subscription?.planId === "free" ? "Free Plan" : `${subscription?.planId} Plan`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Generations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-chart-1" />
                <span className="text-2xl font-medium text-foreground">{generations?.length || 0}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {generations?.filter(g => g.status === "completed").length || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <span className="text-2xl font-medium text-foreground">
                  {generations?.length 
                    ? Math.round((generations.filter(g => g.status === "completed").length / generations.length) * 100)
                    : 0}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Generation History</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Generations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Recent Generations
                  </CardTitle>
                  <CardDescription>Your latest AI-generated assets</CardDescription>
                </CardHeader>
                <CardContent>
                  {generations?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No generations yet</p>
                      <Link href="/">
                        <Button className="mt-2">Browse Flows</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {generations?.slice(0, 5).map((generation) => (
                        <div key={generation._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">{generation.flowId}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(generation.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`border ${getStatusColor(generation.status)}`}>
                              {generation.status}
                            </Badge>
                            {generation.status === "completed" && generation.outputAssets && (
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      {generations && generations.length > 5 && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setSelectedTab("history")}
                        >
                          View All Generations
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Jump to your most used features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/flow/ad-banner-resizer">
                    <Button className="w-full justify-start" variant="outline">
                      <Zap className="w-4 h-4 mr-2" />
                      Resize Ad Banner
                    </Button>
                  </Link>
                  <Link href="/flow/product-360-video">
                    <Button className="w-full justify-start" variant="outline">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate 360° Video
                    </Button>
                  </Link>
                  <Link href="/home">
                    <Button className="w-full justify-start" variant="outline">
                      <Clock className="w-4 h-4 mr-2" />
                      Browse All Flows
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Generation History</CardTitle>
                <CardDescription>All your AI generation activities</CardDescription>
              </CardHeader>
              <CardContent>
                {generations?.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2 text-foreground">No generations yet</h3>
                    <p className="mb-4">Start creating amazing content with our AI flows</p>
                    <Link href="/home">
                      <Button>Browse Flows</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generations?.map((generation) => (
                      <div key={generation._id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-foreground">{generation.flowId}</h4>
                            <p className="text-sm text-muted-foreground">{formatDate(generation.createdAt)}</p>
                          </div>
                          <Badge className={`border ${getStatusColor(generation.status)}`}>
                            {generation.status}
                          </Badge>
                        </div>
                        
                        {generation.status === "processing" && (
                          <div className="mb-3">
                            <Progress value={generation.progress} className="w-full" />
                            <p className="text-sm text-gray-600 mt-1">{generation.progress}% complete</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Credits used: {generation.creditsUsed}</span>
                          {generation.status === "completed" && generation.outputAssets && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Download ({generation.outputAssets.length})
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account and subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subscription Info */}
                <div>
                  <h4 className="font-medium mb-3">Current Plan</h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium capitalize text-foreground">{subscription?.planId || "Free"} Plan</p>
                        <p className="text-sm text-muted-foreground">
                          {subscription?.credits || 0} credits remaining
                        </p>
                      </div>
                      <Button variant="outline">
                        {subscription?.planId === "free" ? "Upgrade Plan" : "Manage Subscription"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div>
                  <h4 className="font-medium mb-3">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground">{user.emailAddresses[0]?.emailAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member since:</span>
                      <span className="text-foreground">{new Date(user.createdAt!).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total generations:</span>
                      <span className="text-foreground">{generations?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}