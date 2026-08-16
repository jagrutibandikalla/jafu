import { useEffect, useState } from "react";
import { birthday } from "@/data/gift";
import { Particles, Reveal } from "./Reveal";

type State =
  | { kind: "before"; days: number; hours: number; minutes: number; seconds: number }
  | { kind: "today" }
  | { kind: "after"; days: number };

function compute(now: Date): State {
  const y = now.getFullYear();
  if (now.getMonth() + 1 === birthday.month && now.getDate() === birthday.day) {
    return { kind: "today" };
  }
  const thisYear = new Date(y, birthday.month - 1, birthday.day, 0, 0, 0);
  if (now < thisYear) {
    const diff = thisYear.getTime() - now.getTime();
    return {
      kind: "before",
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }
  return { kind: "after", days: Math.floor((now.getTime() - thisYear.getTime()) / 86400000) };
}

export function BirthdayMoment() {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    setState(compute(new Date()));
    const id = window.setInterval(() => setState(compute(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-primary py-28 text-center md:py-40">
      <Particles count={26} />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, var(--color-gold), transparent 65%)" }}
      />
      <div className="relative mx-auto max-w-3xl px-6 md:px-10">
        <Reveal>
          <p className="text-[0.62rem] uppercase tracking-[0.4em] text-ondark/60">
            August 18 · Her day
          </p>
        </Reveal>

        {state?.kind === "today" && (
          <Reveal delay={0.15}>
            <h2 className="font-display mt-8 text-5xl text-ondark sm:text-6xl md:text-7xl">
              Today is Jafu's Day ♡
            </h2>
            <p className="mt-7 text-sm tracking-[0.2em] text-ondark/70">
              And the world is a little softer for it.
            </p>
          </Reveal>
        )}

        {state?.kind === "before" && (
          <Reveal delay={0.15}>
            <h2 className="font-display mt-8 text-4xl text-ondark sm:text-5xl">
              Counting down to you
            </h2>
            <div className="mt-12 flex justify-center gap-8 sm:gap-14">
              {[
                { v: state.days, l: "Days" },
                { v: state.hours, l: "Hours" },
                { v: state.minutes, l: "Minutes" },
                { v: state.seconds, l: "Seconds" },
              ].map((u) => (
                <div key={u.l}>
                  <p className="font-display text-4xl text-ondark sm:text-6xl">
                    {String(u.v).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-[0.58rem] uppercase tracking-[0.3em] text-ondark/55">
                    {u.l}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {state?.kind === "after" && (
          <Reveal delay={0.15}>
            <h2 className="font-display mt-8 text-4xl italic text-ondark sm:text-5xl">
              Your birthday has passed — but the celebrating hasn't.
            </h2>
            <p className="mt-7 text-sm leading-relaxed tracking-[0.14em] text-ondark/70">
              {state.days === 0
                ? "Still your day, in my head."
                : `${state.days} day${state.days === 1 ? "" : "s"} since the 18th, and I'm still glad you were born.`}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
