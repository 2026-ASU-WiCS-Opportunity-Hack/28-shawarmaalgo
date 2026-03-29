'use client';

import { type FormEvent, useMemo, useState } from 'react';
import { Panel } from '@/components/portal/PortalCards';
import { Button, buttonClassName } from '@/components/ui/button';
import { type BackendCoach, type BackendUser, api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type ChapterOption = {
  id: string;
  name: string;
  slug: string;
  country: string;
};

type AdminUserManagementProps = {
  initialUsers: BackendUser[];
  initialCoaches: BackendCoach[];
  chapters: ChapterOption[];
};

type CreateUserForm = {
  email: string;
  password: string;
  role: 'chapter_lead' | 'coach' | 'content_creator';
  chapter_id: string;
  first_name: string;
  last_name: string;
  certification_level: string;
  certification_date: string;
  city: string;
  specializations: string;
  languages: string;
  bio: string;
};

const certificationLevels = ['CALC', 'PALC', 'SALC', 'MALC'];

const defaultForm = (chapterId = ''): CreateUserForm => ({
  email: '',
  password: '',
  role: 'chapter_lead',
  chapter_id: chapterId,
  first_name: '',
  last_name: '',
  certification_level: 'CALC',
  certification_date: new Date().toISOString().slice(0, 10),
  city: '',
  specializations: '',
  languages: '',
  bio: ''
});

function formatRole(role: string) {
  return role.replace(/_/g, ' ').replace(/\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function parseList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export default function AdminUserManagement({ initialUsers, initialCoaches, chapters }: AdminUserManagementProps) {
  const [users, setUsers] = useState(initialUsers);
  const [coaches, setCoaches] = useState(initialCoaches);
  const [form, setForm] = useState<CreateUserForm>(defaultForm(chapters[0]?.id || ''));
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const chapterNameById = useMemo(() => new Map(chapters.map((chapter) => [chapter.id, chapter.name])), [chapters]);
  const selectedChapter = chapters.find((chapter) => chapter.id === form.chapter_id) || chapters[0];

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    setIsCreating(true);

    let createdUserId: string | null = null;

    try {
      const token = getClientAuthToken();
      if (!token) {
        throw new Error('Your session has expired. Please log in again.');
      }

      if (form.role === 'coach' && (!form.first_name.trim() || !form.last_name.trim())) {
        throw new Error('Coach first name and last name are required.');
      }

      const createdUser = await api.createUser(
        {
          email: form.email,
          password: form.password,
          role: form.role,
          chapter_id: form.chapter_id
        },
        token
      );
      createdUserId = createdUser.id;

      let createdCoach: BackendCoach | null = null;
      if (form.role === 'coach') {
        createdCoach = await api.createCoach(
          {
            user_id: createdUser.id,
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            email: createdUser.email,
            country: selectedChapter?.country || '',
            city: optionalString(form.city),
            certification_level: form.certification_level,
            certification_date: new Date(`${form.certification_date}T00:00:00`).toISOString(),
            is_active: true,
            bio: optionalString(form.bio),
            specializations: parseList(form.specializations),
            languages: parseList(form.languages),
            chapter_id: form.chapter_id
          },
          token
        );
      }

      setUsers((current) => [createdUser, ...current]);
      if (createdCoach) {
        setCoaches((current) => [createdCoach, ...current]);
        setCreateSuccess(`Created coach account and profile for ${createdCoach.first_name} ${createdCoach.last_name}.`);
      } else {
        setCreateSuccess(`Created ${createdUser.email}.`);
      }
      setForm(defaultForm(form.chapter_id || chapters[0]?.id || ''));
    } catch (error) {
      if (createdUserId) {
        try {
          const token = getClientAuthToken();
          if (token) {
            await api.deleteUser(createdUserId, token);
          }
        } catch {
          // Ignore rollback failures and show the original error.
        }
      }
      setCreateError(error instanceof Error ? error.message : 'Unable to create user.');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteUser(user: BackendUser) {
    const confirmed = window.confirm(`Delete ${user.email}?`);
    if (!confirmed) return;

    setDeleteError(null);
    setDeletingUserId(user.id);

    try {
      const token = getClientAuthToken();
      if (!token) {
        throw new Error('Your session has expired. Please log in again.');
      }

      await api.deleteUser(user.id, token);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setCoaches((current) => current.filter((item) => item.user_id !== user.id));
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Unable to delete user.');
    } finally {
      setDeletingUserId(null);
    }
  }

  return (
    <div className="grid gap-8">
      <Panel title="Create a user" description="Create chapter leaders, coaches, and content creators. Coach accounts now create the linked coach profile too, so they appear in the public directory and can use the coach portal immediately.">
        <form className="grid gap-4" onSubmit={handleCreateUser}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
            <input
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              type="email"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="new.user@wial.org"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Temporary password</span>
            <input
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              type="password"
              minLength={8}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="At least 8 characters"
              required
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
              <select
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as CreateUserForm['role'] }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              >
                <option value="chapter_lead">Chapter lead</option>
                <option value="coach">Coach</option>
                <option value="content_creator">Content creator</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Assigned chapter</span>
              <select
                value={form.chapter_id}
                onChange={(event) => setForm((current) => ({ ...current, chapter_id: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                required
              >
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {form.role === 'coach' ? (
            <div className="grid gap-4 rounded-[1.25rem] border border-slate-200 p-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-brand-navy">Coach profile details</p>
                <p className="mt-1 text-sm text-slate-600">This creates the public coach tile and enables the coach portal for the new account.</p>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">First name</span>
                <input
                  value={form.first_name}
                  onChange={(event) => setForm((current) => ({ ...current, first_name: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Last name</span>
                <input
                  value={form.last_name}
                  onChange={(event) => setForm((current) => ({ ...current, last_name: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Certification level</span>
                <select
                  value={form.certification_level}
                  onChange={(event) => setForm((current) => ({ ...current, certification_level: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                >
                  {certificationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Certification date</span>
                <input
                  value={form.certification_date}
                  onChange={(event) => setForm((current) => ({ ...current, certification_date: event.target.value }))}
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">City</span>
                <input
                  value={form.city}
                  onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  placeholder="City"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Country</span>
                <input value={selectedChapter?.country || ''} disabled className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">Specializations</span>
                <input
                  value={form.specializations}
                  onChange={(event) => setForm((current) => ({ ...current, specializations: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  placeholder="Leadership development, team effectiveness"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">Languages</span>
                <input
                  value={form.languages}
                  onChange={(event) => setForm((current) => ({ ...current, languages: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  placeholder="English, French"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">Bio</span>
                <textarea
                  value={form.bio}
                  onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                  className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                />
              </label>
            </div>
          ) : null}

          {createError ? <p className="text-sm text-red-600">{createError}</p> : null}
          {createSuccess ? <p className="text-sm text-emerald-700">{createSuccess}</p> : null}

          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating user...' : 'Create user'}
          </Button>
        </form>
      </Panel>

      <Panel title="Existing users" description="Delete users from the same console. Coach user deletion also removes the linked coach tile from the local admin view.">
        {deleteError ? <p className="mb-4 text-sm text-red-600">{deleteError}</p> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Chapter</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 align-top">
                  <td className="px-4 py-4 font-semibold text-brand-navy">{user.email}</td>
                  <td className="px-4 py-4 text-slate-600">{formatRole(user.role)}</td>
                  <td className="px-4 py-4 text-slate-600">{user.chapter_name || chapterNameById.get(user.chapter_id || '') || 'Global'}</td>
                  <td className="px-4 py-4 text-slate-600">{formatDate(user.created_at)}</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      className={buttonClassName()}
                      onClick={() => handleDeleteUser(user)}
                      disabled={deletingUserId === user.id}
                    >
                      {deletingUserId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Coach profiles" description="These tiles are what feed the public coach listings and the coach account area when each coach logs in.">
        {coaches.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {coaches.map((coach) => (
              <div key={coach.id} className="rounded-[1.25rem] border border-slate-200 p-4">
                <p className="font-semibold text-brand-navy">{coach.first_name} {coach.last_name}</p>
                <p className="mt-1 text-sm text-slate-600">{coach.certification_level} • {coach.city || coach.country}</p>
                <p className="mt-2 text-sm text-slate-600">{coach.email}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-teal">
                  {coach.is_active ? 'Visible publicly' : 'Hidden publicly'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">No coach profiles have been created yet.</p>
        )}
      </Panel>
    </div>
  );
}
