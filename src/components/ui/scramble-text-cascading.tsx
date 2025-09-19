"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { useScramble } from "use-scramble"

import { cn } from "@/lib/utils"

interface ScrambleTextCascadingProps {
  /** The text that will be scrambled and displayed */
  text: string
  /** Speed of the scrambling effect (higher is faster) */
  speed?: number
  /** Optional custom CSS class for the container */
  className?: string
  /** Whether to start the animation automatically when mounted */
  autoStart?: boolean
  /** Callback function when animation completes */
  onComplete?: () => void
  /** Whether to use intersection observer to trigger animation when visible */
  useIntersectionObserver?: boolean
  /** Whether to retrigger animation when element comes into view again */
  retriggerOnIntersection?: boolean
  /** Threshold for intersection observer (0-1) */
  intersectionThreshold?: number
  /** Root margin for intersection observer */
  intersectionRootMargin?: string
  /** Delay in milliseconds before starting the animation */
  delay?: number
}

export interface ScrambleTextCascadingHandle {
  start: () => void
  reset: () => void
}

const ScrambleTextCascading = forwardRef<ScrambleTextCascadingHandle, ScrambleTextCascadingProps>(
  (
    {
      text,
      speed = 120,
      className = "",
      autoStart = true,
      onComplete,
      useIntersectionObserver = false,
      retriggerOnIntersection = true,
      intersectionThreshold = 0.3,
      intersectionRootMargin = "0px",
      delay = 0,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLSpanElement>(null)
    const hasCompletedOnce = useRef(false)
    const timeoutRef = useRef<NodeJS.Timeout>()

    const { ref: scrambleRef, replay } = useScramble({
      text,
      speed: speed / 100, // Convert to 0-1 range
      tick: 2,
      step: 1,
      range: [65, 125], // Use default range (A-Z, a-z, and some special chars)
      scramble: 2,
      playOnMount: autoStart && !useIntersectionObserver && delay === 0,
      onAnimationEnd: () => {
        hasCompletedOnce.current = true
        onComplete?.()
      },
      overdrive: false, // Disable underscore characters
    })

    const startWithDelay = () => {
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          replay()
        }, delay)
      } else {
        replay()
      }
    }

    useImperativeHandle(ref, () => ({
      start: () => startWithDelay(),
      reset: () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        hasCompletedOnce.current = false
        startWithDelay()
      },
    }))

    // Handle Intersection Observer
    useEffect(() => {
      if (!useIntersectionObserver || !containerRef.current) return

      const observerOptions = {
        root: null,
        rootMargin: intersectionRootMargin,
        threshold: intersectionThreshold,
      }

      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasCompletedOnce.current || retriggerOnIntersection) {
              startWithDelay()
            }

            // If not set to retrigger, unobserve after first animation
            if (!retriggerOnIntersection) {
              observer.unobserve(entry.target)
            }
          }
        })
      }

      const observer = new IntersectionObserver(
        handleIntersection,
        observerOptions
      )
      observer.observe(containerRef.current)

      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current)
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [
      useIntersectionObserver,
      retriggerOnIntersection,
      intersectionThreshold,
      intersectionRootMargin,
      delay,
    ])

    // Auto-start with delay on mount if not using intersection observer
    useEffect(() => {
      if (autoStart && !useIntersectionObserver && delay > 0) {
        startWithDelay()
      }
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [autoStart, useIntersectionObserver, delay])

    return (
      <>
        <span className="sr-only">{text}</span>
        <span
          ref={containerRef}
          className={cn("inline-block whitespace-pre-wrap", className)}
          aria-hidden="true"
        >
          <span ref={scrambleRef} />
        </span>
      </>
    )
  }
)

ScrambleTextCascading.displayName = "ScrambleTextCascading"
export default ScrambleTextCascading