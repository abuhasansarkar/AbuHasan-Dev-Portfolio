export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8" aria-busy="true" aria-live="polite">
      <div className="h-8 w-52 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-80 animate-pulse rounded-md bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 w-full animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}