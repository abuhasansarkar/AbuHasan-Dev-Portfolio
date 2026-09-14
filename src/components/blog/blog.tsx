import type { BlogCategory } from "@prisma/client";
import type { PostWithCategory } from "@/lib/data/posts";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { EmptyState } from "@/components/layout/empty-state";
import { BlogExplorer } from "./blog-explorer";

export function Blog({ posts, categories, error }: { posts: PostWithCategory[]; categories: BlogCategory[]; error?: boolean }) {
  return (
    <Section id="blog" aria-labelledby="blog-title" className="border-t border-border/70">
      <div className="container-x">
        <SectionHeading id="blog-title" number="09" eyebrow="Insights" title="Practical notes on websites that work." highlight={["work."]} description="Short, useful articles on WordPress, design, UX, SEO and performance, written for business owners and agencies." />
        {posts.length === 0 ? (
          <EmptyState className="mt-14" title={error ? "Articles are temporarily unavailable" : "No articles published yet"} description={error ? "The database could not be reached. Please refresh in a moment." : "Publish posts from the admin dashboard to show them here."} />
        ) : (
          <BlogExplorer posts={posts} categories={categories} />
        )}
      </div>
    </Section>
  );
}
