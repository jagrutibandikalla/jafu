import React, { useState } from "react";
import { useWebsiteData } from "@/context/WebsiteDataContext";
import { ImageSettings, ChapterData, LittleThingCardData } from "@/data/types";
import { ImageEditorModal } from "./ImageEditorModal";
import { MemoriesPickerModal } from "./MemoriesPickerModal";
import {
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  Grid,
  Heart,
  Music as MusicIcon,
  Mail,
  Sliders,
  Upload,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Download,
  RotateCcw,
  Check,
  Globe,
  Settings,
  X,
  ExternalLink,
  Award,
  Layers,
  HelpCircle,
  FolderOpen,
} from "lucide-react";

type DashboardTab =
  | "allImages"
  | "hero"
  | "opening"
  | "thought"
  | "story"
  | "gallery"
  | "littleThings"
  | "letter"
  | "music"
  | "finale"
  | "storage";

export function AdminDashboard({ onClose }: { onClose?: () => void }) {
  const {
    data,
    updateHero,
    updateOpening,
    updateThought,
    updateChapter,
    addPhotoToChapter,
    removePhotoFromChapter,
    updateChapterPhoto,
    reorderChapterPhotos,
    addGalleryPhoto,
    updateGalleryPhoto,
    removeGalleryPhoto,
    reorderGallery,
    updateThingsILove,
    updateLittleThingsHero,
    updateLittleThingsCard,
    addLittleThingsCard,
    removeLittleThingsCard,
    updateMusic,
    updateLetter,
    updateFinale,
    updateCloudinaryConfig,
    uploadImageFile,
    exportJSONData,
    importJSONData,
    resetToDefaults,
  } = useWebsiteData();

  const [activeTab, setActiveTab] = useState<DashboardTab>("allImages");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("chap-01");

  // Image Modal State
  const [editingImage, setEditingImage] = useState<{
    image: ImageSettings;
    title: string;
    onSave: (updated: ImageSettings) => void;
    onDelete?: () => void;
  } | null>(null);

  // Memories Picker Modal State
  const [pickerConfig, setPickerConfig] = useState<{
    isOpen: boolean;
    title: string;
    onSelect: (image: ImageSettings) => void;
  }>({
    isOpen: false,
    title: "",
    onSelect: () => {},
  });

  // Cloudinary Form State
  const [cloudName, setCloudName] = useState(
    data.cloudinaryConfig?.cloudName || ""
  );
  const [uploadPreset, setUploadPreset] = useState(
    data.cloudinaryConfig?.uploadPreset || ""
  );

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Helper to open edit modal
  const openEditor = (
    image: ImageSettings,
    title: string,
    onSave: (updated: ImageSettings) => void,
    onDelete?: () => void
  ) => {
    setEditingImage({ image, title, onSave, onDelete });
  };

  // Helper to open picker modal
  const openPicker = (
    title: string,
    onSelect: (image: ImageSettings) => void
  ) => {
    setPickerConfig({
      isOpen: true,
      title,
      onSelect,
    });
  };

  // Quick Direct Upload helper (adds upload to gallery automatically!)
  const handleDirectUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (newPhoto: ImageSettings) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast("Uploading image...");
      const src = await uploadImageFile(file);
      const newPhoto: ImageSettings = {
        id: `gal-${Date.now()}`,
        src,
        title: file.name.replace(/\.[^/.]+$/, ""),
        fit: "cover",
        positionX: 50,
        positionY: 50,
        zoom: 100,
      };
      // Auto-add to Central Memories Library
      addGalleryPhoto(newPhoto);
      onSuccess(newPhoto);
      showToast("Image added & saved to Memories!");
    } catch (err) {
      alert("Failed to upload image.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans antialiased">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[200] flex items-center gap-2 rounded-xl bg-gold px-4 py-3 text-xs font-semibold text-stone-950 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <Check className="h-4 w-4" />
          {toastMsg}
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-800 bg-stone-900/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-stone-950 font-bold shadow-lg">
            ✦
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-wide text-stone-100">
              Customize Memories Dashboard
            </h1>
            <p className="text-xs text-stone-400">
              Centralized Memory Archive & Visual Editor for Jafu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900 px-3.5 py-2 text-xs font-medium text-stone-300 transition-colors hover:bg-stone-800 hover:text-stone-100"
          >
            <Globe className="h-3.5 w-3.5 text-gold" />
            Preview Public Site
            <ExternalLink className="h-3 w-3 text-stone-500" />
          </a>

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-xs font-medium text-stone-950 transition-transform hover:scale-[1.02]"
            >
              <X className="h-4 w-4" />
              Exit Admin
            </button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-65px)]">
        {/* Sidebar Nav */}
        <aside className="w-64 shrink-0 border-r border-stone-800 bg-stone-900/50 p-4">
          <nav className="space-y-1">
            {[
              { id: "allImages", label: "🖼️ All Section Images", icon: ImageIcon },
              { id: "hero", label: "✨ Hero / Background", icon: Sparkles },
              { id: "opening", label: "🌅 Opening / Intro", icon: Layers },
              { id: "thought", label: "💭 A Thought I Keep Having", icon: HelpCircle },
              { id: "story", label: "📖 Our Story Chapters", icon: BookOpen },
              { id: "gallery", label: "📷 Memories Archive", icon: Grid },
              { id: "littleThings", label: "❤️ Little Things & Love", icon: Heart },
              { id: "letter", label: "💌 Letter Section", icon: Mail },
              { id: "music", label: "🎵 Music Artwork", icon: MusicIcon },
              { id: "finale", label: "🎂 Final Birthday", icon: Award },
              { id: "storage", label: "⚙️ Storage & Backup", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gold/15 text-gold border border-gold/30 shadow-md font-semibold"
                      : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-gold" : "text-stone-500"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Workspace Panel */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* TAB 0: ALL WEBSITE IMAGES VISUAL CARDS */}
          {activeTab === "allImages" && (
            <div className="max-w-6xl space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-100">
                  Every Section Image — Unified Memory Library
                </h2>
                <p className="mt-1 text-xs text-stone-400">
                  Select existing photos from your <strong>Central Memories Library</strong> or upload new ones. Uploaded photos are automatically added to the main <strong>Memories Gallery</strong>!
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* 1. Hero */}
                <div className="group relative flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900 p-4 transition-all hover:border-gold/50 shadow-xl">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-stone-950">
                      <img
                        src={data.hero.image.src}
                        alt="Hero background"
                        className="h-full w-full"
                        style={{
                          objectFit: data.hero.image.fit || "cover",
                          objectPosition: `${data.hero.image.positionX ?? 50}% ${data.hero.image.positionY ?? 50}%`,
                        }}
                      />
                      <span className="absolute top-2 left-2 rounded bg-stone-950/80 px-2 py-0.5 text-[0.65rem] font-bold text-gold border border-gold/30">
                        1. Hero Background
                      </span>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold text-stone-200">Hero / Home Background</h3>
                      <p className="text-xs text-stone-400">Main full-screen background</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-stone-800">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for Hero Background", (selected) =>
                            updateHero({ image: { ...data.hero.image, ...selected } })
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-3.5 w-3.5" />
                        Choose from Memories
                      </button>

                      <label className="cursor-pointer rounded-lg bg-gold px-3 py-2 text-center text-xs font-semibold text-stone-950 hover:opacity-90">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateHero({ image: { ...data.hero.image, ...photo } })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(data.hero.image, "Hero Image Controls", (updated) =>
                          updateHero({ image: updated })
                        )
                      }
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 py-1.5 text-xs text-stone-400 hover:text-stone-200"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      Position & Crop Controls
                    </button>
                  </div>
                </div>

                {/* 2. Opening / Intro */}
                <div className="group relative flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900 p-4 transition-all hover:border-gold/50 shadow-xl">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-stone-950">
                      <img
                        src={data.opening.image.src}
                        alt="Opening section"
                        className="h-full w-full"
                        style={{
                          objectFit: data.opening.image.fit || "cover",
                          objectPosition: `${data.opening.image.positionX ?? 50}% ${data.opening.image.positionY ?? 50}%`,
                        }}
                      />
                      <span className="absolute top-2 left-2 rounded bg-stone-950/80 px-2 py-0.5 text-[0.65rem] font-bold text-gold border border-gold/30">
                        2. Opening / Intro
                      </span>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold text-stone-200">Opening Section Photo</h3>
                      <p className="text-xs text-stone-400">“Some friendships begin with a hello”</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-stone-800">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for Opening Section", (selected) =>
                            updateOpening({ image: { ...data.opening.image, ...selected } })
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-3.5 w-3.5" />
                        Choose from Memories
                      </button>

                      <label className="cursor-pointer rounded-lg bg-gold px-3 py-2 text-center text-xs font-semibold text-stone-950 hover:opacity-90">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateOpening({ image: { ...data.opening.image, ...photo } })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(data.opening.image, "Opening Image Controls", (updated) =>
                          updateOpening({ image: updated })
                        )
                      }
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 py-1.5 text-xs text-stone-400 hover:text-stone-200"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      Position & Crop Controls
                    </button>
                  </div>
                </div>

                {/* 3. A Thought I Keep Having */}
                <div className="group relative flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900 p-4 transition-all hover:border-gold/50 shadow-xl">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-stone-950">
                      <img
                        src={data.thought.image.src}
                        alt="A thought I keep having"
                        className="h-full w-full"
                        style={{
                          objectFit: data.thought.image.fit || "cover",
                          objectPosition: `${data.thought.image.positionX ?? 50}% ${data.thought.image.positionY ?? 50}%`,
                        }}
                      />
                      <span className="absolute top-2 left-2 rounded bg-stone-950/80 px-2 py-0.5 text-[0.65rem] font-bold text-gold border border-gold/30">
                        3. A Thought I Keep Having
                      </span>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold text-stone-200">A Thought I Keep Having</h3>
                      <p className="text-xs text-stone-400">“If I Could Go Back...” background</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-stone-800">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for A Thought I Keep Having", (selected) =>
                            updateThought({ image: { ...data.thought.image, ...selected } })
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-3.5 w-3.5" />
                        Choose from Memories
                      </button>

                      <label className="cursor-pointer rounded-lg bg-gold px-3 py-2 text-center text-xs font-semibold text-stone-950 hover:opacity-90">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateThought({ image: { ...data.thought.image, ...photo } })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(data.thought.image, "Thought Image Controls", (updated) =>
                          updateThought({ image: updated })
                        )
                      }
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 py-1.5 text-xs text-stone-400 hover:text-stone-200"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      Position & Crop Controls
                    </button>
                  </div>
                </div>

                {/* Chapters 01 to 06 */}
                {data.chapters.map((chap) => {
                  const firstPhoto = chap.photos[0] || {
                    id: `c-def-${chap.id}`,
                    src: "",
                    alt: chap.title,
                  };
                  return (
                    <div
                      key={chap.id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900 p-4 transition-all hover:border-gold/50 shadow-xl"
                    >
                      <div>
                        <div className="relative h-48 w-full overflow-hidden rounded-xl bg-stone-950">
                          {firstPhoto.src ? (
                            <img
                              src={firstPhoto.src}
                              alt={chap.title}
                              className="h-full w-full"
                              style={{
                                objectFit: firstPhoto.fit || "cover",
                                objectPosition: `${firstPhoto.positionX ?? 50}% ${firstPhoto.positionY ?? 50}%`,
                              }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-stone-500">
                              No image uploaded
                            </div>
                          )}
                          <span className="absolute top-2 left-2 rounded bg-stone-950/80 px-2 py-0.5 text-[0.65rem] font-bold text-gold border border-gold/30">
                            {chap.number} — {chap.title}
                          </span>
                        </div>
                        <div className="mt-3">
                          <h3 className="text-sm font-semibold text-stone-200">{chap.title}</h3>
                          <p className="text-xs text-stone-400">{chap.photos.length} photo(s)</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-stone-800">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              openPicker(`Choose Photo for ${chap.number}`, (selected) => {
                                if (chap.photos[0]) {
                                  updateChapterPhoto(chap.id, chap.photos[0].id, selected);
                                } else {
                                  addPhotoToChapter(chap.id, selected);
                                }
                              })
                            }
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/20"
                          >
                            <FolderOpen className="h-3.5 w-3.5" />
                            Choose from Memories
                          </button>

                          <label className="cursor-pointer rounded-lg bg-gold px-3 py-2 text-center text-xs font-semibold text-stone-950 hover:opacity-90">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleDirectUpload(e, (photo) => {
                                  if (chap.photos[0]) {
                                    updateChapterPhoto(chap.id, chap.photos[0].id, photo);
                                  } else {
                                    addPhotoToChapter(chap.id, photo);
                                  }
                                })
                              }
                              className="hidden"
                            />
                          </label>
                        </div>

                        {chap.photos[0] && (
                          <button
                            onClick={() =>
                              openEditor(chap.photos[0], `Edit ${chap.number} Image`, (updated) =>
                                updateChapterPhoto(chap.id, chap.photos[0].id, updated)
                              )
                            }
                            className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 py-1.5 text-xs text-stone-400 hover:text-stone-200"
                          >
                            <Sliders className="h-3.5 w-3.5" />
                            Position & Crop Controls
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Our Little Things Hero */}
                <div className="group relative flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900 p-4 transition-all hover:border-gold/50 shadow-xl">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-stone-950">
                      <img
                        src={data.littleThings.heroPhoto.src}
                        alt="Our Little Things"
                        className="h-full w-full"
                        style={{
                          objectFit: data.littleThings.heroPhoto.fit || "cover",
                          objectPosition: `${data.littleThings.heroPhoto.positionX ?? 50}% ${data.littleThings.heroPhoto.positionY ?? 50}%`,
                        }}
                      />
                      <span className="absolute top-2 left-2 rounded bg-stone-950/80 px-2 py-0.5 text-[0.65rem] font-bold text-gold border border-gold/30">
                        Our Little Things
                      </span>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold text-stone-200">Our Little Things Feature</h3>
                      <p className="text-xs text-stone-400">Section Header Image</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-stone-800">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for Our Little Things", (selected) =>
                            updateLittleThingsHero(selected)
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-3.5 w-3.5" />
                        Choose from Memories
                      </button>

                      <label className="cursor-pointer rounded-lg bg-gold px-3 py-2 text-center text-xs font-semibold text-stone-950 hover:opacity-90">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateLittleThingsHero(photo)
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(data.littleThings.heroPhoto, "Little Things Feature Controls", (updated) =>
                          updateLittleThingsHero(updated)
                        )
                      }
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 py-1.5 text-xs text-stone-400 hover:text-stone-200"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      Position & Crop Controls
                    </button>
                  </div>
                </div>

                {/* Letter Artwork */}
                <div className="group relative flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900 p-4 transition-all hover:border-gold/50 shadow-xl">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-stone-950">
                      <img
                        src={data.letter.artwork.src}
                        alt="Letter envelope"
                        className="h-full w-full"
                        style={{
                          objectFit: data.letter.artwork.fit || "cover",
                          objectPosition: `${data.letter.artwork.positionX ?? 50}% ${data.letter.artwork.positionY ?? 50}%`,
                        }}
                      />
                      <span className="absolute top-2 left-2 rounded bg-stone-950/80 px-2 py-0.5 text-[0.65rem] font-bold text-gold border border-gold/30">
                        Letter Envelope
                      </span>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold text-stone-200">Letter Envelope Artwork</h3>
                      <p className="text-xs text-stone-400">Sealed Envelope Image</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-stone-800">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for Letter Envelope", (selected) =>
                            updateLetter({ artwork: { ...data.letter.artwork, ...selected } })
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-3.5 w-3.5" />
                        Choose from Memories
                      </button>

                      <label className="cursor-pointer rounded-lg bg-gold px-3 py-2 text-center text-xs font-semibold text-stone-950 hover:opacity-90">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateLetter({ artwork: { ...data.letter.artwork, ...photo } })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(data.letter.artwork, "Letter Envelope Controls", (updated) =>
                          updateLetter({ artwork: updated })
                        )
                      }
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 py-1.5 text-xs text-stone-400 hover:text-stone-200"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      Position & Crop Controls
                    </button>
                  </div>
                </div>

                {/* Music Artwork */}
                <div className="group relative flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900 p-4 transition-all hover:border-gold/50 shadow-xl">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-stone-950">
                      <img
                        src={data.music.artwork.src}
                        alt="Music Artwork"
                        className="h-full w-full"
                        style={{
                          objectFit: data.music.artwork.fit || "cover",
                          objectPosition: `${data.music.artwork.positionX ?? 50}% ${data.music.artwork.positionY ?? 50}%`,
                        }}
                      />
                      <span className="absolute top-2 left-2 rounded bg-stone-950/80 px-2 py-0.5 text-[0.65rem] font-bold text-gold border border-gold/30">
                        Music Cover
                      </span>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold text-stone-200">Song Album Artwork</h3>
                      <p className="text-xs text-stone-400">Song Player Cover</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-stone-800">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for Music Cover", (selected) =>
                            updateMusic({ artwork: { ...data.music.artwork, ...selected } })
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-3.5 w-3.5" />
                        Choose from Memories
                      </button>

                      <label className="cursor-pointer rounded-lg bg-gold px-3 py-2 text-center text-xs font-semibold text-stone-950 hover:opacity-90">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateMusic({ artwork: { ...data.music.artwork, ...photo } })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(data.music.artwork, "Music Album Controls", (updated) =>
                          updateMusic({ artwork: updated })
                        )
                      }
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 py-1.5 text-xs text-stone-400 hover:text-stone-200"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      Position & Crop Controls
                    </button>
                  </div>
                </div>

                {/* Final Birthday Photo */}
                <div className="group relative flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900 p-4 transition-all hover:border-gold/50 shadow-xl">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-stone-950">
                      <img
                        src={data.finale.photo.src}
                        alt="Finale Photo"
                        className="h-full w-full"
                        style={{
                          objectFit: data.finale.photo.fit || "cover",
                          objectPosition: `${data.finale.photo.positionX ?? 50}% ${data.finale.photo.positionY ?? 50}%`,
                        }}
                      />
                      <span className="absolute top-2 left-2 rounded bg-stone-950/80 px-2 py-0.5 text-[0.65rem] font-bold text-gold border border-gold/30">
                        Final Birthday
                      </span>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold text-stone-200">Final Birthday Photo</h3>
                      <p className="text-xs text-stone-400">Closing Section Portrait</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-stone-800">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for Final Birthday", (selected) =>
                            updateFinale({ photo: { ...data.finale.photo, ...selected } })
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-3.5 w-3.5" />
                        Choose from Memories
                      </button>

                      <label className="cursor-pointer rounded-lg bg-gold px-3 py-2 text-center text-xs font-semibold text-stone-950 hover:opacity-90">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateFinale({ photo: { ...data.finale.photo, ...photo } })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(data.finale.photo, "Finale Photo Controls", (updated) =>
                          updateFinale({ photo: updated })
                        )
                      }
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 py-1.5 text-xs text-stone-400 hover:text-stone-200"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      Position & Crop Controls
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: HERO IMAGE */}
          {activeTab === "hero" && (
            <div className="max-w-4xl space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-100">
                  Hero / Homepage Background
                </h2>
                <p className="mt-1 text-xs text-stone-400">
                  Upload or select a photo from the Memories Library for the main full-screen hero image.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-stone-900 shadow-2xl">
                <div className="relative h-80 w-full overflow-hidden">
                  <img
                    src={data.hero.image.src}
                    alt={data.hero.image.alt || "Hero Preview"}
                    className="h-full w-full"
                    style={{
                      objectFit: data.hero.image.fit || "cover",
                      objectPosition: `${data.hero.image.positionX ?? 50}% ${data.hero.image.positionY ?? 50}%`,
                      transform: `scale(${(data.hero.image.zoom ?? 100) / 100})`,
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-stone-950"
                    style={{ opacity: (data.hero.overlayIntensity ?? 45) / 100 }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-gold/90">
                      {data.hero.eyebrowText || "Eighteenth of August"}
                    </p>
                    <h1 className="font-display mt-2 text-3xl font-bold text-stone-100 sm:text-4xl">
                      {data.hero.mainTitle || "Happy Birthday, Jafu"}
                    </h1>
                    <p className="font-display mt-2 max-w-md text-sm italic text-stone-300">
                      {data.hero.quote}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 border-t border-stone-800 p-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for Hero Background", (selected) =>
                            updateHero({ image: { ...data.hero.image, ...selected } })
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Choose from Memories
                      </button>

                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-xs font-semibold text-stone-950 hover:opacity-90">
                        <Upload className="h-4 w-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateHero({ image: { ...data.hero.image, ...photo } })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(data.hero.image, "Customize Hero Background", (updated) =>
                          updateHero({ image: updated })
                        )
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2.5 text-xs font-medium text-stone-200 hover:bg-stone-700"
                    >
                      <Sliders className="h-4 w-4 text-gold" />
                      Advanced Crop & Position Controls
                    </button>

                    <div>
                      <div className="mb-1 flex justify-between text-xs text-stone-300">
                        <span>Overlay Darkening</span>
                        <span className="font-mono text-gold">
                          {data.hero.overlayIntensity ?? 45}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={90}
                        value={data.hero.overlayIntensity ?? 45}
                        onChange={(e) =>
                          updateHero({ overlayIntensity: Number(e.target.value) })
                        }
                        className="h-1.5 w-full appearance-none rounded-lg bg-stone-800 accent-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-stone-300">
                        Top Tagline
                      </label>
                      <input
                        type="text"
                        value={data.hero.eyebrowText || ""}
                        onChange={(e) => updateHero({ eyebrowText: e.target.value })}
                        className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-stone-300">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={data.hero.mainTitle || ""}
                        onChange={(e) => updateHero({ mainTitle: e.target.value })}
                        className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-stone-300">
                        Hero Quote
                      </label>
                      <input
                        type="text"
                        value={data.hero.quote || ""}
                        onChange={(e) => updateHero({ quote: e.target.value })}
                        className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: OPENING / INTRO */}
          {activeTab === "opening" && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-100">
                  Opening / Intro Section Image
                </h2>
                <p className="mt-1 text-xs text-stone-400">
                  Select from Memories Library or upload a new photo for “Some friendships begin with a hello...”
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="h-56 w-44 shrink-0 overflow-hidden rounded-xl bg-stone-950">
                    <img
                      src={data.opening.image.src}
                      alt="Opening photo"
                      className="h-full w-full"
                      style={{
                        objectFit: data.opening.image.fit || "cover",
                        objectPosition: `${data.opening.image.positionX ?? 50}% ${data.opening.image.positionY ?? 50}%`,
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for Opening Section", (selected) =>
                            updateOpening({ image: { ...data.opening.image, ...selected } })
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Choose from Memories
                      </button>

                      <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-semibold text-stone-950 hover:opacity-90">
                        <Upload className="h-4 w-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateOpening({ image: { ...data.opening.image, ...photo } })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(data.opening.image, "Opening Image Controls", (updated) =>
                          updateOpening({ image: updated })
                        )
                      }
                      className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-medium text-stone-200"
                    >
                      <Sliders className="h-4 w-4 text-gold" />
                      Crop & Position Controls
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: A THOUGHT I KEEP HAVING */}
          {activeTab === "thought" && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-100">
                  A Thought I Keep Having Section
                </h2>
                <p className="mt-1 text-xs text-stone-400">
                  Select from Memories Library or upload a new background photo for “If I Could Go Back...”
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="h-56 w-80 shrink-0 overflow-hidden rounded-xl bg-stone-950">
                    <img
                      src={data.thought.image.src}
                      alt="Thought section"
                      className="h-full w-full"
                      style={{
                        objectFit: data.thought.image.fit || "cover",
                        objectPosition: `${data.thought.image.positionX ?? 50}% ${data.thought.image.positionY ?? 50}%`,
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for A Thought I Keep Having", (selected) =>
                            updateThought({ image: { ...data.thought.image, ...selected } })
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Choose from Memories
                      </button>

                      <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-semibold text-stone-950 hover:opacity-90">
                        <Upload className="h-4 w-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateThought({ image: { ...data.thought.image, ...photo } })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(data.thought.image, "Thought Image Controls", (updated) =>
                          updateThought({ image: updated })
                        )
                      }
                      className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-medium text-stone-200"
                    >
                      <Sliders className="h-4 w-4 text-gold" />
                      Crop & Position Controls
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      Quote
                    </label>
                    <input
                      type="text"
                      value={data.thought.quote || ""}
                      onChange={(e) => updateThought({ quote: e.target.value })}
                      className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OUR STORY CHAPTERS */}
          {activeTab === "story" && (
            <div className="max-w-5xl space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-100">
                  Our Story Timeline Chapters
                </h2>
                <p className="mt-1 text-xs text-stone-400">
                  Manage photos, titles, and stories for Chapters 01 through 06.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-3">
                {data.chapters.map((chap) => (
                  <button
                    key={chap.id}
                    onClick={() => setSelectedChapterId(chap.id)}
                    className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                      selectedChapterId === chap.id
                        ? "bg-gold text-stone-950 font-bold"
                        : "bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                    }`}
                  >
                    {chap.number} — {chap.title}
                  </button>
                ))}
              </div>

              {(() => {
                const chap =
                  data.chapters.find((c) => c.id === selectedChapterId) ||
                  data.chapters[0];
                if (!chap) return null;

                return (
                  <div className="space-y-6 rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-xl">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-stone-300">
                          Chapter Tag
                        </label>
                        <input
                          type="text"
                          value={chap.number}
                          onChange={(e) =>
                            updateChapter(chap.id, { number: e.target.value })
                          }
                          className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-stone-300">
                          Chapter Title
                        </label>
                        <input
                          type="text"
                          value={chap.title}
                          onChange={(e) =>
                            updateChapter(chap.id, { title: e.target.value })
                          }
                          className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">
                          Photos for {chap.number} ({chap.photos.length})
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              openPicker(`Select Photo for ${chap.number}`, (selected) =>
                                addPhotoToChapter(chap.id, selected)
                              )
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold/20"
                          >
                            <FolderOpen className="h-3.5 w-3.5" />
                            Choose from Memories
                          </button>

                          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-semibold text-stone-950 hover:opacity-90">
                            <Plus className="h-3.5 w-3.5" />
                            Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleDirectUpload(e, (photo) =>
                                  addPhotoToChapter(chap.id, photo)
                                )
                              }
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {chap.photos.map((p, idx) => (
                          <div
                            key={p.id}
                            className="group relative overflow-hidden rounded-xl border border-stone-800 bg-stone-950 p-3"
                          >
                            <div className="relative h-44 w-full overflow-hidden rounded-lg bg-stone-900">
                              <img
                                src={p.src}
                                alt={p.alt || "Chapter photo"}
                                className="h-full w-full"
                                style={{
                                  objectFit: p.fit || "cover",
                                  objectPosition: `${p.positionX ?? 50}% ${p.positionY ?? 50}%`,
                                  transform: `scale(${(p.zoom ?? 100) / 100})`,
                                }}
                              />
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="truncate text-xs text-stone-300">
                                {p.caption || "No caption set"}
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    openEditor(
                                      p,
                                      `Edit ${chap.number} Photo`,
                                      (updated) =>
                                        updateChapterPhoto(chap.id, p.id, updated),
                                      () => removePhotoFromChapter(chap.id, p.id)
                                    )
                                  }
                                  className="rounded p-1 text-gold hover:bg-gold/10"
                                  title="Edit Photo"
                                >
                                  <Sliders className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: MEMORY GALLERY ARCHIVE */}
          {activeTab === "gallery" && (
            <div className="max-w-5xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-stone-100">
                    Central Memories Gallery Archive
                  </h2>
                  <p className="mt-1 text-xs text-stone-400">
                    This is your central memory library. All uploaded photos automatically appear here and can be displayed on the website.
                  </p>
                </div>

                <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-semibold text-stone-950 transition-transform hover:scale-[1.02]">
                  <Plus className="h-4 w-4" />
                  Add Photo to Memories
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleDirectUpload(e, () => {})
                    }
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.gallery.map((p, idx) => (
                  <div
                    key={p.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-stone-800 bg-stone-900 p-4 transition-all hover:border-gold/50"
                  >
                    <div>
                      <div className="relative h-52 w-full overflow-hidden rounded-lg bg-stone-950">
                        <img
                          src={p.src}
                          alt={p.alt || "Memory photo"}
                          className="h-full w-full"
                          style={{
                            objectFit: p.fit || "cover",
                            objectPosition: `${p.positionX ?? 50}% ${p.positionY ?? 50}%`,
                            transform: `scale(${(p.zoom ?? 100) / 100})`,
                          }}
                        />
                      </div>
                      <div className="mt-3">
                        <p className="font-display text-sm font-semibold text-stone-200">
                          {p.caption || p.title || "Untitled Memory"}
                        </p>
                        {p.date && (
                          <p className="mt-0.5 text-[0.65rem] uppercase text-gold/80">
                            {p.date}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-stone-800/80 pt-3">
                      <div className="flex items-center gap-1">
                        {idx > 0 && (
                          <button
                            onClick={() => reorderGallery(idx, idx - 1)}
                            className="rounded p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                          >
                            <MoveUp className="h-4 w-4" />
                          </button>
                        )}
                        {idx < data.gallery.length - 1 && (
                          <button
                            onClick={() => reorderGallery(idx, idx + 1)}
                            className="rounded p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                          >
                            <MoveDown className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          openEditor(
                            p,
                            `Edit Gallery Photo #${idx + 1}`,
                            (updated) => updateGalleryPhoto(p.id, updated),
                            () => removeGalleryPhoto(p.id)
                          )
                        }
                        className="flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold/20"
                      >
                        <Sliders className="h-3.5 w-3.5" />
                        Edit Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LITTLE THINGS */}
          {activeTab === "littleThings" && (
            <div className="max-w-4xl space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-100">
                  Our Little Things & Memory Cards
                </h2>
                <p className="mt-1 text-xs text-stone-400">
                  Edit hero photo and memory cards.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">
                  Section Feature Image
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="h-40 w-60 shrink-0 overflow-hidden rounded-xl bg-stone-950">
                    <img
                      src={data.littleThings.heroPhoto.src}
                      alt="Little things feature"
                      className="h-full w-full"
                      style={{
                        objectFit: data.littleThings.heroPhoto.fit || "cover",
                        objectPosition: `${data.littleThings.heroPhoto.positionX ?? 50}% ${data.littleThings.heroPhoto.positionY ?? 50}%`,
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for Our Little Things", (selected) =>
                            updateLittleThingsHero(selected)
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Choose from Memories
                      </button>

                      <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-semibold text-stone-950 hover:opacity-90">
                        <Upload className="h-4 w-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateLittleThingsHero(photo)
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(
                          data.littleThings.heroPhoto,
                          "Customize Little Things Image",
                          (updated) => updateLittleThingsHero(updated)
                        )
                      }
                      className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-medium text-stone-200"
                    >
                      <Sliders className="h-4 w-4 text-gold" />
                      Adjust Photo Position & Crop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LETTER SECTION */}
          {activeTab === "letter" && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-100">
                  Letter For Jafu
                </h2>
                <p className="mt-1 text-xs text-stone-400">
                  Customize the letter envelope artwork.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="h-40 w-60 shrink-0 overflow-hidden rounded-xl bg-stone-950">
                    <img
                      src={data.letter.artwork.src}
                      alt="Letter Envelope"
                      className="h-full w-full"
                      style={{
                        objectFit: data.letter.artwork.fit || "cover",
                        objectPosition: `${data.letter.artwork.positionX ?? 50}% ${data.letter.artwork.positionY ?? 50}%`,
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for Letter Envelope", (selected) =>
                            updateLetter({ artwork: { ...data.letter.artwork, ...selected } })
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Choose from Memories
                      </button>

                      <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-semibold text-stone-950 hover:opacity-90">
                        <Upload className="h-4 w-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateLetter({ artwork: { ...data.letter.artwork, ...photo } })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(
                          data.letter.artwork,
                          "Customize Letter Envelope Image",
                          (updated) => updateLetter({ artwork: updated })
                        )
                      }
                      className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-medium text-stone-200"
                    >
                      <Sliders className="h-4 w-4 text-gold" />
                      Edit Artwork Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MUSIC SECTION */}
          {activeTab === "music" && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-100">
                  Music Artwork
                </h2>
                <p className="mt-1 text-xs text-stone-400">
                  Change album artwork photo.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="h-44 w-44 shrink-0 overflow-hidden rounded-xl bg-stone-950">
                    <img
                      src={data.music.artwork.src}
                      alt="Song Artwork"
                      className="h-full w-full"
                      style={{
                        objectFit: data.music.artwork.fit || "cover",
                        objectPosition: `${data.music.artwork.positionX ?? 50}% ${data.music.artwork.positionY ?? 50}%`,
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for Music Cover", (selected) =>
                            updateMusic({ artwork: { ...data.music.artwork, ...selected } })
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Choose from Memories
                      </button>

                      <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-semibold text-stone-950 hover:opacity-90">
                        <Upload className="h-4 w-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateMusic({ artwork: { ...data.music.artwork, ...photo } })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(
                          data.music.artwork,
                          "Customize Music Album Cover",
                          (updated) => updateMusic({ artwork: updated })
                        )
                      }
                      className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-medium text-stone-200"
                    >
                      <Sliders className="h-4 w-4 text-gold" />
                      Change Album Artwork
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: FINALE SECTION */}
          {activeTab === "finale" && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-100">
                  Final Birthday Section
                </h2>
                <p className="mt-1 text-xs text-stone-400">
                  Customize finale background photo.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="h-44 w-60 shrink-0 overflow-hidden rounded-xl bg-stone-950">
                    <img
                      src={data.finale.photo.src}
                      alt="Finale background"
                      className="h-full w-full"
                      style={{
                        objectFit: data.finale.photo.fit || "cover",
                        objectPosition: `${data.finale.photo.positionX ?? 50}% ${data.finale.photo.positionY ?? 50}%`,
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openPicker("Choose Photo for Final Birthday", (selected) =>
                            updateFinale({ photo: { ...data.finale.photo, ...selected } })
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-semibold text-gold hover:bg-gold/20"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Choose from Memories
                      </button>

                      <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-semibold text-stone-950 hover:opacity-90">
                        <Upload className="h-4 w-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleDirectUpload(e, (photo) =>
                              updateFinale({ photo: { ...data.finale.photo, ...photo } })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      onClick={() =>
                        openEditor(
                          data.finale.photo,
                          "Customize Finale Background Photo",
                          (updated) => updateFinale({ photo: updated })
                        )
                      }
                      className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-medium text-stone-200"
                    >
                      <Sliders className="h-4 w-4 text-gold" />
                      Edit Finale Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: STORAGE & CLOUDINARY */}
          {activeTab === "storage" && (
            <div className="max-w-4xl space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-100">
                  Storage & Cloud Integration
                </h2>
                <p className="mt-1 text-xs text-stone-400">
                  Connect Cloudinary for cloud photo hosting or export/import website JSON backups.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">
                  Cloudinary Configuration (Optional for Cloud Hosting)
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      Cloud Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. dxyz123"
                      value={cloudName}
                      onChange={(e) => setCloudName(e.target.value)}
                      className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      Unsigned Upload Preset
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. jafu_memories"
                      value={uploadPreset}
                      onChange={(e) => setUploadPreset(e.target.value)}
                      className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    updateCloudinaryConfig({ cloudName, uploadPreset });
                    showToast("Cloudinary configuration saved!");
                  }}
                  className="rounded-xl bg-gold px-4 py-2 text-xs font-semibold text-stone-950"
                >
                  Save Cloudinary Settings
                </button>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">
                  Data Backup & Reset
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      const json = exportJSONData();
                      const blob = new Blob([json], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `jafu-website-backup-${Date.now()}.json`;
                      a.click();
                      showToast("Backup downloaded!");
                    }}
                    className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2.5 text-xs font-medium text-stone-200 hover:bg-stone-700"
                  >
                    <Download className="h-4 w-4 text-gold" />
                    Download Complete JSON Backup
                  </button>

                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to reset all customized photos and text back to default?"
                        )
                      ) {
                        resetToDefaults();
                        showToast("Reset to default settings!");
                      }
                    }}
                    className="flex items-center gap-2 rounded-xl border border-rose-900/50 bg-rose-950/30 px-4 py-2.5 text-xs font-medium text-rose-400 hover:bg-rose-900/50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset All to Original Defaults
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Render Image Editor Modal if active */}
      {editingImage && (
        <ImageEditorModal
          isOpen={!!editingImage}
          onClose={() => setEditingImage(null)}
          image={editingImage.image}
          title={editingImage.title}
          onSave={editingImage.onSave}
          onDelete={editingImage.onDelete}
        />
      )}

      {/* Render Memories Picker Modal if active */}
      {pickerConfig.isOpen && (
        <MemoriesPickerModal
          isOpen={pickerConfig.isOpen}
          onClose={() => setPickerConfig((prev) => ({ ...prev, isOpen: false }))}
          title={pickerConfig.title}
          onSelect={pickerConfig.onSelect}
        />
      )}
    </div>
  );
}
