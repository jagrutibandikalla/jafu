import { Heart } from "lucide-react";
import { useWebsiteData } from "@/context/WebsiteDataContext";
import { defaultWebsiteData } from "@/data/defaultWebsiteData";
import { Particles, Reveal } from "./Reveal";

export function Finale() {
  const { data } = useWebsiteData();
  const finale = data?.finale || defaultWebsiteData.finale;
  const photo = finale?.photo || defaultWebsiteData.finale.photo;
  const imgSrc = photo.src || defaultWebsiteData.finale.photo.src;

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <img
        src={imgSrc}
        alt={photo.alt || "Finale portrait"}
        loading="lazy"
        style={{
          objectFit: photo.fit || "cover",
          objectPosition: `${photo.positionX ?? 50}% ${photo.positionY ?? 50}%`,
          transform: `scale(${(photo.zoom ?? 100) / 100})`,
        }}
        className="absolute inset-0 h-full w-full"
      />
      <div
        className="absolute inset-0"
        style={{
          background: "var(--gradient-veil)",
          opacity: (finale.overlayIntensity ?? 40) / 100,
        }}
      />
      <div className="grain-overlay absolute inset-0" />
      <Particles count={18} />

      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center md:px-10">
        <Reveal>
          <p className="font-display text-2xl leading-[1.7] text-ondark sm:text-3xl md:text-4xl">
            {finale.lines && finale.lines.length > 0 ? (
              finale.lines.map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < finale.lines.length - 1 && <br />}
                </span>
              ))
            ) : (
              <>
                Years passed.
                <br />
                Cities changed.
                <br />
                Life changed.
                <br />
                But you are still one of my favorite parts of it.
              </>
            )}
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="rule-gold mx-auto my-12 w-24" />
          <h2 className="font-display text-4xl text-ondark sm:text-5xl md:text-6xl">
            {finale.title || "Happy Birthday, Jafu."}
          </h2>
          <p className="mt-7 text-[0.7rem] uppercase tracking-[0.3em] text-ondark/70">
            {finale.subtitle || "Thank you for being my person for all these years."}
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-16 flex items-center justify-center gap-4">
            <span className="font-script text-2xl text-ondark">
              {finale.footerTag || "6th standard → forever"}
            </span>
            <Heart
              className="animate-heartbeat h-5 w-5 fill-rose text-rose"
              strokeWidth={1}
              aria-hidden="true"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
