const CLOUD_NAME = import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"] || "o7ldnt8a";
const UPLOAD_PRESET = import.meta.env["VITE_CLOUDINARY_UPLOAD_PRESET"] || "jafu_uploads";

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  resourceType: string;
  format: string;
  bytes: number;
}

/** Direct Unsigned Browser Upload to Cloudinary */
export async function uploadToCloudinaryDirect(
  file: File,
  category: string = "memories"
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", `jafu/${category}`);

  const resourceType = file.type.startsWith("audio/") || file.type.startsWith("video/") ? "video" : "image";
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.warn("Unsigned Cloudinary upload failed:", errorText);
    // Try fallback preset if custom preset fails
    formData.set("upload_preset", "ml_default");
    const fallbackRes = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!fallbackRes.ok) {
      throw new Error(`Cloudinary upload failed with status ${fallbackRes.status}`);
    }

    const fallbackData = await fallbackRes.json();
    return {
      secureUrl: fallbackData.secure_url,
      publicId: fallbackData.public_id,
      resourceType: fallbackData.resource_type,
      format: fallbackData.format,
      bytes: fallbackData.bytes,
    };
  }

  const data = await res.json();
  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    format: data.format,
    bytes: data.bytes,
  };
}

/** Get Cloudinary Optimized URL with auto format & quality */
export function getCloudinaryOptimizedUrl(
  url: string,
  width?: number,
  height?: number
): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  let transformations = "f_auto,q_auto";
  if (width || height) {
    transformations += `,c_limit${width ? `,w_${width}` : ""}${height ? `,h_${height}` : ""}`;
  }

  return url.replace("/upload/", `/upload/${transformations}/`);
}
