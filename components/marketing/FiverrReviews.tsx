import { Star } from 'lucide-react'
import { getPublishedReviews } from '@/lib/site-data'
import { AnimateIn, StaggerGrid, StaggerItem } from '@/components/marketing/AnimateIn'

function FiverrBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1dbf73]/30 bg-[#1dbf73]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0d8f4a]">
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-[#1dbf73]" aria-hidden>
        <path d="M23.004 8.01a1.38 1.38 0 0 1-1.38 1.38H19.5v7.24a1.38 1.38 0 0 1-2.76 0V9.39h-2.12v7.24a1.38 1.38 0 0 1-2.76 0V9.39H9.74v7.24a1.38 1.38 0 0 1-2.76 0V9.39H4.86v7.24a1.38 1.38 0 0 1-2.76 0V9.39H0V7.01h1.1V5.63A3.13 3.13 0 0 1 4.23 2.5h15.54a3.13 3.13 0 0 1 3.13 3.13V7.01h1.1v1.99zM6.38 5.63V7.01h11.24V5.63a1.38 1.38 0 0 0-1.38-1.38H7.76a1.38 1.38 0 0 0-1.38 1.38z" />
      </svg>
      Fiverr Client
    </span>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </div>
  )
}

export async function FiverrReviews() {
  const reviews = await getPublishedReviews(6)

  if (reviews.length === 0) return null

  return (
    <section className="bg-white py-20 sm:py-28 border-t border-slate-200">
      <div className="container-page">
        <AnimateIn className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-bold uppercase tracking-widest text-[#1dbf73] mb-3">
            Client feedback
          </p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Trusted on Fiverr & beyond
          </h2>
          <p className="mt-4 text-slate-600">
            Real reviews from freelance orders and enterprise projects — transparent,
            verified client experiences.
          </p>
        </AnimateIn>

        <StaggerGrid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <StaggerItem key={review.id}>
              <article className="card-hover flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {review.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.avatarUrl}
                        alt=""
                        className="h-11 w-11 rounded-full border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-800 text-sm font-bold text-white">
                        {review.clientName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {review.clientName}
                      </p>
                      {review.clientCountry && (
                        <p className="text-xs text-slate-500">{review.clientCountry}</p>
                      )}
                    </div>
                  </div>
                  {review.source === 'FIVERR' && <FiverrBadge />}
                </div>

                <Stars rating={review.rating} />

                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {review.projectTitle && (
                  <p className="mt-4 text-xs font-medium text-slate-400 border-t border-slate-100 pt-4">
                    Project: {review.projectTitle}
                  </p>
                )}
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  )
}
