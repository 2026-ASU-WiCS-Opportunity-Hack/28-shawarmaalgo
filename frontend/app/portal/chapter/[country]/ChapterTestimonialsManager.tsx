'use client';

import { type FormEvent, useState } from 'react';
import { Panel } from '@/components/portal/PortalCards';
import { Button } from '@/components/ui/button';
import { type BackendChapter, type BackendTestimonial, api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type ChapterTestimonialsManagerProps = {
  chapter: BackendChapter;
  initialTestimonials: BackendTestimonial[];
};

type TestimonialForm = {
  author_name: string;
  author_title: string;
  author_company: string;
  author_image_url: string;
  content: string;
  rating: string;
};

const inputClassName = 'w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm';
const labelClassName = 'mb-2 block text-sm font-medium text-slate-700';

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function optionalRating(value: string) {
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  const parsed = Number.parseInt(trimmed, 10);
  if (Number.isNaN(parsed)) return undefined;
  return Math.max(1, Math.min(5, parsed));
}

function buildTestimonialForm(testimonial?: BackendTestimonial): TestimonialForm {
  return {
    author_name: testimonial?.author_name || '',
    author_title: testimonial?.author_title || '',
    author_company: testimonial?.author_company || '',
    author_image_url: testimonial?.author_image_url || '',
    content: testimonial?.content || '',
    rating: typeof testimonial?.rating === 'number' ? String(testimonial.rating) : ''
  };
}

export default function ChapterTestimonialsManager({
  chapter,
  initialTestimonials
}: ChapterTestimonialsManagerProps) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [drafts, setDrafts] = useState<Record<string, TestimonialForm>>(
    Object.fromEntries(initialTestimonials.map((testimonial) => [testimonial.id, buildTestimonialForm(testimonial)]))
  );
  const [newTestimonial, setNewTestimonial] = useState<TestimonialForm>(buildTestimonialForm());
  const [savingTestimonialId, setSavingTestimonialId] = useState<string | null>(null);
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<string | null>(null);
  const [creatingTestimonial, setCreatingTestimonial] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function withToken<T>(action: (token: string) => Promise<T>) {
    const token = getClientAuthToken();
    if (!token) throw new Error('Your session has expired. Please log in again.');
    return action(token);
  }

  function updateDraft(testimonialId: string, patch: Partial<TestimonialForm>) {
    setDrafts((current) => ({
      ...current,
      [testimonialId]: { ...(current[testimonialId] || buildTestimonialForm()), ...patch }
    }));
  }

  async function handleSaveTestimonial(testimonialId: string) {
    const form = drafts[testimonialId];
    if (!form) return;

    setError(null);
    setSuccess(null);
    setSavingTestimonialId(testimonialId);

    try {
      const updated = await withToken((token) =>
        api.patchTestimonial(
          testimonialId,
          {
            author_name: form.author_name.trim(),
            author_title: form.author_title.trim(),
            author_company: optionalString(form.author_company),
            author_image_url: optionalString(form.author_image_url),
            content: form.content.trim(),
            rating: optionalRating(form.rating),
            chapter_id: chapter.id
          },
          token
        )
      );
      setTestimonials((current) =>
        current.map((testimonial) => (testimonial.id === updated.id ? updated : testimonial))
      );
      setDrafts((current) => ({ ...current, [updated.id]: buildTestimonialForm(updated) }));
      setSuccess(`Saved testimonial from ${updated.author_name}.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save testimonial.');
    } finally {
      setSavingTestimonialId(null);
    }
  }

  async function handleDeleteTestimonial(testimonialId: string) {
    const testimonial = testimonials.find((item) => item.id === testimonialId);
    if (!testimonial) return;
    const confirmed = window.confirm(`Delete the testimonial from ${testimonial.author_name}?`);
    if (!confirmed) return;

    setError(null);
    setSuccess(null);
    setDeletingTestimonialId(testimonialId);

    try {
      await withToken((token) => api.deleteTestimonial(testimonialId, token));
      setTestimonials((current) => current.filter((item) => item.id !== testimonialId));
      setDrafts((current) => {
        const next = { ...current };
        delete next[testimonialId];
        return next;
      });
      setSuccess(`Deleted testimonial from ${testimonial.author_name}.`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete testimonial.');
    } finally {
      setDeletingTestimonialId(null);
    }
  }

  async function handleCreateTestimonial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setCreatingTestimonial(true);

    try {
      const created = await withToken((token) =>
        api.createTestimonial(
          {
            author_name: newTestimonial.author_name.trim(),
            author_title: newTestimonial.author_title.trim(),
            author_company: optionalString(newTestimonial.author_company),
            author_image_url: optionalString(newTestimonial.author_image_url),
            content: newTestimonial.content.trim(),
            rating: optionalRating(newTestimonial.rating),
            chapter_id: chapter.id
          },
          token
        )
      );
      setTestimonials((current) => [created, ...current]);
      setDrafts((current) => ({ ...current, [created.id]: buildTestimonialForm(created) }));
      setNewTestimonial(buildTestimonialForm());
      setSuccess(`Added testimonial from ${created.author_name}.`);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to create testimonial.');
    } finally {
      setCreatingTestimonial(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {testimonials.map((testimonial) => {
        const form = drafts[testimonial.id] || buildTestimonialForm(testimonial);
        const description = [testimonial.author_title, testimonial.author_company].filter(Boolean).join(' • ');

        return (
          <Panel key={testimonial.id} title={testimonial.author_name} description={description || 'Chapter testimonial'}>
            <div className="grid gap-4">
              <label className="block">
                <span className={labelClassName}>Author name</span>
                <input
                  className={inputClassName}
                  value={form.author_name}
                  onChange={(event) => updateDraft(testimonial.id, { author_name: event.target.value })}
                />
              </label>
              <label className="block">
                <span className={labelClassName}>Author title</span>
                <input
                  className={inputClassName}
                  value={form.author_title}
                  onChange={(event) => updateDraft(testimonial.id, { author_title: event.target.value })}
                />
              </label>
              <label className="block">
                <span className={labelClassName}>Company</span>
                <input
                  className={inputClassName}
                  value={form.author_company}
                  onChange={(event) => updateDraft(testimonial.id, { author_company: event.target.value })}
                />
              </label>
              <label className="block">
                <span className={labelClassName}>Author image URL</span>
                <input
                  className={inputClassName}
                  value={form.author_image_url}
                  onChange={(event) => updateDraft(testimonial.id, { author_image_url: event.target.value })}
                />
              </label>
              <label className="block">
                <span className={labelClassName}>Quote</span>
                <textarea
                  className={`${inputClassName} min-h-32`}
                  value={form.content}
                  onChange={(event) => updateDraft(testimonial.id, { content: event.target.value })}
                />
              </label>
              <label className="block md:max-w-xs">
                <span className={labelClassName}>Rating (1-5)</span>
                <input
                  className={inputClassName}
                  inputMode="numeric"
                  value={form.rating}
                  onChange={(event) => updateDraft(testimonial.id, { rating: event.target.value })}
                />
              </label>
              <p className="text-xs leading-6 text-slate-500">
                Leaving company, image URL, or rating blank on update will keep the existing saved value.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={() => handleSaveTestimonial(testimonial.id)}
                  disabled={savingTestimonialId === testimonial.id}
                >
                  {savingTestimonialId === testimonial.id ? 'Saving...' : 'Save testimonial'}
                </Button>
                <Button
                  type="button"
                  onClick={() => handleDeleteTestimonial(testimonial.id)}
                  disabled={deletingTestimonialId === testimonial.id}
                >
                  {deletingTestimonialId === testimonial.id ? 'Deleting...' : 'Delete testimonial'}
                </Button>
              </div>
            </div>
          </Panel>
        );
      })}

      <Panel
        title="Add a new testimonial"
        description="Publish a client or participant quote to the public chapter page."
      >
        <form className="grid gap-4" onSubmit={handleCreateTestimonial}>
          <label className="block">
            <span className={labelClassName}>Author name</span>
            <input
              className={inputClassName}
              value={newTestimonial.author_name}
              onChange={(event) => setNewTestimonial((current) => ({ ...current, author_name: event.target.value }))}
              required
            />
          </label>
          <label className="block">
            <span className={labelClassName}>Author title</span>
            <input
              className={inputClassName}
              value={newTestimonial.author_title}
              onChange={(event) => setNewTestimonial((current) => ({ ...current, author_title: event.target.value }))}
              required
            />
          </label>
          <label className="block">
            <span className={labelClassName}>Company</span>
            <input
              className={inputClassName}
              value={newTestimonial.author_company}
              onChange={(event) => setNewTestimonial((current) => ({ ...current, author_company: event.target.value }))}
            />
          </label>
          <label className="block">
            <span className={labelClassName}>Author image URL</span>
            <input
              className={inputClassName}
              value={newTestimonial.author_image_url}
              onChange={(event) =>
                setNewTestimonial((current) => ({ ...current, author_image_url: event.target.value }))
              }
            />
          </label>
          <label className="block">
            <span className={labelClassName}>Quote</span>
            <textarea
              className={`${inputClassName} min-h-32`}
              value={newTestimonial.content}
              onChange={(event) => setNewTestimonial((current) => ({ ...current, content: event.target.value }))}
              required
            />
          </label>
          <label className="block md:max-w-xs">
            <span className={labelClassName}>Rating (1-5)</span>
            <input
              className={inputClassName}
              inputMode="numeric"
              value={newTestimonial.rating}
              onChange={(event) => setNewTestimonial((current) => ({ ...current, rating: event.target.value }))}
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
          <div>
            <Button type="submit" disabled={creatingTestimonial}>
              {creatingTestimonial ? 'Creating testimonial...' : 'Add testimonial'}
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
