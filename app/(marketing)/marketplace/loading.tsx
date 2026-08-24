export default function MarketplaceLoading() {
  return (
    <div className="bg-ink-900">
      <div className="bg-ink-950">
        <div className="container-page py-16">
          <div className="h-3 w-36 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-5 w-[32rem] max-w-full animate-pulse rounded bg-ink-900" />
        </div>
      </div>
      <div className="container-page py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
              <div className="h-56 animate-pulse bg-white/[0.04]" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-24 animate-pulse rounded bg-white/[0.04]" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-white/[0.04]" />
                <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
