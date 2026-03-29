import { PortalShell } from '@/components/portal/PortalShell';
import AdminGlobalPagesManager from '@/app/portal/admin/pages/AdminGlobalPagesManager';
import { getGlobalPages } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function AdminPagesPage() {
  const pages = await getGlobalPages();

  return (
    <PortalShell
      roleScope="admin"
      eyebrow="Admin console"
      title="Global page management"
      description="Maintain shared public content for pages such as Home, About, Action Learning, Certification, Resources, and Contact."
    >
      <AdminGlobalPagesManager initialPages={pages} />
    </PortalShell>
  );
}
