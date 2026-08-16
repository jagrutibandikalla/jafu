import React, { useState } from "react";
import { ImageSettings } from "@/data/types";
import { useWebsiteData } from "@/context/WebsiteDataContext";
import { X, Search, Check, Upload, Grid } from "lucide-react";

interface MemoriesPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedImage: ImageSettings) => void;
  title?: string;
}

export const MemoriesPickerModal: React.FC<MemoriesPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = "Select from Memories Library",
}) => {
  const { data, uploadImageFile, addGalleryPhoto } = useWebsiteData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const categories = [
    "all",
    "Childhood",
    "School",
    "Apartment",
    "Hostel",
    "College",
    "Recent",
    "Favorites",
  ];

  const gallery = data.gallery || [];

  const filtered = gallery.filter((img) => {
    const matchesSearch =
      !searchQuery ||
      (img.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.date || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      (img.category || "").toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const newSrc = await uploadImageFile(file);
      const newPhoto: ImageSettings = {
        id: `gal-${Date.now()}`,
        src: newSrc,
        title: file.name.replace(/\.[^/.]+$/, ""),
        fit: "cover",
        positionX: 50,
        positionY: 50,
        zoom: 100,
        date: "New Upload",
      };
      addGalleryPhoto(newPhoto);
      onSelect(newPhoto);
      onClose();
    } catch (err) {
      alert("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gold/30 bg-stone-900 text-stone-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <Grid className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-stone-100">
                {title}
              </h3>
              <p className="text-xs text-stone-400">
                Select an existing photo from your central memory archive or upload a new one
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-stone-800 bg-stone-950 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search memories by caption, date, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-stone-800 bg-stone-900 pl-9 pr-4 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
            />
          </div>

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2 text-xs font-semibold text-stone-950 hover:opacity-90">
            <Upload className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload New Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 border-b border-stone-800 bg-stone-900/50 px-6 py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition-colors ${
                selectedCategory === cat
                  ? "bg-gold/20 text-gold border border-gold/40"
                  : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center text-stone-500">
              <Grid className="mb-2 h-8 w-8 text-stone-600" />
              <p className="text-sm">No photos found in library.</p>
              <p className="mt-1 text-xs text-stone-600">
                Upload a photo above to add it to your memory collection.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((img) => (
                <div
                  key={img.id}
                  onClick={() => {
                    onSelect(img);
                    onClose();
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-stone-800 bg-stone-950 transition-all hover:border-gold hover:shadow-lg hover:shadow-gold/10"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-stone-900">
                    <img
                      src={img.src}
                      alt={img.alt || "Memory"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        objectPosition: `${img.positionX ?? 50}% ${img.positionY ?? 50}%`,
                      }}
                    />
                    <div className="absolute inset-0 bg-stone-950/0 transition-colors group-hover:bg-stone-950/30" />
                    <div className="absolute right-2 top-2 rounded-full bg-gold p-1 text-stone-950 opacity-0 transition-opacity group-hover:opacity-100">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-xs font-medium text-stone-200">
                      {img.caption || img.title || "Untitled Memory"}
                    </p>
                    {img.date && (
                      <p className="mt-0.5 text-[0.65rem] uppercase text-stone-500">
                        {img.date}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-stone-800 bg-stone-950 px-6 py-3 text-xs text-stone-400">
          <span>{filtered.length} photo(s) available</span>
          <button
            onClick={onClose}
            className="rounded-lg border border-stone-800 bg-stone-900 px-4 py-1.5 text-xs font-medium text-stone-300 hover:bg-stone-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
