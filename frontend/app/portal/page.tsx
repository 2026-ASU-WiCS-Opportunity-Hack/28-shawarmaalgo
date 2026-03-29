import { redirect } from 'next/navigation';
import { getServerRole } from '@/lib/auth';
import { getRoleDestination } from '@/lib/auth-routing';

export default function PortalLandingPage() {
  redirect(getRoleDestination(getServerRole()) || '/login');
}
