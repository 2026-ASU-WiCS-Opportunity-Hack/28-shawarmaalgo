import { PortalShell } from '@/components/portal/PortalShell';
import AdminUserManagement from '@/app/portal/admin/users/AdminUserManagement';
import { getChapterOptions, getManagedUsersRaw } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const [users, chapters] = await Promise.all([getManagedUsersRaw(), getChapterOptions()]);

  return (
    <PortalShell
      eyebrow="Admin console"
      title="User access and roles"
      description="Create and delete chapter leaders, content creators, and coaches directly from the admin console using the managed users API."
    >
      <AdminUserManagement initialUsers={users} chapters={chapters} />
    </PortalShell>
  );
}
