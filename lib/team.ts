import { getPublishedTeam } from '@/lib/site-data'
import { DEFAULT_TEAM } from '@/lib/site-content'
import type { TeamMemberData } from '@/components/marketing/TeamSection'

// Copy and links come from DEFAULT_TEAM; photos (and any extra members)
// come from the admin-managed team records. If the database is
// unreachable the defaults render on their own.
export async function getTeamMembers(): Promise<TeamMemberData[]> {
  let managedTeam: Awaited<ReturnType<typeof getPublishedTeam>> = []
  try {
    managedTeam = await getPublishedTeam()
  } catch (error) {
    console.error('[team] query failed, using defaults', error)
  }

  const key = (name: string) => name.trim().toLowerCase()
  const managedByName = new Map(managedTeam.map((m) => [key(m.name), m]))
  const defaultNames = new Set(DEFAULT_TEAM.map((d) => key(d.name)))

  return [
    ...DEFAULT_TEAM.map((member) => {
      const managed = managedByName.get(key(member.name))
      return {
        ...member,
        avatarUrl: managed?.avatarUrl ?? null,
        linkedInUrl: member.linkedInUrl || managed?.linkedInUrl,
        githubUrl: member.githubUrl || managed?.githubUrl,
      }
    }),
    ...managedTeam
      .filter((m) => !defaultNames.has(key(m.name)))
      .map((m) => ({
        name: m.name,
        role: m.role,
        bio: m.bio,
        avatarUrl: m.avatarUrl,
        linkedInUrl: m.linkedInUrl,
        githubUrl: m.githubUrl,
      })),
  ]
}
