import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerRole } from '@/lib/auth';
import { getRoleDestination } from '@/lib/auth-routing';

export default function PortalChapterLayout({ children }: { children: ReactNode }) {
  const role = getServerRole();

  if (role !== 'chapter_lead' && role !== 'content_creator') {
    redirect(getRoleDestination(role) || '/login');
  }

  return children;
}
