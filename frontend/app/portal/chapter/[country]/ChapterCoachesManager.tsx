'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/portal/PortalCards';
import { type BackendChapter, type BackendCoach, api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type ChapterCoachesManagerProps = {
  chapter: BackendChapter;
  initialCoaches: BackendCoach[];
};

type CoachForm = {
  first_name: string;
  last_name: string;
  certification_level: string;
  certification_date: string;
  city: string;
  country: string;
  phone: string;
  profile_image_url: string;
  linkedin_url: string;
  website_url: string;
  specializations: string;
  languages: string;
  bio: string;
  is_active: boolean;
};

const inputClassName = 'w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm';
const labelClassName = 'mb-2 block text-sm font-medium text-slate-700';
const certificationLevels = ['CALC', 'PALC', 'SALC', 'MALC'];

function parseStringList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildCoachForm(coach: BackendCoach): CoachForm {
  return {
    first_name: coach.first_name,
    last_name: coach.last_name,
    certification_level: coach.certification_level,
    certification_date: coach.certification_date.slice(0, 10),
    city: coach.city || '',
    country: coach.country,
    phone: coach.phone || '',
    profile_image_url: coach.profile_image_url || '',
    linkedin_url: coach.linkedin_url || '',
    website_url: coach.website_url || '',
    specializations: coach.specializations.join(', '),
    languages: coach.languages.join(', '),
    bio: coach.bio || '',
    is_active: coach.is_active
  };
}

function trimOrEmpty(value: string) {
  return value.trim();
}

function validateForm(form: CoachForm) {
  if (!form.first_name.trim()) return 'First name is required.';
  if (!form.last_name.trim()) return 'Last name is required.';
  if (!form.country.trim()) return 'Country is required.';
  if (!form.certification_date) return 'Certification date is required.';
  return null;
}

export default function ChapterCoachesManager({ chapter, initialCoaches }: ChapterCoachesManagerProps) {
  const [coaches, setCoaches] = useState(initialCoaches);
  const [drafts, setDrafts] = useState<Record<string, CoachForm>>(
    Object.fromEntries(initialCoaches.map((coach) => [coach.id, buildCoachForm(coach)]))
  );
  const [savingCoachId, setSavingCoachId] = useState<string | null>(null);
  const [deletingCoachId, setDeletingCoachId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function withToken<T>(action: (token: string) => Promise<T>) {
    const token = getClientAuthToken();
    if (!token) throw new Error('Your session has expired. Please log in again.');
    return action(token);
  }

  async function handleSaveCoach(coachId: string) {
    const form = drafts[coachId];
    if (!form) return;

    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);
    setSavingCoachId(coachId);

    try {
      const updated = await withToken((token) =>
        api.patchCoach(
          coachId,
          {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            certification_level: form.certification_level.trim(),
            certification_date: new Date(`${form.certification_date}T00:00:00`).toISOString(),
            city: trimOrEmpty(form.city),
            country: form.country.trim(),
            phone: trimOrEmpty(form.phone),
            profile_image_url: trimOrEmpty(form.profile_image_url),
            linkedin_url: trimOrEmpty(form.linkedin_url),
            website_url: trimOrEmpty(form.website_url),
            specializations: parseStringList(form.specializations),
            languages: parseStringList(form.languages),
            bio: trimOrEmpty(form.bio),
            is_active: form.is_active,
            chapter_id: chapter.id
          },
          token
        )
      );

      setCoaches((current) => current.map((coach) => (coach.id === updated.id ? updated : coach)));
      setDrafts((current) => ({ ...current, [updated.id]: buildCoachForm(updated) }));
      setSuccess(`Saved ${updated.first_name} ${updated.last_name}.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save coach.');
    } finally {
      setSavingCoachId(null);
    }
  }

  async function handleDeleteCoach(coachId: string) {
    const coach = coaches.find((item) => item.id === coachId);
    if (!coach) return;
    const confirmed = window.confirm(`Delete coach profile for ${coach.first_name} ${coach.last_name}?`);
    if (!confirmed) return;

    setError(null);
    setSuccess(null);
    setDeletingCoachId(coachId);

    try {
      await withToken((token) => api.deleteCoach(coachId, token));
      setCoaches((current) => current.filter((item) => item.id !== coachId));
      setDrafts((current) => {
        const next = { ...current };
        delete next[coachId];
        return next;
      });
      setSuccess(`Deleted ${coach.first_name} ${coach.last_name}.`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete coach.');
    } finally {
      setDeletingCoachId(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {coaches.map((coach) => {
        const form = drafts[coach.id] || buildCoachForm(coach);
        return (
          <Panel key={coach.id} title={`${coach.first_name} ${coach.last_name}`} description={`${coach.certification_level} • ${coach.city || coach.country}`}>
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className={labelClassName}>First name</span>
                  <input className={inputClassName} value={form.first_name} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, first_name: event.target.value } }))} />
                </label>
                <label className="block">
                  <span className={labelClassName}>Last name</span>
                  <input className={inputClassName} value={form.last_name} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, last_name: event.target.value } }))} />
                </label>
                <label className="block">
                  <span className={labelClassName}>Certification level</span>
                  <select className={inputClassName} value={form.certification_level} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, certification_level: event.target.value } }))}>
                    {certificationLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClassName}>Certification date</span>
                  <input className={inputClassName} type="date" value={form.certification_date} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, certification_date: event.target.value } }))} />
                </label>
                <label className="block">
                  <span className={labelClassName}>Country</span>
                  <input className={inputClassName} value={form.country} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, country: event.target.value } }))} />
                </label>
                <label className="block">
                  <span className={labelClassName}>City</span>
                  <input className={inputClassName} value={form.city} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, city: event.target.value } }))} />
                </label>
                <label className="block">
                  <span className={labelClassName}>Phone</span>
                  <input className={inputClassName} value={form.phone} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, phone: event.target.value } }))} />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={form.is_active} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, is_active: event.target.checked } }))} />
                  Visible on the chapter coach page
                </label>
              </div>
              <label className="block">
                <span className={labelClassName}>Specializations</span>
                <input className={inputClassName} value={form.specializations} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, specializations: event.target.value } }))} placeholder="Leadership development, team effectiveness" />
              </label>
              <label className="block">
                <span className={labelClassName}>Languages</span>
                <input className={inputClassName} value={form.languages} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, languages: event.target.value } }))} placeholder="English, French" />
              </label>
              <label className="block">
                <span className={labelClassName}>Profile image URL</span>
                <input className={inputClassName} value={form.profile_image_url} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, profile_image_url: event.target.value } }))} placeholder="https://..." />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className={labelClassName}>LinkedIn URL</span>
                  <input className={inputClassName} value={form.linkedin_url} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, linkedin_url: event.target.value } }))} placeholder="https://linkedin.com/in/..." />
                </label>
                <label className="block">
                  <span className={labelClassName}>Website URL</span>
                  <input className={inputClassName} value={form.website_url} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, website_url: event.target.value } }))} placeholder="https://..." />
                </label>
              </div>
              <label className="block">
                <span className={labelClassName}>Bio</span>
                <textarea className={`${inputClassName} min-h-32`} value={form.bio} onChange={(event) => setDrafts((current) => ({ ...current, [coach.id]: { ...form, bio: event.target.value } }))} />
              </label>
              <p className="text-xs text-slate-500">Email login and chapter assignment stay linked to the coach account user and are managed automatically.</p>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={() => handleSaveCoach(coach.id)} disabled={savingCoachId === coach.id}>
                  {savingCoachId === coach.id ? 'Saving...' : 'Save coach'}
                </Button>
                <Button type="button" onClick={() => handleDeleteCoach(coach.id)} disabled={deletingCoachId === coach.id}>
                  {deletingCoachId === coach.id ? 'Deleting...' : 'Delete coach'}
                </Button>
              </div>
            </div>
          </Panel>
        );
      })}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
      {coaches.length === 0 ? (
        <Panel title="No coaches yet" description="Create coaches from the team page first, then manage them here.">
          <p className="text-sm text-slate-600">This chapter does not have any coach profiles yet.</p>
        </Panel>
      ) : null}
    </div>
  );
}
