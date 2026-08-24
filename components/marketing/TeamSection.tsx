import { Github, Linkedin } from 'lucide-react'
import { getPublishedTeam } from '@/lib/site-data'
import { AnimateIn, StaggerGrid, StaggerItem } from '@/components/marketing/AnimateIn'

export async function TeamSection() {
  const members = await getPublishedTeam()

  if (members.length === 0) return null

  return (
    <section id="team" className="bg-surface-50 py-20 sm:py-28 border-t border-navy-200">
      <div className="container-page">
        <AnimateIn className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-bold uppercase tracking-widest text-navy-700 mb-3">
            Our team
          </p>
          <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">
            Engineers behind Druporia
          </h2>
          <p className="mt-4 text-navy-600">
            Developers and specialists building plugins, apps, and automation for
            global clients.
          </p>
        </AnimateIn>

        <StaggerGrid className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <StaggerItem key={member.id}>
              <article className="group card-hover overflow-hidden text-center">
                <div className="relative bg-gradient-to-br from-navy-950 via-navy-950 to-navy-900 px-6 pb-16 pt-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.35),transparent_45%)] opacity-80" />
                  <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-white/20 bg-white/10 p-1.5 shadow-2xl shadow-navy-950/40 backdrop-blur">
                    <div className="h-full w-full overflow-hidden rounded-full bg-navy-900 ring-4 ring-white/90">
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
                <div className="-mt-10 p-6 pt-0">
                  <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-transparent" />
                  <h3 className="text-lg font-bold text-navy-900">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-navy-700">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-navy-600 line-clamp-4">
                    {member.bio}
                  </p>
                  <div className="mt-4 flex justify-center gap-3">
                    {member.linkedInUrl && (
                      <a
                        href={member.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-navy-200 p-2 text-navy-500 hover:border-navy-300 hover:text-navy-700 transition-colors"
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
                        className="rounded-full border border-navy-200 p-2 text-navy-500 hover:border-navy-300 hover:text-navy-700 transition-colors"
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
