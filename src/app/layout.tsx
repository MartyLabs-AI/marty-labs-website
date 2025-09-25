import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
// import { ConvexClientProvider } from "@/lib/convex";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marty Labs - AI Creative Studio",
  description: "Transform images with AI workflows in seconds. Create, edit, and reimagine visuals with intelligent AI-powered tools.",
  icons: {
    icon: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/Group%2044.png",
    shortcut: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/Group%2044.png",
    apple: "https://davhrppssmixrmhusdtb.supabase.co/storage/v1/object/public/videos/Group%2044.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical domains for faster loading */}
        <link rel="preconnect" href="https://davhrppssmixrmhusdtb.supabase.co" />
        <link rel="dns-prefetch" href="//davhrppssmixrmhusdtb.supabase.co" />
        <link rel="dns-prefetch" href="//calendly.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
