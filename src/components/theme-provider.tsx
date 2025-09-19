"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// Use React.ComponentProps to define props instead of importing from dist/types
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}