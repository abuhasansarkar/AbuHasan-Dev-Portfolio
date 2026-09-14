export type TextTag = "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type CodeLanguage =
  | "typescript"
  | "javascript"
  | "tsx"
  | "jsx"
  | "html"
  | "css"
  | "python"
  | "bash"
  | "shell"
  | "json"
  | "sql"
  | "markdown"
  | "yaml"
  | "other";

export interface TextBlock {
  id: string;
  type: "text";
  tag: TextTag;
  content: string;
}

export interface ImageBlock {
  id: string;
  type: "image";
  url: string;
  alt: string;
  caption?: string;
}

export interface VideoBlock {
  id: string;
  type: "video";
  url: string;
  embedUrl: string;
  caption?: string;
}

export interface CodeBlockData {
  id: string;
  type: "code";
  code: string;
  language: CodeLanguage;
  title?: string;
}

export interface LinkBlock {
  id: string;
  type: "link";
  url: string;
  title: string;
  description?: string;
}

export interface QuoteBlock {
  id: string;
  type: "quote";
  quote: string;
  author?: string;
}

export type ContentBlock =
  | TextBlock
  | ImageBlock
  | VideoBlock
  | CodeBlockData
  | LinkBlock
  | QuoteBlock;
