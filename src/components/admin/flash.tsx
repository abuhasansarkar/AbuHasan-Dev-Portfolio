"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const messages: Record<string, { type: "success" | "error"; text: string }> = {
  saved: { type: "success", text: "Saved successfully." },
  deleted: { type: "success", text: "Deleted." },
  "error=delete": { type: "error", text: "Could not delete the item." },
};

/** Shows a toast for ?saved=1 / ?deleted=1 / ?error=... and cleans the URL. */
export function Flash() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let key: string | null = null;
    if (params.get("saved")) key = "saved";
    else if (params.get("deleted")) key = "deleted";
    else if (params.get("error")) key = `error=${params.get("error")}`;
    if (!key) return;
    const m = messages[key];
    if (m) toast[m.type](m.text);
    router.replace(window.location.pathname, { scroll: false });
  }, [params, router]);

  return null;
}
