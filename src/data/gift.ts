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
import chapter6 from "@/assets/memories/long-distance/chapter-6.jpg";
import gallery1 from "@/assets/memories/gallery/gallery-1.jpg";
import gallery2 from "@/assets/memories/gallery/gallery-2.jpg";
import gallery3 from "@/assets/memories/gallery/gallery-3.jpg";

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
  chapter6,
  gallery1,
  gallery2,
  gallery3,
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
    title: "The Apartment Floor",
    quote: "We didn't know we were making memories. We were just playing after school.",
    body: "We lived on the same floor. Same staircase, same afternoon shadows, same routine of running out the door the moment homework was done. Half of my childhood memories are just you standing in them.",
    photos: [
      { src: childhood2, alt: "Same floor. Same afternoon.", shape: "portrait" },
    ],
  },
  {
    number: "Chapter 02",
    title: "The School Years",
    body: "School became the backdrop to everything. Walking together, sharing tiffins, stressing over exams that feel so small now, and laughing at things no one else found funny.",
    photos: [{ src: school1, alt: "Corridor conversations", shape: "portrait" }],
  },
  {
    number: "Chapter 03",
    title: "The Growing Up Phase",
    body: "Between school ending and college starting, everything was uncertain except for one thing: our evening catch-ups. We talked about big dreams, small fears, and everything in between.",
    photos: [{ src: hostel1, alt: "Walking into the future together", shape: "landscape" }],
  },
  {
    number: "Chapter 04",
    title: "The Hostel Era",
    body: "Those two years in the hostel — I don't think I'll ever have anything quite like that again. Sharing a space, staying up way past midnight, laughing until our stomachs hurt when we were supposed to be sleeping.",
    photos: [{ src: recent2, alt: "Hostel days. The best two years.", shape: "portrait" }],
  },
  {
    number: "Chapter 05",
    title: "The Distance Phase",
    body: "Now I'm in my final year, you're somewhere else, and our daily routines don't overlap the way they used to. Distance changed our location — it never touched our bond.",
    photos: [{ src: recent1, alt: "Miles apart, but never distant.", shape: "square" }],
  },
  {
    number: "Chapter 06",
    title: "Where We Are Today",
    body: "Looking back at all these chapters, I realize how much of my life has your presence woven through it. From 6th standard corridor games to final-year phone calls — you've been a constant in the best way possible.",
    photos: [{ src: chapter6, alt: "To many more years of this.", shape: "portrait" }],
  },
];

/** Gallery — mix shapes freely, captions are optional. */
export const gallery: Photo[] = [
  {
    src: childhood1,
    alt: "Jafu fixing her hair",
    shape: "polaroid",
    caption: "Same floor. Same afternoon. Endless games.",
    date: "6th Standard",
    note: "From 6th standard corridor games to forever.",
  },
  {
    src: childhood2,
    alt: "Jafu fixing her hair",
    shape: "polaroid",
    caption: "The balcony where we solved all the world's problems.",
    date: "Childhood",
    note: "Living on the same floor made growing up so sweet.",
  },
  {
    src: school1,
    alt: "Jafu & Princy dancing outdoors",
    shape: "polaroid",
    caption: "Just another ordinary day that became a memory.",
    date: "School",
    note: "Even ordinary school days were bright with you.",
  },
  {
    src: hostel1,
    alt: "Jafu & Princy hugging closely",
    shape: "polaroid",
    caption: "The kind of laughter I wish I could replay forever.",
    date: "Hostel, 2 a.m.",
    note: "Half our best conversations happened when we were supposed to be asleep.",
  },
  {
    src: recent2,
    alt: "Jafu & Princy hugging closely",
    shape: "polaroid",
    caption: "Miles apart, but never distant.",
    date: "Present",
    note: "No matter how many miles apart, we pick up mid-sentence.",
  },
  {
    src: littleThings,
    alt: "Jafu & Princy dancing outdoors",
    shape: "polaroid",
    caption: "The little things that will always mean us.",
    date: "Always",
    note: "It's always the smallest moments that mean the most.",
  },
  {
    src: recent1,
    alt: "Jafu & Princy dancing outdoors",
    shape: "polaroid",
    caption: "To the person who makes everything feel a little calmer.",
    date: "Today",
    note: "Your calm presence makes every heavy day lighter.",
  },
  {
    src: gallery1,
    alt: "Jafu on a boat ride by the lake",
    shape: "polaroid",
    caption: "Boat rides, quiet water, and peaceful moments.",
    date: "Recent",
    note: "Peaceful water, gentle breeze, and good company.",
  },
  {
    src: gallery2,
    alt: "Jafu smiling in lehenga outdoors",
    shape: "polaroid",
    caption: "Dressed up, glowing, and being her gorgeous self.",
    date: "Celebrations",
    note: "Dressed up for celebrations, glowing inside and out.",
  },
  {
    src: gallery3,
    alt: "Warm tight hug in front of green bushes",
    shape: "polaroid",
    caption: "Hugs that make everything feel alright.",
    date: "Always",
    note: "A hug that makes you feel completely safe.",
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
  src: "/music/jafu.mp3",
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
