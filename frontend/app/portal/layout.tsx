import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerAuthToken, getServerRole } from '@/lib/auth';
import { getRoleDestination } from '@/lib/auth-routing';

export const dynamic = 'force-dynamic';

export default function PortalLayout({ children }: { children: ReactNode }) {
  const token = getServerAuthToken();

  if (!token) {
    redirect('/login');
  }

  const destination = getRoleDestination(getServerRole());
  if (!destination) {
    redirect('/login');
  }

  return children;
}
