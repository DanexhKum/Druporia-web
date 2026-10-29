import Image from 'next/image'
import { SectionHeading } from '@/components/ui/Section'

export interface TeamMemberData {
  name: string
  role: string
  bio: string
  avatarUrl?: string | null
  linkedInUrl?: string | null
  githubUrl?: string | null
}

// Hosts allowed in next.config images.remotePatterns; anything else
// is served unoptimized so an unexpected host can't break the page.
const OPTIMIZED_HOSTS = [/\.supabase\.co$/, /\.amazonaws\.com$/, /^img\.clerk\.com$/, /^media\.licdn\.com$/]

function isOptimizable(src: string) {
  if (src.startsWith('/')) return true
  try {
    const { hostname, protocol } = new URL(src)
    return protocol === 'https:' && OPTIMIZED_HOSTS.some((re) => re.test(hostname))
  } catch {
    return false
  }
}

const pill =
  'rounded-full border border-line-chip px-3.5 py-[7px] text-[13px] font-medium text-ink transition-colors hover:bg-surface'

export function TeamSection({ members }: { members: TeamMemberData[] }) {
  if (members.length === 0) return null

  return (
    <section id="team" className="container-page scroll-mt-20 pb-20 pt-6 desk:pb-[104px]">
      <SectionHeading
        eyebrow="Team"
        title="The people you’ll work with"
        description="No account managers in between — you talk directly to the engineers writing your code."
        layout="split"
        className="mb-11"
      />
      <ul className="grid gap-10 tab:grid-cols-2 tab:gap-6 desk:grid-cols-3">
        {members.map((member) => (
          <li key={member.name} className="flex flex-col gap-[18px]">
            <div className="relative aspect-square overflow-hidden rounded-card bg-surface-photo">
              {member.avatarUrl ? (
                <Image
                  src={member.avatarUrl}
                  alt={`Portrait of ${member.name}`}
                  fill
                  sizes="(min-width: 1025px) 380px, (min-width: 641px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized={!isOptimizable(member.avatarUrl)}
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-6xl font-semibold text-muted-soft" aria-hidden="true">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-[22px] font-semibold tracking-[-0.02em]">{member.name}</h3>
              <p className="mt-1.5 text-sm font-medium text-orange-text">{member.role}</p>
              <p className="mt-3 text-[15px] leading-[1.6] text-body">{member.bio}</p>
            </div>
            {(member.linkedInUrl || member.githubUrl) && (
              <div className="flex gap-2">
                {member.linkedInUrl && (
                  <a href={member.linkedInUrl} target="_blank" rel="noopener noreferrer" className={pill}>
                    LinkedIn<span className="sr-only"> profile of {member.name}</span>
                  </a>
                )}
                {member.githubUrl && (
                  <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className={pill}>
                    GitHub<span className="sr-only"> profile of {member.name}</span>
                  </a>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
