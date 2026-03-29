'use client';

import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/portal/PortalCards';
import { type BackendChapter, type BackendResource, api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type ChapterResourcesManagerProps = {
  chapter: BackendChapter;
  initialResources: BackendResource[];
};

type ResourceForm = {
  title: string;
  type: string;
  summary: string;
  url: string;
  sort_order: string;
};

const inputClassName = 'w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm';
const labelClassName = 'mb-2 block text-sm font-medium text-slate-700';

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function buildResourceForm(resource?: BackendResource): ResourceForm {
  return {
    title: resource?.title || '',
    type: resource?.type || 'Guide',
    summary: resource?.summary || '',
    url: resource?.url || '',
    sort_order: typeof resource?.sort_order === 'number' ? String(resource.sort_order) : '0'
  };
}

export default function ChapterResourcesManager({ chapter, initialResources }: ChapterResourcesManagerProps) {
  const [resources, setResources] = useState(initialResources);
  const [drafts, setDrafts] = useState<Record<string, ResourceForm>>(
    Object.fromEntries(initialResources.map((resource) => [resource.id, buildResourceForm(resource)]))
  );
  const [newResource, setNewResource] = useState<ResourceForm>(buildResourceForm());
  const [savingResourceId, setSavingResourceId] = useState<string | null>(null);
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null);
  const [creatingResource, setCreatingResource] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function withToken<T>(action: (token: string) => Promise<T>) {
    const token = getClientAuthToken();
    if (!token) throw new Error('Your session has expired. Please log in again.');
    return action(token);
  }

  async function handleSaveResource(resourceId: string) {
    const form = drafts[resourceId];
    if (!form) return;

    setError(null);
    setSuccess(null);
    setSavingResourceId(resourceId);

    try {
      const updated = await withToken((token) =>
        api.patchResource(
          resourceId,
          {
            chapter_id: chapter.id,
            title: form.title.trim(),
            type: form.type.trim(),
            summary: form.summary.trim(),
            url: optionalString(form.url),
            sort_order: Number.parseInt(form.sort_order, 10) || 0
          },
          token
        )
      );
      setResources((current) => current.map((resource) => (resource.id === updated.id ? updated : resource)));
      setDrafts((current) => ({ ...current, [updated.id]: buildResourceForm(updated) }));
      setSuccess(`Saved ${updated.title}.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save resource.');
    } finally {
      setSavingResourceId(null);
    }
  }

  async function handleDeleteResource(resourceId: string) {
    const resource = resources.find((item) => item.id === resourceId);
    if (!resource) return;
    const confirmed = window.confirm(`Delete ${resource.title}?`);
    if (!confirmed) return;

    setError(null);
    setSuccess(null);
    setDeletingResourceId(resourceId);

    try {
      await withToken((token) => api.deleteResource(resourceId, token));
      setResources((current) => current.filter((resource) => resource.id !== resourceId));
      setSuccess(`Deleted ${resource.title}.`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete resource.');
    } finally {
      setDeletingResourceId(null);
    }
  }

  async function handleCreateResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setCreatingResource(true);

    try {
      const created = await withToken((token) =>
        api.createResource(
          {
            chapter_id: chapter.id,
            title: newResource.title.trim(),
            type: newResource.type.trim(),
            summary: newResource.summary.trim(),
            url: optionalString(newResource.url),
            sort_order: Number.parseInt(newResource.sort_order, 10) || 0
          },
          token
        )
      );
      setResources((current) => [...current, created]);
      setDrafts((current) => ({ ...current, [created.id]: buildResourceForm(created) }));
      setNewResource(buildResourceForm());
      setSuccess(`Created ${created.title}.`);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to create resource.');
    } finally {
      setCreatingResource(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {resources.map((resource) => {
        const form = drafts[resource.id] || buildResourceForm(resource);
        return (
          <Panel key={resource.id} title={resource.title} description={resource.type}>
            <div className="grid gap-4">
              <label className="block">
                <span className={labelClassName}>Resource title</span>
                <input className={inputClassName} value={form.title} onChange={(event) => setDrafts((current) => ({ ...current, [resource.id]: { ...form, title: event.target.value } }))} />
              </label>
              <label className="block">
                <span className={labelClassName}>Type</span>
                <input className={inputClassName} value={form.type} onChange={(event) => setDrafts((current) => ({ ...current, [resource.id]: { ...form, type: event.target.value } }))} />
              </label>
              <label className="block">
                <span className={labelClassName}>Summary</span>
                <textarea className={`${inputClassName} min-h-28`} value={form.summary} onChange={(event) => setDrafts((current) => ({ ...current, [resource.id]: { ...form, summary: event.target.value } }))} />
              </label>
              <label className="block">
                <span className={labelClassName}>URL</span>
                <input className={inputClassName} value={form.url} onChange={(event) => setDrafts((current) => ({ ...current, [resource.id]: { ...form, url: event.target.value } }))} />
              </label>
              <label className="block md:max-w-xs">
                <span className={labelClassName}>Sort order</span>
                <input className={inputClassName} value={form.sort_order} onChange={(event) => setDrafts((current) => ({ ...current, [resource.id]: { ...form, sort_order: event.target.value } }))} />
              </label>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={() => handleSaveResource(resource.id)} disabled={savingResourceId === resource.id}>
                  {savingResourceId === resource.id ? 'Saving...' : 'Save resource'}
                </Button>
                <Button type="button" onClick={() => handleDeleteResource(resource.id)} disabled={deletingResourceId === resource.id}>
                  {deletingResourceId === resource.id ? 'Deleting...' : 'Delete resource'}
                </Button>
              </div>
            </div>
          </Panel>
        );
      })}

      <Panel title="Add a new resource" description="Create a chapter-specific resource for the public chapter resources page.">
        <form className="grid gap-4" onSubmit={handleCreateResource}>
          <label className="block">
            <span className={labelClassName}>Resource title</span>
            <input className={inputClassName} value={newResource.title} onChange={(event) => setNewResource((current) => ({ ...current, title: event.target.value }))} required />
          </label>
          <label className="block">
            <span className={labelClassName}>Type</span>
            <input className={inputClassName} value={newResource.type} onChange={(event) => setNewResource((current) => ({ ...current, type: event.target.value }))} required />
          </label>
          <label className="block">
            <span className={labelClassName}>Summary</span>
            <textarea className={`${inputClassName} min-h-28`} value={newResource.summary} onChange={(event) => setNewResource((current) => ({ ...current, summary: event.target.value }))} required />
          </label>
          <label className="block">
            <span className={labelClassName}>URL</span>
            <input className={inputClassName} value={newResource.url} onChange={(event) => setNewResource((current) => ({ ...current, url: event.target.value }))} />
          </label>
          <label className="block md:max-w-xs">
            <span className={labelClassName}>Sort order</span>
            <input className={inputClassName} value={newResource.sort_order} onChange={(event) => setNewResource((current) => ({ ...current, sort_order: event.target.value }))} />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
          <div>
            <Button type="submit" disabled={creatingResource}>{creatingResource ? 'Creating resource...' : 'Add resource'}</Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
