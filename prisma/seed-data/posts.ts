import { PostStatus } from "@prisma/client";

/**
 * BLOG CONTENT.
 * Add real articles here with real insights from your projects.
 * Set status: PostStatus.DRAFT for work in progress, PostStatus.PUBLISHED for live articles.
 * Set isDemo: false for real articles.
 */
export const categories = [
  { slug: "wordpress", name: "WordPress", description: "Building, extending and maintaining WordPress the right way.", sortOrder: 1 },
  { slug: "web-design", name: "Web Design", description: "Design decisions that make websites clearer and more persuasive.", sortOrder: 2 },
  { slug: "ui-ux", name: "UI/UX", description: "Interfaces and journeys that reduce friction.", sortOrder: 3 },
  { slug: "seo", name: "SEO", description: "Technical and on-page SEO for real businesses.", sortOrder: 4 },
  { slug: "performance", name: "Performance", description: "Speed, Core Web Vitals and why they matter for revenue.", sortOrder: 5 },
  { slug: "freelancing", name: "Freelancing", description: "Working with clients and agencies as an independent developer.", sortOrder: 6 },
  { slug: "web-development", name: "Web Development", description: "Custom code, tooling and modern stacks.", sortOrder: 7 },
];

export type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  categorySlug: string;
  tags: string[];
  coverImage: string;
  author: string;
  publishedAt: Date;
  readingTime: number;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  status: PostStatus;
  featured: boolean;
  isDemo: boolean;
};

const author = "Abu Hasan Sarkar";

export const posts: SeedPost[] = [];
