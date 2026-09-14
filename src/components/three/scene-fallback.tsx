/** Lightweight CSS fallback used when WebGL is unavailable, motion is reduced, or the scene fails. */
export function SceneFallback() {
  return (
    <div aria-hidden className="relative flex size-full items-center justify-center">
      <div className="absolute size-[42vmin] max-w-[520px] rounded-full bg-accent/20 blur-3xl" />
      <div className="relative size-[34vmin] max-w-[420px] rounded-full border border-foreground/15" />
      <div className="absolute size-[46vmin] max-w-[560px] rounded-full border border-foreground/10 [transform:rotateX(65deg)]" />
      <div className="absolute size-[24vmin] max-w-[300px] rounded-full border border-accent/40" />
    </div>
  );
}
