/**
 * ─────────────────────────────────────────────────────────────
 *  EVERYTHING EDITABLE LIVES HERE.
 *
 *  To swap a photo:
 *    1. Drop your image into  src/assets/   (e.g. src/assets/hostel-3.jpg)
 *    2. Add an import at the top of this file
 *    3. Use it in the relevant place below
 *
 *  To add a song:
 *    Put the file in  public/audio/song.mp3
 *    and update `song` below (src path + title/artist).
 * ─────────────────────────────────────────────────────────────
 */

import hero from "@/assets/memories/hero/hero.jpg";
import childhood1 from "@/assets/memories/childhood/childhood-1.jpg";
import childhood2 from "@/assets/memories/childhood/childhood-2.jpg";
import school1 from "@/assets/memories/school/school-1.jpg";
import hostel1 from "@/assets/memories/hostel/hostel-1.jpg";
import recent1 from "@/assets/memories/things-i-love/recent-1.jpg";
import recent2 from "@/assets/memories/long-distance/recent-2.jpg";
import littleThings from "@/assets/memories/little-things/little-things.jpg";
import letterArt from "@/assets/memories/letter/letter.jpg";
import songArt from "@/assets/memories/music/song-art.jpg";

export const images = {
  hero,
  childhood1,
  childhood2,
  school1,
  hostel1,
  recent1,
  recent2,
  littleThings,
  letterArt,
  songArt,
};

export const birthday = { month: 8, day: 18, year: 2005 };

export type Photo = {
  src: string;
  alt: string;
  /** editorial layout hint */
  shape?: "portrait" | "landscape" | "square" | "hero" | "polaroid";
  caption?: string;
  date?: string;
  note?: string;
};

export const chapters: {
  number: string;
  title: string;
  quote?: string;
  body: string;
  photos: Photo[];
}[] = [
  {
    number: "Chapter 01",
    title: "6th Standard",
    quote: "And somehow, you became my person.",
    body: "A new class, a new bench, a new year — and one girl who felt familiar before I even knew her properly. Neither of us planned it. It simply happened, the way the best things do.",
    photos: [
      { src: childhood1, alt: "Two little girls playing on an apartment floor", shape: "portrait" },
    ],
  },
  {
    number: "Chapter 02",
    title: "Same Apartment. Same Floor. Endless Days.",
    body: "The same floor, the same staircase, the same doorbell. We played until the lights came on, talked about nothing for hours, and spent whole afternoons just being around each other. Childhood was easier because you were three steps away.",
    photos: [{ src: childhood2, alt: "Warm apartment stairwell in afternoon light", shape: "portrait" }],
  },
  {
    number: "Chapter 03",
    title: "Growing Up Together",
    body: "School years, exam nights, small heartbreaks and enormous inside jokes. We grew taller, quieter, more complicated — and somehow always at the same speed.",
    photos: [{ src: school1, alt: "Two schoolgirls walking down a sunlit corridor", shape: "landscape" }],
  },
  {
    number: "Chapter 04",
    title: "Two Years. One Hostel. A Thousand Memories.",
    body: "Two years of shared rooms and stolen sleep. Late-night conversations that fixed everything, midnight snacks, laughing so hard we had to whisper. A completely different chapter of us — and one of my favourites.",
    photos: [{ src: hostel1, alt: "Cozy hostel room at night with fairy lights", shape: "landscape" }],
  },
  {
    number: "Chapter 05",
    title: "Different Places. Same Friendship.",
    body: "Now there are cities between us and calendars that never match. But the friendship never became distant. We pick up mid-sentence, months later, like no time passed at all.",
    photos: [{ src: recent2, alt: "Two friends holding coffee cups by a window", shape: "square" }],
  },
  {
    number: "Chapter 06",
    title: "Still Us.",
    body: "Years changed. Places changed. We changed. But somehow, we never became strangers.",
    photos: [{ src: recent1, alt: "Portrait of a calm young woman in warm light", shape: "portrait" }],
  },
];

/** Gallery — mix shapes freely, captions are optional. */
export const gallery: Photo[] = [
  {
    src: childhood1,
    alt: "Two little girls playing on the apartment floor",
    shape: "hero",
    caption: "Us, before we knew how quickly time would move.",
    date: "The apartment years",
  },
  { src: childhood2, alt: "Apartment stairwell", shape: "portrait" },
  {
    src: school1,
    alt: "School corridor",
    shape: "landscape",
    caption: "Just another ordinary day that became a memory.",
    date: "School",
  },
  {
    src: hostel1,
    alt: "Hostel room at night",
    shape: "polaroid",
    caption: "The kind of laughter I wish I could replay forever.",
    date: "Hostel, 2 a.m.",
    note: "Half our best conversations happened when we were supposed to be asleep.",
  },
  { src: recent2, alt: "Coffee together", shape: "square" },
  { src: littleThings, alt: "Diary, polaroids and chai", shape: "landscape" },
  {
    src: recent1,
    alt: "Recent portrait",
    shape: "portrait",
    caption: "Still the calmest person I know.",
  },
];

export const thingsILove = [
  "Your calmness.",
  "Your beautiful heart.",
  "The way you make people feel safe.",
  "The honesty in you.",
  "The way you understand without needing explanations.",
  "The little things you do without realizing how much they mean.",
  "The person you have always been.",
];

export const littleThingsCards = [
  { title: "Things only we laugh about", body: "One word. That's all it takes, and we're gone for ten minutes." },
  { title: "Random conversations", body: "Two-hour talks that begin with nothing and end somewhere important." },
  { title: "Hostel memories", body: "Shared plates, borrowed clothes, and lights-out arguments about who'd get up to switch off the fan." },
  { title: "Childhood madness", body: "Running through the corridor, inventing games with no rules, coming home only when called twice." },
  { title: "Our favourite moments", body: "Not the big ones. The ordinary evenings that quietly turned into memories." },
  { title: "Things that remind me of you", body: "Rain on the balcony. Chai at odd hours. Anyone who is kind for no reason." },
];

export const song = {
  /** Replace with your uploaded file: put it at public/audio/song.mp3 */
  src: "/audio/song.mp3",
  title: "A Song For You",
  artist: "For Jafu, with love",
  artwork: songArt,
};

export const letterParagraphs = [
  "Jafu,",
  "I've been trying to write this for days, and I keep starting over — because how do you write down thirteen years of someone?",
  "We met in 6th standard. I don't even remember the exact day, which feels strange for something so important. What I remember is how quickly you became normal to me — the person on the same floor, the same staircase, the same afternoon. We played until the lights came on. We talked about absolutely nothing for hours. Half of my childhood is just you standing there in it.",
  "Then school happened, and exams, and all the small dramas that felt enormous. And then those two years in the hostel — I don't think I'll ever have anything like that again. Sharing a room with you, staying up too late, laughing when we should have been sleeping, sharing food, sharing worries. Ordinary days, all of them. And now they're the ones I miss the most.",
  "Life has moved a lot since then. I'm in my final year, you're somewhere else, our days don't overlap the way they used to. Distance changed the situation — it never changed the friendship. We still talk like there was no gap. You are still the person I want to tell things to first.",
  "I want you to know how much I admire you. You are so calm in a way that makes everything around you calmer. You're genuine, you're kind, and you never make anyone feel small. People feel safe with you — I always have.",
  "So thank you. For every corridor evening, every hostel night, every message you sent when you knew something was wrong before I said it. Thank you for being exactly who you are.",
  "Happy birthday, Jafu. I hope this year is soft and full and kind to you. And I hope we're still doing this — badly-timed calls, old jokes, all of it — for many, many more years.",
];

export const letterSignature = {
  closing: "With all my love,",
  name: "Your Princy ❤️",
  handwritten: "Always your person.",
};
