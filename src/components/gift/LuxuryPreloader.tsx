import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWebsiteData } from "@/context/WebsiteDataContext";
import { defaultWebsiteData } from "@/data/defaultWebsiteData";

interface LuxuryPreloaderProps {
  children: React.ReactNode;
  onComplete?: () => void;
}

export function LuxuryPreloader({ children, onComplete }: LuxuryPreloaderProps) {
  const { data } = useWebsiteData();
  const heroSrc = data?.hero?.image?.src || defaultWebsiteData.hero.image.src;

  // ALWAYS initialize as false (isLoading = true)
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();
    const MINIMUM_PRELOADER_DURATION = 2200; // 2.2s minimum visual luxury duration

    // Progress bar fill over 2.2 seconds
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(95, Math.floor((elapsed / MINIMUM_PRELOADER_DURATION) * 100));
      if (isMounted) setProgress(currentProgress);
    }, 50);

    // Preload Hero Image
    const imgTask = new Promise<void>((resolve) => {
      if (!heroSrc) {
        resolve();
        return;
      }
      const img = new Image();
      img.src = heroSrc;
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }
    });

    // Preload Fonts if supported
    const fontTask =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready.then(() => {})
        : Promise.resolve();

    Promise.all([imgTask, fontTask]).then(() => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, MINIMUM_PRELOADER_DURATION - elapsed);

      setTimeout(() => {
        if (!isMounted) return;
        setProgress(100);
        setTimeout(() => {
          if (!isMounted) return;
          setIsLoaded(true);
          onComplete?.();
        }, 350);
      }, remainingTime);
    });

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [heroSrc, onComplete]);

  return (
    <>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="luxury-preloader-modal"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(14px)", scale: 1.03 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#FAF6F0] px-6 py-16 text-center select-none"
            style={{ position: "fixed", inset: 0, zIndex: 99999 }}
          >
            {/* Top Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="text-[0.65rem] uppercase tracking-[0.42em] text-amber-900/50"
            >
              Eighteenth of August
            </motion.div>

            {/* Center Content */}
            <div className="flex flex-col items-center max-w-md w-full">
              {/* Luxury Monogram Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-amber-800/25 bg-amber-100/40 shadow-sm backdrop-blur-md"
              >
                <span className="font-display text-2xl font-bold tracking-widest text-amber-950">
                  J ♡ P
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="font-display text-4xl text-amber-950 sm:text-5xl md:text-6xl"
              >
                Jafu
              </motion.h1>

              {/* Gold Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, delay: 0.5 }}
                className="my-5 h-[1px] w-20 bg-amber-700/35 origin-center"
              />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.7 }}
                className="font-script text-2xl text-amber-900 sm:text-3xl"
              >
                A little world made for you.
              </motion.p>
            </div>

            {/* Progress Bar & Status Text */}
            <div className="w-full max-w-xs space-y-3">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="text-[0.62rem] uppercase tracking-[0.3em] text-amber-900/60"
              >
                Preparing your memories...
              </motion.p>
              <div className="h-[2px] w-full overflow-hidden rounded-full bg-amber-900/15">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Website Content */}
      {children}
    </>
  );
}
