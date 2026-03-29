import { PortalShell } from '@/components/portal/PortalShell';
import ChapterContentManager from '@/app/portal/chapter/[country]/ChapterContentManager';
import { requireChapterPortalAccess } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterContentPage({ params }: { params: { country: string } }) {
  const { chapter } = await requireChapterPortalAccess(params.country, {
    allowedRoles: ['chapter_lead', 'content_creator'],
    pathSuffix: '/content'
  });

  return (
    <PortalShell
      roleScope="chapter"
      eyebrow="Chapter leader console"
      title={`${chapter.name} content editor`}
      description="Adjust the chapter homepage copy and supporting chapter details that appear on the public chapter page."
      chapterSlug={chapter.slug}
    >
      <ChapterContentManager chapter={chapter} />
    </PortalShell>
  );
}
