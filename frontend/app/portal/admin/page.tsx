import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Panel, StatCard } from '@/components/portal/PortalCards';
import { getAdminOverview, getGlobalPages, getChapters } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const overview = await getAdminOverview();
  const pages = await getGlobalPages();
  const chapters = await getChapters();

  return (
    <PortalShell
      eyebrow="Admin console"
      title="Global network administration"
      description="Create and configure chapters, assign chapter leaders, maintain global pages, review coach visibility, and keep the entire WIAL network aligned from one place."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Chapters" value={overview.chapters} />
        <StatCard label="Active coaches" value={overview.activeCoaches} />
        <StatCard label="Upcoming events" value={overview.upcomingEvents} />
        <StatCard label="Pending approvals" value={overview.pendingApprovals} />
        <StatCard label="Global page updates" value={overview.pageUpdates} />
        <StatCard label="Chapter leaders" value={overview.chapterLeaders} />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Chapter provisioning" description="Administrators can launch new chapters from the shared template, assign leadership, and control publishing status.">
          <div className="grid gap-4 md:grid-cols-2">
            {chapters.map((chapter) => (
              <div key={chapter.slug} className="rounded-[1.25rem] border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-brand-navy">{chapter.name}</h3>
                <p className="mt-1 text-sm text-slate-600">/{chapter.slug}</p>
                <div className="mt-4 flex gap-4 text-sm font-semibold">
                  <Link href={`/portal/admin/chapters/${chapter.slug}`} className="text-brand-navy hover:text-brand-teal">Manage</Link>
                  <Link href={`/${chapter.slug}`} className="text-brand-navy hover:text-brand-teal">View public page</Link>
                </div>
              </div>
            ))}
          </div>
          <Link href="/portal/admin/chapters/new" className="mt-5 inline-flex rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Create new chapter</Link>
        </Panel>

        <Panel title="Global pages" description="Shared pages are centrally managed and inherited across the platform where appropriate.">
          <div className="space-y-3">
            {pages.map((page) => (
              <div key={page.slug} className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-brand-navy">{page.title}</p>
                  <p className="text-sm text-slate-600">{page.status} • Updated {page.lastUpdated}</p>
                </div>
                <Link href="/portal/admin/pages" className="text-sm font-semibold text-brand-navy hover:text-brand-teal">Edit</Link>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PortalShell>
  );
}
