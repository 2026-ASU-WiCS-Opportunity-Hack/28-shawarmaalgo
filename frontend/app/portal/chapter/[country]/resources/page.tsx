import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import ChapterResourcesManager from '@/app/portal/chapter/[country]/ChapterResourcesManager';
import { api } from '@/lib/api';
import { getChapterRecord } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterResourcesPage({ params }: { params: { country: string } }) {
  const chapter = await getChapterRecord(params.country);
  if (!chapter) notFound();
  const resources = await api.listResources({ chapter_id: chapter.id });

  return (
    <PortalShell
      roleScope="chapter"
      eyebrow="Chapter leader console"
      title={`${chapter.name} resources`}
      description="Manage chapter downloads, guides, and supporting links that appear on the public chapter resources page."
      chapterSlug={chapter.slug}
    >
      <ChapterResourcesManager chapter={chapter} initialResources={resources.data} />
    </PortalShell>
  );
}
