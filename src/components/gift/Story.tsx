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
            <div className="group relative block w-full text-left bg-white dark:bg-stone-900 p-4 sm:p-5 pb-7 sm:pb-8 rounded-sm border border-stone-200/80 dark:border-stone-800 shadow-md transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] rotate-1">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-amber-100/80 dark:bg-amber-950/40 backdrop-blur-[1px] border border-amber-200/60 rotate-[-1deg] shadow-[0_1px_3px_rgba(0,0,0,0.08)] z-10 pointer-events-none rounded-[1px]" />
              <div className="relative overflow-hidden aspect-[4/5] bg-stone-100 dark:bg-stone-800 rounded-[2px] border border-stone-200/50">
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
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="grain-overlay absolute inset-0" />
              </div>
              {(p.caption || p.date) && (
                <div className="mt-3.5 flex flex-col items-center text-center px-1">
                  {p.date && (
                    <span className="text-[0.62rem] uppercase tracking-[0.25em] font-mono text-stone-400 dark:text-stone-500 mb-1">
                      {p.date}
                    </span>
                  )}
                  {p.caption && (
                    <span className="font-script text-lg sm:text-xl text-stone-800 dark:text-stone-100 leading-snug font-bold">
                      {p.caption}
                    </span>
                  )}
                </div>
              )}
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
