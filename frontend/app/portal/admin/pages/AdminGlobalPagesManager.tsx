'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Panel } from '@/components/portal/PortalCards';
import { Button, buttonClassName } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type EditableGlobalPage = {
  slug: string;
  title: string;
  heroHeading: string;
  introContent: string;
  status: string;
  lastUpdated: string;
};

export default function AdminGlobalPagesManager({ initialPages }: { initialPages: EditableGlobalPage[] }) {
  const [pages, setPages] = useState(initialPages);
  const [selectedSlug, setSelectedSlug] = useState(initialPages[0]?.slug || 'home');
  const [title, setTitle] = useState(initialPages[0]?.title || '');
  const [heroHeading, setHeroHeading] = useState(initialPages[0]?.heroHeading || '');
  const [introContent, setIntroContent] = useState(initialPages[0]?.introContent || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedPage = useMemo(
    () => pages.find((page) => page.slug === selectedSlug) || pages[0] || null,
    [pages, selectedSlug]
  );

  useEffect(() => {
    if (!selectedPage) return;
    setTitle(selectedPage.title);
    setHeroHeading(selectedPage.heroHeading);
    setIntroContent(selectedPage.introContent);
  }, [selectedPage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const token = getClientAuthToken();
    if (!token) {
      setError('Your session has expired. Please log in again.');
      return;
    }

    if (!selectedPage) {
      setError('Select a page before saving.');
      return;
    }

    setLoading(true);

    try {
      const updatedPage = await api.patchGlobalPage(
        selectedPage.slug,
        {
          title: title.trim(),
          hero_heading: heroHeading.trim(),
          intro_content: introContent.trim()
        },
        token
      );

      const refreshedPage = {
        slug: updatedPage.slug,
        title: updatedPage.title,
        heroHeading: updatedPage.hero_heading,
        introContent: updatedPage.intro_content,
        status: updatedPage.status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
        lastUpdated: new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }).format(new Date(updatedPage.updated_at))
      };

      setPages((current) => current.map((page) => (page.slug === refreshedPage.slug ? refreshedPage : page)));
      setSuccess(`${refreshedPage.title} saved.`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save page content.');
    } finally {
      setLoading(false);
    }
  }

  if (pages.length === 0) {
    return (
      <Panel title="Global pages" description="No editable pages are currently available.">
        <p className="text-sm text-slate-600">Seed the global pages table or restore the API connection to manage shared page content.</p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
      <Panel title="Available pages" description="Choose the page you want to edit. Updates are saved through the API and reflected on the public site.">
        <div className="space-y-3">
          {pages.map((page) => {
            const selected = page.slug === selectedSlug;
            return (
              <button
                key={page.slug}
                type="button"
                className={`w-full rounded-[1.25rem] border p-4 text-left transition ${
                  selected ? 'border-brand-navy bg-brand-sand' : 'border-slate-200 bg-white hover:border-brand-teal'
                }`}
                onClick={() => {
                  setSelectedSlug(page.slug);
                  setError(null);
                  setSuccess(null);
                }}
              >
                <p className="font-semibold text-brand-navy">{page.title}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {page.status} • Updated {page.lastUpdated}
                </p>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Edit shared page content" description="Select a global page, update the hero text below, and save it back to the API.">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Page</span>
            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              value={selectedSlug}
              onChange={(event) => {
                setSelectedSlug(event.target.value);
                setError(null);
                setSuccess(null);
              }}
            >
              {pages.map((page) => (
                <option key={page.slug} value={page.slug}>
                  {page.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Page title</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Hero heading</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              value={heroHeading}
              onChange={(event) => setHeroHeading(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Introductory content</span>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              value={introContent}
              onChange={(event) => setIntroContent(event.target.value)}
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving page...' : 'Save page content'}
            </Button>
            <a href={`/${selectedSlug === 'home' ? '' : selectedSlug}`} className={buttonClassName()}>
              Preview page
            </a>
          </div>
        </form>
      </Panel>
    </div>
  );
}
