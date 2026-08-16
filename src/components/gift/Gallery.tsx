import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useWebsiteData } from "@/context/WebsiteDataContext";
import { ImageSettings } from "@/data/types";
import { Reveal } from "./Reveal";

const layoutFor = (shape?: ImageSettings["shape"]): { col: string; ratio: string } => {
  switch (shape) {
    case "hero":
      return { col: "md:col-span-8", ratio: "aspect-[16/10]" };
    case "landscape":
      return { col: "md:col-span-7", ratio: "aspect-[3/2]" };
    case "portrait":
      return { col: "md:col-span-4", ratio: "aspect-[3/4]" };
    case "square":
      return { col: "md:col-span-5", ratio: "aspect-square" };
    case "polaroid":
      return { col: "md:col-span-5", ratio: "aspect-[4/5]" };
    default:
      return { col: "md:col-span-6", ratio: "aspect-[4/3]" };
  }
};

export function Gallery() {
  const { data } = useWebsiteData();
  const gallery = data.gallery;
  const [active, setActive] = useState<number | null>(null);

  const photo = active === null ? null : gallery[active];

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (d: number) => setActive((i) => (i === null ? i : (i + d + gallery.length) % gallery.length)),
    [gallery.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  return (
    <section id="memories" className="relative bg-background py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal className="mb-16 max-w-2xl md:mb-24">
          <p className="text-eyebrow">The archive</p>
          <h2 className="font-display mt-5 text-4xl leading-[1.1] text-ink sm:text-5xl md:text-6xl">
            Memories I Never Want to Forget
          </h2>
          <p className="mt-6 text-[0.95rem] italic text-muted-foreground">A little archive of us.</p>
          <div className="rule-gold mt-8 w-24" />
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-7">
          {gallery.map((p, i) => (
            <Reveal key={`${p.id}-${i}`} className={layoutFor(p.shape).col} y={36}>
              <button
                onClick={() => setActive(i)}
                aria-label={p.caption ?? p.alt ?? "Gallery photo"}
                className={`group relative block w-full overflow-hidden ${
                  p.shape === "polaroid" ? "bg-card p-3 pb-12" : ""
                }`}
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                <div className={`relative overflow-hidden ${layoutFor(p.shape).ratio}`}>
                  <img
                    src={p.src}
                    alt={p.alt || "Memory"}
                    loading="lazy"
                    style={{
                      objectFit: p.fit || "cover",
                      objectPosition: `${p.positionX ?? 50}% ${p.positionY ?? 50}%`,
                      transform: `scale(${(p.zoom ?? 100) / 100})`,
                    }}
                    className="h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                  <div className="grain-overlay absolute inset-0" />
                </div>
                {p.shape === "polaroid" && p.caption && (
                  <span className="absolute bottom-3 left-0 right-0 px-4 font-script text-base text-ink">
                    {p.caption}
                  </span>
                )}
                {p.caption && p.shape !== "polaroid" && (
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-primary/70 to-transparent px-5 pb-5 pt-14 text-left font-display text-base italic text-ondark opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                    {p.caption}
                  </span>
                )}
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && photo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-primary/95 px-4 py-14"
            onClick={close}
          >
            <button
              aria-label="Close"
              onClick={close}
              className="absolute right-6 top-6 text-ondark/80 transition-opacity hover:opacity-100"
            >
              <X className="h-6 w-6" strokeWidth={1.1} />
            </button>
            <button
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className="absolute left-3 z-10 text-ondark/70 md:left-8"
            >
              <ChevronLeft className="h-8 w-8" strokeWidth={1} />
            </button>
            <button
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className="absolute right-3 z-10 text-ondark/70 md:right-8"
            >
              <ChevronRight className="h-8 w-8" strokeWidth={1} />
            </button>

            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-full w-full max-w-4xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photo.src}
                alt={photo.alt || "Gallery preview"}
                style={{
                  objectFit: photo.fit || "contain",
                  objectPosition: `${photo.positionX ?? 50}% ${photo.positionY ?? 50}%`,
                }}
                className="mx-auto max-h-[70svh] w-auto"
              />
              {(photo.caption || photo.date || photo.note) && (
                <figcaption className="mx-auto mt-6 max-w-xl">
                  {photo.date && (
                    <p className="text-[0.62rem] uppercase tracking-[0.34em] text-ondark/60">
                      {photo.date}
                    </p>
                  )}
                  {photo.caption && (
                    <p className="font-display mt-3 text-xl italic text-ondark">
                      {photo.caption}
                    </p>
                  )}
                  {photo.note && (
                    <p className="mt-3 text-sm leading-relaxed text-ondark/70">
                      {photo.note}
                    </p>
                  )}
                </figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
