"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlockRenderer } from "@/components/content/block-renderer";
import { CodeBlock } from "@/components/content/code-block";
import type { ContentBlock } from "@/types/content-blocks";

function tryParseBlocks(content: string): ContentBlock[] | null {
  if (!content) return null;
  const trimmed = content.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.type) {
        return parsed as ContentBlock[];
      }
    } catch {
      return null;
    }
  }
  return null;
}

/** Renders either modular JSON blocks or trusted-author markdown. */
export function Markdown({ content }: { content: string }) {
  const blocks = tryParseBlocks(content);

  if (blocks) {
    return <BlockRenderer blocks={blocks} className="prose-custom" />;
  }

  return (
    <div className="prose-custom">
      {/* Highlighting is handled by the custom `code` renderer (CodeBlock / highlight.js);
          rehype-highlight is intentionally NOT used — it would double-process the code and
          replace the raw text child that CodeBlock needs to read. */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const external = href?.startsWith("http");
            return (
              <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                {children}
              </a>
            );
          },
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ src, alt }) => <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" decoding="async" />,
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && typeof children === "string" && !children.includes("\n");

            if (isInline) {
              return (
                <code className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[0.85em] text-accent" {...props}>
                  {children}
                </code>
              );
            }

            const codeString = String(children).replace(/\n$/, "");
            const lang = match ? match[1] : "code";

            return <CodeBlock code={codeString} language={lang} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
