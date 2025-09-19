"use client";

import { useEffect, useState, useRef } from "react";

const TASK_SEQUENCES = [
    {
        status: "Analyzing your request",
        lines: [
            "Processing your creative brief...",
            "Understanding image requirements...",
            "Scanning uploaded assets...", 
            "Selecting optimal AI models...",
            "Preparing generation pipeline...",
        ],
    },
    {
        status: "Generating content",
        lines: [
            "Initializing image generation...",
            "Applying style transformations...",
            "Enhancing visual quality...",
            "Processing video frames...",
            "Rendering lipsync animations...",
            "Optimizing output formats...",
            "Finalizing creative assets...",
        ],
    },
    {
        status: "Delivering results",
        lines: [
            "Packaging generated content...",
            "Running quality checks...",
            "Preparing download links...",
            "Organizing output files...",
            "Finalizing delivery...",
        ],
    },
];

interface AILoadingStateProps {
    status?: string;
    progress?: number;
    currentStep?: string;
}

const LoadingAnimation = ({ progress }: { progress: number }) => (
    <div className="relative w-6 h-6">
        <svg
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-label={`Loading progress: ${Math.round(progress)}%`}
        >
            <title>AI Processing Indicator</title>

            <defs>
                <mask id="progress-mask">
                    <rect width="240" height="240" fill="black" />
                    <circle
                        r="120"
                        cx="120"
                        cy="120"
                        fill="white"
                        strokeDasharray={`${(progress / 100) * 754}, 754`}
                        transform="rotate(-90 120 120)"
                    />
                </mask>
            </defs>

            <style>
                {`
                    @keyframes rotate-cw {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes rotate-ccw {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    .g-spin circle {
                        transform-origin: 120px 120px;
                    }
                    .g-spin circle:nth-child(1) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(2) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(3) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(4) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(5) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(6) { animation: rotate-ccw 8s linear infinite; }

                    .g-spin circle:nth-child(2n) { animation-delay: 0.2s; }
                    .g-spin circle:nth-child(3n) { animation-delay: 0.3s; }
                `}
            </style>

            <g
                className="g-spin"
                strokeWidth="16"
                strokeDasharray="18% 40%"
                mask="url(#progress-mask)"
            >
                <circle
                    r="150"
                    cx="120"
                    cy="120"
                    stroke="#9333EA"
                    opacity="0.95"
                />
                <circle
                    r="130"
                    cx="120"
                    cy="120"
                    stroke="#3B82F6"
                    opacity="0.95"
                />
                <circle
                    r="110"
                    cx="120"
                    cy="120"
                    stroke="#06B6D4"
                    opacity="0.95"
                />
                <circle
                    r="90"
                    cx="120"
                    cy="120"
                    stroke="#10B981"
                    opacity="0.95"
                />
                <circle
                    r="70"
                    cx="120"
                    cy="120"
                    stroke="#F59E0B"
                    opacity="0.95"
                />
                <circle
                    r="50"
                    cx="120"
                    cy="120"
                    stroke="#EF4444"
                    opacity="0.95"
                />
            </g>
        </svg>
    </div>
);

export default function AILoadingState({ 
    status: propStatus, 
    progress: propProgress = 0, 
    currentStep: propCurrentStep 
}: AILoadingStateProps) {
    const [sequenceIndex, setSequenceIndex] = useState(0);
    const [visibleLines, setVisibleLines] = useState<
        Array<{ text: string; number: number }>
    >([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const codeContainerRef = useRef<HTMLDivElement>(null);
    const lineHeight = 28;

    // Use prop status if provided, otherwise use sequence status
    const displayStatus = propStatus || TASK_SEQUENCES[sequenceIndex].status;
    const displayProgress = propProgress > 0 ? propProgress : (sequenceIndex / TASK_SEQUENCES.length) * 100;

    const currentSequence = TASK_SEQUENCES[sequenceIndex];
    const totalLines = currentSequence.lines.length;

    useEffect(() => {
        const initialLines = [];
        for (let i = 0; i < Math.min(5, totalLines); i++) {
            initialLines.push({
                text: currentSequence.lines[i],
                number: i + 1,
            });
        }
        setVisibleLines(initialLines);
        setScrollPosition(0);
    }, [sequenceIndex, currentSequence.lines, totalLines]);

    // Handle line advancement - only if no custom status is provided
    useEffect(() => {
        if (propStatus) return; // Don't auto-advance if custom status is provided

        const advanceTimer = setInterval(() => {
            const firstVisibleLineIndex = Math.floor(scrollPosition / lineHeight);
            const nextLineIndex = (firstVisibleLineIndex + 3) % totalLines;

            if (nextLineIndex < firstVisibleLineIndex && nextLineIndex !== 0) {
                setSequenceIndex(
                    (prevIndex) => (prevIndex + 1) % TASK_SEQUENCES.length
                );
                return;
            }

            if (
                nextLineIndex >= visibleLines.length &&
                nextLineIndex < totalLines
            ) {
                setVisibleLines((prevLines) => [
                    ...prevLines,
                    {
                        text: currentSequence.lines[nextLineIndex],
                        number: nextLineIndex + 1,
                    },
                ]);
            }

            setScrollPosition((prevPosition) => prevPosition + lineHeight);
        }, 2500);

        return () => clearInterval(advanceTimer);
    }, [
        scrollPosition,
        visibleLines,
        totalLines,
        sequenceIndex,
        currentSequence.lines,
        lineHeight,
        propStatus,
    ]);

    // Apply scroll position
    useEffect(() => {
        if (codeContainerRef.current) {
            codeContainerRef.current.scrollTop = scrollPosition;
        }
    }, [scrollPosition]);

    // If we have a custom current step, show it in the lines
    useEffect(() => {
        if (propCurrentStep && propStatus) {
            setVisibleLines([{
                text: propCurrentStep,
                number: 1,
            }]);
        }
    }, [propCurrentStep, propStatus]);

    return (
        <div className="flex items-start justify-start w-full py-3 pl-4">
            <div className="space-y-2">
                <div className="flex items-center space-x-2 text-muted-foreground text-sm font-medium">
                    <LoadingAnimation progress={displayProgress} />
                    <span>{displayStatus}...</span>
                </div>

                <div className="relative">
                    <div
                        ref={codeContainerRef}
                        className="font-mono text-xs overflow-hidden w-full h-[56px] relative"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        <div>
                            {visibleLines.slice(0, 2).map((line, index) => (
                                <div
                                    key={`${line.number}-${line.text}`}
                                    className="flex h-[28px] items-center"
                                >
                                    <div className="text-muted-foreground/60 pr-2 select-none w-4 text-right text-xs">
                                        {line.number}
                                    </div>

                                    <div className="text-muted-foreground flex-1 text-xs">
                                        {line.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Progress bar if we have explicit progress */}
                {propProgress > 0 && (
                    <div className="w-48 bg-muted/30 rounded-full h-1 mt-2">
                        <div
                            className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(propProgress, 100)}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}