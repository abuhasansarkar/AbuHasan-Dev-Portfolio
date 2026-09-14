import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { TAGS } from "@/lib/data/tags";

/** Invalidate public caches after an admin mutation. */
export function revalidatePublic(tag: keyof typeof TAGS) {
  revalidateTag(TAGS[tag]);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}
