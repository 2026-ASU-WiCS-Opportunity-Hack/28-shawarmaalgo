import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Field, Panel } from '@/components/portal/PortalCards';
import { getChapter } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterCoachesPage({ params }: { params: { country: string } }) {
  const chapter = await getChapter(params.country);
  if (!chapter) notFound();
  return (
    <PortalShell roleScope="chapter" eyebrow="Chapter leader console" title={`${chapter.name} coaches`} description="Review coach profiles, update featured specialists, and coordinate visibility for chapter-level and global directory listings." chapterSlug={chapter.slug}>
      <div className="grid gap-6 xl:grid-cols-2">
        {chapter.coaches.map((coach) => (
          <Panel key={coach.name} title={coach.name} description={`${coach.certification} • ${coach.location}`}>
            <div className="grid gap-4">
              <Field label="Name" defaultValue={coach.name} />
              <Field label="Certification" defaultValue={coach.certification} />
              <Field label="Focus" defaultValue={coach.focus} />
              <Field label="Bio" textarea defaultValue={coach.bio} />
              <div className="flex gap-3">
                <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink">Save coach</button>
                <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink">Archive</button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </PortalShell>
  );
}
