'use client';

import { type FormEvent, useState } from 'react';
import { Button, buttonClassName } from '@/components/ui/button';
import { Panel } from '@/components/portal/PortalCards';
import { ImageUploadField } from '@/components/forms/ImageUploadField';
import { type BackendChapter, api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type ChapterContentManagerProps = {
  chapter: BackendChapter;
};

type ContentFormState = {
  name: string;
  description: string;
  description_local: string;
  primary_language: string;
  supported_languages: string;
  website_url: string;
  logo_url: string;
  hero_image_url: string;
};

const inputClassName = 'w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm';
const labelClassName = 'mb-2 block text-sm font-medium text-slate-700';

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function buildInitialState(chapter: BackendChapter): ContentFormState {
  return {
    name: chapter.name,
    description: chapter.description || '',
    description_local: chapter.description_local || '',
    primary_language: chapter.primary_language,
    supported_languages: chapter.supported_languages.join(', '),
    website_url: chapter.website_url || '',
    logo_url: chapter.logo_url || '',
    hero_image_url: chapter.hero_image_url || ''
  };
}

export default function ChapterContentManager({ chapter }: ChapterContentManagerProps) {
  const [form, setForm] = useState<ContentFormState>(() => buildInitialState(chapter));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const token = getClientAuthToken();
    if (!token) {
      setError('Your session has expired. Please log in again.');
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

    setLoading(true);

    try {
      const updated = await api.patchChapterContent(
        chapter.id,
        {
          name: form.name.trim(),
          description: optionalString(form.description),
          description_local: optionalString(form.description_local),
          primary_language: form.primary_language.trim(),
          supported_languages: supportedLanguages,
          website_url: optionalString(form.website_url),
          logo_url: optionalString(form.logo_url),
          hero_image_url: optionalString(form.hero_image_url)
        },
        token
      );
      setForm(buildInitialState(updated));
      setSuccess('Chapter content saved. Refresh the public chapter page to see the updated content.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save chapter content.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel title="Chapter homepage content" description="These fields feed the public chapter page at the chapter slug route.">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className={labelClassName}>Chapter name</span>
          <input className={inputClassName} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        </label>

        <label className="block">
          <span className={labelClassName}>Hero description</span>
          <textarea
            className={`${inputClassName} min-h-32`}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
        </label>

        <label className="block">
          <span className={labelClassName}>Overview content</span>
          <textarea
            className={`${inputClassName} min-h-32`}
            value={form.description_local}
            onChange={(event) => setForm((current) => ({ ...current, description_local: event.target.value }))}
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className={labelClassName}>Primary language</span>
            <input
              className={inputClassName}
              value={form.primary_language}
              onChange={(event) => setForm((current) => ({ ...current, primary_language: event.target.value }))}
            />
          </label>
          <label className="block">
            <span className={labelClassName}>Supported languages</span>
            <input
              className={inputClassName}
              value={form.supported_languages}
              onChange={(event) => setForm((current) => ({ ...current, supported_languages: event.target.value }))}
              placeholder="English, French"
            />
          </label>
          <label className="block">
            <span className={labelClassName}>Website URL</span>
            <input
              className={inputClassName}
              value={form.website_url}
              onChange={(event) => setForm((current) => ({ ...current, website_url: event.target.value }))}
              placeholder="https://chapter.example.org"
            />
          </label>
          <div className="md:col-span-2">
            <ImageUploadField
              label="Logo image"
              value={form.logo_url}
              onChange={(value) => setForm((current) => ({ ...current, logo_url: value }))}
              helpText="Upload a chapter logo and the form will save the S3 URL automatically."
              previewAlt={`${chapter.name} logo`}
              emptyLabel="No logo uploaded yet."
            />
          </div>
        </div>

        <ImageUploadField
          label="Hero image"
          value={form.hero_image_url}
          onChange={(value) => setForm((current) => ({ ...current, hero_image_url: value }))}
          helpText="Upload the main chapter image and the saved chapter content will reference the S3 URL."
          previewAlt={`${chapter.name} hero`}
          emptyLabel="No hero image uploaded yet."
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving content...' : 'Save chapter content'}
          </Button>
          <a href={`/${chapter.slug}`} className={buttonClassName()}>
            Preview chapter page
          </a>
        </div>
      </form>
    </Panel>
  );
}
