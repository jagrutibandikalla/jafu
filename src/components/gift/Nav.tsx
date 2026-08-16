import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

const items = [
  { label: "Home", id: "home" },
  { label: "Our Story", id: "story" },
  { label: "Memories", id: "memories" },
  { label: "Things I Love", id: "things" },
  { label: "Our Little Things", id: "little" },
  { label: "Music", id: "music" },
  { label: "Letter", id: "letter" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled ? "glass-panel border-x-0 border-t-0 py-3" : "border-transparent py-6"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10">
          <button
            onClick={() => go("home")}
            className={`font-display text-lg tracking-[0.3em] transition-colors ${
              scrolled ? "text-ink" : "text-ondark"
            }`}
          >
            JAFU
          </button>

          <ul className="hidden items-center gap-8 lg:flex">
            {items.map((it) => (
              <li key={it.id}>
                <button
                  onClick={() => go(it.id)}
                  className={`text-[0.68rem] uppercase tracking-[0.22em] transition-opacity duration-500 hover:opacity-100 ${
                    scrolled ? "text-ink-soft opacity-80" : "text-ondark opacity-75"
                  }`}
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className={`lg:hidden ${scrolled ? "text-ink" : "text-ondark"}`}
          >
            <Menu className="h-5 w-5" strokeWidth={1.2} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[60] flex flex-col bg-background"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-display text-lg tracking-[0.3em] text-ink">JAFU</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-ink">
                <X className="h-5 w-5" strokeWidth={1.2} />
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-7 px-8">
              {items.map((it, i) => (
                <motion.li
                  key={it.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    onClick={() => go(it.id)}
                    className="font-display text-3xl text-ink transition-colors hover:text-primary"
                  >
                    {it.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="px-8 pb-10">
              <div className="rule-gold" />
              <p className="text-eyebrow mt-4">August 18</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
