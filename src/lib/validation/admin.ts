import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(2, "Slug is required")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

const imagePath = z.string().trim().max(500).refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), "Use an absolute URL or a path starting with /");

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
  next: z.string().optional(),
});

export const projectImageSchema = z.object({
  url: imagePath.refine((v) => v.length > 0, "Image URL is required"),
  alt: z.string().trim().min(1, "Alt text is required").max(200),
  caption: z.string().trim().max(300).optional(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Title is required").max(120),
  slug,
  client: z.string().trim().min(1, "Client is required").max(120),
  industry: z.string().trim().min(1, "Industry is required").max(120),
  category: z.string().trim().min(1, "Category is required").max(120),
  excerpt: z.string().trim().min(10, "Excerpt should be at least 10 characters").max(300),
  description: z.string().trim().min(10).max(50000),
  challenge: z.string().trim().min(10).max(50000),
  strategy: z.string().trim().min(10).max(50000),
  solution: z.string().trim().min(10).max(50000),
  results: z.string().trim().min(10).max(50000),
  keyImprovements: z.array(z.string().max(200)).max(20),
  technologies: z.array(z.string().max(60)).max(30),
  services: z.array(z.string().max(80)).max(20),
  projectUrl: z.string().trim().max(300).refine((v) => v === "" || /^https?:\/\//.test(v), "Enter a full URL including https://"),
  coverImage: imagePath.refine((v) => v.length > 0, "Cover image is required"),
  accentColor: z.string().trim().max(20).refine((v) => v === "" || /^#[0-9a-fA-F]{3,8}$/.test(v), "Use a hex color like #f97316"),
  year: z.number().int().min(2000).max(2100).optional(),
  featured: z.boolean(),
  published: z.boolean(),
  isDemo: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
  images: z.array(projectImageSchema).max(20),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Title is required").max(160),
  slug,
  excerpt: z.string().trim().min(10, "Excerpt should be at least 10 characters").max(400),
  content: z.string().trim().min(20, "Article body is too short").max(200000),
  categoryId: z.string().min(1, "Choose a category"),
  tags: z.array(z.string().max(40)).max(20),
  coverImage: imagePath,
  author: z.string().trim().min(1).max(80),
  publishedAt: z.date().optional(),
  readingTime: z.number().int().min(1).max(120).optional(),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(170).optional(),
  ogImage: imagePath.optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featured: z.boolean(),
  isDemo: z.boolean(),
});
export type PostInput = z.infer<typeof postSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug,
  description: z.string().trim().max(200).optional(),
});

export const testimonialSchema = z.object({
  id: z.string().optional(),
  quote: z.string().trim().min(10, "Quote is too short").max(1200),
  name: z.string().trim().min(2, "Name is required").max(80),
  role: z.string().trim().min(1, "Role is required").max(80),
  company: z.string().trim().min(1, "Company is required").max(120),
  avatar: imagePath,
  rating: z.number().int().min(1).max(5).optional(),
  featured: z.boolean(),
  isDemo: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Title is required").max(80),
  slug,
  description: z.string().trim().min(10, "Description is too short").max(300),
  details: z.string().trim().min(10, "Details are too short").max(3000),
  icon: z.string().trim().min(1, "Choose an icon").max(40),
  features: z.array(z.string().max(120)).max(12),
  sortOrder: z.number().int().min(0).max(9999),
  active: z.boolean(),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const submissionUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]),
  notes: z.string().trim().max(5000).optional(),
});
