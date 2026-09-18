import ImageKit from "imagekit";
import type { UploadOptions } from "imagekit/dist/libs/interfaces/UploadOptions";

let imagekitInstance: ImageKit | null = null;

/** Upload folder (not a secret). Endpoint and keys come from environment variables only. */
export const IMAGEKIT_FOLDER_NAME = process.env.IMAGEKIT_FOLDER_NAME || "Developer-Portfolio";

/**
 * Returns a server-side ImageKit instance configured with environment credentials.
 * Throws when the required environment variables are missing – real credentials are
 * never hardcoded as fallbacks. See .env.example for the required variables.
 */
export function getImageKitServerClient(): ImageKit {
  if (imagekitInstance) return imagekitInstance;

  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  const missing = [
    !urlEndpoint && "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
    !publicKey && "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    !privateKey && "IMAGEKIT_PRIVATE_KEY",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `ImageKit is not configured. Missing environment variables: ${missing.join(", ")}. See .env.example.`,
    );
  }

  imagekitInstance = new ImageKit({
    urlEndpoint: urlEndpoint as string,
    publicKey: publicKey as string,
    privateKey: privateKey as string,
  });

  return imagekitInstance;
}

export interface ImageKitUploadParams {
  file: Buffer | string; // Buffer or base64 or URL
  fileName: string;
  folder?: string;
  tags?: string[];
  useUniqueFileName?: boolean;
  isPrivateFile?: boolean;
  customMetadata?: Record<string, string | number | boolean>;
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
 * Upload a file directly to ImageKit in the designated folder (defaults to Developer-Portfolio).
 */
export async function uploadToImageKit(params: ImageKitUploadParams): Promise<ImageKitUploadResult> {
  const client = getImageKitServerClient();
  const folder = params.folder || `/${IMAGEKIT_FOLDER_NAME.replace(/^\//, "")}`;

  const uploadOptions: UploadOptions = {
    file: params.file,
    fileName: params.fileName,
    folder,
    useUniqueFileName: params.useUniqueFileName ?? true,
    isPrivateFile: params.isPrivateFile ?? false,
  };

  if (params.tags && params.tags.length > 0) {
    uploadOptions.tags = params.tags;
  }
  if (params.customMetadata && Object.keys(params.customMetadata).length > 0) {
    uploadOptions.customMetadata = params.customMetadata;
  }

  const response = await client.upload(uploadOptions);

  return {
    fileId: response.fileId,
    name: response.name,
    url: response.url,
    thumbnailUrl: response.thumbnailUrl,
    height: response.height,
    width: response.width,
    size: response.size,
    filePath: response.filePath,
    fileType: response.fileType,
  };
}

/**
 * Generates client-side authentication parameters (token, expire timestamp, signature)
 * for secure frontend uploads.
 */
export function getImageKitAuthParameters(token?: string, expire?: number) {
  const client = getImageKitServerClient();
  return client.getAuthenticationParameters(token, expire);
}

/**
 * Deletes a file from ImageKit by fileId.
 */
export async function deleteFromImageKit(fileId: string): Promise<boolean> {
  const client = getImageKitServerClient();
  try {
    await client.deleteFile(fileId);
    return true;
  } catch (error) {
    console.error("[ImageKit] Failed to delete file:", fileId, error);
    return false;
  }
}
