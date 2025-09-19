/**
 * Theme Preview Component
 * 
 * Quick component to verify the new OKLCH theme is working correctly
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ThemePreview() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          OKLCH Theme Preview
        </h1>
        <p className="text-lg text-muted-foreground">
          Testing the new modern OKLCH color space theme with warm golden accents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Primary Colors</CardTitle>
            <CardDescription>Main brand colors using OKLCH</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">Primary Button</Button>
            <Button variant="secondary" className="w-full">Secondary Button</Button>
            <Button variant="outline" className="w-full">Outline Button</Button>
            <Button variant="ghost" className="w-full">Ghost Button</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Geist Mono with proper spacing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="font-sans">
              <div className="text-2xl font-bold">Heading Text</div>
              <div className="text-base">Regular body text</div>
              <div className="text-sm text-muted-foreground">Muted text</div>
            </div>
            <div className="font-mono text-sm bg-muted p-2 rounded">
              Code example with JetBrains Mono
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Colors</CardTitle>
            <CardDescription>Semantic colors for feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shadows & Borders</CardTitle>
            <CardDescription>Modern shadow system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md">Border example</div>
            <div className="p-4 bg-accent rounded-lg shadow-sm">Small shadow</div>
            <div className="p-4 bg-card rounded-lg shadow-md">Medium shadow</div>
            <div className="p-4 bg-card rounded-lg shadow-lg">Large shadow</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interactive States</CardTitle>
            <CardDescription>Hover and focus states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full transition-all duration-300 hover:scale-[1.02]">
              Hover me
            </Button>
            <input 
              type="text" 
              placeholder="Focus me"
              className="w-full p-2 border rounded-md bg-input focus:ring-2 focus:ring-ring focus:ring-offset-2 outline-none transition-all"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chart Colors</CardTitle>
            <CardDescription>Data visualization palette</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="h-4 bg-chart-1 rounded"></div>
              <div className="h-4 bg-chart-2 rounded"></div>
              <div className="h-4 bg-chart-3 rounded"></div>
              <div className="h-4 bg-chart-4 rounded"></div>
              <div className="h-4 bg-chart-5 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 bg-sidebar border border-sidebar-border rounded-lg">
        <h3 className="text-lg font-semibold text-sidebar-foreground mb-3">
          Sidebar Colors
        </h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground">
            Sidebar Item
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sidebar-primary">
            Primary Sidebar Item
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Theme successfully applied! Check both light and dark modes using the theme toggle.
      </div>
    </div>
  );
}