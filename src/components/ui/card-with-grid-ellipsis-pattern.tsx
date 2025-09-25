import { cn } from '@/lib/utils'
import { motion } from "framer-motion"

interface GridPatternCardProps {
  children: React.ReactNode
  className?: string
  patternClassName?: string
  gradientClassName?: string
}

export function GridPatternCard({ 
  children, 
  className,
  patternClassName,
  gradientClassName
}: GridPatternCardProps) {
  return (
    <motion.div
      className={cn(
        "border w-full rounded-lg overflow-hidden relative",
        "bg-background",
        "border-border",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Visible Grid Pattern Background */}
      <div 
        className={cn("absolute inset-0", patternClassName)}
        style={{
          backgroundImage: `
            radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 2px, transparent 0)
          `,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Grid lines for structure */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Corner dots for ellipsis effect */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 0px 0px, rgba(255,255,255,0.6) 1.5px, transparent 0),
            radial-gradient(circle at 24px 0px, rgba(255,255,255,0.6) 1.5px, transparent 0),
            radial-gradient(circle at 0px 24px, rgba(255,255,255,0.6) 1.5px, transparent 0),
            radial-gradient(circle at 24px 24px, rgba(255,255,255,0.6) 1.5px, transparent 0)
          `,
          backgroundSize: '24px 24px, 24px 24px, 24px 24px, 24px 24px'
        }}
      />
      
      {/* Content with gradient overlay */}
      <div className={cn(
        "relative z-10 bg-gradient-to-tr",
        "from-background/95 via-background/80 to-background/60",
        gradientClassName
      )}>
        {children}
      </div>
    </motion.div>
  )
}

export function GridPatternCardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("text-left p-4 md:p-6", className)} 
      {...props} 
    />
  )
}