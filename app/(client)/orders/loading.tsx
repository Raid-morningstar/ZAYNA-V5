export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 animate-pulse space-y-4">
      <div className="h-8 w-40 rounded-full bg-slate-200" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 rounded-3xl border border-slate-200 bg-white" />
      ))}
    </div>
  );
}
