import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Panel } from '@/components/portal/PortalCards';
import { api } from '@/lib/api';
import AdminChapterSitesManager from '@/app/portal/admin/chapters/AdminChapterSitesManager';

export const dynamic = 'force-dynamic';

export default async function AdminChaptersPage() {
  const chapters = await api.listChapters({ page_size: 100 });

  return (
    <PortalShell
      roleScope="admin"
      eyebrow="Admin console"
      title="Chapter management"
      description="Review every chapter, open chapter settings, provision new chapter sites, and delete chapter sites from the shared admin console."
    >
      <Panel title="All chapters" description="Each chapter inherits the core global template while retaining local content areas for leadership, coaches, events, resources, and contact information.">
        <div className="mb-5 flex justify-end">
          <Link href="/portal/admin/chapters/new" className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink">Create new chapter</Link>
        </div>
        <AdminChapterSitesManager initialChapters={chapters.data} mode="table" />
      </Panel>
    </PortalShell>
  );
}
