export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="card p-5">
            <div className="h-8 w-8 animate-pulse rounded bg-slate-100" />
            <div className="mt-4 h-5 w-24 animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="card p-6">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
