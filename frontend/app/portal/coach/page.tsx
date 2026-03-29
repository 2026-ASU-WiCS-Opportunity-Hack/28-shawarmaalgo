import { PortalShell } from '@/components/portal/PortalShell';
import CoachAccountManager from '@/app/portal/coach/CoachAccountManager';
import { getCoachAccount } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function CoachPortalPage() {
  const account = await getCoachAccount();

  return (
    <PortalShell
      roleScope="coach"
      eyebrow="Coach account"
      title="Manage your coach profile"
      description="Update your public profile, review certification standing, and keep your chapter presence current for the WIAL directory and chapter pages."
    >
      <CoachAccountManager account={account} />
    </PortalShell>
  );
}
