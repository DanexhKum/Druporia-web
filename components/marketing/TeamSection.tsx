import Image from 'next/image'
import { Tag } from '@/components/ui/Card'
import { SectionHeading } from '@/components/ui/Section'
import { TEAM_INTRO } from '@/lib/site-content'

export interface TeamMemberData {
  name: string
  role: string
  bio: string
  focus?: string[]
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

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

const pill =
  'rounded-full border border-line-chip bg-canvas px-3.5 py-[7px] text-[13px] font-medium text-ink transition-colors hover:border-line-strong hover:bg-surface-hover'

export function TeamSection({ members }: { members: TeamMemberData[] }) {
  if (members.length === 0) return null

  return (
    <section id="team" className="container-page scroll-mt-20 pb-20 pt-6 desk:pb-[104px]">
      <SectionHeading
        eyebrow="Team"
        title={TEAM_INTRO.title}
        description={TEAM_INTRO.description}
        layout="split"
        className="mb-11"
      />
      <ul className="grid gap-4 tab:grid-cols-2 desk:grid-cols-3">
        {members.map((member) => (
          <li key={member.name} className="card-surface flex flex-col p-7 tab:p-8">
            <div className="relative h-28 w-28 overflow-hidden rounded-full bg-canvas ring-4 ring-canvas">
              {member.avatarUrl ? (
                <Image
                  src={member.avatarUrl}
                  alt={`Portrait of ${member.name}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                  unoptimized={!isOptimizable(member.avatarUrl)}
                />
              ) : (
                <div
                  className="grid h-full w-full place-items-center bg-brand text-[34px] font-semibold tracking-[-0.02em] text-white"
                  aria-hidden="true"
                >
                  {initials(member.name)}
                </div>
              )}
            </div>

            <h3 className="mt-6 text-[22px] font-semibold tracking-[-0.02em]">{member.name}</h3>
            <p className="mt-1.5 text-sm font-medium text-orange-text">{member.role}</p>
            <p className="mt-4 text-[15px] leading-[1.65] text-body">{member.bio}</p>

            {member.focus && member.focus.length > 0 && (
              <div className="mt-5">
                <p className="text-[13px] font-medium text-muted">Works on</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {member.focus.map((item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(member.linkedInUrl || member.githubUrl) && (
              <div className="mt-auto flex gap-2 pt-6">
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
