import { useWebsiteData } from "@/context/WebsiteDataContext";
import { defaultWebsiteData } from "@/data/defaultWebsiteData";
import { Reveal } from "./Reveal";

export function ThingsILove() {
  const { data } = useWebsiteData();
  
  const raw = data?.thingsILove || defaultWebsiteData.thingsILove;
  let items: string[] = [];

  if (Array.isArray(raw)) {
    items = raw;
  } else if (raw && typeof raw === "object" && Array.isArray((raw as any).items)) {
    items = (raw as any).items;
  } else {
    items = defaultWebsiteData.thingsILove.items;
  }

  return (
    <section
      id="things"
      className="relative py-28 md:py-40"
      style={{ background: "var(--gradient-champagne)" }}
    >
      <div className="grain-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <Reveal className="text-center">
          <p className="text-eyebrow">A short list of an endless thing</p>
          <h2 className="font-display mt-5 text-4xl text-ink sm:text-5xl md:text-6xl">
            Things I Love About You
          </h2>
          <div className="rule-gold mx-auto mt-8 w-24" />
        </Reveal>

        <ol className="mt-16 md:mt-24">
          {items.map((t, i) => (
            <Reveal key={`${t}-${i}`} delay={i * 0.06}>
              <li className="group flex items-baseline gap-6 border-b border-border/70 py-7 transition-colors duration-700 hover:border-gold md:gap-10 md:py-9">
                <span className="font-display w-10 shrink-0 text-sm text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-2xl leading-snug text-ink transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 sm:text-3xl md:text-[2.1rem]">
                  {t}
                </span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
