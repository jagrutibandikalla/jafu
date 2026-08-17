import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useWebsiteData } from "@/context/WebsiteDataContext";
import { defaultWebsiteData } from "@/data/defaultWebsiteData";
import { Reveal } from "./Reveal";

export function Letter() {
  const { data } = useWebsiteData();
  const letter = data?.letter || defaultWebsiteData.letter;
  const artwork = letter?.artwork || defaultWebsiteData.letter.artwork;
  const imgSrc = artwork.src || defaultWebsiteData.letter.artwork.src;

  const [open, setOpen] = useState(false);

  return (
    <section id="letter" className="relative bg-background py-28 md:py-40">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <Reveal className="text-center">
          <p className="text-eyebrow">Written, not typed</p>
          <h2 className="font-display mt-5 text-4xl text-ink sm:text-5xl md:text-6xl">
            A Letter For My Jafu
          </h2>
          <div className="rule-gold mx-auto mt-8 w-24" />
        </Reveal>

        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div
              key="closed"
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-14"
            >
              <Reveal y={40}>
                <div
                  className="relative overflow-hidden rounded-2xl bg-[#FAF6F0] p-4 sm:p-8 flex items-center justify-center border border-gold/30"
                  style={{ boxShadow: "var(--shadow-lift)" }}
                >
                  <img
                    src={imgSrc}
                    alt={artwork.alt || "A sealed envelope with a wax seal"}
                    loading="lazy"
                    style={{
                      objectFit: artwork.fit || "contain",
                      objectPosition: `${artwork.positionX ?? 50}% ${artwork.positionY ?? 50}%`,
                    }}
                    className="max-h-[28rem] sm:max-h-[34rem] w-auto mx-auto object-contain rounded-xl transition-transform duration-700 hover:scale-[1.02]"
                  />
                  <div className="grain-overlay absolute inset-0 rounded-2xl" />
                </div>
                <p className="font-display mx-auto mt-10 max-w-lg text-center text-xl italic leading-relaxed text-ink sm:text-2xl">
                  “There are some people you don't just meet.
                  <br />
                  You grow up with them.”
                </p>
                <div className="mt-9 text-center">
                  <button
                    onClick={() => setOpen(true)}
                    className="group relative inline-flex items-center gap-3 border border-gold/70 px-9 py-4 text-[0.66rem] uppercase tracking-[0.34em] text-ink transition-colors duration-700 hover:bg-primary hover:text-primary-foreground"
                  >
                    Open Letter
                  </button>
                </div>
              </Reveal>
            </motion.div>
          ) : (
            <motion.article
              key="open"
              initial={{ opacity: 0, rotateX: -8, y: 40, filter: "blur(14px)" }}
              animate={{ opacity: 1, rotateX: 0, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 1400, boxShadow: "var(--shadow-lift)" }}
              className="relative mt-14 overflow-hidden bg-card px-7 py-12 sm:px-14 sm:py-16"
            >
              <div className="grain-overlay absolute inset-0" />
              <div className="rule-gold mx-auto mb-10 w-16" />
              <div className="relative space-y-6">
                {letter.paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.5 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className={
                      i === 0
                        ? "font-script text-3xl text-primary"
                        : "text-[0.98rem] leading-[2.05] text-ink-soft"
                    }
                  >
                    {p}
                  </motion.p>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.6 + letter.paragraphs.length * 0.18 }}
                  className="pt-6"
                >
                  <p className="text-[0.98rem] text-ink-soft">{letter.signature.closing}</p>
                  <p className="font-script mt-2 text-3xl text-primary">
                    {letter.signature?.name && !letter.signature.name.includes("Jagruti")
                      ? letter.signature.name
                      : "From your Princy ❤️"}
                  </p>
                  <p className="font-script mt-6 text-xl text-ink-soft">
                    “{letter.signature.handwritten}”
                  </p>
                </motion.div>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
