import { motion } from "motion/react";
import { useWebsiteData } from "@/context/WebsiteDataContext";
import { defaultWebsiteData } from "@/data/defaultWebsiteData";
import { Particles } from "./Reveal";

export function Hero() {
  const { data } = useWebsiteData();
  const hero = data?.hero || defaultWebsiteData.hero;
  const image = hero.image || defaultWebsiteData.hero.image;
  const imgSrc = image.src || defaultWebsiteData.hero.image.src;

  return (
    <section id="home" className="relative h-[100svh] w-full overflow-hidden">
      {/* High-priority browser image preload */}
      <link rel="preload" as="image" href={imgSrc} />

      <img
        src={imgSrc}
        alt={image.alt || "Hero background"}
        width={1440}
        height={1920}
        loading="eager"
        style={{
          objectFit: image.fit || "cover",
          objectPosition: `${image.positionX ?? 50}% ${image.positionY ?? 50}%`,
          transform: `scale(${(image.zoom ?? 100) / 100})`,
        }}
        className="animate-slow-zoom absolute inset-0 h-full w-full"
      />
      <div
        className="absolute inset-0"
        style={{
          background: "var(--gradient-veil)",
          opacity: (hero.overlayIntensity ?? 28) / 100,
        }}
      />
      <div className="grain-overlay absolute inset-0" />
      <Particles count={22} />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-[0.65rem] uppercase tracking-[0.42em] text-ondark/75"
        >
          {hero.eyebrowText || "Eighteenth of August"}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-7 text-balance text-5xl leading-[1.02] text-ondark sm:text-6xl md:text-7xl lg:text-[5.5rem]"
        >
          {hero.mainTitle || "Happy Birthday, Jafu"}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="rule-gold my-8 w-24 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
          className="font-display max-w-xl text-lg italic leading-relaxed text-ondark/90 sm:text-xl"
        >
          {hero.quote || "To the girl who has been a part of my story since 6th standard."}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.7 }}
          className="mt-6 text-[0.68rem] uppercase tracking-[0.3em] text-ondark/65"
        >
          {hero.subtextDate || "August 18, 2005 — The day the world got Jafu."}
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2.2 }}
          onClick={() =>
            document.getElementById("opening")?.scrollIntoView({ behavior: "smooth" })
          }
          className="animate-scroll-hint absolute bottom-10 text-[0.6rem] uppercase tracking-[0.36em] text-ondark/80"
        >
          Scroll to relive our story ↓
        </motion.button>
      </div>
    </section>
  );
}
