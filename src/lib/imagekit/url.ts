import { publicEnv } from "@/lib/env";

export interface ImageKitTransformOptions {
  width?: number | string;
  height?: number | string;
  quality?: number | string;
  format?: "auto" | "webp" | "avif" | "png" | "jpg";
  blur?: number | string;
  crop?: "maintain_ratio" | "force" | "at_least" | "at_max";
  cropMode?: "pad_resize" | "pad_extract" | "extract";
  aspectRatio?: string;
  focus?: "auto" | "center" | "top" | "bottom" | "left" | "right";
  raw?: string;
}

/**
 * Checks if a given URL is hosted on ImageKit.
 */
export function isImageKitUrl(url?: string | null): boolean {
  if (!url) return false;
  return url.includes("ik.imagekit.io") || url.includes("imagekit.io");
}

/**
 * Transforms an ImageKit URL with real-time transformations.
 * If the input is not an ImageKit URL, returns it unmodified.
 */
export function getImageKitUrl(
  pathOrUrl: string,
  transforms?: ImageKitTransformOptions,
  customEndpoint?: string
): string {
  if (!pathOrUrl) return "";

  const endpoint = (customEndpoint || publicEnv.imagekit.urlEndpoint).replace(/\/$/, "");

  // If path is a relative path (e.g., "/Developer-Portfolio/photo.jpg" or "photo.jpg")
  let fullUrl = pathOrUrl;
  if (!pathOrUrl.startsWith("http://") && !pathOrUrl.startsWith("https://")) {
    const cleanPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    fullUrl = `${endpoint}${cleanPath}`;
  }

  // If not an ImageKit URL and no transforms possible, return original URL
  if (!isImageKitUrl(fullUrl) || !transforms) {
    return fullUrl;
  }

  const trParams: string[] = [];

  if (transforms.width) trParams.push(`w-${transforms.width}`);
  if (transforms.height) trParams.push(`h-${transforms.height}`);
  if (transforms.quality) trParams.push(`q-${transforms.quality}`);
  if (transforms.format) trParams.push(`f-${transforms.format}`);
  if (transforms.blur) trParams.push(`bl-${transforms.blur}`);
  if (transforms.crop) trParams.push(`c-${transforms.crop}`);
  if (transforms.cropMode) trParams.push(`cm-${transforms.cropMode}`);
  if (transforms.aspectRatio) trParams.push(`ar-${transforms.aspectRatio}`);
  if (transforms.focus) trParams.push(`fo-${transforms.focus}`);
  if (transforms.raw) trParams.push(transforms.raw);

  if (trParams.length === 0) return fullUrl;

  const trQuery = `tr=${trParams.join(",")}`;

  // If URL already has query parameters
  const [base, queryString] = fullUrl.split("?");
  if (queryString) {
    return `${base}?${queryString}&${trQuery}`;
  }

  return `${base}?${trQuery}`;
}

/**
 * Generates low-quality image placeholder (LQIP) blur URL for ImageKit images.
 */
export function getImageKitBlurUrl(pathOrUrl: string): string {
  return getImageKitUrl(pathOrUrl, {
    width: 20,
    quality: 30,
    blur: 10,
    format: "webp",
  });
}
