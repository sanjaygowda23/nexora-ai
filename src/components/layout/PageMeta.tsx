import { useEffect } from "react";

/** Lightweight per-route SEO: title + description without a head-management dependency. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title === "Alder" ? "Alder — Intelligence That Moves Business Forward" : `${title} · Alder`;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);
}
