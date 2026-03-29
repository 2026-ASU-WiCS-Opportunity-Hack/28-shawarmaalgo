import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import ChapterCoachesManager from '@/app/portal/chapter/[country]/ChapterCoachesManager';
import { api } from '@/lib/api';
import { getChapterRecord } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterCoachesPage({ params }: { params: { country: string } }) {
  const chapter = await getChapterRecord(params.country);
  if (!chapter) notFound();
  const coaches = await api.listCoaches({ page_size: 100, chapter_id: chapter.id });

  return (
    <PortalShell
      roleScope="chapter"
      eyebrow="Chapter leader console"
      title={`${chapter.name} coaches`}
      description="Update chapter coach profiles and control whether they appear on the public chapter coach page."
      chapterSlug={chapter.slug}
    >
      <ChapterCoachesManager chapter={chapter} initialCoaches={coaches.data} />
    </PortalShell>
  );
}
