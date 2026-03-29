import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import ChapterEventsManager from '@/app/portal/chapter/[country]/ChapterEventsManager';
import { api } from '@/lib/api';
import { getChapterRecord } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterEventsPage({ params }: { params: { country: string } }) {
  const chapter = await getChapterRecord(params.country);
  if (!chapter) notFound();
  const events = await api.listEvents({ page_size: 100, chapter_id: chapter.id });

  return (
    <PortalShell
      roleScope="chapter"
      eyebrow="Chapter leader console"
      title={`${chapter.name} events`}
      description="Create, edit, and remove chapter events that appear on the public chapter events page."
      chapterSlug={chapter.slug}
    >
      <ChapterEventsManager chapter={chapter} initialEvents={events.data} />
    </PortalShell>
  );
}
