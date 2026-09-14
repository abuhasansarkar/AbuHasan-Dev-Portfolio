import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"]);
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg", "image/avif": "avif" };

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Same-origin check (CSRF hardening for the multipart endpoint)
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File is larger than 5 MB" }, { status: 413 });

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${EXT[file.type] ?? "bin"}`;

  try {
    // 1. Primary storage: ImageKit
    if (process.env.IMAGEKIT_PRIVATE_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY) {
      const { uploadToImageKit } = await import("@/lib/imagekit/server");
      const buffer = Buffer.from(await file.arrayBuffer());
      const customFolder = form?.get("folder")?.toString();

      const result = await uploadToImageKit({
        file: buffer,
        fileName: filename,
        folder: customFolder,
        tags: ["portfolio", "admin-upload"],
      });

      return NextResponse.json({
        url: result.url,
        fileId: result.fileId,
        name: result.name,
        thumbnailUrl: result.thumbnailUrl,
        width: result.width,
        height: result.height,
      });
    }

    // 2. Fallback: Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${filename}`, file, { access: "public", contentType: file.type });
      return NextResponse.json({ url: blob.url });
    }

    // 3. Fallback: Local public/uploads for development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "ImageKit credentials or BLOB_READ_WRITE_TOKEN required in production." },
        { status: 501 }
      );
    }

    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("[upload] failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
