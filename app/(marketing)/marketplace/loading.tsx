export default function MarketplaceLoading() {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <div className="container-page pb-14 pt-16 desk:pb-20 desk:pt-24">
        <div className="h-4 w-20 animate-pulse rounded-full bg-surface" />
        <div className="mt-5 h-14 w-[36rem] max-w-full animate-pulse rounded-2xl bg-surface" />
        <div className="mt-6 h-5 w-[30rem] max-w-full animate-pulse rounded-full bg-surface" />
      </div>
      <div className="container-page grid gap-4 pb-20 tab:grid-cols-2 desk:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card-surface animate-pulse p-2">
            <div className="aspect-[16/10] rounded-[16px] bg-surface-photo" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-24 rounded-full bg-surface-photo" />
              <div className="h-5 w-3/4 rounded-full bg-surface-photo" />
              <div className="h-3 w-full rounded-full bg-surface-photo" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
