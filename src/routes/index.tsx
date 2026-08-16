import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/gift/Nav";
import { Hero } from "@/components/gift/Hero";
import { Opening } from "@/components/gift/Opening";
import { Story } from "@/components/gift/Story";
import { Gallery } from "@/components/gift/Gallery";
import { ThingsILove } from "@/components/gift/ThingsILove";
import { LittleThings } from "@/components/gift/LittleThings";
import { Music } from "@/components/gift/Music";
import { Letter } from "@/components/gift/Letter";
import { IfICouldGoBack } from "@/components/gift/IfICouldGoBack";
import { BirthdayMoment } from "@/components/gift/BirthdayMoment";
import { Finale } from "@/components/gift/Finale";
import { Sliders } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jafu ♡ | A Little World Made For You" },
      {
        name: "description",
        content:
          "A private memory museum for Jafu: our childhood on the same apartment floor, school years, hostel days and a letter — a birthday gift made with love.",
      },
      { property: "og:title", content: "Jafu ♡ | A Little World Made For You" },
      {
        property: "og:description",
        content:
          "From 6th standard to forever: chapters, memories, a song and a letter for my best friend Jafu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative bg-background">
      <Nav />
      <Hero />
      <Opening />
      <Story />
      <Gallery />
      <ThingsILove />
      <LittleThings />
      <Music />
      <Letter />
      <IfICouldGoBack />
      <BirthdayMoment />
      <Finale />
      <footer className="bg-background py-10 text-center relative">
        <p className="text-[0.6rem] uppercase tracking-[0.34em] text-muted-foreground">
          For Jafu, with love ♡
        </p>
        <Link
          to="/admin"
          className="absolute right-6 bottom-6 flex items-center gap-1 text-[0.6rem] uppercase tracking-widest text-muted-foreground/40 transition-colors hover:text-gold"
          title="Customize Memories Dashboard"
        >
          <Sliders className="h-3 w-3" />
          <span>Admin</span>
        </Link>
      </footer>
    </main>
  );
}
