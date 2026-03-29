import { PortalShell } from '@/components/portal/PortalShell';
import AdminUserManagement from '@/app/portal/admin/users/AdminUserManagement';
import { getChapterOptions, getCoachProfilesRaw, getManagedUsersRaw } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const [users, chapters, coaches] = await Promise.all([getManagedUsersRaw(), getChapterOptions(), getCoachProfilesRaw()]);

  return (
    <PortalShell
      roleScope="admin"
      eyebrow="Admin console"
      title="User access and roles"
      description="Create and delete chapter leaders, content creators, and coaches directly from the admin console using the managed users API."
    >
      <AdminUserManagement initialUsers={users} initialCoaches={coaches} chapters={chapters} />
    </PortalShell>
  );
}
