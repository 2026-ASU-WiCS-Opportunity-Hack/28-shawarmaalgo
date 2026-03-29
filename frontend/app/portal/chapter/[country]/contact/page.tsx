import { PortalShell } from '@/components/portal/PortalShell';
import ChapterContactManager from '@/app/portal/chapter/[country]/ChapterContactManager';
import { requireChapterPortalAccess } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterContactPage({ params }: { params: { country: string } }) {
  const { chapter } = await requireChapterPortalAccess(params.country, {
    allowedRoles: ['chapter_lead'],
    pathSuffix: '/contact'
  });

  return (
    <PortalShell
      roleScope="chapter"
      eyebrow="Chapter leader console"
      title={`${chapter.name} contact details`}
      description="Update the contact information shown on the public chapter contact page."
      chapterSlug={chapter.slug}
    >
      <ChapterContactManager chapter={chapter} />
    </PortalShell>
  );
}
