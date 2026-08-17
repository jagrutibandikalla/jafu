import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useWebsiteData } from "@/context/WebsiteDataContext";
import { ChapterData } from "@/data/types";
import { Reveal } from "./Reveal";

function ChapterItem({ chapter, index }: { chapter: ChapterData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const flip = index % 2 === 1;

  return (
    <div ref={ref} className="relative grid gap-10 pb-28 md:grid-cols-12 md:gap-12 md:pb-40">
      <div className={`md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}>
        <Reveal>
          <p className="text-eyebrow">{chapter.number}</p>
          <h3 className="font-display mt-5 text-[1.75rem] leading-[1.2] text-ink sm:text-4xl">
            {chapter.title}
          </h3>
          {chapter.subtitle && (
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-primary/80 font-medium">
              {chapter.subtitle}
            </p>
          )}
          {(chapter.quote || chapter.pullQuote) && (
            <p className="font-display mt-5 text-xl italic text-primary sm:text-2xl">
              “{chapter.quote || chapter.pullQuote}”
            </p>
          )}
          <div className="rule-gold my-6 w-16" />
          {chapter.leadText && (
            <p className="mb-4 max-w-md text-[0.96rem] font-medium leading-[1.85] text-ink/90">
              {chapter.leadText}
            </p>
          )}
          {chapter.bodyParagraphs && chapter.bodyParagraphs.length > 0 ? (
            chapter.bodyParagraphs.map((para, pIdx) => (
              <p key={pIdx} className="mb-4 max-w-md text-[0.93rem] leading-[1.9] text-muted-foreground">
                {para}
              </p>
            ))
          ) : (
            chapter.body && (
              <p className="max-w-md text-[0.93rem] leading-[1.9] text-muted-foreground">
                {chapter.body}
              </p>
            )
          )}
          {chapter.accentNote && (
            <p className="mt-4 text-xs italic text-muted-foreground/70">
              ✦ {chapter.accentNote}
            </p>
          )}
        </Reveal>
      </div>

      <div className={`md:col-span-6 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-7"} space-y-6 md:sticky md:top-28 md:self-start`}>
        {chapter.photos.map((p) => (
          <Reveal key={p.id} y={44}>
            <div className="relative overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
              <motion.img
                style={{
                  y,
                  objectFit: p.fit || "cover",
                  objectPosition: `${p.positionX ?? 50}% ${p.positionY ?? 50}%`,
                  transform: `scale(${(p.zoom ?? 100) / 100})`,
                }}
                src={p.src}
                alt={p.alt || chapter.title}
                loading="lazy"
                className={`w-full ${
                  p.shape === "landscape"
                    ? "aspect-[3/2]"
                    : p.shape === "square"
                      ? "aspect-square"
                      : "aspect-[4/5]"
                }`}
              />
              <div className="grain-overlay absolute inset-0" />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function Story() {
  const { data } = useWebsiteData();

  return (
    <section id="story" className="relative bg-secondary/40 py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="mb-20 text-center md:mb-28">
          <p className="text-eyebrow">Chapter by chapter</p>
          <h2 className="font-display mt-5 text-4xl text-ink sm:text-5xl md:text-6xl">Our Story</h2>
          <div className="rule-gold mx-auto mt-8 w-24" />
        </Reveal>

        {data.chapters.map((c, i) => (
          <ChapterItem key={c.id} chapter={c} index={i} />
        ))}

        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-display text-2xl italic leading-[1.6] text-primary sm:text-3xl">
            “Years changed. Places changed. We changed.
            <br />
            But somehow, we never became strangers.”
          </p>
        </Reveal>
      </div>
    </section>
  );
}
