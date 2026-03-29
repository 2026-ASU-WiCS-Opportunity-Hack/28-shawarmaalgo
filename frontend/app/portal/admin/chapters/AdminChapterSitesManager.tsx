'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, buttonClassName } from '@/components/ui/button';
import { type BackendChapter, api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type AdminChapterSitesManagerProps = {
  initialChapters: BackendChapter[];
  mode?: 'cards' | 'table';
};

function ChapterDeleteButton({
  chapter,
  onDeleted
}: {
  chapter: BackendChapter;
  onDeleted: (chapterId: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete the ${chapter.name} chapter site? This will remove the chapter and its chapter route.`);
    if (!confirmed) return;

    setError(null);
    setLoading(true);

    try {
      const token = getClientAuthToken();
      if (!token) {
        throw new Error('Your session has expired. Please log in again.');
      }

      await api.deleteChapter(chapter.id, token);
      onDeleted(chapter.id);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete chapter.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" className={buttonClassName()} onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete'}
      </button>
      {error ? <p className="max-w-xs text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export default function AdminChapterSitesManager({ initialChapters, mode = 'table' }: AdminChapterSitesManagerProps) {
  const [chapters, setChapters] = useState(initialChapters);

  function handleDeleted(chapterId: string) {
    setChapters((current) => current.filter((chapter) => chapter.id !== chapterId));
  }

  if (mode === 'cards') {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="rounded-[1.25rem] border border-slate-200 p-4">
              <h3 className="text-lg font-semibold text-brand-navy">{chapter.name}</h3>
              <p className="mt-1 text-sm text-slate-600">/{chapter.slug}</p>
              <p className="mt-3 text-sm text-slate-600">{chapter.contact_email}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                <Link href={`/portal/admin/chapters/${chapter.slug}`} className="text-brand-navy hover:text-brand-teal">
                  Manage
                </Link>
                <Link href={`/${chapter.slug}`} className="text-brand-navy hover:text-brand-teal">
                  View
                </Link>
              </div>
              <div className="mt-4">
                <ChapterDeleteButton chapter={chapter} onDeleted={handleDeleted} />
              </div>
            </div>
          ))}
        </div>
        <Button href="/portal/admin/chapters/new" className="mt-5">
          Create new chapter
        </Button>
      </>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-4 py-3 font-medium">Chapter</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {chapters.map((chapter) => (
            <tr key={chapter.id} className="border-b border-slate-100 align-top">
              <td className="px-4 py-4 font-semibold text-brand-navy">{chapter.name}</td>
              <td className="px-4 py-4 text-slate-600">/{chapter.slug}</td>
              <td className="px-4 py-4 text-slate-600">{chapter.contact_email}</td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap items-start gap-3">
                  <Link href={`/portal/admin/chapters/${chapter.slug}`} className="text-sm font-semibold text-brand-navy hover:text-brand-teal">
                    Edit
                  </Link>
                  <Link href={`/${chapter.slug}`} className="text-sm font-semibold text-brand-navy hover:text-brand-teal">
                    Preview
                  </Link>
                  <ChapterDeleteButton chapter={chapter} onDeleted={handleDeleted} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
