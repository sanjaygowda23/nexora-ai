import { useEffect } from "react";

/** Lightweight per-route SEO: title + description without a head-management dependency. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title === "NEXORA AI" ? "NEXORA AI — Intelligence That Moves Business Forward" : `${title} · NEXORA AI`;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);
}
