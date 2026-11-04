import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll to top on route change, or to an in-page anchor when the path carries one (#/solutions#agents). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      let tries = 0;
      const seek = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else if (tries++ < 20) setTimeout(seek, 60); // wait for lazy page
      };
      seek();
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname, hash]);
  return null;
}
