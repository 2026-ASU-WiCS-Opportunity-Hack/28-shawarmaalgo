'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Panel } from '@/components/portal/PortalCards';
import { api, type BackendChapter, type ChapterUpdatePayload } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type EditChapterFormState = {
  name: string;
  slug: string;
  country: string;
  region: string;
  description: string;
  description_local: string;
  primary_language: string;
  supported_languages: string;
  timezone: string;
  currency: string;
  contact_email: string;
  contact_phone: string;
  contact_city: string;
  website_url: string;
  logo_url: string;
  hero_image_url: string;
  is_active: boolean;
  founded_year: string;
  member_count: string;
};

const inputClassName = 'w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm';
const labelClassName = 'mb-2 block text-sm font-medium text-slate-700';

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function optionalNumber(value: string) {
  const trimmed = value.trim();
  if (trimmed === '') return undefined;

  const parsed = Number.parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function buildInitialState(chapter: BackendChapter): EditChapterFormState {
  return {
    name: chapter.name,
    slug: chapter.slug,
    country: chapter.country,
    region: chapter.region,
    description: chapter.description || '',
    description_local: chapter.description_local || '',
    primary_language: chapter.primary_language,
    supported_languages: chapter.supported_languages.join(', '),
    timezone: chapter.timezone,
    currency: chapter.currency,
    contact_email: chapter.contact_email,
    contact_phone: chapter.contact_phone || '',
    contact_city: chapter.contact_city || '',
    website_url: chapter.website_url || '',
    logo_url: chapter.logo_url || '',
    hero_image_url: chapter.hero_image_url || '',
    is_active: chapter.is_active,
    founded_year: chapter.founded_year ? String(chapter.founded_year) : '',
    member_count: chapter.member_count ? String(chapter.member_count) : ''
  };
}

export function EditChapterSettingsForm({ chapter }: { chapter: BackendChapter }) {
  const router = useRouter();
  const [form, setForm] = useState<EditChapterFormState>(() => buildInitialState(chapter));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function updateField<K extends keyof EditChapterFormState>(key: K, value: EditChapterFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const token = getClientAuthToken();
    if (!token) {
      setError('You must be signed in as a super admin to update a chapter.');
      return;
    }

    const supportedLanguages = form.supported_languages
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (supportedLanguages.length === 0) {
      setError('Supported languages must include at least one language.');
      return;
    }

    const payload: ChapterUpdatePayload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      country: form.country.trim(),
      region: form.region.trim(),
      description: optionalString(form.description),
      description_local: optionalString(form.description_local),
      primary_language: form.primary_language.trim(),
      supported_languages: supportedLanguages,
      timezone: form.timezone.trim(),
      currency: form.currency.trim(),
      contact_email: form.contact_email.trim(),
      contact_phone: optionalString(form.contact_phone),
      contact_city: optionalString(form.contact_city),
      website_url: optionalString(form.website_url),
      logo_url: optionalString(form.logo_url),
      hero_image_url: optionalString(form.hero_image_url),
      is_active: form.is_active,
      founded_year: optionalNumber(form.founded_year),
      member_count: optionalNumber(form.member_count)
    };

    setLoading(true);

    try {
      const updatedChapter = await api.updateChapter(chapter.id, payload, token);
      setForm(buildInitialState(updatedChapter));
      setSuccess('Chapter settings saved.');
      if (updatedChapter.slug !== chapter.slug) {
        router.push(`/portal/admin/chapters/${updatedChapter.slug}`);
      }
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save chapter settings');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PortalShell
      eyebrow="Admin console"
      title={`Manage ${chapter.name}`}
      description="Control chapter-level settings and publishing details without affecting the shared platform template."
    >
      <div className="grid gap-8 xl:grid-cols-2">
        <Panel title="Chapter settings" description="These values are saved to the backend chapter record and drive the shared frontend experience.">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="block">
              <span className={labelClassName}>Chapter name</span>
              <input required className={inputClassName} value={form.name} onChange={(event) => updateField('name', event.target.value)} />
            </label>
            <label className="block">
              <span className={labelClassName}>Slug</span>
              <input required className={inputClassName} value={form.slug} onChange={(event) => updateField('slug', event.target.value)} />
            </label>
            <label className="block">
              <span className={labelClassName}>Country</span>
              <input required className={inputClassName} value={form.country} onChange={(event) => updateField('country', event.target.value)} />
            </label>
            <label className="block">
              <span className={labelClassName}>Region</span>
              <input required className={inputClassName} value={form.region} onChange={(event) => updateField('region', event.target.value)} />
            </label>
            <label className="block">
              <span className={labelClassName}>Primary language</span>
              <input
                required
                className={inputClassName}
                value={form.primary_language}
                onChange={(event) => updateField('primary_language', event.target.value)}
              />
            </label>
            <label className="block">
              <span className={labelClassName}>Supported languages</span>
              <input
                required
                className={inputClassName}
                value={form.supported_languages}
                onChange={(event) => updateField('supported_languages', event.target.value)}
              />
            </label>
            <label className="block">
              <span className={labelClassName}>Timezone</span>
              <input required className={inputClassName} value={form.timezone} onChange={(event) => updateField('timezone', event.target.value)} />
            </label>
            <label className="block">
              <span className={labelClassName}>Currency</span>
              <input required className={inputClassName} value={form.currency} onChange={(event) => updateField('currency', event.target.value)} />
            </label>
            <label className="block">
              <span className={labelClassName}>Contact email</span>
              <input
                required
                type="email"
                className={inputClassName}
                value={form.contact_email}
                onChange={(event) => updateField('contact_email', event.target.value)}
              />
            </label>
            <label className="block">
              <span className={labelClassName}>Phone</span>
              <input className={inputClassName} value={form.contact_phone} onChange={(event) => updateField('contact_phone', event.target.value)} />
            </label>
            <label className="block">
              <span className={labelClassName}>City</span>
              <input className={inputClassName} value={form.contact_city} onChange={(event) => updateField('contact_city', event.target.value)} />
            </label>
            <label className="block">
              <span className={labelClassName}>Website URL</span>
              <input className={inputClassName} value={form.website_url} onChange={(event) => updateField('website_url', event.target.value)} />
            </label>
            <label className="block">
              <span className={labelClassName}>Logo URL</span>
              <input className={inputClassName} value={form.logo_url} onChange={(event) => updateField('logo_url', event.target.value)} />
            </label>
            <label className="block">
              <span className={labelClassName}>Hero image URL</span>
              <input className={inputClassName} value={form.hero_image_url} onChange={(event) => updateField('hero_image_url', event.target.value)} />
            </label>
            <label className="block">
              <span className={labelClassName}>Founded year</span>
              <input type="number" className={inputClassName} value={form.founded_year} onChange={(event) => updateField('founded_year', event.target.value)} />
            </label>
            <label className="block">
              <span className={labelClassName}>Member count</span>
              <input type="number" className={inputClassName} value={form.member_count} onChange={(event) => updateField('member_count', event.target.value)} />
            </label>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" checked={form.is_active} onChange={(event) => updateField('is_active', event.target.checked)} />
                Publish this chapter as active
              </label>
            </div>
            <div className="md:col-span-2">
              <span className={labelClassName}>Description</span>
              <textarea className={`${inputClassName} min-h-32`} value={form.description} onChange={(event) => updateField('description', event.target.value)} />
            </div>
            <div className="md:col-span-2">
              <span className={labelClassName}>Localized description</span>
              <textarea
                className={`${inputClassName} min-h-32`}
                value={form.description_local}
                onChange={(event) => updateField('description_local', event.target.value)}
              />
            </div>
            {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
            {success ? <p className="md:col-span-2 text-sm text-emerald-700">{success}</p> : null}
            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink disabled:opacity-70"
              >
                {loading ? 'Saving chapter...' : 'Save changes'}
              </button>
            </div>
          </form>
        </Panel>
        <Panel
          title="Assign chapter leader"
          description="This panel is intentionally read-only for now. The current backend user API requires an email, password, role, and chapter assignment, but it does not store a separate leader name field or support the previous placeholder flow."
        >
          <div className="grid gap-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Chapter-leader assignment still needs a dedicated UX. Use the admin users API flow instead of this placeholder card for now.
            </div>
            <div className="grid gap-3 text-sm text-slate-600">
              <p>Suggested next step: create or update a `chapter_lead` user for this chapter from the admin users area.</p>
              <p>Chapter slug: <span className="font-semibold text-brand-navy">{chapter.slug}</span></p>
              <p>Contact email: <span className="font-semibold text-brand-navy">{chapter.contact_email}</span></p>
            </div>
          </div>
        </Panel>
      </div>
    </PortalShell>
  );
}
