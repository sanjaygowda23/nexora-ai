import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * A soft electric→violet horizon that breathes slowly.
 * Rendered into a tiny 80×48 canvas and stretched by CSS — the browser's bilinear
 * upscaling produces a perfectly smooth gradient at ~4k pixels of work per frame.
 */
export function HorizonGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const W = c.width, H = c.height;
    const img = ctx.createImageData(W, H);
    const blue = [76, 125, 255], violet = [139, 92, 246], cyan = [62, 230, 210];
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(c);

    const draw = (t: number) => {
      const time = reduce ? 0 : t;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const u = x / (W - 1), v = y / (H - 1);
          // Elliptical horizon centred below the bottom edge
          const cx = 0.5 + Math.sin(time * 0.00018) * 0.06;
          const dx = (u - cx) * 1.15;
          const dy = (v - 1.18 - Math.sin(time * 0.00025 + 1.4) * 0.03) * 2.1;
          const d = Math.sqrt(dx * dx + dy * dy);
          let g = Math.max(0, 1 - d / 1.05);
          g = g * g * (3 - 2 * g);
          // Hue sweep: violet on the left, electric centre, cyan hint right
          const h = Math.min(1, Math.max(0, u + Math.sin(time * 0.0003) * 0.08));
          const a = h < 0.55 ? mix(violet, blue, h / 0.55) : mix(blue, cyan, (h - 0.55) / 0.45 * 0.35);
          const i = (y * W + x) * 4;
          img.data[i] = a[0]; img.data[i + 1] = a[1]; img.data[i + 2] = a[2];
          img.data[i + 3] = Math.round(g * 150);
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const loop = (t: number) => {
      if (visible) draw(t);
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [reduce]);

  return <canvas ref={ref} width={80} height={48} className={className} aria-hidden />;
}

function mix(a: number[], b: number[], t: number) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
