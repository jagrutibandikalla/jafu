export type ImageShape = "portrait" | "landscape" | "square" | "hero" | "polaroid";
export type ImageFit = "cover" | "contain" | "fill";

export interface ImageSettings {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
  date?: string;
  note?: string;
  title?: string;
  category?: string;
  shape?: ImageShape;
  fit?: ImageFit;
  positionX?: number; // 0% to 100%, default 50%
  positionY?: number; // 0% to 100%, default 50%
  zoom?: number; // 100% to 200%, default 100%
  isFeatured?: boolean;
  desktopCrop?: string;
  mobileCrop?: string;
}

export interface HeroConfig {
  image: ImageSettings;
  overlayIntensity: number; // 0 to 90 %
  eyebrowText?: string;
  mainTitle?: string;
  quote?: string;
  subtextDate?: string;
}

export interface OpeningConfig {
  image: ImageSettings;
  eyebrowText?: string;
  titleLine1?: string;
  titleLine2?: string;
  bodyText?: string;
  captionText?: string;
}

export interface ThoughtConfig {
  image: ImageSettings;
  overlayOpacity?: number; // 0 to 100 % (default 25%)
  eyebrowText?: string;
  mainTitle?: string;
  quote?: string;
  lines?: string[];
}

export interface ChapterData {
  id: string;
  number: string; // e.g. "Chapter 01"
  title: string;
  subtitle?: string;
  period?: string;
  leadText?: string;
  body?: string;
  bodyParagraphs?: string[];
  pullQuote?: string;
  accentNote?: string;
  quote?: string;
  photos: ImageSettings[];
}

export interface LittleThingCardData {
  id: string;
  title: string;
  body: string;
  date?: string;
  caption?: string;
  photo?: ImageSettings;
}

export interface LittleThingsSectionData {
  heroPhoto: ImageSettings;
  cards: LittleThingCardData[];
}

export interface MusicSectionData {
  artwork: ImageSettings;
  title: string;
  artist: string;
  src: string;
}

export interface LetterSectionData {
  artwork: ImageSettings;
  paragraphs: string[];
  signature: {
    closing: string;
    name: string;
    handwritten: string;
  };
}

export interface FinaleSectionData {
  photo: ImageSettings;
  lines: string[];
  title: string;
  subtitle: string;
  footerTag: string;
  overlayIntensity?: number;
}

export interface ThingsILoveData {
  image?: ImageSettings | undefined;
  items: string[];
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export interface WebsiteData {
  hero: HeroConfig;
  opening: OpeningConfig;
  thought: ThoughtConfig;
  chapters: ChapterData[];
  gallery: ImageSettings[];
  thingsILove: ThingsILoveData;
  littleThings: LittleThingsSectionData;
  music: MusicSectionData;
  letter: LetterSectionData;
  finale: FinaleSectionData;
  cloudinaryConfig?: CloudinaryConfig;
  lastUpdated?: string;
}
