import { PortalShell } from '@/components/portal/PortalShell';
import { Panel, StatCard } from '@/components/portal/PortalCards';
import { buttonClassName } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getAdminOverview } from '@/lib/server-data';
import AdminChapterSitesManager from '@/app/portal/admin/chapters/AdminChapterSitesManager';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const [overview, chaptersResponse] = await Promise.all([getAdminOverview(), api.listChapters({ page_size: 100 })]);
  const chapters = chaptersResponse.data;

  return (
    <PortalShell
      roleScope="admin"
      eyebrow="Admin console"
      title="Global network administration"
      description="Create and configure chapters, assign leadership, review coach visibility, and keep the entire WIAL network aligned from one place."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Chapters" value={overview.chapters} />
        <StatCard label="Active coaches" value={overview.activeCoaches} />
        <StatCard label="Upcoming events" value={overview.upcomingEvents} />
        <StatCard label="Chapter leaders" value={overview.chapterLeaders} />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Chapter provisioning" description="Administrators can launch new chapters from the shared template, assign leadership, and remove retired chapter sites from the admin console.">
          <AdminChapterSitesManager initialChapters={chapters} mode="cards" />
        </Panel>

        <div className="grid gap-8">
          <Panel title="User access management" description="Open the user management workspace to create and delete managed users through the API-connected admin console.">
            <Link href="/portal/admin/users" className={buttonClassName()}>
              Manage users
            </Link>
          </Panel>
        </div>
      </div>
    </PortalShell>
  );
}
