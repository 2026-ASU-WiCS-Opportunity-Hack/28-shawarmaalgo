import { PortalShell } from '@/components/portal/PortalShell';
import AdminGlobalPagesManager from './AdminGlobalPagesManager';
import { getGlobalPages } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

const editableSlugs = new Set(['home', 'about', 'certification', 'resources']);

export default async function AdminPagesPage() {
  const pages = (await getGlobalPages()).filter((page) => editableSlugs.has(page.slug));

  return (
    <PortalShell
      roleScope="admin"
      eyebrow="Admin console"
      title="Global page management"
      description="Edit shared content for the core public pages and publish updates across the main WIAL site."
    >
      <AdminGlobalPagesManager initialPages={pages} />
    </PortalShell>
  );
}
