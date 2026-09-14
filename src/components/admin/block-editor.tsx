"use client";

import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Code2,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Quote,
  Trash2,
  Type,
  Upload,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { ContentBlockBar } from "@/components/admin/content-block-bar";
import { CodeBlock } from "@/components/content/code-block";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { parseVideoEmbedUrl } from "@/lib/video-embed";
import type {
  CodeLanguage,
  ContentBlock,
  TextTag,
} from "@/types/content-blocks";

interface BlockEditorProps {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
}

function parseInitialBlocks(defaultValue?: string | null): {
  mode: "blocks" | "markdown";
  blocks: ContentBlock[];
  rawMarkdown: string;
} {
  if (!defaultValue) {
    return { mode: "blocks", blocks: [], rawMarkdown: "" };
  }

  const trimmed = defaultValue.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return { mode: "blocks", blocks: parsed, rawMarkdown: "" };
      }
    } catch {
      // Not JSON, treat as markdown
    }
  }

  // Treat as existing legacy markdown
  return {
    mode: "markdown",
    blocks: [
      {
        id: "block-initial",
        type: "text",
        tag: "p",
        content: defaultValue,
      },
    ],
    rawMarkdown: defaultValue,
  };
}

export function BlockEditor({ name, defaultValue }: BlockEditorProps) {
  const initial = parseInitialBlocks(defaultValue);
  const [mode, setMode] = useState<"blocks" | "markdown">(initial.mode);
  const [blocks, setBlocks] = useState<ContentBlock[]>(initial.blocks);
  const [markdown, setMarkdown] = useState<string>(initial.rawMarkdown);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadTargetRef = useRef<string | null>(null);

  // Add block handlers
  const handleAddText = (tag: TextTag) => {
    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "text",
        tag,
        content: "",
      },
    ]);
  };

  const handleAddVideo = () => {
    const url = window.prompt("Enter YouTube or Vimeo URL:");
    if (!url) return;

    const embedUrl = parseVideoEmbedUrl(url);
    if (!embedUrl) {
      toast.error("Could not parse video URL. Please enter a valid YouTube or Vimeo link.");
      return;
    }

    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "video",
        url,
        embedUrl,
        caption: "",
      },
    ]);
    toast.success("Video embed block added");
  };

  const handleAddImage = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "image",
        url: "",
        alt: "",
        caption: "",
      },
    ]);
  };

  const handleAddCode = (lang: CodeLanguage = "typescript") => {
    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "code",
        code: "",
        language: lang,
        title: "",
      },
    ]);
  };

  const handleAddLink = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "link",
        url: "https://",
        title: "",
        description: "",
      },
    ]);
  };

  const handleAddQuote = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "quote",
        quote: "",
        author: "",
      },
    ]);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...updates } as ContentBlock) : b))
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= blocks.length) return;
    const copy = [...blocks];
    const [moved] = copy.splice(index, 1);
    if (moved) {
      copy.splice(target, 0, moved);
      setBlocks(copy);
    }
  };

  // Upload handler for image blocks
  const triggerImageUpload = (blockId: string) => {
    activeUploadTargetRef.current = blockId;
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (file: File) => {
    const blockId = activeUploadTargetRef.current;
    if (!blockId) return;

    setUploadingBlockId(blockId);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Upload failed");
      }

      updateBlock(blockId, { url: json.url });
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Image upload failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setUploadingBlockId(null);
      activeUploadTargetRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // The value submitted to the form
  const payloadValue = mode === "blocks" ? JSON.stringify(blocks) : markdown;

  return (
    <div className="flex flex-col gap-4">
      {/* Hidden file input for ImageKit uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />

      {/* Hidden input sent with server action */}
      <input type="hidden" name={name} value={payloadValue} />

      {/* Header bar: Mode Switcher */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Editor Mode
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {mode === "blocks" ? `${blocks.length} block(s)` : "Raw Markdown"}
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode("blocks")}
            className={`rounded-md px-3 py-1 font-medium transition ${
              mode === "blocks"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Visual Blocks
          </button>
          <button
            type="button"
            onClick={() => setMode("markdown")}
            className={`rounded-md px-3 py-1 font-medium transition ${
              mode === "markdown"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Raw Markdown
          </button>
        </div>
      </div>

      {mode === "markdown" ? (
        /* Markdown Fallback Mode */
        <Textarea
          id={`${name}-raw`}
          rows={22}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Write in standard markdown..."
          className="font-mono text-xs leading-relaxed"
        />
      ) : (
        /* Visual Block Mode */
        <div className="flex flex-col gap-4">
          {blocks.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
              No blocks yet. Use the toolbar below to add headings, paragraphs, images, videos, or code snippets!
            </div>
          )}

          {blocks.map((block, index) => (
            <div
              key={block.id}
              className="group relative rounded-xl border border-border/80 bg-card/60 p-4 transition-all hover:border-border hover:shadow-md"
            >
              {/* Block Header Toolbar */}
              <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-secondary text-accent text-xs">
                    {block.type === "text" && <Type className="size-3.5" />}
                    {block.type === "image" && <ImageIcon className="size-3.5" />}
                    {block.type === "video" && <Video className="size-3.5" />}
                    {block.type === "code" && <Code2 className="size-3.5" />}
                    {block.type === "link" && <LinkIcon className="size-3.5" />}
                    {block.type === "quote" && <Quote className="size-3.5" />}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {block.type === "text" ? `Text Tag <${block.tag}>` : block.type}
                  </span>
                </div>

                {/* Block Controls: Reorder & Delete */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(index, "up")}
                    disabled={index === 0}
                    title="Move Up"
                    className="rounded p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-20"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(index, "down")}
                    disabled={index === blocks.length - 1}
                    title="Move Down"
                    className="rounded p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-20"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(block.id)}
                    title="Remove Block"
                    className="rounded p-1 text-muted-foreground transition hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Block Body: TEXT */}
              {block.type === "text" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Tag:</span>
                    <div className="flex flex-wrap gap-1">
                      {(["p", "span", "h1", "h2", "h3", "h4", "h5", "h6"] as TextTag[]).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => updateBlock(block.id, { tag: t })}
                          className={`rounded px-2 py-0.5 text-xs font-mono font-medium transition ${
                            block.tag === t
                              ? "bg-accent text-accent-foreground shadow-xs"
                              : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    rows={block.tag.startsWith("h") ? 2 : block.tag === "span" ? 1 : 4}
                    placeholder={`Enter text content for <${block.tag}>...`}
                    className="text-sm leading-relaxed"
                  />
                </div>
              )}

              {/* Block Body: VIDEO */}
              {block.type === "video" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={block.url}
                      onChange={(e) => {
                        const newUrl = e.target.value;
                        const embed = parseVideoEmbedUrl(newUrl);
                        updateBlock(block.id, {
                          url: newUrl,
                          embedUrl: embed || block.embedUrl,
                        });
                      }}
                      placeholder="Paste YouTube or Vimeo URL..."
                    />
                  </div>
                  {block.embedUrl && (
                    <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-xl border border-border bg-black/40">
                      <iframe
                        src={block.embedUrl}
                        title="Video Preview"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <Input
                    value={block.caption ?? ""}
                    onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                    placeholder="Caption or description (optional)"
                  />
                </div>
              )}

              {/* Block Body: IMAGE */}
              {block.type === "image" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={block.url}
                      onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                      placeholder="Image URL or upload below..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => triggerImageUpload(block.id)}
                      disabled={uploadingBlockId === block.id}
                      className="shrink-0"
                    >
                      {uploadingBlockId === block.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                      Upload Image
                    </Button>
                  </div>

                  {block.url && (
                    <div className="relative max-h-64 max-w-md overflow-hidden rounded-lg border border-border bg-secondary/30 p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={block.url}
                        alt={block.alt || "Preview"}
                        className="max-h-60 w-full object-contain rounded"
                      />
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      value={block.alt}
                      onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                      placeholder="Alt text (for accessibility & SEO)"
                    />
                    <Input
                      value={block.caption ?? ""}
                      onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                      placeholder="Caption (optional)"
                    />
                  </div>
                </div>
              )}

              {/* Block Body: CODE */}
              {block.type === "code" && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Language:</span>
                      <Select
                        value={block.language}
                        onChange={(e) =>
                          updateBlock(block.id, { language: e.target.value as CodeLanguage })
                        }
                      >
                        <option value="typescript">TypeScript (TSX)</option>
                        <option value="javascript">JavaScript (JSX)</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="python">Python</option>
                        <option value="bash">Bash / Shell</option>
                        <option value="json">JSON</option>
                        <option value="sql">SQL</option>
                        <option value="markdown">Markdown</option>
                        <option value="other">Other / Plain Text</option>
                      </Select>
                    </div>
                    <Input
                      value={block.title ?? ""}
                      onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                      placeholder="Title or filename (e.g. app/page.tsx)"
                    />
                  </div>
                  <Textarea
                    value={block.code}
                    onChange={(e) => updateBlock(block.id, { code: e.target.value })}
                    rows={8}
                    placeholder="Paste code snippet here..."
                    className="font-mono text-xs leading-relaxed bg-[hsl(240_8%_6%)] text-[hsl(40_10%_92%)]"
                  />
                  {block.code && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Live Preview (Highlighted)
                      </span>
                      <CodeBlock code={block.code} language={block.language} title={block.title} />
                    </div>
                  )}
                </div>
              )}

              {/* Block Body: LINK */}
              {block.type === "link" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    value={block.title}
                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                    placeholder="Link title or button text..."
                  />
                  <Input
                    value={block.url}
                    onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                    placeholder="https://..."
                  />
                  <div className="sm:col-span-2">
                    <Input
                      value={block.description ?? ""}
                      onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                      placeholder="Optional description / subtext"
                    />
                  </div>
                </div>
              )}

              {/* Block Body: QUOTE */}
              {block.type === "quote" && (
                <div className="space-y-3">
                  <Textarea
                    value={block.quote}
                    onChange={(e) => updateBlock(block.id, { quote: e.target.value })}
                    rows={3}
                    placeholder="Enter inspiring quote or callout text..."
                    className="italic text-sm"
                  />
                  <Input
                    value={block.author ?? ""}
                    onChange={(e) => updateBlock(block.id, { author: e.target.value })}
                    placeholder="Author or source attribution (optional)"
                  />
                </div>
              )}
            </div>
          ))}

          {/* The "Add content" Toolbar Matching the Screenshot */}
          <ContentBlockBar
            onAddText={handleAddText}
            onAddImage={handleAddImage}
            onAddVideo={handleAddVideo}
            onAddCode={handleAddCode}
            onAddLink={handleAddLink}
            onAddQuote={handleAddQuote}
          />
        </div>
      )}
    </div>
  );
}
