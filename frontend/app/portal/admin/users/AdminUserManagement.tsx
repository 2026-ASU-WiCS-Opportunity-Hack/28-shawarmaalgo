'use client';

import { type FormEvent, useMemo, useState } from 'react';
import { Panel } from '@/components/portal/PortalCards';
import { Button, buttonClassName } from '@/components/ui/button';
import { type BackendUser, api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type ChapterOption = {
  id: string;
  name: string;
  slug: string;
};

type AdminUserManagementProps = {
  initialUsers: BackendUser[];
  chapters: ChapterOption[];
};

type CreateUserForm = {
  email: string;
  password: string;
  role: 'chapter_lead' | 'coach' | 'content_creator';
  chapter_id: string;
};

const defaultForm = (chapterId = ''): CreateUserForm => ({
  email: '',
  password: '',
  role: 'chapter_lead',
  chapter_id: chapterId
});

function formatRole(role: string) {
  return role.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
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

export default function AdminUserManagement({ initialUsers, chapters }: AdminUserManagementProps) {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState<CreateUserForm>(defaultForm(chapters[0]?.id || ''));
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const chapterNameById = useMemo(() => new Map(chapters.map((chapter) => [chapter.id, chapter.name])), [chapters]);

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    setIsCreating(true);

    try {
      const token = getClientAuthToken();
      if (!token) {
        throw new Error('Your session has expired. Please log in again.');
      }

      const createdUser = await api.createUser(form, token);
      setUsers((current) => [createdUser, ...current]);
      setCreateSuccess(`Created ${createdUser.email}.`);
      setForm(defaultForm(form.chapter_id || chapters[0]?.id || ''));
    } catch (error) {
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
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Unable to delete user.');
    } finally {
      setDeletingUserId(null);
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
      <Panel title="Create a user" description="This form is connected to the managed users API so admins can add chapter leaders, coaches, and content creators directly from the console.">
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

          {createError ? <p className="text-sm text-red-600">{createError}</p> : null}
          {createSuccess ? <p className="text-sm text-emerald-700">{createSuccess}</p> : null}

          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating user...' : 'Create user'}
          </Button>
        </form>
      </Panel>

      <Panel title="Existing users" description="Delete users from the same console. The table below is refreshed locally after each create or delete action.">
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
    </div>
  );
}
