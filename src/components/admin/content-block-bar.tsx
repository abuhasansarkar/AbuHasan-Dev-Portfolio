"use client";

import {
  Image as ImageIcon,
  Video,
  Type,
  Link as LinkIcon,
  Code2,
  Quote,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TextTag, CodeLanguage } from "@/types/content-blocks";

interface ContentBlockBarProps {
  onAddText: (tag: TextTag) => void;
  onAddImage: () => void;
  onAddVideo: () => void;
  onAddCode: (lang?: CodeLanguage) => void;
  onAddLink: () => void;
  onAddQuote?: () => void;
}

export function ContentBlockBar({
  onAddText,
  onAddImage,
  onAddVideo,
  onAddCode,
  onAddLink,
  onAddQuote,
}: ContentBlockBarProps) {
  const textOptions: { label: string; tag: TextTag; description: string }[] = [
    { label: "Paragraph", tag: "p", description: "Standard body text" },
    { label: "Lead / Highlight Tag", tag: "span", description: "Small accent tag or kicker" },
    { label: "Heading 1 (H1)", tag: "h1", description: "Primary section heading" },
    { label: "Heading 2 (H2)", tag: "h2", description: "Main section title" },
    { label: "Heading 3 (H3)", tag: "h3", description: "Sub-section heading" },
    { label: "Heading 4 (H4)", tag: "h4", description: "Minor title" },
    { label: "Heading 5 (H5)", tag: "h5", description: "Small header" },
    { label: "Heading 6 (H6)", tag: "h6", description: "Uppercase tracking header" },
  ];

  const codeLanguages: { label: string; lang: CodeLanguage }[] = [
    { label: "TypeScript / TSX", lang: "typescript" },
    { label: "JavaScript / JSX", lang: "javascript" },
    { label: "HTML / CSS", lang: "html" },
    { label: "Python", lang: "python" },
    { label: "Bash / Terminal", lang: "bash" },
    { label: "JSON", lang: "json" },
    { label: "SQL", lang: "sql" },
    { label: "Markdown", lang: "markdown" },
  ];

  return (
    <div className="group relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/40 px-6 py-7 transition-all duration-300 hover:border-accent/50 hover:bg-card/70 hover:shadow-lg">
      {/* Icon action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* 1. Image */}
        <button
          type="button"
          onClick={onAddImage}
          title="Add Image (ImageKit or URL)"
          aria-label="Add Image"
          className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/90 text-muted-foreground shadow-sm transition-all duration-200 hover:scale-110 hover:border-accent hover:text-foreground hover:shadow active:scale-95"
        >
          <ImageIcon className="size-4.5" />
        </button>

        {/* 2. Video */}
        <button
          type="button"
          onClick={onAddVideo}
          title="Add Video (YouTube, Vimeo, MP4)"
          aria-label="Add Video Embed"
          className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/90 text-muted-foreground shadow-sm transition-all duration-200 hover:scale-110 hover:border-accent hover:text-foreground hover:shadow active:scale-95"
        >
          <Video className="size-4.5" />
        </button>

        {/* 3. Text (T with dropdown for p, span, h1-h6) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              title="Add Text Block (p, span, h1-h6)"
              aria-label="Add Text Block"
              className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/90 text-muted-foreground shadow-sm transition-all duration-200 hover:scale-110 hover:border-accent hover:text-foreground hover:shadow active:scale-95"
            >
              <Type className="size-4.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuLabel>Select Text Element</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {textOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.tag}
                onClick={() => onAddText(opt.tag)}
                className="flex flex-col items-start gap-0.5"
              >
                <span className="font-medium text-foreground">{opt.label}</span>
                <span className="text-[10px] text-muted-foreground">{opt.description}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 4. Link */}
        <button
          type="button"
          onClick={onAddLink}
          title="Add Link Card"
          aria-label="Add Link"
          className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/90 text-muted-foreground shadow-sm transition-all duration-200 hover:scale-110 hover:border-accent hover:text-foreground hover:shadow active:scale-95"
        >
          <LinkIcon className="size-4.5" />
        </button>

        {/* 5. Code Snippet */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              title="Add Code Snippet"
              aria-label="Add Code Snippet"
              className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/90 text-muted-foreground shadow-sm transition-all duration-200 hover:scale-110 hover:border-accent hover:text-foreground hover:shadow active:scale-95"
            >
              <Code2 className="size-4.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuLabel>Code Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {codeLanguages.map((l) => (
              <DropdownMenuItem key={l.lang} onClick={() => onAddCode(l.lang)}>
                {l.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 6. Document / Quote */}
        {onAddQuote && (
          <button
            type="button"
            onClick={onAddQuote}
            title="Add Quote / Callout"
            aria-label="Add Quote or Callout"
            className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/90 text-muted-foreground shadow-sm transition-all duration-200 hover:scale-110 hover:border-accent hover:text-foreground hover:shadow active:scale-95"
          >
            <Quote className="size-4.5" />
          </button>
        )}
      </div>

      {/* Subtitle label */}
      <span className="mt-3 text-xs font-medium tracking-wide text-muted-foreground transition-colors group-hover:text-foreground/80">
        Add content
      </span>
    </div>
  );
}
