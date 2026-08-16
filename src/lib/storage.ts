const DB_NAME = "JafuWebsiteDB";
const STORE_NAME = "WebsiteState";
const DATA_KEY = "website_customization_data";

/** Open or initialize the IndexedDB database */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Synchronous read from localStorage for instant 0ms first frame render */
export function loadWebsiteStateSync(): any | null {
  if (typeof window === "undefined") return null;
  try {
    const local = localStorage.getItem(DATA_KEY);
    if (local) return JSON.parse(local);
  } catch (e) {
    console.warn("localStorage sync read failed", e);
  }
  return null;
}

/** Save full website state synchronously to localStorage, then async to IndexedDB */
export async function saveWebsiteState(data: any): Promise<void> {
  // Synchronous localStorage write for instant zero-flash reload
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("localStorage quota warning", e);
  }

  // Asynchronous IndexedDB storage backup
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, DATA_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB save error", err);
  }
}

/** Load website state from IndexedDB with localStorage fallback */
export async function loadWebsiteState(): Promise<any | null> {
  // Try localStorage first for instant speed
  const syncData = loadWebsiteStateSync();
  if (syncData) return syncData;

  try {
    const db = await openDB();
    const result = await new Promise<any>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(DATA_KEY);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    if (result) return result;
  } catch (err) {
    console.warn("IndexedDB load failed", err);
  }

  return null;
}

/** Clear custom website state to restore defaults */
export async function clearWebsiteState(): Promise<void> {
  try {
    localStorage.removeItem(DATA_KEY);
  } catch (e) {
    // ignore
  }
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(DATA_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    // ignore
  }
}

/** Helper to convert uploaded File to Data URL string with automatic web compression */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        reject(new Error("File read error"));
        return;
      }

      // If file is SVG or non-image, resolve raw
      if (!file.type.startsWith("image/") || file.type.includes("svg")) {
        resolve(rawDataUrl);
        return;
      }

      // Resize & compress image so it fits comfortably within local storage quota
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compressed JPEG data URL (~150-250KB)
        const compressed = canvas.toDataURL("image/jpeg", 0.82);
        resolve(compressed);
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/** Helper to upload image to Cloudinary if configured */
export async function uploadToCloudinary(
  file: File,
  cloudName: string,
  uploadPreset: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url;
}
