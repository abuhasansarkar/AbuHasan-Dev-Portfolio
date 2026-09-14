"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { BlogCategory } from "@prisma/client";
import { savePost } from "@/app/actions/admin/posts";
import { BlockEditor } from "@/components/admin/block-editor";
import { Checkbox, FormError, FormField, FormSection } from "@/components/admin/form-field";
import { ImageInput } from "@/components/admin/image-input";
import { SubmitButton } from "@/components/admin/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/admin/action-state";
import type { PostWithCategory } from "@/lib/data/posts";

function toLocalInput(d: Date | null | undefined) {
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostForm({ post, categories }: { post?: PostWithCategory; categories: BlogCategory[] }) {
  const [state, action] = useActionState(savePost, initialActionState);
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-6">
      {post && <input type="hidden" name="id" value={post.id} />}

      <FormSection title="Article" description="Body supports Markdown: headings, lists, links, images, code blocks and tables.">
        <FormField label="Title" name="title" error={e.title}>
          <Input id="title" name="title" defaultValue={post?.title} required />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Slug" name="slug" error={e.slug} hint="Leave empty to generate from the title.">
            <Input id="slug" name="slug" defaultValue={post?.slug} />
          </FormField>
          <FormField label="Category" name="categoryId" error={e.categoryId}>
            <Select id="categoryId" name="categoryId" defaultValue={post?.categoryId ?? ""} required>
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <FormField label="Excerpt" name="excerpt" error={e.excerpt}>
          <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} required />
        </FormField>
        <FormField label="Content & Blocks" name="content" error={e.content} hint="Add text tags (p, span, h1-h6), images, videos, links, or code snippets.">
          <BlockEditor name="content" defaultValue={post?.content} />
        </FormField>
        <FormField label="Cover image" name="coverImage" error={e.coverImage}>
          <ImageInput name="coverImage" defaultValue={post?.coverImage} />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-3">
          <FormField label="Tags" name="tags" error={e.tags} hint="Comma separated.">
            <Input id="tags" name="tags" defaultValue={post?.tags.join(", ")} />
          </FormField>
          <FormField label="Author" name="author" error={e.author}>
            <Input id="author" name="author" defaultValue={post?.author ?? "AbuHasan"} />
          </FormField>
          <FormField label="Reading time (min)" name="readingTime" error={e.readingTime} hint="Leave empty to estimate.">
            <Input id="readingTime" name="readingTime" type="number" min={1} defaultValue={post?.readingTime ?? ""} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="SEO" description="Optional overrides for search engines and social sharing.">
        <FormField label="SEO title" name="seoTitle" error={e.seoTitle} hint="Up to 70 characters.">
          <Input id="seoTitle" name="seoTitle" maxLength={70} defaultValue={post?.seoTitle ?? ""} />
        </FormField>
        <FormField label="SEO description" name="seoDescription" error={e.seoDescription} hint="Up to 170 characters.">
          <Textarea id="seoDescription" name="seoDescription" rows={2} maxLength={170} defaultValue={post?.seoDescription ?? ""} />
        </FormField>
        <FormField label="Open Graph image" name="ogImage" error={e.ogImage} hint="Falls back to the cover image.">
          <ImageInput name="ogImage" defaultValue={post?.ogImage} />
        </FormField>
      </FormSection>

      <FormSection title="Publishing">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Status" name="status" error={e.status}>
            <Select id="status" name="status" defaultValue={post?.status ?? "DRAFT"}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </Select>
          </FormField>
          <FormField label="Publish date" name="publishedAt" error={e.publishedAt} hint="Leave empty to use now when publishing.">
            <Input id="publishedAt" name="publishedAt" type="datetime-local" defaultValue={toLocalInput(post?.publishedAt)} />
          </FormField>
        </div>
        <div className="flex flex-wrap gap-6">
          <FormField label="Featured" name="featured" inline>
            <Checkbox id="featured" name="featured" defaultChecked={post?.featured ?? false} />
          </FormField>
          <FormField label="Demo content" name="isDemo" inline>
            <Checkbox id="isDemo" name="isDemo" defaultChecked={post?.isDemo ?? false} />
          </FormField>
        </div>
      </FormSection>

      <FormError message={state.error} />

      <div className="flex items-center justify-end gap-3">
        <Button asChild variant="ghost">
          <Link href="/admin/posts">Cancel</Link>
        </Button>
        <SubmitButton pendingLabel="Saving…">{post ? "Save changes" : "Create post"}</SubmitButton>
      </div>
    </form>
  );
}
