export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-64 rounded-2xl bg-slate-200" />
      <div className="h-5 w-96 rounded-xl bg-slate-100" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-[28px] bg-slate-100" />
        ))}
      </div>
      <div className="h-72 rounded-[28px] bg-slate-100" />
      <div className="h-64 rounded-[28px] bg-slate-100" />
    </div>
  );
}
