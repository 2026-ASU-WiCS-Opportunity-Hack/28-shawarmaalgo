import { PortalShell } from '@/components/portal/PortalShell';
import { Field, Panel, StatCard } from '@/components/portal/PortalCards';
import { getCoachAccount } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

export default async function CoachPortalPage() {
  const account = await getCoachAccount();
  const { profile, certification } = account;

  return (
    <PortalShell
      eyebrow="Coach account"
      title="Manage your coach profile"
      description="Update your public profile, review certification standing, and keep your chapter presence current for the WIAL directory and chapter pages."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Certification level" value={profile.certification} />
        <StatCard label="CE credits" value={`${certification.continuingEducationCredits}/${certification.requiredCredits}`} />
        <StatCard label="Renewal due" value={certification.renewalDue} />
      </div>
      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <Panel title="Profile details">
          <form className="grid gap-4">
            <Field label="Name" defaultValue={profile.name} />
            <Field label="Email" defaultValue={profile.email} />
            <Field label="Location" defaultValue={profile.location} />
            <Field label="Certification" defaultValue={profile.certification} />
            <Field label="Bio" textarea defaultValue={profile.bio} />
            <button className="w-fit rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink">Save profile</button>
          </form>
        </Panel>
        <Panel title="Certification status" description={certification.status}>
          <div className="space-y-3 text-sm leading-7 text-slate-700">
            <p><span className="font-semibold text-brand-navy">Current level:</span> {certification.currentLevel}</p>
            <p><span className="font-semibold text-brand-navy">Renewal due:</span> {certification.renewalDue}</p>
            <p><span className="font-semibold text-brand-navy">Continuing education:</span> {certification.continuingEducationCredits} of {certification.requiredCredits} credits completed</p>
            <p><span className="font-semibold text-brand-navy">Chapter:</span> {profile.chapter}</p>
          </div>
        </Panel>
      </div>
    </PortalShell>
  );
}
