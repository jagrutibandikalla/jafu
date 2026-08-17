import { useWebsiteData } from "@/context/WebsiteDataContext";
import { Reveal } from "./Reveal";

export function LittleThings() {
  const { data } = useWebsiteData();
  const heroPhoto = data.littleThings.heroPhoto;
  const cards = data.littleThings.cards;

  return (
    <section id="little" className="relative bg-background py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid items-end gap-12 md:grid-cols-2">
          <Reveal>
            <p className="text-eyebrow">Only ours</p>
            <h2 className="font-display mt-5 text-4xl leading-[1.1] text-ink sm:text-5xl">
              Our Little Things
            </h2>
            <div className="rule-gold mt-8 w-20" />
            <p className="mt-7 max-w-sm text-[0.95rem] leading-[1.9] text-muted-foreground">
              The small, unimportant things that turned out to be the most important ones.
            </p>
          </Reveal>

          <Reveal y={40}>
            <div className="group relative block w-full text-left bg-white dark:bg-stone-900 p-4 sm:p-5 pb-7 sm:pb-8 rounded-sm border border-stone-200/80 dark:border-stone-800 shadow-md -rotate-1">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-amber-100/80 dark:bg-amber-950/40 backdrop-blur-[1px] border border-amber-200/60 rotate-[1deg] shadow-[0_1px_3px_rgba(0,0,0,0.08)] z-10 pointer-events-none rounded-[1px]" />
              <div className="relative overflow-hidden aspect-[3/2] bg-stone-100 dark:bg-stone-800 rounded-[2px] border border-stone-200/50">
                <img
                  src={heroPhoto.src}
                  alt={heroPhoto.alt || "A diary, polaroids and chai on ivory linen"}
                  loading="lazy"
                  style={{
                    objectFit: heroPhoto.fit || "cover",
                    objectPosition: `${heroPhoto.positionX ?? 50}% ${heroPhoto.positionY ?? 50}%`,
                    transform: `scale(${(heroPhoto.zoom ?? 100) / 100})`,
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="grain-overlay absolute inset-0" />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-24">
          {cards.map((c, i) => (
            <Reveal key={c.id || c.title} delay={i * 0.05}>
              <article className="glass-panel h-full p-7 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    {c.date && (
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-gold/80">
                        {c.date}
                      </p>
                    )}
                  </div>
                  <h3 className="font-display mt-4 text-xl text-ink">{c.title}</h3>
                  <p className="mt-3 text-sm leading-[1.85] text-muted-foreground">{c.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
