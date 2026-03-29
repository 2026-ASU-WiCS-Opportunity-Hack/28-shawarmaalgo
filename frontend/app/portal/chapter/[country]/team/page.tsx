import { PortalShell } from '@/components/portal/PortalShell';
import ChapterTeamManager from '@/app/portal/chapter/[country]/ChapterTeamManager';
import { api } from '@/lib/api';
import { getManagedUsersRaw, requireChapterPortalAccess } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterTeamPage({ params }: { params: { country: string } }) {
  const { chapter } = await requireChapterPortalAccess(params.country, {
    allowedRoles: ['chapter_lead'],
    pathSuffix: '/team'
  });

  const [teamMembersResponse, users, coachesResponse] = await Promise.all([
    api.listTeamMembers({ chapter_id: chapter.id }),
    getManagedUsersRaw(),
    api.listCoaches({ page_size: 100, chapter_id: chapter.id })
  ]);

  return (
    <PortalShell
      roleScope="chapter"
      eyebrow="Chapter leader console"
      title={`${chapter.name} team management`}
      description="Maintain public chapter leadership cards, assign additional chapter leaders, and create coaches under this chapter."
      chapterSlug={chapter.slug}
    >
      <ChapterTeamManager
        chapter={chapter}
        initialTeamMembers={teamMembersResponse.data}
        initialUsers={users.filter((user) => user.chapter_id === chapter.id)}
        initialCoaches={coachesResponse.data}
      />
    </PortalShell>
  );
}
