"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageOff, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = { name: string; defaultValue?: string | null; id?: string; required?: boolean };

/** URL field with optional upload. Upload posts to /api/admin/upload and fills the URL. */
export function ImageInput({ name, defaultValue, id, required }: Props) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed");
      setValue(json.url);
      setBroken(false);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed", { description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input id={id ?? name} name={name} value={value} onChange={(e) => { setValue(e.target.value); setBroken(false); }} placeholder="/demo/... or https://" required={required} />
        <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} aria-label="Upload image" />
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="animate-spin" aria-hidden /> : <Upload aria-hidden />}
          Upload
        </Button>
      </div>
      {value && (
        <div className="relative aspect-[16/9] w-full max-w-sm overflow-hidden rounded-lg border border-border bg-secondary">
          {broken ? (
            <div className="flex size-full items-center justify-center gap-2 text-xs text-muted-foreground">
              <ImageOff className="size-4" aria-hidden />
              Could not load image
            </div>
          ) : (
            <>
              <Image
                src={value}
                alt="Preview"
                fill
                sizes="384px"
                className="object-cover"
                onError={() => setBroken(true)}
                unoptimized={
                  value.startsWith("http") &&
                  !value.includes("blob.vercel-storage.com") &&
                  !value.includes("imagekit.io") &&
                  !value.includes("images.unsplash.com")
                }
              />
              {value.includes("imagekit.io") && (
                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white backdrop-blur">
                  ImageKit
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
