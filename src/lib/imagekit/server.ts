import "server-only";

import ImageKit, { toFile } from "@imagekit/nodejs";

/**
 * Server-side ImageKit integration.
 *
 * Uses the official @imagekit/nodejs SDK (v7+). Credentials come from environment
 * variables only – real keys are never hardcoded as fallbacks (see .env.example).
 */

let imagekitInstance: ImageKit | null = null;

/** Upload folder (not a secret). */
export const IMAGEKIT_FOLDER_NAME = process.env.IMAGEKIT_FOLDER_NAME || "Developer-Portfolio";

export function getImageKitServerClient(): ImageKit {
  if (imagekitInstance) return imagekitInstance;

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("ImageKit is not configured. Missing environment variable: IMAGEKIT_PRIVATE_KEY. See .env.example.");
  }

  imagekitInstance = new ImageKit({ privateKey });
  return imagekitInstance;
}

export interface ImageKitUploadParams {
  /** Raw file bytes. */
  file: Buffer;
  fileName: string;
  /** Absolute ImageKit folder, e.g. "/Developer-Portfolio/blog". Defaults to IMAGEKIT_FOLDER_NAME. */
  folder?: string;
  /** MIME type of the content (used for the multipart upload). */
  mimeType?: string;
  tags?: string[];
  useUniqueFileName?: boolean;
  isPrivateFile?: boolean;
}

export interface ImageKitUploadResult {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  filePath: string;
  fileType: string;
}

/**
 * Upload a file to ImageKit (server-side, private key authentication).
 * Throws on failure – callers surface a friendly error to the admin UI.
 */
export async function uploadToImageKit(params: ImageKitUploadParams): Promise<ImageKitUploadResult> {
  const client = getImageKitServerClient();
  const folder = params.folder || `/${IMAGEKIT_FOLDER_NAME.replace(/^\//, "")}`;

  const file = await toFile(
    params.file,
    params.fileName,
    params.mimeType ? { type: params.mimeType } : undefined,
  );

  const response = await client.files.upload({
    file,
    fileName: params.fileName,
    folder,
    useUniqueFileName: params.useUniqueFileName ?? true,
    isPrivateFile: params.isPrivateFile ?? false,
    ...(params.tags && params.tags.length > 0 ? { tags: params.tags } : {}),
  });

  const url = response.url ?? "";

  return {
    fileId: response.fileId ?? "",
    name: response.name ?? params.fileName,
    url,
    thumbnailUrl: response.thumbnailUrl ?? url,
    height: response.height ?? 0,
    width: response.width ?? 0,
    size: response.size ?? params.file.length,
    filePath: response.filePath ?? "",
    fileType: response.fileType ?? params.mimeType ?? "",
  };
}

/**
 * Deletes a file from ImageKit by fileId. Returns false instead of throwing so the
 * caller can decide whether a failed delete blocks the operation.
 */
export async function deleteFromImageKit(fileId: string): Promise<boolean> {
  const client = getImageKitServerClient();
  try {
    await client.files.delete(fileId);
    return true;
  } catch (error) {
    console.error("[ImageKit] Failed to delete file:", fileId, error);
    return false;
  }
}
