import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Field, Panel } from '@/components/portal/PortalCards';
import { getChapter } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterContentPage({ params }: { params: { country: string } }) {
  const chapter = await getChapter(params.country);
  if (!chapter) notFound();

  return (
    <PortalShell
      eyebrow="Chapter leader console"
      title={`${chapter.name} content editor`}
      description="Adjust the chapter homepage copy, local introduction, and featured messaging from structured fields that map directly to the public chapter pages."
      chapterSlug={chapter.slug}
    >
      <Panel title="Chapter homepage content">
        <form className="grid gap-4">
          <Field label="Eyebrow" defaultValue={chapter.hero.eyebrow} />
          <Field label="Hero title" defaultValue={chapter.hero.title} />
          <Field label="Hero description" textarea defaultValue={chapter.hero.description} />
          <Field label="Overview" textarea defaultValue={chapter.overview} />
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Save draft</button>
            <button className="rounded-full border border-brand-navy px-5 py-3 text-sm font-semibold text-brand-navy">Publish changes</button>
          </div>
        </form>
      </Panel>
    </PortalShell>
  );
}
