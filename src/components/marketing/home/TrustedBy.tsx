import { demoBrands } from "@/data/site";

const Glyph = ({ kind }: { kind: string }) => {
  const c = "h-5 w-5";
  switch (kind) {
    case "triangle": return <svg viewBox="0 0 20 20" className={c}><path d="M10 3 18 17H2z" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
    case "bars": return <svg viewBox="0 0 20 20" className={c}><path d="M3 15V9M8 15V5M13 15V8M18 15V3" stroke="currentColor" strokeWidth="2.4" /></svg>;
    case "plus": return <svg viewBox="0 0 20 20" className={c}><path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="3" /></svg>;
    case "arc": return <svg viewBox="0 0 20 20" className={c}><path d="M2 16a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="2.2" /><circle cx="10" cy="16" r="2" fill="currentColor" /></svg>;
    case "ring": return <svg viewBox="0 0 20 20" className={c}><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="10" cy="10" r="2.5" fill="currentColor" /></svg>;
    case "chevron": return <svg viewBox="0 0 20 20" className={c}><path d="m3 6 7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>;
    case "dot": return <svg viewBox="0 0 20 20" className={c}><circle cx="6" cy="10" r="3.5" fill="currentColor" /><circle cx="14" cy="10" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
    default: return <svg viewBox="0 0 20 20" className={c}><rect x="4" y="4" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(45 10 10)" /></svg>;
  }
};

export function TrustedBy() {
  const row = [...demoBrands, ...demoBrands];
  return (
    <section className="relative border-y border-white/[.06] py-10" aria-labelledby="trusted-title">
      <div className="container mb-6 flex flex-col items-center gap-1.5 text-center">
        <p id="trusted-title" className="text-[13px] text-ink-400">Operating AI for teams across finance, healthcare, manufacturing and SaaS</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-500">Fictional demo brands · for layout illustration only</p>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="flex w-max animate-marquee items-center gap-14 hover:[animation-play-state:paused]">
          {row.map((b, i) => (
            <li key={i} aria-hidden={i >= demoBrands.length} className="flex items-center gap-2.5 whitespace-nowrap text-ink-400 transition-colors hover:text-white">
              <Glyph kind={b.glyph} />
              <span className="text-[15px] font-semibold tracking-[-0.01em]">{b.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
