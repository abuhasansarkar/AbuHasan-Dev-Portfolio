import ImageKit from "imagekit";
import type { UploadOptions } from "imagekit/dist/libs/interfaces/UploadOptions";

let imagekitInstance: ImageKit | null = null;

export const DEFAULT_IMAGEKIT_CONFIG = {
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/abuhasansarkar",
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "public_Jwy2XiHu804qq+/UucO7RXtyh4I=",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_JSzMpz1oQoGa5b+ftpU/szQ0dpk=",
  folderName: process.env.IMAGEKIT_FOLDER_NAME || "Developer-Portfolio",
  folderId: process.env.IMAGEKIT_FOLDER_ID || "6aa7dc41ead997d09ac1e888",
  imagekitId: process.env.IMAGEKIT_ID || "abuhasansarkar",
};

/**
 * Returns a server-side ImageKit instance configured with environment credentials.
 */
export function getImageKitServerClient(): ImageKit {
  if (imagekitInstance) return imagekitInstance;

  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || DEFAULT_IMAGEKIT_CONFIG.publicKey;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || DEFAULT_IMAGEKIT_CONFIG.privateKey;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || DEFAULT_IMAGEKIT_CONFIG.urlEndpoint;

  if (!privateKey) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is missing from environment variables.");
  }

  imagekitInstance = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
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
  const folder = params.folder || `/${DEFAULT_IMAGEKIT_CONFIG.folderName.replace(/^\//, "")}`;

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
