import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Field, Panel } from '@/components/portal/PortalCards';
import { getChapter } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterResourcesPage({ params }: { params: { country: string } }) {
  const chapter = await getChapter(params.country);
  if (!chapter) notFound();
  return (
    <PortalShell eyebrow="Chapter leader console" title={`${chapter.name} resources`} description="Manage local chapter guides, downloads, and supporting materials displayed on the chapter resources page." chapterSlug={chapter.slug}>
      <div className="grid gap-6 xl:grid-cols-2">
        {chapter.resources.map((resource) => (
          <Panel key={resource.title} title={resource.title} description={resource.type}>
            <div className="grid gap-4">
              <Field label="Resource title" defaultValue={resource.title} />
              <Field label="Type" defaultValue={resource.type} />
              <Field label="Summary" textarea defaultValue={resource.summary} />
              <div className="flex gap-3">
                <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Save resource</button>
                <button className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">Delete</button>
              </div>
            </div>
          </Panel>
        ))}
        <Panel title="Add a new resource">
          <div className="grid gap-4">
            <Field label="Resource title" placeholder="Canada chapter guide" />
            <Field label="Type" placeholder="Guide" />
            <Field label="Summary" textarea placeholder="Describe the resource." />
            <button className="w-fit rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Add resource</button>
          </div>
        </Panel>
      </div>
    </PortalShell>
  );
}
