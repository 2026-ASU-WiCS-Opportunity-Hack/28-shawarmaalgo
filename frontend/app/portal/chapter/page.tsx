import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Panel, StatCard } from '@/components/portal/PortalCards';
import { getPortalChapterWorkspace } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function ChapterPortalPage() {
  const { chapter, stats } = await getPortalChapterWorkspace();
  if (!chapter) return null;

  return (
    <PortalShell
      roleScope="chapter"
      eyebrow="Chapter leader console"
      title={`${chapter.name} workspace`}
      description="Edit local content, manage team members and coaches, publish events and resources, and keep chapter contact information current without touching code."
      chapterSlug={chapter.slug}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Team members" value={chapter.team.length} />
        <StatCard label="Visible coaches" value={stats.coachCount} />
        <StatCard label="Upcoming events" value={stats.eventCount} />
      </div>
      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <Panel title="Quick actions">
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href={`/portal/chapter/${chapter.slug}/content`} className="rounded-[1.25rem] border border-slate-200 p-4 text-sm font-semibold text-brand-navy">Edit chapter content</Link>
            <Link href={`/portal/chapter/${chapter.slug}/team`} className="rounded-[1.25rem] border border-slate-200 p-4 text-sm font-semibold text-brand-navy">Manage team</Link>
            <Link href={`/portal/chapter/${chapter.slug}/coaches`} className="rounded-[1.25rem] border border-slate-200 p-4 text-sm font-semibold text-brand-navy">Manage coaches</Link>
            <Link href={`/portal/chapter/${chapter.slug}/events`} className="rounded-[1.25rem] border border-slate-200 p-4 text-sm font-semibold text-brand-navy">Manage events</Link>
            <Link href={`/portal/chapter/${chapter.slug}/resources`} className="rounded-[1.25rem] border border-slate-200 p-4 text-sm font-semibold text-brand-navy">Manage resources</Link>
            <Link href={`/portal/chapter/${chapter.slug}/contact`} className="rounded-[1.25rem] border border-slate-200 p-4 text-sm font-semibold text-brand-navy">Update contact details</Link>
          </div>
        </Panel>
        <Panel title="Publishing controls" description="Chapter leaders should be able to save drafts, preview updates, and publish when changes are ready.">
          <ul className="space-y-3 text-sm leading-7 text-slate-700">
            <li>Hero copy and chapter overview fields</li>
            <li>Team member roster and local contact information</li>
            <li>Chapter coach visibility and featured listings</li>
            <li>Events, resources, and testimonials</li>
          </ul>
        </Panel>
      </div>
    </PortalShell>
  );
}
