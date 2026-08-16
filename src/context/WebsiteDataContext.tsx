import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultWebsiteData } from "@/data/defaultWebsiteData";
import {
  WebsiteData,
  HeroConfig,
  OpeningConfig,
  ThoughtConfig,
  ChapterData,
  ImageSettings,
  LittleThingCardData,
  CloudinaryConfig,
} from "@/data/types";
import {
  loadWebsiteState,
  loadWebsiteStateSync,
  saveWebsiteState,
  clearWebsiteState,
  fileToDataURL,
  uploadToCloudinary,
} from "@/lib/storage";
import {
  uploadFileToFirebaseStorage,
  saveWebsiteStateToFirebase,
  loadWebsiteStateFromRealtimeDB,
  subscribeToRealtimeDBWebsiteData,
  subscribeToFirestoreWebsiteData,
  loadWebsiteStateFromFirestore,
} from "@/lib/firebase";
import { uploadToCloudinaryDirect } from "@/lib/cloudinary";

interface WebsiteContextType {
  data: WebsiteData;
  loading: boolean;
  updateHero: (updates: Partial<HeroConfig>) => void;
  updateOpening: (updates: Partial<OpeningConfig>) => void;
  updateThought: (updates: Partial<ThoughtConfig>) => void;
  updateChapter: (chapterId: string, updates: Partial<ChapterData>) => void;
  addPhotoToChapter: (chapterId: string, photo: ImageSettings) => void;
  removePhotoFromChapter: (chapterId: string, photoId: string) => void;
  updateChapterPhoto: (
    chapterId: string,
    photoId: string,
    updates: Partial<ImageSettings>
  ) => void;
  reorderChapterPhotos: (
    chapterId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  addGalleryPhoto: (photo: ImageSettings) => void;
  updateGalleryPhoto: (
    photoId: string,
    updates: Partial<ImageSettings>
  ) => void;
  removeGalleryPhoto: (photoId: string) => void;
  reorderGallery: (fromIndex: number, toIndex: number) => void;
  updateThingsILove: (items: string[], image?: ImageSettings) => void;
  updateLittleThingsHero: (photoUpdates: Partial<ImageSettings>) => void;
  updateLittleThingsCard: (
    cardId: string,
    updates: Partial<LittleThingCardData>
  ) => void;
  updateMusic: (updates: Partial<WebsiteData["music"]>) => void;
  updateLetter: (updates: Partial<WebsiteData["letter"]>) => void;
  updateFinale: (updates: Partial<WebsiteData["finale"]>) => void;
  updateCloudinaryConfig: (config: CloudinaryConfig) => void;
  uploadImageFile: (file: File, category?: string) => Promise<string>;
  exportJSONData: () => string;
  importJSONData: (jsonStr: string) => boolean;
  resetToDefaults: () => void;
}

const WebsiteDataContext = createContext<WebsiteContextType | undefined>(
  undefined
);

/** Helper to robustly merge saved state with default fields */
function mergeWebsiteData(saved: any): WebsiteData {
  return {
    ...defaultWebsiteData,
    ...(saved || {}),
    hero: { ...defaultWebsiteData.hero, ...(saved?.hero || {}) },
    opening: { ...defaultWebsiteData.opening, ...(saved?.opening || {}) },
    thought: { ...defaultWebsiteData.thought, ...(saved?.thought || {}) },
    chapters: (saved?.chapters && Array.isArray(saved.chapters) && saved.chapters.length > 0)
      ? saved.chapters
      : defaultWebsiteData.chapters,
    gallery: (saved?.gallery && Array.isArray(saved.gallery) && saved.gallery.length > 0)
      ? saved.gallery
      : defaultWebsiteData.gallery,
    thingsILove: {
      ...defaultWebsiteData.thingsILove,
      ...(saved?.thingsILove || {}),
      items: Array.isArray(saved?.thingsILove?.items)
        ? saved.thingsILove.items
        : (Array.isArray(saved?.thingsILove) ? saved.thingsILove : defaultWebsiteData.thingsILove.items),
    },
    littleThings: {
      ...defaultWebsiteData.littleThings,
      ...(saved?.littleThings || {}),
    },
    music: { ...defaultWebsiteData.music, ...(saved?.music || {}) },
    letter: { ...defaultWebsiteData.letter, ...(saved?.letter || {}) },
    finale: { ...defaultWebsiteData.finale, ...(saved?.finale || {}) },
  };
}

/** Helper to compute initial state synchronously (0ms delay, zero flash on frame 0) */
function getInitialWebsiteData(): WebsiteData {
  const saved = loadWebsiteStateSync();
  if (saved && typeof saved === "object") {
    return mergeWebsiteData(saved);
  }
  return defaultWebsiteData;
}

export const WebsiteDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<WebsiteData>(getInitialWebsiteData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Real-time Firebase Realtime Database Sync
    const unsubRTDB = subscribeToRealtimeDBWebsiteData((rtdbData) => {
      if (rtdbData && typeof rtdbData === "object") {
        const merged = mergeWebsiteData(rtdbData);
        setData(merged);
        saveWebsiteState(merged).catch(() => {});
      }
    });

    // 2. Real-time Firestore Sync (Secondary)
    const unsubFirestore = subscribeToFirestoreWebsiteData((firestoreData) => {
      if (firestoreData && typeof firestoreData === "object") {
        const merged = mergeWebsiteData(firestoreData);
        setData(merged);
        saveWebsiteState(merged).catch(() => {});
      }
    });

    // 3. One-shot fetch from Firebase Realtime Database
    loadWebsiteStateFromRealtimeDB().then((rtdbVal) => {
      if (rtdbVal && typeof rtdbVal === "object") {
        const merged = mergeWebsiteData(rtdbVal);
        setData(merged);
        saveWebsiteState(merged).catch(() => {});
      }
    });

    return () => {
      unsubRTDB();
      unsubFirestore();
    };
  }, []);

  const updateDataState = (updater: (prev: WebsiteData) => WebsiteData) => {
    setData((prev) => {
      const updated = updater(prev);
      updated.lastUpdated = new Date().toISOString();

      // Save locally & to Firebase Realtime Database + Firestore
      saveWebsiteState(updated).catch((err) =>
        console.error("Auto-save local error", err)
      );
      saveWebsiteStateToFirebase(updated).catch((err) =>
        console.error("Auto-save Firebase error", err)
      );

      return updated;
    });
  };

  const updateHero = (updates: Partial<HeroConfig>) => {
    updateDataState((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        ...updates,
        image: updates.image
          ? { ...prev.hero.image, ...updates.image }
          : prev.hero.image,
      },
    }));
  };

  const updateOpening = (updates: Partial<OpeningConfig>) => {
    updateDataState((prev) => ({
      ...prev,
      opening: {
        ...prev.opening,
        ...updates,
        image: updates.image
          ? { ...prev.opening.image, ...updates.image }
          : prev.opening.image,
      },
    }));
  };

  const updateThought = (updates: Partial<ThoughtConfig>) => {
    updateDataState((prev) => ({
      ...prev,
      thought: {
        ...prev.thought,
        ...updates,
        image: updates.image
          ? { ...prev.thought.image, ...updates.image }
          : prev.thought.image,
      },
    }));
  };

  const updateChapter = (chapterId: string, updates: Partial<ChapterData>) => {
    updateDataState((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, ...updates } : ch
      ),
    }));
  };

  const addPhotoToChapter = (chapterId: string, photo: ImageSettings) => {
    updateDataState((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, photos: [...ch.photos, photo] } : ch
      ),
    }));
  };

  const removePhotoFromChapter = (chapterId: string, photoId: string) => {
    updateDataState((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch) =>
        ch.id === chapterId
          ? { ...ch, photos: ch.photos.filter((p) => p.id !== photoId) }
          : ch
      ),
    }));
  };

  const updateChapterPhoto = (
    chapterId: string,
    photoId: string,
    updates: Partial<ImageSettings>
  ) => {
    updateDataState((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              photos: ch.photos.map((p) =>
                p.id === photoId ? { ...p, ...updates } : p
              ),
            }
          : ch
      ),
    }));
  };

  const reorderChapterPhotos = (
    chapterId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    updateDataState((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch) => {
        if (ch.id !== chapterId) return ch;
        const newPhotos = [...ch.photos];
        const [moved] = newPhotos.splice(fromIndex, 1);
        newPhotos.splice(toIndex, 0, moved);
        return { ...ch, photos: newPhotos };
      }),
    }));
  };

  const addGalleryPhoto = (photo: ImageSettings) => {
    updateDataState((prev) => ({
      ...prev,
      gallery: [...prev.gallery, photo],
    }));
  };

  const updateGalleryPhoto = (
    photoId: string,
    updates: Partial<ImageSettings>
  ) => {
    updateDataState((prev) => ({
      ...prev,
      gallery: prev.gallery.map((p) =>
        p.id === photoId ? { ...p, ...updates } : p
      ),
    }));
  };

  const removeGalleryPhoto = (photoId: string) => {
    updateDataState((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((p) => p.id !== photoId),
    }));
  };

  const reorderGallery = (fromIndex: number, toIndex: number) => {
    updateDataState((prev) => {
      const newG = [...prev.gallery];
      const [moved] = newG.splice(fromIndex, 1);
      newG.splice(toIndex, 0, moved);
      return { ...prev, gallery: newG };
    });
  };

  const updateThingsILove = (items: string[], image?: ImageSettings) => {
    updateDataState((prev) => ({
      ...prev,
      thingsILove: {
        ...prev.thingsILove,
        items,
        image: image || prev.thingsILove.image,
      },
    }));
  };

  const updateLittleThingsHero = (photoUpdates: Partial<ImageSettings>) => {
    updateDataState((prev) => ({
      ...prev,
      littleThings: {
        ...prev.littleThings,
        heroPhoto: { ...prev.littleThings.heroPhoto, ...photoUpdates },
      },
    }));
  };

  const updateLittleThingsCard = (
    cardId: string,
    updates: Partial<LittleThingCardData>
  ) => {
    updateDataState((prev) => ({
      ...prev,
      littleThings: {
        ...prev.littleThings,
        cards: prev.littleThings.cards.map((c) =>
          c.id === cardId ? { ...c, ...updates } : c
        ),
      },
    }));
  };

  const updateMusic = (updates: Partial<WebsiteData["music"]>) => {
    updateDataState((prev) => ({
      ...prev,
      music: { ...prev.music, ...updates },
    }));
  };

  const updateLetter = (updates: Partial<WebsiteData["letter"]>) => {
    updateDataState((prev) => ({
      ...prev,
      letter: { ...prev.letter, ...updates },
    }));
  };

  const updateFinale = (updates: Partial<WebsiteData["finale"]>) => {
    updateDataState((prev) => ({
      ...prev,
      finale: { ...prev.finale, ...updates },
    }));
  };

  const updateCloudinaryConfig = (config: CloudinaryConfig) => {
    updateDataState((prev) => ({ ...prev, cloudinaryConfig: config }));
  };

  const uploadImageFile = async (file: File, category: string = "general"): Promise<string> => {
    // Priority 1: Cloudinary Unsigned Upload
    try {
      const res = await uploadToCloudinaryDirect(file, category);
      if (res?.secureUrl) {
        return res.secureUrl;
      }
    } catch (err) {
      console.warn("Cloudinary upload failed, trying Firebase Storage fallback", err);
    }

    // Priority 2: Firebase Storage
    try {
      const downloadUrl = await uploadFileToFirebaseStorage(file, category);
      if (downloadUrl) {
        return downloadUrl;
      }
    } catch (err) {
      console.warn("Firebase Storage upload failed", err);
    }

    // Priority 3: Local file Data URL
    return await fileToDataURL(file);
  };

  const exportJSONData = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importJSONData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === "object") {
        const merged = mergeWebsiteData(parsed);
        setData(merged);
        saveWebsiteState(merged).catch(() => {});
        saveWebsiteStateToFirebase(merged).catch(() => {});
        return true;
      }
    } catch (err) {
      console.error("Failed to import JSON data", err);
    }
    return false;
  };

  const resetToDefaults = () => {
    setData(defaultWebsiteData);
    clearWebsiteState().catch(() => {});
    saveWebsiteStateToFirebase(defaultWebsiteData).catch(() => {});
  };

  return (
    <WebsiteDataContext.Provider
      value={{
        data,
        loading,
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
        updateMusic,
        updateLetter,
        updateFinale,
        updateCloudinaryConfig,
        uploadImageFile,
        exportJSONData,
        importJSONData,
        resetToDefaults,
      }}
    >
      {children}
    </WebsiteDataContext.Provider>
  );
};

export const useWebsiteData = () => {
  const context = useContext(WebsiteDataContext);
  if (!context) {
    return {
      data: defaultWebsiteData,
      loading: false,
      updateHero: () => {},
      updateOpening: () => {},
      updateThought: () => {},
      updateChapter: () => {},
      addPhotoToChapter: () => {},
      removePhotoFromChapter: () => {},
      updateChapterPhoto: () => {},
      reorderChapterPhotos: () => {},
      addGalleryPhoto: () => {},
      updateGalleryPhoto: () => {},
      removeGalleryPhoto: () => {},
      reorderGallery: () => {},
      updateThingsILove: () => {},
      updateLittleThingsHero: () => {},
      updateLittleThingsCard: () => {},
      updateMusic: () => {},
      updateLetter: () => {},
      updateFinale: () => {},
      updateCloudinaryConfig: () => {},
      uploadImageFile: async () => "",
      exportJSONData: () => "",
      importJSONData: () => {},
      resetToDefaults: () => {},
    } as unknown as WebsiteContextType;
  }
  return context;
};
