import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gray-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-gray-900 shadow-lg border border-gray-800/20 dark:border-white/20 hover:shadow-xl hover:bg-gray-800/90 dark:hover:bg-gray-100/90 transform hover:scale-[1.01]",
        destructive:
          "bg-red-600/90 backdrop-blur-md text-white shadow-lg border border-red-500/20 hover:shadow-xl hover:bg-red-700/90 transform hover:scale-[1.01]",
        outline:
          "border border-border/60 bg-background/80 backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-background/90 hover:border-border/80 transform hover:scale-[1.01]",
        secondary:
          "bg-muted/80 backdrop-blur-md text-muted-foreground shadow-lg border border-muted/40 hover:shadow-xl hover:bg-muted/90 transform hover:scale-[1.01]",
        ghost:
          "hover:bg-muted/60 hover:text-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline",
        primary:
          "bg-blue-600/90 backdrop-blur-md text-white shadow-lg border border-blue-500/20 hover:shadow-xl hover:bg-blue-700/90 transform hover:scale-[1.01]",
        accent:
          "bg-purple-600/90 backdrop-blur-md text-white shadow-lg border border-purple-500/20 hover:shadow-xl hover:bg-purple-700/90 transform hover:scale-[1.01]",
        glass:
          "bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-white/30 dark:border-white/20 text-foreground shadow-lg hover:shadow-xl hover:bg-white/20 dark:hover:bg-black/20 hover:border-white/40 dark:hover:border-white/30 transform hover:scale-[1.01]",
        subtle:
          "bg-gray-50/80 dark:bg-gray-800/60 backdrop-blur-md text-gray-700 dark:text-gray-300 shadow-lg border border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/60 transform hover:scale-[1.01]",
      },
      size: {
        default: "h-11 px-6 py-2.5 has-[>svg]:px-4",
        sm: "h-9 px-4 gap-1.5 has-[>svg]:px-3",
        lg: "h-14 px-8 py-3.5 text-base has-[>svg]:px-6",
        xl: "h-16 px-10 py-4 text-lg has-[>svg]:px-8",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
