'use client';

import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/portal/PortalCards';
import { type BackendChapter, api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type ChapterContactManagerProps = {
  chapter: BackendChapter;
};

type ContactForm = {
  contact_email: string;
  contact_phone: string;
  contact_city: string;
  website_url: string;
};

const inputClassName = 'w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm';
const labelClassName = 'mb-2 block text-sm font-medium text-slate-700';

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function buildForm(chapter: BackendChapter): ContactForm {
  return {
    contact_email: chapter.contact_email,
    contact_phone: chapter.contact_phone || '',
    contact_city: chapter.contact_city || '',
    website_url: chapter.website_url || ''
  };
}

export default function ChapterContactManager({ chapter }: ChapterContactManagerProps) {
  const [form, setForm] = useState<ContactForm>(() => buildForm(chapter));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const token = getClientAuthToken();
      if (!token) {
        throw new Error('Your session has expired. Please log in again.');
      }

      const updated = await api.patchChapter(
        chapter.id,
        {
          contact_email: form.contact_email.trim(),
          contact_phone: optionalString(form.contact_phone),
          contact_city: optionalString(form.contact_city),
          website_url: optionalString(form.website_url)
        },
        token
      );
      setForm(buildForm(updated));
      setSuccess('Contact details saved. The public chapter contact page now uses these values.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save contact details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel title="Chapter contact information" description="These values appear on the public chapter contact page.">
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="block">
          <span className={labelClassName}>Email</span>
          <input className={inputClassName} type="email" value={form.contact_email} onChange={(event) => setForm((current) => ({ ...current, contact_email: event.target.value }))} required />
        </label>
        <label className="block">
          <span className={labelClassName}>Phone</span>
          <input className={inputClassName} value={form.contact_phone} onChange={(event) => setForm((current) => ({ ...current, contact_phone: event.target.value }))} />
        </label>
        <label className="block">
          <span className={labelClassName}>City</span>
          <input className={inputClassName} value={form.contact_city} onChange={(event) => setForm((current) => ({ ...current, contact_city: event.target.value }))} />
        </label>
        <label className="block">
          <span className={labelClassName}>Website URL</span>
          <input className={inputClassName} value={form.website_url} onChange={(event) => setForm((current) => ({ ...current, website_url: event.target.value }))} />
        </label>
        {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
        {success ? <p className="md:col-span-2 text-sm text-emerald-700">{success}</p> : null}
        <div className="md:col-span-2">
          <Button type="submit" disabled={loading}>{loading ? 'Saving contact...' : 'Save contact details'}</Button>
        </div>
      </form>
    </Panel>
  );
}
