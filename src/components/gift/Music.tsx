import { motion } from "motion/react";
import { Pause, Play, Volume2 } from "lucide-react";
import { useWebsiteData } from "@/context/WebsiteDataContext";
import { useAudioPlayer } from "@/context/AudioContext";
import { defaultWebsiteData } from "@/data/defaultWebsiteData";
import { Reveal } from "./Reveal";

const fmt = (s: number) => {
  if (!Number.isFinite(s) || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export function Music() {
  const { data } = useWebsiteData();
  const song = data?.music || defaultWebsiteData.music;
  const artwork = song?.artwork || defaultWebsiteData.music.artwork;
  const artworkSrc = artwork.src || defaultWebsiteData.music.artwork.src;
  const rawSrc = song?.src;
  const audioSrc = (rawSrc && rawSrc.startsWith("/music/")) ? rawSrc : "/music/jafu.mp3";

  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isAutoplayBlocked,
    togglePlay,
    setVolume,
    seek,
  } = useAudioPlayer();

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section id="music" className="relative bg-secondary/40 py-28 md:py-40">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <Reveal className="text-center">
          <p className="text-eyebrow">Press play when you're ready</p>
          <h2 className="font-display mt-5 text-4xl text-ink sm:text-5xl md:text-6xl">
            {song.title || "Jafu ♡"}
          </h2>
          <div className="rule-gold mx-auto mt-8 w-24" />
        </Reveal>

        <Reveal delay={0.15} y={40}>
          <div className="glass-panel mt-14 flex flex-col gap-8 p-6 sm:flex-row sm:items-center sm:gap-10 sm:p-9">
            <div className="relative mx-auto w-40 shrink-0 sm:mx-0 sm:w-48">
              <motion.img
                src={artworkSrc}
                alt={artwork.alt || "Album artwork"}
                loading="lazy"
                animate={isPlaying ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }}
                style={{
                  objectFit: artwork.fit || "cover",
                  objectPosition: `${artwork.positionX ?? 50}% ${artwork.positionY ?? 50}%`,
                  boxShadow: "var(--shadow-soft)",
                }}
                className="aspect-square w-full rounded-lg"
              />
            </div>

            <div className="flex-1">
              <p className="text-[0.62rem] uppercase tracking-[0.32em] text-muted-foreground">
                {song.artist || "For Jafu, with love"}
              </p>
              <h3 className="font-display mt-3 text-2xl text-ink sm:text-3xl">
                {song.title || "Jafu ♡"}
              </h3>

              {/* Animated Equalizer Waveform */}
              <div className="mt-6 flex items-end gap-[3px]" aria-hidden="true">
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-full rounded-full bg-primary/45"
                    animate={
                      isPlaying
                        ? { height: [4, 6 + ((i * 7) % 22), 4] }
                        : { height: 3 + ((i * 3) % 5) }
                    }
                    transition={{
                      duration: 0.9 + (i % 5) * 0.18,
                      repeat: isPlaying ? Infinity : 0,
                      ease: "easeInOut",
                      delay: (i % 8) * 0.06,
                    }}
                    style={{ height: 4 }}
                  />
                ))}
              </div>

              {/* Play / Pause & Progress Bar */}
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() => togglePlay()}
                  aria-label={isPlaying ? "Pause song" : "Play song"}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 hover:scale-105 shadow-md"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" strokeWidth={1.4} />
                  ) : (
                    <Play className="ml-0.5 h-4 w-4" strokeWidth={1.4} />
                  )}
                </button>

                <div className="flex-1">
                  <input
                    type="range"
                    aria-label="Seek"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={(e) => seek(Number(e.target.value))}
                    className="h-[3px] w-full appearance-none rounded-full bg-border accent-primary cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--color-primary) ${progress}%, var(--color-border) ${progress}%)`,
                    }}
                  />
                  <div className="mt-2 flex justify-between text-[0.62rem] tracking-[0.2em] text-muted-foreground font-mono">
                    <span>{fmt(currentTime)}</span>
                    <span>{fmt(duration)}</span>
                  </div>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="mt-5 flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-muted-foreground" strokeWidth={1.2} />
                <input
                  type="range"
                  aria-label="Volume"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="h-[3px] w-28 appearance-none rounded-full accent-primary cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--color-gold) ${volume * 100}%, var(--color-border) ${volume * 100}%)`,
                  }}
                />
              </div>

              {isAutoplayBlocked && !isPlaying && (
                <p className="mt-5 text-xs leading-relaxed text-amber-800 font-medium">
                  ♫ Tap play to begin listening to Jafu's song.
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
