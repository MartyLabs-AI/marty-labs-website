"use client";

import * as React from "react";
import { useAnimate } from "framer-motion";
import { useRouter } from "next/navigation";
import { HighlighterItem, HighlightGroup, Particles } from "@/components/ui/highlighter";

export function ProducerAgentBanner() {
  const [scope, animate] = useAnimate();
  const router = useRouter();

  React.useEffect(() => {
    animate(
      [
        ["#pointer", { left: 250, top: 60 }, { duration: 0 }],
        ["#image-generation", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 60, top: 102 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#image-generation", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#video-creation", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 280, top: 170 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#video-creation", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#memory-context", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 100, top: 198 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#memory-context", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#upscaling-4k", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 250, top: 60 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#upscaling-4k", { opacity: 0.5 }, { at: "-0.3", duration: 0.1 }],
      ],
      {
        repeat: Number.POSITIVE_INFINITY,
      },
    );
  }, [animate]);

  return (
    <section className="relative w-full py-0 px-0">
      <HighlightGroup className="group h-full w-full">
        <div
          className="group/item h-full w-full"
          data-aos="fade-down"
        >
          <HighlighterItem className="rounded-none p-0">
            <div className="relative z-20 h-full overflow-hidden rounded-none border-l-0 border-r-0 border-t border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-black">
              <Particles
                className="absolute inset-0 -z-10 opacity-10 transition-opacity duration-1000 ease-in-out group-hover/item:opacity-100"
                quantity={300}
                color={"#ef4444"}
                vy={-0.2}
              />
              <div className="flex justify-center w-full">
                <div className="flex h-full flex-col justify-center gap-10 p-6 md:h-[300px] md:flex-row w-full max-w-7xl">
                  <div
                    className="relative mx-auto h-[270px] w-[350px] md:h-[270px] md:w-[400px]"
                    ref={scope}
                  >
                    <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                        <path d="M2 17L12 22L22 17" />
                        <path d="M2 12L12 17L22 12" />
                      </svg>
                    </div>
                    <div
                      id="upscaling-4k"
                      className="absolute bottom-12 left-14 rounded-3xl border border-slate-400 bg-slate-200 px-3 py-1.5 text-xs opacity-50 dark:border-slate-600 dark:bg-slate-800"
                    >
                      4K Upscaling
                    </div>
                    <div
                      id="video-creation"
                      className="absolute left-2 top-20 rounded-3xl border border-slate-400 bg-slate-200 px-3 py-1.5 text-xs opacity-50 dark:border-slate-600 dark:bg-slate-800"
                    >
                      Video Creation
                    </div>
                    <div
                      id="memory-context"
                      className="absolute bottom-20 right-1 rounded-3xl border border-slate-400 bg-slate-200 px-3 py-1.5 text-xs opacity-50 dark:border-slate-600 dark:bg-slate-800"
                    >
                      Memory & Context
                    </div>
                    <div
                      id="image-generation"
                      className="absolute right-12 top-10 rounded-3xl border border-slate-400 bg-slate-200 px-3 py-1.5 text-xs opacity-50 dark:border-slate-600 dark:bg-slate-800"
                    >
                      Image Generation
                    </div>

                    <div id="pointer" className="absolute">
                      <svg
                        width="16.8"
                        height="18.2"
                        viewBox="0 0 12 13"
                        className="fill-red-500"
                        stroke="white"
                        strokeWidth="1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"
                        />
                      </svg>
                      <span className="bg-red-500 relative -top-1 left-3 rounded-3xl px-2 py-1 text-xs text-white">
                        Producer
                      </span>
                    </div>
                  </div>

                  <div className="-mt-20 flex h-full flex-col justify-center p-2 md:-mt-4 md:ml-10 md:w-[500px]">
                    <div className="flex flex-col items-center">
                      <h3 className="mt-6 pb-1 font-bold">
                        <span className="text-2xl md:text-4xl">
                          Announcing Producer Agent!
                        </span>
                      </h3>
                    </div>
                    <p className="mb-4 text-slate-400">
                      Producer Agent sits on top state-of-the-art AI models, making creating with AI more accessible.
                      No more referring to multiple prompt guides or figuring what model to go with, just prompt.
                      Built for creatives, by creatives.
                    </p>
                    <div className="mt-4">
                      <button 
                        onClick={() => router.push('/producer-agent')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white text-xs font-medium rounded backdrop-blur-md transition-all duration-300 hover:scale-105"
                      >
                        Read More
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HighlighterItem>
        </div>
      </HighlightGroup>
    </section>
  );
}