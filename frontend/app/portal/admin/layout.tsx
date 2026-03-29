import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerRole } from '@/lib/auth';
import { getRoleDestination } from '@/lib/auth-routing';

export default function PortalAdminLayout({ children }: { children: ReactNode }) {
  const role = getServerRole();

  if (role !== 'super_admin' && role !== 'admin') {
    redirect(getRoleDestination(role) || '/login');
  }

  return children;
}
