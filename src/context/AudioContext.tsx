import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useWebsiteData } from "./WebsiteDataContext";

interface AudioContextType {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isAutoplayBlocked: boolean;
  hasStartedOnce: boolean;
  playSoftly: () => Promise<void>;
  togglePlay: () => Promise<void>;
  setVolume: (v: number) => void;
  seek: (t: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { data } = useWebsiteData();
  const rawSrc = data?.music?.src;
  const songSrc = (rawSrc && rawSrc.startsWith("/music/")) ? rawSrc : "/music/jafu.mp3";

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  // Initialize audio element once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = songSrc;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    audio.onended = () => {
      setIsPlaying(false);
    };

    audio.onerror = () => {
      console.warn("Primary audio source error, switching fallback...");
      if (!audio.src.endsWith(".mp3")) {
        audio.src = "/music/jafu.mp3";
        audio.load();
      }
    };

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [songSrc]);

  // Auto-play trigger on any user gesture anywhere on page
  useEffect(() => {
    if (typeof window === "undefined" || hasStartedOnce) return;

    const handleGesture = () => {
      if (!hasStartedOnce && audioRef.current) {
        playSoftly();
      }
    };

    window.addEventListener("click", handleGesture);
    window.addEventListener("touchstart", handleGesture);
    window.addEventListener("pointerdown", handleGesture);
    window.addEventListener("scroll", handleGesture);
    window.addEventListener("keydown", handleGesture);

    return () => {
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("scroll", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
  }, [hasStartedOnce]);

  // Keep volume synced
  const setVolume = (v: number) => {
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  const playSoftly = async (): Promise<void> => {
    const audio = audioRef.current;
    if (!audio) return;

    // Clear any active volume fade
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    try {
      audio.currentTime = 0;
      audio.volume = 0;
      setVolumeState(0);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }

      setIsPlaying(true);
      setIsAutoplayBlocked(false);
      setHasStartedOnce(true);

      // Smooth volume fade-in from 0 to 0.8 over 1.8 seconds
      const targetVolume = 0.8;
      const durationMs = 1800;
      const stepMs = 60;
      const increment = targetVolume / (durationMs / stepMs);
      let currentVol = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentVol = Math.min(targetVolume, currentVol + increment);
        if (audioRef.current) {
          audioRef.current.volume = currentVol;
        }
        setVolumeState(currentVol);

        if (currentVol >= targetVolume) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }
      }, stepMs);
    } catch (err) {
      console.warn("Autoplay blocked by browser policy:", err);
      setIsAutoplayBlocked(true);
      setIsPlaying(false);
    }
  };

  const togglePlay = async (): Promise<void> => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        if (audio.volume < 0.1) {
          audio.volume = volume > 0 ? volume : 0.8;
        }
        await audio.play();
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
        setHasStartedOnce(true);
      } catch (err) {
        console.warn("Play error:", err);
        setIsAutoplayBlocked(true);
      }
    }
  };

  const seek = (t: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = t;
      setCurrentTime(t);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTime,
        duration,
        volume,
        isAutoplayBlocked,
        hasStartedOnce,
        playSoftly,
        togglePlay,
        setVolume,
        seek,
      }}
    >
      {children}

      {/* Floating Autoplay Tap Pill if Autoplay was blocked */}
      {isAutoplayBlocked && !isPlaying && (
        <div className="fixed bottom-6 right-6 z-[99990] flex items-center">
          <button
            onClick={() => playSoftly()}
            className="group flex items-center gap-3 rounded-full bg-[#3B171E]/90 text-[#F5E6D3] px-5 py-3 text-xs font-medium tracking-[0.22em] uppercase shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-md border border-[#D4AF37]/40 transition-all duration-300 hover:scale-105 hover:bg-[#4A1D27] hover:border-[#D4AF37]/70"
          >
            <span className="animate-pulse text-[#E6C687] text-sm">♫</span>
            <span>Tap to begin our song</span>
          </button>
        </div>
      )}
    </AudioContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioContext);
  if (!context) {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isAutoplayBlocked: false,
      hasStartedOnce: false,
      playSoftly: async () => {},
      togglePlay: async () => {},
      setVolume: () => {},
      seek: () => {},
    };
  }
  return context;
}
