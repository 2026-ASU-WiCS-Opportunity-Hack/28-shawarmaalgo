import { PortalShell } from '@/components/portal/PortalShell';
import { Panel } from '@/components/portal/PortalCards';
import { getUsers } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <PortalShell
      eyebrow="Admin console"
      title="User access and roles"
      description="Manage administrators, chapter leaders, and coaches, including status, chapter assignment, and role-based platform access."
    >
      <Panel title="Platform users">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Chapter</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100">
                  <td className="px-4 py-4 font-semibold text-brand-navy">{user.name}</td>
                  <td className="px-4 py-4 text-slate-600">{user.role}</td>
                  <td className="px-4 py-4 text-slate-600">{user.chapter}</td>
                  <td className="px-4 py-4 text-slate-600">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PortalShell>
  );
}
