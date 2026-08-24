import { Github, Linkedin } from 'lucide-react'
import { getPublishedTeam } from '@/lib/site-data'
import { AnimateIn, StaggerGrid, StaggerItem } from '@/components/marketing/AnimateIn'

export async function TeamSection() {
  const members = await getPublishedTeam()

  if (members.length === 0) return null

  return (
    <section id="team" className="bg-ink-950 py-16 sm:py-24 border-t border-white/10">
      <div className="container-page">
        <AnimateIn className="text-center max-w-2xl mx-auto mb-14">
          <p className="chip">
            Our team
          </p>
          <h2 className="heading-dark mt-5">
            Engineers behind Druporia
          </h2>
          <p className="mt-4 text-white/55">
            Developers and specialists building plugins, apps, and automation for
            global clients.
          </p>
        </AnimateIn>

        <StaggerGrid className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <StaggerItem key={member.id}>
              <article className="group card-dark-hover sweep-host overflow-hidden text-center">
                <div className="relative bg-gradient-to-br from-ink-990 via-ink-950 to-ink-950 px-6 pb-8 pt-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_50%)] opacity-80" />
                  <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-white/20 bg-white/10 p-1.5 shadow-2xl shadow-black/60 backdrop-blur">
                    <div className="h-full w-full overflow-hidden rounded-full bg-ink-950 ring-4 ring-white/15">
                      {member.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white/70">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-white/80">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/55 line-clamp-4">
                    {member.bio}
                  </p>
                  <div className="mt-4 flex justify-center gap-3">
                    {member.linkedInUrl && (
                      <a
                        href={member.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-white/10 p-2 text-white/55 hover:border-white/15 hover:text-white/80 transition-colors"
                        aria-label={`${member.name} on LinkedIn`}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-white/10 p-2 text-white/55 hover:border-white/15 hover:text-white/80 transition-colors"
                        aria-label={`${member.name} on GitHub`}
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  )
}
