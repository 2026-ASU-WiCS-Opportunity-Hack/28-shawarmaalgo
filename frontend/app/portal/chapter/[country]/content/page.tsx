import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import ChapterContentManager from '@/app/portal/chapter/[country]/ChapterContentManager';
import { getChapterRecord } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterContentPage({ params }: { params: { country: string } }) {
  const chapter = await getChapterRecord(params.country);
  if (!chapter) notFound();

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
