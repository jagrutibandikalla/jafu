import React, { useState } from "react";
import { ImageSettings, ImageShape, ImageFit } from "@/data/types";
import { X, Upload, Trash2, Eye, Sliders, Check, Move } from "lucide-react";
import { useWebsiteData } from "@/context/WebsiteDataContext";

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: ImageSettings;
  onSave: (updated: ImageSettings) => void;
  onDelete?: (() => void) | undefined;
  title?: string;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  onClose,
  image,
  onSave,
  onDelete,
  title = "Customize Photo",
}) => {
  const { uploadImageFile } = useWebsiteData();
  const [formData, setFormData] = useState<ImageSettings>({
    positionX: 50,
    positionY: 50,
    zoom: 100,
    fit: "cover",
    shape: "portrait",
    ...image,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"adjust" | "details" | "preview">(
    "adjust"
  );
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const newSrc = await uploadImageFile(file);
      setFormData((prev) => ({ ...prev, src: newSrc }));
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gold/30 bg-stone-900 text-stone-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-stone-100">
                {title}
              </h3>
              <p className="text-xs text-stone-400">
                Adjust position, zoom, captions and layout
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

        {/* Content Body */}
        <div className="grid flex-1 overflow-y-auto md:grid-cols-12">
          {/* Left Preview Pane (5 cols) */}
          <div className="flex flex-col items-center justify-center border-b border-stone-800 bg-stone-950 p-6 md:col-span-5 md:border-b-0 md:border-r">
            {/* Desktop / Mobile Preview Toggle */}
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-stone-900 p-1">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                  previewMode === "desktop"
                    ? "bg-gold text-stone-950"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                  previewMode === "mobile"
                    ? "bg-gold text-stone-950"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                Mobile
              </button>
            </div>

            {/* Visual Container */}
            <div
              className={`relative overflow-hidden rounded-xl border border-stone-800 bg-stone-900 transition-all duration-300 ${
                previewMode === "mobile"
                  ? "h-72 w-44"
                  : formData.shape === "hero" || formData.shape === "landscape"
                    ? "h-52 w-full max-w-xs"
                    : formData.shape === "square"
                      ? "h-56 w-56"
                      : "h-64 w-52"
              }`}
            >
              {formData.src ? (
                <img
                  src={formData.src}
                  alt={formData.alt || "Preview"}
                  className="h-full w-full"
                  style={{
                    objectFit: formData.fit || "cover",
                    objectPosition: `${formData.positionX ?? 50}% ${formData.positionY ?? 50}%`,
                    transform: `scale(${(formData.zoom ?? 100) / 100})`,
                    transformOrigin: `${formData.positionX ?? 50}% ${formData.positionY ?? 50}%`,
                  }}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center text-stone-500">
                  <Upload className="mb-2 h-8 w-8 text-stone-600" />
                  <span className="text-xs">No image selected</span>
                </div>
              )}

              {/* Crosshair indicator when adjusting */}
              <div
                className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold bg-gold/30"
                style={{
                  left: `${formData.positionX ?? 50}%`,
                  top: `${formData.positionY ?? 50}%`,
                }}
              />
            </div>

            {/* Change Photo Upload Zone */}
            <div className="mt-6 w-full">
              <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gold/40 bg-gold/5 p-3 text-center transition-colors hover:border-gold hover:bg-gold/10">
                <Upload className="mb-1 h-5 w-5 text-gold" />
                <span className="text-xs font-medium text-gold">
                  {isUploading ? "Uploading..." : "Upload / Change Image"}
                </span>
                <span className="mt-0.5 text-[0.65rem] text-stone-400">
                  PNG, JPG, WEBP, GIF up to 20MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>

              {/* Image URL fallback input */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Or paste image URL..."
                  value={formData.src}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, src: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Controls Pane (7 cols) */}
          <div className="flex flex-col p-6 md:col-span-7">
            {/* Tab navigation */}
            <div className="mb-6 flex border-b border-stone-800">
              <button
                onClick={() => setActiveTab("adjust")}
                className={`border-b-2 px-4 py-2 text-xs font-medium transition-colors ${
                  activeTab === "adjust"
                    ? "border-gold text-gold"
                    : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                Crop & Position
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`border-b-2 px-4 py-2 text-xs font-medium transition-colors ${
                  activeTab === "details"
                    ? "border-gold text-gold"
                    : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                Captions & Details
              </button>
            </div>

            {/* Tab 1: Crop & Position Controls */}
            {activeTab === "adjust" && (
              <div className="space-y-5">
                {/* Position X Slider */}
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-stone-300">
                      Horizontal Focal Point (X)
                    </span>
                    <span className="font-mono text-gold">
                      {formData.positionX ?? 50}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={formData.positionX ?? 50}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        positionX: Number(e.target.value),
                      }))
                    }
                    className="h-1.5 w-full appearance-none rounded-lg bg-stone-800 accent-gold"
                  />
                  <div className="mt-1 flex justify-between text-[0.65rem] text-stone-500">
                    <span>Left</span>
                    <span>Center</span>
                    <span>Right</span>
                  </div>
                </div>

                {/* Position Y Slider */}
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-stone-300">
                      Vertical Focal Point (Y)
                    </span>
                    <span className="font-mono text-gold">
                      {formData.positionY ?? 50}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={formData.positionY ?? 50}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        positionY: Number(e.target.value),
                      }))
                    }
                    className="h-1.5 w-full appearance-none rounded-lg bg-stone-800 accent-gold"
                  />
                  <div className="mt-1 flex justify-between text-[0.65rem] text-stone-500">
                    <span>Top</span>
                    <span>Middle</span>
                    <span>Bottom</span>
                  </div>
                </div>

                {/* Zoom / Scale Slider */}
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-stone-300">Zoom / Scale</span>
                    <span className="font-mono text-gold">
                      {formData.zoom ?? 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={200}
                    value={formData.zoom ?? 100}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        zoom: Number(e.target.value),
                      }))
                    }
                    className="h-1.5 w-full appearance-none rounded-lg bg-stone-800 accent-gold"
                  />
                </div>

                {/* Image Fit Option */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-300">
                    Image Fit Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["cover", "contain", "fill"] as ImageFit[]).map((fit) => (
                      <button
                        key={fit}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, fit }))
                        }
                        className={`rounded-lg border py-2 text-xs font-medium capitalize transition-colors ${
                          formData.fit === fit
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700"
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Aspect Shape */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-300">
                    Card Shape Ratio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        "portrait",
                        "landscape",
                        "square",
                        "hero",
                        "polaroid",
                      ] as ImageShape[]
                    ).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, shape }))
                        }
                        className={`rounded-lg border py-2 text-xs font-medium capitalize transition-colors ${
                          formData.shape === shape
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700"
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Details & Captions */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-300">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="e.g. 6th Standard Corridor"
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-300">
                    Caption
                  </label>
                  <textarea
                    rows={2}
                    value={formData.caption || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        caption: e.target.value,
                      }))
                    }
                    placeholder="e.g. Us, before we knew how quickly time would move..."
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-300">
                    Date / Period Tag
                  </label>
                  <input
                    type="text"
                    value={formData.date || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    placeholder="e.g. Hostel, 2 a.m. or 2012"
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-300">
                    Memory Note / Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.note || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                    placeholder="e.g. Half our best conversations happened when we were supposed to be asleep..."
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-300">
                    Alt Text (Accessibility)
                  </label>
                  <input
                    type="text"
                    value={formData.alt || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        alt: e.target.value,
                      }))
                    }
                    placeholder="Describe image..."
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-stone-200 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-stone-800 bg-stone-950 px-6 py-4">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this photo?")
                  ) {
                    onDelete();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 rounded-lg border border-rose-900/50 bg-rose-950/30 px-3 py-2 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-900/50 hover:text-rose-200"
              >
                <Trash2 className="h-4 w-4" />
                Delete Photo
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-800 bg-stone-900 px-4 py-2 text-xs font-medium text-stone-300 hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-gold px-5 py-2 text-xs font-medium text-stone-950 transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Check className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
