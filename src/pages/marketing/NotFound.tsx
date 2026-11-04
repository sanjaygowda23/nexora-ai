import { Link } from "react-router-dom";
import { usePageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  usePageMeta("Page not found");
  return (
    <section className="container grid min-h-[80vh] place-items-center pt-24 text-center">
      <div>
        <p className="font-mono text-[12px] text-signal">ERROR 404 · route.unresolved</p>
        <h1 className="mt-5 text-display-lg font-medium text-white">This path isn't in the graph.</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-400">The page you're looking for has moved or never existed.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild signal><Link to="/">Back to home</Link></Button>
          <Button asChild variant="secondary"><Link to="/app/dashboard">Open the console</Link></Button>
        </div>
      </div>
    </section>
  );
}
