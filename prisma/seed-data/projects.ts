/**
 * PORTFOLIO PROJECTS.
 * Add real projects here with real metrics, live URLs, and real screenshots.
 * Set isDemo: false for real projects. Set published: true only for projects you can defend.
 * Images should be real screenshots of live sites, not synthetic SVG mockups.
 */
type SeedProjectImage = { url: string; alt: string; caption?: string };

export type SeedProject = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  category: string;
  excerpt: string;
  description: string;
  challenge: string;
  strategy: string;
  solution: string;
  results: string;
  keyImprovements: string[];
  technologies: string[];
  services: string[];
  projectUrl?: string;
  coverImage: string;
  accentColor?: string;
  year?: number;
  featured: boolean;
  published: boolean;
  isDemo: boolean;
  sortOrder: number;
  images: SeedProjectImage[];
};

export const projects: SeedProject[] = [];
