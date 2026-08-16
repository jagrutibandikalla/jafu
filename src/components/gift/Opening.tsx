import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useWebsiteData } from "@/context/WebsiteDataContext";
import { defaultWebsiteData } from "@/data/defaultWebsiteData";
import { Reveal, Words } from "./Reveal";

export function Opening() {
  const { data } = useWebsiteData();
  const opening = data?.opening || defaultWebsiteData.opening;
  const image = opening.image || defaultWebsiteData.opening.image;
  const imgSrc = image.src || defaultWebsiteData.opening.image.src;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <section id="opening" ref={ref} className="relative overflow-hidden bg-background py-28 md:py-40">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2 md:gap-20 md:px-10">
        <div className="order-2 md:order-1">
          <p className="text-eyebrow">{opening.eyebrowText || "The beginning"}</p>
          <h2 className="font-display mt-6 text-3xl leading-[1.18] text-ink sm:text-4xl md:text-[2.9rem]">
            <Words text={opening.titleLine1 || "Some friendships begin with a hello."} />
            <br />
            <span className="italic text-primary">
              <Words text={opening.titleLine2 || "Ours began with growing up together."} delay={0.35} />
            </span>
          </h2>
          <Reveal delay={0.3}>
            <div className="rule-gold my-9 w-20" />
            <p className="max-w-md text-[0.95rem] leading-[1.9] text-muted-foreground">
              {opening.bodyText ||
                "From two little girls on the same apartment floor to two people navigating life from different places — somehow, through every version of us, one thing stayed the same: us."}
            </p>
          </Reveal>
        </div>

        <Reveal className="order-1 md:order-2" y={40}>
          <div className="relative overflow-hidden" style={{ boxShadow: "var(--shadow-lift)" }}>
            <motion.img
              style={{
                y,
                scale,
                objectFit: image.fit || "cover",
                objectPosition: `${image.positionX ?? 50}% ${image.positionY ?? 50}%`,
              }}
              src={imgSrc}
              alt={image.alt || "Opening corridor floor"}
              loading="lazy"
              width={1280}
              height={1600}
              className="aspect-[4/5] w-full"
            />
            <div className="grain-overlay absolute inset-0" />
          </div>
          <p className="mt-4 text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground">
            {opening.captionText || image.caption || "The apartment floor, where it all started"}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
