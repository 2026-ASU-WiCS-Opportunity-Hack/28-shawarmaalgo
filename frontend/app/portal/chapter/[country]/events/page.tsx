import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Field, Panel } from '@/components/portal/PortalCards';
import { getChapter } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterEventsPage({ params }: { params: { country: string } }) {
  const chapter = await getChapter(params.country);
  if (!chapter) notFound();
  return (
    <PortalShell eyebrow="Chapter leader console" title={`${chapter.name} events`} description="Create new chapter events, revise schedules, and publish local chapter sessions to the public site and the wider WIAL event experience." chapterSlug={chapter.slug}>
      <div className="grid gap-6 xl:grid-cols-2">
        {chapter.events.map((event) => (
          <Panel key={event.title} title={event.title} description={`${event.date} • ${event.location}`}>
            <div className="grid gap-4">
              <Field label="Title" defaultValue={event.title} />
              <Field label="Date" defaultValue={event.date} />
              <Field label="Location" defaultValue={event.location} />
              <Field label="Summary" textarea defaultValue={event.summary} />
              <div className="flex gap-3">
                <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Save event</button>
                <button className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">Delete</button>
              </div>
            </div>
          </Panel>
        ))}
        <Panel title="Add a new event" description="Create a new chapter event from structured fields.">
          <div className="grid gap-4">
            <Field label="Title" placeholder="Leadership roundtable" />
            <Field label="Date" placeholder="August 24, 2026" />
            <Field label="Location" placeholder="Toronto, Canada" />
            <Field label="Summary" textarea placeholder="Describe the event." />
            <button className="w-fit rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Add event</button>
          </div>
        </Panel>
      </div>
    </PortalShell>
  );
}
