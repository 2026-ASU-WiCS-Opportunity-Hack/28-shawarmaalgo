'use client';

import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/portal/PortalCards';
import { type BackendChapter, type BackendEvent, api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type ChapterEventsManagerProps = {
  chapter: BackendChapter;
  initialEvents: BackendEvent[];
};

type EventForm = {
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  timezone: string;
  location_type: string;
  venue_name: string;
  venue_address: string;
  online_meeting_url: string;
  status: string;
};

const inputClassName = 'w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm';
const labelClassName = 'mb-2 block text-sm font-medium text-slate-700';

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toIsoDate(value: string) {
  return value ? new Date(value).toISOString() : undefined;
}

function buildEventForm(event?: BackendEvent, timezone?: string): EventForm {
  return {
    title: event?.title || '',
    description: event?.description || '',
    event_type: event?.event_type || 'chapter_session',
    start_date: toDateTimeLocal(event?.start_date),
    end_date: toDateTimeLocal(event?.end_date),
    timezone: event?.timezone || timezone || 'UTC',
    location_type: event?.location_type || 'in_person',
    venue_name: event?.venue_name || '',
    venue_address: event?.venue_address || '',
    online_meeting_url: event?.online_meeting_url || '',
    status: event?.status || 'published'
  };
}

export default function ChapterEventsManager({ chapter, initialEvents }: ChapterEventsManagerProps) {
  const [events, setEvents] = useState(initialEvents);
  const [drafts, setDrafts] = useState<Record<string, EventForm>>(
    Object.fromEntries(initialEvents.map((event) => [event.id, buildEventForm(event, chapter.timezone)]))
  );
  const [newEvent, setNewEvent] = useState<EventForm>(() => buildEventForm(undefined, chapter.timezone));
  const [savingEventId, setSavingEventId] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function withToken<T>(action: (token: string) => Promise<T>) {
    const token = getClientAuthToken();
    if (!token) throw new Error('Your session has expired. Please log in again.');
    return action(token);
  }

  async function handleSaveEvent(eventId: string) {
    const form = drafts[eventId];
    if (!form) return;

    setError(null);
    setSuccess(null);
    setSavingEventId(eventId);

    try {
      const updated = await withToken((token) =>
        api.patchEvent(
          eventId,
          {
            title: form.title.trim(),
            description: optionalString(form.description),
            event_type: form.event_type.trim(),
            start_date: toIsoDate(form.start_date),
            end_date: toIsoDate(form.end_date),
            timezone: form.timezone.trim(),
            location_type: form.location_type.trim(),
            venue_name: optionalString(form.venue_name),
            venue_address: optionalString(form.venue_address),
            online_meeting_url: optionalString(form.online_meeting_url),
            status: form.status.trim(),
            chapter_id: chapter.id
          },
          token
        )
      );
      setEvents((current) => current.map((event) => (event.id === updated.id ? updated : event)));
      setDrafts((current) => ({ ...current, [updated.id]: buildEventForm(updated, chapter.timezone) }));
      setSuccess(`Saved ${updated.title}.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save event.');
    } finally {
      setSavingEventId(null);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    const eventRecord = events.find((event) => event.id === eventId);
    if (!eventRecord) return;
    const confirmed = window.confirm(`Delete ${eventRecord.title}?`);
    if (!confirmed) return;

    setError(null);
    setSuccess(null);
    setDeletingEventId(eventId);

    try {
      await withToken((token) => api.deleteEvent(eventId, token));
      setEvents((current) => current.filter((event) => event.id !== eventId));
      setSuccess(`Deleted ${eventRecord.title}.`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete event.');
    } finally {
      setDeletingEventId(null);
    }
  }

  async function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setCreatingEvent(true);

    try {
      const created = await withToken((token) =>
        api.createEvent(
          {
            title: newEvent.title.trim(),
            description: optionalString(newEvent.description),
            event_type: newEvent.event_type.trim(),
            start_date: toIsoDate(newEvent.start_date),
            end_date: toIsoDate(newEvent.end_date),
            timezone: newEvent.timezone.trim(),
            location_type: newEvent.location_type.trim(),
            venue_name: optionalString(newEvent.venue_name),
            venue_address: optionalString(newEvent.venue_address),
            online_meeting_url: optionalString(newEvent.online_meeting_url),
            chapter_id: chapter.id,
            is_free: true,
            status: newEvent.status.trim()
          },
          token
        )
      );
      setEvents((current) => [...current, created]);
      setDrafts((current) => ({ ...current, [created.id]: buildEventForm(created, chapter.timezone) }));
      setNewEvent(buildEventForm(undefined, chapter.timezone));
      setSuccess(`Created ${created.title}.`);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to create event.');
    } finally {
      setCreatingEvent(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {events.map((event) => {
        const form = drafts[event.id] || buildEventForm(event, chapter.timezone);
        return (
          <Panel key={event.id} title={event.title} description={`${event.event_type} • ${event.status}`}>
            <div className="grid gap-4">
              <label className="block">
                <span className={labelClassName}>Title</span>
                <input className={inputClassName} value={form.title} onChange={(evt) => setDrafts((current) => ({ ...current, [event.id]: { ...form, title: evt.target.value } }))} />
              </label>
              <label className="block">
                <span className={labelClassName}>Summary</span>
                <textarea className={`${inputClassName} min-h-28`} value={form.description} onChange={(evt) => setDrafts((current) => ({ ...current, [event.id]: { ...form, description: evt.target.value } }))} />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className={labelClassName}>Start</span>
                  <input className={inputClassName} type="datetime-local" value={form.start_date} onChange={(evt) => setDrafts((current) => ({ ...current, [event.id]: { ...form, start_date: evt.target.value } }))} />
                </label>
                <label className="block">
                  <span className={labelClassName}>End</span>
                  <input className={inputClassName} type="datetime-local" value={form.end_date} onChange={(evt) => setDrafts((current) => ({ ...current, [event.id]: { ...form, end_date: evt.target.value } }))} />
                </label>
                <label className="block">
                  <span className={labelClassName}>Event type</span>
                  <input className={inputClassName} value={form.event_type} onChange={(evt) => setDrafts((current) => ({ ...current, [event.id]: { ...form, event_type: evt.target.value } }))} />
                </label>
                <label className="block">
                  <span className={labelClassName}>Status</span>
                  <input className={inputClassName} value={form.status} onChange={(evt) => setDrafts((current) => ({ ...current, [event.id]: { ...form, status: evt.target.value } }))} />
                </label>
                <label className="block">
                  <span className={labelClassName}>Timezone</span>
                  <input className={inputClassName} value={form.timezone} onChange={(evt) => setDrafts((current) => ({ ...current, [event.id]: { ...form, timezone: evt.target.value } }))} />
                </label>
                <label className="block">
                  <span className={labelClassName}>Location type</span>
                  <input className={inputClassName} value={form.location_type} onChange={(evt) => setDrafts((current) => ({ ...current, [event.id]: { ...form, location_type: evt.target.value } }))} />
                </label>
                <label className="block">
                  <span className={labelClassName}>Venue name</span>
                  <input className={inputClassName} value={form.venue_name} onChange={(evt) => setDrafts((current) => ({ ...current, [event.id]: { ...form, venue_name: evt.target.value } }))} />
                </label>
                <label className="block">
                  <span className={labelClassName}>Venue address</span>
                  <input className={inputClassName} value={form.venue_address} onChange={(evt) => setDrafts((current) => ({ ...current, [event.id]: { ...form, venue_address: evt.target.value } }))} />
                </label>
              </div>
              <label className="block">
                <span className={labelClassName}>Online meeting URL</span>
                <input className={inputClassName} value={form.online_meeting_url} onChange={(evt) => setDrafts((current) => ({ ...current, [event.id]: { ...form, online_meeting_url: evt.target.value } }))} />
              </label>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={() => handleSaveEvent(event.id)} disabled={savingEventId === event.id}>
                  {savingEventId === event.id ? 'Saving...' : 'Save event'}
                </Button>
                <Button type="button" onClick={() => handleDeleteEvent(event.id)} disabled={deletingEventId === event.id}>
                  {deletingEventId === event.id ? 'Deleting...' : 'Delete event'}
                </Button>
              </div>
            </div>
          </Panel>
        );
      })}

      <Panel title="Add a new event" description="Create a new chapter event for the public chapter page.">
        <form className="grid gap-4" onSubmit={handleCreateEvent}>
          <label className="block">
            <span className={labelClassName}>Title</span>
            <input className={inputClassName} value={newEvent.title} onChange={(event) => setNewEvent((current) => ({ ...current, title: event.target.value }))} required />
          </label>
          <label className="block">
            <span className={labelClassName}>Summary</span>
            <textarea className={`${inputClassName} min-h-28`} value={newEvent.description} onChange={(event) => setNewEvent((current) => ({ ...current, description: event.target.value }))} />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={labelClassName}>Start</span>
              <input className={inputClassName} type="datetime-local" value={newEvent.start_date} onChange={(event) => setNewEvent((current) => ({ ...current, start_date: event.target.value }))} required />
            </label>
            <label className="block">
              <span className={labelClassName}>End</span>
              <input className={inputClassName} type="datetime-local" value={newEvent.end_date} onChange={(event) => setNewEvent((current) => ({ ...current, end_date: event.target.value }))} />
            </label>
            <label className="block">
              <span className={labelClassName}>Event type</span>
              <input className={inputClassName} value={newEvent.event_type} onChange={(event) => setNewEvent((current) => ({ ...current, event_type: event.target.value }))} required />
            </label>
            <label className="block">
              <span className={labelClassName}>Status</span>
              <input className={inputClassName} value={newEvent.status} onChange={(event) => setNewEvent((current) => ({ ...current, status: event.target.value }))} required />
            </label>
            <label className="block">
              <span className={labelClassName}>Timezone</span>
              <input className={inputClassName} value={newEvent.timezone} onChange={(event) => setNewEvent((current) => ({ ...current, timezone: event.target.value }))} required />
            </label>
            <label className="block">
              <span className={labelClassName}>Location type</span>
              <input className={inputClassName} value={newEvent.location_type} onChange={(event) => setNewEvent((current) => ({ ...current, location_type: event.target.value }))} required />
            </label>
            <label className="block">
              <span className={labelClassName}>Venue name</span>
              <input className={inputClassName} value={newEvent.venue_name} onChange={(event) => setNewEvent((current) => ({ ...current, venue_name: event.target.value }))} />
            </label>
            <label className="block">
              <span className={labelClassName}>Venue address</span>
              <input className={inputClassName} value={newEvent.venue_address} onChange={(event) => setNewEvent((current) => ({ ...current, venue_address: event.target.value }))} />
            </label>
          </div>
          <label className="block">
            <span className={labelClassName}>Online meeting URL</span>
            <input className={inputClassName} value={newEvent.online_meeting_url} onChange={(event) => setNewEvent((current) => ({ ...current, online_meeting_url: event.target.value }))} />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
          <div>
            <Button type="submit" disabled={creatingEvent}>{creatingEvent ? 'Creating event...' : 'Add event'}</Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
