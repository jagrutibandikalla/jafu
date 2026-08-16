import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useWebsiteData } from "@/context/WebsiteDataContext";
import { defaultWebsiteData } from "@/data/defaultWebsiteData";
import { Reveal, Words } from "./Reveal";

export function IfICouldGoBack() {
  const { data } = useWebsiteData();
  const thought = data?.thought || defaultWebsiteData.thought;
  const image = thought.image || defaultWebsiteData.thought.image;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const lines = thought.lines && thought.lines.length > 0 ? thought.lines : [
    "I would still choose the same apartment floor.",
    "The same childhood.",
    "The same silly conversations.",
    "The same hostel days.",
    "The same friendship.",
    "The same you.",
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28 md:py-44"
      style={{ background: "var(--gradient-champagne)" }}
    >
      <motion.img
        style={{
          y,
          objectFit: image.fit || "cover",
          objectPosition: `${image.positionX ?? 50}% ${image.positionY ?? 50}%`,
          transform: `scale(${(image.zoom ?? 100) / 100})`,
        }}
        src={image.src}
        alt={image.alt || "An old apartment stairwell in soft afternoon light"}
        loading="lazy"
        className="absolute inset-0 h-[120%] w-full opacity-25"
      />
      <div className="grain-overlay absolute inset-0" />

      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
        <Reveal>
          <p className="text-eyebrow">{thought.eyebrowText || "A thought I keep having"}</p>
          <h2 className="font-display mt-6 text-4xl text-ink sm:text-5xl md:text-6xl">
            {thought.mainTitle || "If I Could Go Back…"}
          </h2>
          <div className="rule-gold mx-auto mt-8 w-20" />
        </Reveal>

        <Reveal delay={0.2}>
          <p className="font-display mt-12 text-3xl italic text-primary sm:text-4xl">
            <Words text={thought.quote || "I wouldn't change a thing."} />
          </p>
        </Reveal>

        <div className="mt-14 space-y-5">
          {lines.map((l, i) => (
            <Reveal key={`${l}-${i}`} delay={i * 0.08} y={20}>
              <p className="font-display text-xl leading-relaxed text-ink sm:text-2xl">{l}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
