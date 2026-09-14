"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import hljs from "highlight.js";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

function getHighlightedHtml(code: string, language?: string): string {
  if (!code) return "";
  const rawLang = (language || "typescript").toLowerCase().trim();
  const langMap: Record<string, string> = {
    tsx: "typescript",
    jsx: "javascript",
    ts: "typescript",
    js: "javascript",
    py: "python",
    sh: "bash",
    shell: "bash",
    yml: "yaml",
  };
  const target = langMap[rawLang] || rawLang;

  try {
    if (target && hljs.getLanguage(target)) {
      return hljs.highlight(code, { language: target, ignoreIllegals: true }).value;
    }
    return hljs.highlightAuto(code).value;
  } catch {
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

export function CodeBlock({ code, language = "typescript", title, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access error fallback
    }
  };

  const highlightedHtml = useMemo(() => getHighlightedHtml(code, language), [code, language]);
  const displayTitle = title || language.toUpperCase();

  return (
    <div
      className={cn(
        "group relative my-5 overflow-hidden rounded-xl border border-border/80 bg-[hsl(240_8%_6%)] text-[hsl(40_10%_94%)] shadow-2xl transition-all",
        className
      )}
    >
      {/* Terminal Header Bar */}
      <div className="flex h-10 items-center justify-between border-b border-border/60 bg-[hsl(240_8%_4%)]/90 px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500/80" />
            <span className="size-2.5 rounded-full bg-yellow-500/80" />
            <span className="size-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="mx-2 h-3.5 w-px bg-border/60" />
          <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wide text-muted-foreground">
            <Terminal className="size-3 text-accent" />
            {displayTitle}
          </span>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Code copied" : "Copy code snippet"}
          className="flex items-center gap-1.5 rounded-md border border-border/50 bg-secondary/20 px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition hover:border-accent/40 hover:bg-secondary/40 hover:text-foreground active:scale-95"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area with Colorful Syntax Highlighting */}
      <pre className="no-scrollbar overflow-x-auto p-4 font-mono text-xs leading-relaxed md:text-sm">
        <code
          className={`hljs language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
    </div>
  );
}
