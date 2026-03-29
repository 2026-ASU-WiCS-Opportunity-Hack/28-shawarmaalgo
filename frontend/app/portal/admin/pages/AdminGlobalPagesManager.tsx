'use client';

import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Panel } from '@/components/portal/PortalCards';
import { Button, buttonClassName } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type EditableGlobalPage = {
  slug: string;
  title: string;
  heroHeading: string;
  introContent: string;
  bodyContent: string;
  heroImageUrl: string;
  status: string;
  lastUpdated: string;
};

function formatUpdatedPage(updatedPage: Awaited<ReturnType<typeof api.patchGlobalPage>>) {
  return {
    slug: updatedPage.slug,
    title: updatedPage.title,
    heroHeading: updatedPage.hero_heading,
    introContent: updatedPage.intro_content,
    bodyContent: updatedPage.body_content,
    heroImageUrl: updatedPage.hero_image_url || '',
    status: updatedPage.status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    lastUpdated: new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(updatedPage.updated_at))
  } satisfies EditableGlobalPage;
}

export default function AdminGlobalPagesManager({ initialPages }: { initialPages: EditableGlobalPage[] }) {
  const [pages, setPages] = useState(initialPages);
  const [selectedSlug, setSelectedSlug] = useState(initialPages[0]?.slug || 'home');
  const [title, setTitle] = useState(initialPages[0]?.title || '');
  const [heroHeading, setHeroHeading] = useState(initialPages[0]?.heroHeading || '');
  const [introContent, setIntroContent] = useState(initialPages[0]?.introContent || '');
  const [bodyContent, setBodyContent] = useState(initialPages[0]?.bodyContent || '');
  const [heroImageUrl, setHeroImageUrl] = useState(initialPages[0]?.heroImageUrl || '');
  const [loading, setLoading] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingBodyImage, setUploadingBodyImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const heroUploadRef = useRef<HTMLInputElement | null>(null);
  const bodyUploadRef = useRef<HTMLInputElement | null>(null);

  const selectedPage = useMemo(
    () => pages.find((page) => page.slug === selectedSlug) || pages[0] || null,
    [pages, selectedSlug]
  );

  useEffect(() => {
    if (!selectedPage) return;
    setTitle(selectedPage.title);
    setHeroHeading(selectedPage.heroHeading);
    setIntroContent(selectedPage.introContent);
    setBodyContent(selectedPage.bodyContent);
    setHeroImageUrl(selectedPage.heroImageUrl);
  }, [selectedPage]);

  async function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(new Error('Unable to read image file.'));
      reader.readAsDataURL(file);
    });
  }

  async function handleHeroImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setUploadingHeroImage(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setHeroImageUrl(dataUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload hero image.');
    } finally {
      setUploadingHeroImage(false);
      event.target.value = '';
    }
  }

  async function handleBodyImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setUploadingBodyImage(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const imageMarkup = `![${file.name}](${dataUrl})`;
      setBodyContent((current) => `${current.trim()}${current.trim() ? '\n\n' : ''}${imageMarkup}`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to insert image into page content.');
    } finally {
      setUploadingBodyImage(false);
      event.target.value = '';
    }
  }

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
          intro_content: introContent.trim(),
          body_content: bodyContent.trim(),
          hero_image_url: heroImageUrl.trim()
        },
        token
      );

      const refreshedPage = formatUpdatedPage(updatedPage);
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
        <p className="text-sm text-slate-600 dark:text-slate-300">No shared pages are currently configured for editing.</p>
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
                  selected
                    ? 'border-brand-navy bg-brand-sand dark:border-brand-gold dark:bg-slate-900'
                    : 'border-slate-200 bg-white hover:border-brand-teal dark:border-slate-800 dark:bg-slate-950'
                }`}
                onClick={() => {
                  setSelectedSlug(page.slug);
                  setError(null);
                  setSuccess(null);
                }}
              >
                <p className="font-semibold text-brand-navy dark:text-white">{page.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {page.status} • Updated {page.lastUpdated}
                </p>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Edit shared page content" description="Update the public copy for the selected page. You can paste an image URL or upload an image to embed in the page body.">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Page</span>
            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
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
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Page title</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Hero heading</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={heroHeading}
              onChange={(event) => setHeroHeading(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Introductory content</span>
            <textarea
              className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={introContent}
              onChange={(event) => setIntroContent(event.target.value)}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Hero image URL</span>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                value={heroImageUrl}
                onChange={(event) => setHeroImageUrl(event.target.value)}
                placeholder="https://... or upload below"
              />
            </label>
            <div className="flex gap-3">
              <input ref={heroUploadRef} type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
              <Button type="button" onClick={() => heroUploadRef.current?.click()}>
                {uploadingHeroImage ? 'Uploading...' : 'Upload hero image'}
              </Button>
            </div>
          </div>

          {heroImageUrl ? (
            <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950">
              <img src={heroImageUrl} alt={`${title || 'Page'} hero`} className="max-h-60 w-full object-cover" />
            </div>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Body content</span>
            <textarea
              className="min-h-56 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={bodyContent}
              onChange={(event) => setBodyContent(event.target.value)}
              placeholder="Use plain text, headings with ##, bullets with -, links like [Label](https://...), and images like ![Alt](image-url)."
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <input ref={bodyUploadRef} type="file" accept="image/*" className="hidden" onChange={handleBodyImageUpload} />
            <Button type="button" onClick={() => bodyUploadRef.current?.click()}>
              {uploadingBodyImage ? 'Inserting image...' : 'Upload image into content'}
            </Button>
            <a href={`/${selectedSlug === 'home' ? '' : selectedSlug}`} className={buttonClassName()}>
              Preview page
            </a>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving page...' : 'Save page content'}
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
