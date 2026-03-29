'use client';

import { useState } from 'react';
import { Field, Panel, StatCard } from '@/components/portal/PortalCards';
import { api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type CoachAccountData = {
  coachId: string | null;
  profile: {
    name: string;
    email: string;
    chapter: string;
    certification: string;
    location: string;
    specialties: string[];
    bio: string;
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    languages: string[];
    linkedinUrl: string;
    websiteUrl: string;
  };
  certification: {
    currentLevel: string;
    renewalDue: string;
    continuingEducationCredits: number;
    requiredCredits: number;
    status: string;
  };
};

function parseList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export default function CoachAccountManager({ account }: { account: CoachAccountData }) {
  const [form, setForm] = useState({
    firstName: account.profile.firstName,
    lastName: account.profile.lastName,
    city: account.profile.city,
    country: account.profile.country,
    specialties: account.profile.specialties.join(', '),
    languages: account.profile.languages.join(', '),
    bio: account.profile.bio,
    linkedinUrl: account.profile.linkedinUrl,
    websiteUrl: account.profile.websiteUrl
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const token = getClientAuthToken();
      if (!token) {
        throw new Error('Your session has expired. Please log in again.');
      }
      if (!account.coachId) {
        throw new Error('This coach account does not have a linked public profile yet.');
      }

      await api.patchMyCoach(
        {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          city: optionalString(form.city),
          country: form.country.trim(),
          specializations: parseList(form.specialties),
          languages: parseList(form.languages),
          bio: optionalString(form.bio),
          linkedin_url: optionalString(form.linkedinUrl),
          website_url: optionalString(form.websiteUrl)
        },
        token
      );

      setSuccess('Your coach profile has been updated.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save coach profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Certification level" value={account.profile.certification} />
        <StatCard label="CE credits" value={`${account.certification.continuingEducationCredits}/${account.certification.requiredCredits}`} />
        <StatCard label="Profile status" value={account.certification.status} />
      </div>
      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <Panel title="Profile details">
          <div className="grid gap-4">
            <Field label="First name" value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} />
            <Field label="Last name" value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} />
            <Field label="Email" defaultValue={account.profile.email} disabled />
            <Field label="Chapter" defaultValue={account.profile.chapter} disabled />
            <Field label="Certification" defaultValue={account.profile.certification} disabled />
            <Field label="Country" value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))} />
            <Field label="City" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
            <Field label="Specialties" value={form.specialties} onChange={(event) => setForm((current) => ({ ...current, specialties: event.target.value }))} />
            <Field label="Languages" value={form.languages} onChange={(event) => setForm((current) => ({ ...current, languages: event.target.value }))} />
            <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={(event) => setForm((current) => ({ ...current, linkedinUrl: event.target.value }))} />
            <Field label="Website URL" value={form.websiteUrl} onChange={(event) => setForm((current) => ({ ...current, websiteUrl: event.target.value }))} />
            <Field label="Bio" textarea value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
            <button type="button" className="w-fit rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink disabled:cursor-not-allowed disabled:opacity-60" onClick={handleSave} disabled={saving || !account.coachId}>
              {saving ? 'Saving profile...' : 'Save profile'}
            </button>
          </div>
        </Panel>
        <Panel title="Certification status" description={account.certification.status}>
          <div className="space-y-3 text-sm leading-7 text-slate-700">
            <p><span className="font-semibold text-brand-navy">Current level:</span> {account.certification.currentLevel}</p>
            <p><span className="font-semibold text-brand-navy">Certification date:</span> {account.certification.renewalDue}</p>
            <p><span className="font-semibold text-brand-navy">Continuing education:</span> {account.certification.continuingEducationCredits} of {account.certification.requiredCredits} credits completed</p>
            <p><span className="font-semibold text-brand-navy">Chapter:</span> {account.profile.chapter}</p>
          </div>
        </Panel>
      </div>
    </>
  );
}
