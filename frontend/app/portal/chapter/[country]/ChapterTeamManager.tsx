'use client';

import { type FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button, buttonClassName } from '@/components/ui/button';
import { Panel } from '@/components/portal/PortalCards';
import { type BackendChapter, type BackendCoach, type BackendTeamMember, type BackendUser, api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type ChapterTeamManagerProps = {
  chapter: BackendChapter;
  initialTeamMembers: BackendTeamMember[];
  initialUsers: BackendUser[];
  initialCoaches: BackendCoach[];
};

type TeamMemberForm = {
  name: string;
  role: string;
  blurb: string;
  sort_order: string;
};

type ChapterLeaderForm = {
  email: string;
  password: string;
};

type CoachCreateForm = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  certification_level: string;
  certification_date: string;
  city: string;
  country: string;
  specializations: string;
  languages: string;
  bio: string;
};

const inputClassName = 'w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm';
const labelClassName = 'mb-2 block text-sm font-medium text-slate-700';
const certificationLevels = ['CALC', 'PALC', 'SALC', 'MALC'];

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function parseStringList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function teamMemberForm(member?: BackendTeamMember): TeamMemberForm {
  return {
    name: member?.name || '',
    role: member?.role || 'Chapter leader',
    blurb: member?.blurb || '',
    sort_order: typeof member?.sort_order === 'number' ? String(member.sort_order) : '0'
  };
}

function defaultCoachForm(country: string): CoachCreateForm {
  return {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    certification_level: 'CALC',
    certification_date: new Date().toISOString().slice(0, 10),
    city: '',
    country,
    specializations: '',
    languages: '',
    bio: ''
  };
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export default function ChapterTeamManager({
  chapter,
  initialTeamMembers,
  initialUsers,
  initialCoaches
}: ChapterTeamManagerProps) {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [users, setUsers] = useState(initialUsers);
  const [coaches, setCoaches] = useState(initialCoaches);
  const [memberDrafts, setMemberDrafts] = useState<Record<string, TeamMemberForm>>(
    Object.fromEntries(initialTeamMembers.map((member) => [member.id, teamMemberForm(member)]))
  );
  const [newMember, setNewMember] = useState<TeamMemberForm>(teamMemberForm());
  const [teamError, setTeamError] = useState<string | null>(null);
  const [teamSuccess, setTeamSuccess] = useState<string | null>(null);
  const [savingMemberId, setSavingMemberId] = useState<string | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [creatingMember, setCreatingMember] = useState(false);

  const [leaderForm, setLeaderForm] = useState<ChapterLeaderForm>({ email: '', password: '' });
  const [leaderError, setLeaderError] = useState<string | null>(null);
  const [leaderSuccess, setLeaderSuccess] = useState<string | null>(null);
  const [creatingLeader, setCreatingLeader] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const [coachForm, setCoachForm] = useState<CoachCreateForm>(() => defaultCoachForm(chapter.country));
  const [coachError, setCoachError] = useState<string | null>(null);
  const [coachSuccess, setCoachSuccess] = useState<string | null>(null);
  const [creatingCoach, setCreatingCoach] = useState(false);

  const chapterLeaders = useMemo(
    () => users.filter((user) => user.role === 'chapter_lead' && user.chapter_id === chapter.id),
    [users, chapter.id]
  );

  async function withToken<T>(action: (token: string) => Promise<T>) {
    const token = getClientAuthToken();
    if (!token) {
      throw new Error('Your session has expired. Please log in again.');
    }
    return action(token);
  }

  async function handleSaveMember(memberId: string) {
    const form = memberDrafts[memberId];
    if (!form) return;

    setTeamError(null);
    setTeamSuccess(null);
    setSavingMemberId(memberId);

    try {
      const updated = await withToken((token) =>
        api.patchTeamMember(
          memberId,
          {
            name: form.name.trim(),
            role: form.role.trim(),
            blurb: form.blurb.trim(),
            sort_order: Number.parseInt(form.sort_order, 10) || 0
          },
          token
        )
      );
      setTeamMembers((current) => current.map((member) => (member.id === updated.id ? updated : member)));
      setMemberDrafts((current) => ({ ...current, [updated.id]: teamMemberForm(updated) }));
      setTeamSuccess(`Saved ${updated.name}.`);
    } catch (error) {
      setTeamError(error instanceof Error ? error.message : 'Unable to save team member.');
    } finally {
      setSavingMemberId(null);
    }
  }

  async function handleDeleteMember(memberId: string) {
    const member = teamMembers.find((item) => item.id === memberId);
    if (!member) return;
    const confirmed = window.confirm(`Delete ${member.name} from the public chapter team page?`);
    if (!confirmed) return;

    setTeamError(null);
    setTeamSuccess(null);
    setDeletingMemberId(memberId);

    try {
      await withToken((token) => api.deleteTeamMember(memberId, token));
      setTeamMembers((current) => current.filter((memberItem) => memberItem.id !== memberId));
      setMemberDrafts((current) => {
        const next = { ...current };
        delete next[memberId];
        return next;
      });
      setTeamSuccess(`Deleted ${member.name}.`);
    } catch (error) {
      setTeamError(error instanceof Error ? error.message : 'Unable to delete team member.');
    } finally {
      setDeletingMemberId(null);
    }
  }

  async function handleCreateMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTeamError(null);
    setTeamSuccess(null);
    setCreatingMember(true);

    try {
      const created = await withToken((token) =>
        api.createTeamMember(
          {
            chapter_id: chapter.id,
            name: newMember.name.trim(),
            role: newMember.role.trim(),
            blurb: newMember.blurb.trim(),
            sort_order: Number.parseInt(newMember.sort_order, 10) || 0
          },
          token
        )
      );
      setTeamMembers((current) => [...current, created].sort((a, b) => a.sort_order - b.sort_order));
      setMemberDrafts((current) => ({ ...current, [created.id]: teamMemberForm(created) }));
      setNewMember(teamMemberForm());
      setTeamSuccess(`Added ${created.name} to the public chapter team page.`);
    } catch (error) {
      setTeamError(error instanceof Error ? error.message : 'Unable to create team member.');
    } finally {
      setCreatingMember(false);
    }
  }

  async function handleCreateLeader(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLeaderError(null);
    setLeaderSuccess(null);
    setCreatingLeader(true);

    try {
      const created = await withToken((token) =>
        api.createUser(
          {
            email: leaderForm.email.trim(),
            password: leaderForm.password,
            role: 'chapter_lead',
            chapter_id: chapter.id
          },
          token
        )
      );
      setUsers((current) => [created, ...current]);
      setLeaderForm({ email: '', password: '' });
      setLeaderSuccess(`Added ${created.email} as a chapter leader.`);
    } catch (error) {
      setLeaderError(error instanceof Error ? error.message : 'Unable to create chapter leader.');
    } finally {
      setCreatingLeader(false);
    }
  }

  async function handleDeleteUser(user: BackendUser) {
    const confirmed = window.confirm(`Delete ${user.email}?`);
    if (!confirmed) return;

    setLeaderError(null);
    setLeaderSuccess(null);
    setDeletingUserId(user.id);

    try {
      await withToken((token) => api.deleteUser(user.id, token));
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setLeaderSuccess(`Deleted ${user.email}.`);
    } catch (error) {
      setLeaderError(error instanceof Error ? error.message : 'Unable to delete user.');
    } finally {
      setDeletingUserId(null);
    }
  }

  async function handleCreateCoach(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCoachError(null);
    setCoachSuccess(null);
    setCreatingCoach(true);

    let createdUserId: string | null = null;

    try {
      const createdUser = await withToken((token) =>
        api.createUser(
          {
            email: coachForm.email.trim(),
            password: coachForm.password,
            role: 'coach',
            chapter_id: chapter.id
          },
          token
        )
      );
      createdUserId = createdUser.id;

      const createdCoach = await withToken((token) =>
        api.createCoach(
          {
            user_id: createdUser.id,
            first_name: coachForm.first_name.trim(),
            last_name: coachForm.last_name.trim(),
            email: createdUser.email,
            country: coachForm.country.trim(),
            city: optionalString(coachForm.city),
            certification_level: coachForm.certification_level.trim(),
            certification_date: new Date(`${coachForm.certification_date}T00:00:00`).toISOString(),
            is_active: true,
            bio: optionalString(coachForm.bio),
            specializations: parseStringList(coachForm.specializations),
            languages: parseStringList(coachForm.languages),
            chapter_id: chapter.id
          },
          token
        )
      );

      setUsers((current) => [createdUser, ...current]);
      setCoaches((current) => [createdCoach, ...current]);
      setCoachForm(defaultCoachForm(chapter.country));
      setCoachSuccess(`Created coach profile for ${createdCoach.first_name} ${createdCoach.last_name}.`);
    } catch (error) {
      if (createdUserId) {
        try {
          await withToken((token) => api.deleteUser(createdUserId, token));
        } catch {
          // Ignore rollback failures and show the original error below.
        }
      }
      setCoachError(error instanceof Error ? error.message : 'Unable to create coach.');
    } finally {
      setCreatingCoach(false);
    }
  }

  return (
    <div className="grid gap-8">
      <Panel title="Public chapter team page" description="Manage the leadership cards shown on the public chapter team page.">
        <div className="grid gap-6 xl:grid-cols-2">
          {teamMembers.map((member) => {
            const form = memberDrafts[member.id] || teamMemberForm(member);
            return (
              <div key={member.id} className="rounded-[1.25rem] border border-slate-200 p-4">
                <div className="grid gap-4">
                  <label className="block">
                    <span className={labelClassName}>Name</span>
                    <input
                      className={inputClassName}
                      value={form.name}
                      onChange={(event) =>
                        setMemberDrafts((current) => ({
                          ...current,
                          [member.id]: { ...form, name: event.target.value }
                        }))
                      }
                    />
                  </label>
                  <label className="block">
                    <span className={labelClassName}>Role</span>
                    <input
                      className={inputClassName}
                      value={form.role}
                      onChange={(event) =>
                        setMemberDrafts((current) => ({
                          ...current,
                          [member.id]: { ...form, role: event.target.value }
                        }))
                      }
                    />
                  </label>
                  <label className="block">
                    <span className={labelClassName}>Profile summary</span>
                    <textarea
                      className={`${inputClassName} min-h-32`}
                      value={form.blurb}
                      onChange={(event) =>
                        setMemberDrafts((current) => ({
                          ...current,
                          [member.id]: { ...form, blurb: event.target.value }
                        }))
                      }
                    />
                  </label>
                  <label className="block">
                    <span className={labelClassName}>Sort order</span>
                    <input
                      className={inputClassName}
                      value={form.sort_order}
                      onChange={(event) =>
                        setMemberDrafts((current) => ({
                          ...current,
                          [member.id]: { ...form, sort_order: event.target.value }
                        }))
                      }
                    />
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <Button type="button" onClick={() => handleSaveMember(member.id)} disabled={savingMemberId === member.id}>
                      {savingMemberId === member.id ? 'Saving...' : 'Save member'}
                    </Button>
                    <Button type="button" onClick={() => handleDeleteMember(member.id)} disabled={deletingMemberId === member.id}>
                      {deletingMemberId === member.id ? 'Deleting...' : 'Delete member'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <form className="mt-6 grid gap-4 rounded-[1.25rem] border border-dashed border-slate-300 p-4" onSubmit={handleCreateMember}>
          <h3 className="text-lg font-semibold text-brand-navy">Add a public team card</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={labelClassName}>Name</span>
              <input className={inputClassName} value={newMember.name} onChange={(event) => setNewMember((current) => ({ ...current, name: event.target.value }))} required />
            </label>
            <label className="block">
              <span className={labelClassName}>Role</span>
              <input className={inputClassName} value={newMember.role} onChange={(event) => setNewMember((current) => ({ ...current, role: event.target.value }))} required />
            </label>
          </div>
          <label className="block">
            <span className={labelClassName}>Profile summary</span>
            <textarea className={`${inputClassName} min-h-32`} value={newMember.blurb} onChange={(event) => setNewMember((current) => ({ ...current, blurb: event.target.value }))} required />
          </label>
          <label className="block md:max-w-xs">
            <span className={labelClassName}>Sort order</span>
            <input className={inputClassName} value={newMember.sort_order} onChange={(event) => setNewMember((current) => ({ ...current, sort_order: event.target.value }))} />
          </label>
          {teamError ? <p className="text-sm text-red-600">{teamError}</p> : null}
          {teamSuccess ? <p className="text-sm text-emerald-700">{teamSuccess}</p> : null}
          <div>
            <Button type="submit" disabled={creatingMember}>{creatingMember ? 'Adding member...' : 'Add team member'}</Button>
          </div>
        </form>
      </Panel>

      <div className="grid gap-8 xl:grid-cols-2">
        <Panel title="Assign chapter leaders" description="Create additional chapter leader logins for this chapter.">
          <form className="grid gap-4" onSubmit={handleCreateLeader}>
            <label className="block">
              <span className={labelClassName}>Email address</span>
              <input className={inputClassName} type="email" value={leaderForm.email} onChange={(event) => setLeaderForm((current) => ({ ...current, email: event.target.value }))} required />
            </label>
            <label className="block">
              <span className={labelClassName}>Temporary password</span>
              <input className={inputClassName} type="password" minLength={8} value={leaderForm.password} onChange={(event) => setLeaderForm((current) => ({ ...current, password: event.target.value }))} required />
            </label>
            {leaderError ? <p className="text-sm text-red-600">{leaderError}</p> : null}
            {leaderSuccess ? <p className="text-sm text-emerald-700">{leaderSuccess}</p> : null}
            <div>
              <Button type="submit" disabled={creatingLeader}>{creatingLeader ? 'Creating leader...' : 'Add chapter leader'}</Button>
            </div>
          </form>

          <div className="mt-6 space-y-3">
            {chapterLeaders.map((leader) => (
              <div key={leader.id} className="rounded-[1.25rem] border border-slate-200 p-4">
                <p className="font-semibold text-brand-navy">{leader.email}</p>
                <p className="mt-1 text-sm text-slate-600">Chapter leader • Added {formatDate(leader.created_at)}</p>
                <button
                  type="button"
                  className={`${buttonClassName()} mt-4`}
                  onClick={() => handleDeleteUser(leader)}
                  disabled={deletingUserId === leader.id}
                >
                  {deletingUserId === leader.id ? 'Deleting...' : 'Delete leader'}
                </button>
              </div>
            ))}
            {chapterLeaders.length === 0 ? <p className="text-sm text-slate-600">No additional chapter leaders have been assigned yet.</p> : null}
          </div>
        </Panel>

        <Panel title="Create coaches under this chapter" description="Create a coach login and coach profile in one flow. Created coaches appear on the public chapter coaches page.">
          <form className="grid gap-4" onSubmit={handleCreateCoach}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className={labelClassName}>Email address</span>
                <input className={inputClassName} type="email" value={coachForm.email} onChange={(event) => setCoachForm((current) => ({ ...current, email: event.target.value }))} required />
              </label>
              <label className="block">
                <span className={labelClassName}>Temporary password</span>
                <input className={inputClassName} type="password" minLength={8} value={coachForm.password} onChange={(event) => setCoachForm((current) => ({ ...current, password: event.target.value }))} required />
              </label>
              <label className="block">
                <span className={labelClassName}>First name</span>
                <input className={inputClassName} value={coachForm.first_name} onChange={(event) => setCoachForm((current) => ({ ...current, first_name: event.target.value }))} required />
              </label>
              <label className="block">
                <span className={labelClassName}>Last name</span>
                <input className={inputClassName} value={coachForm.last_name} onChange={(event) => setCoachForm((current) => ({ ...current, last_name: event.target.value }))} required />
              </label>
              <label className="block">
                <span className={labelClassName}>Certification level</span>
                <select className={inputClassName} value={coachForm.certification_level} onChange={(event) => setCoachForm((current) => ({ ...current, certification_level: event.target.value }))} required>
                  {certificationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelClassName}>Certification date</span>
                <input className={inputClassName} type="date" value={coachForm.certification_date} onChange={(event) => setCoachForm((current) => ({ ...current, certification_date: event.target.value }))} required />
              </label>
              <label className="block">
                <span className={labelClassName}>Country</span>
                <input className={inputClassName} value={coachForm.country} onChange={(event) => setCoachForm((current) => ({ ...current, country: event.target.value }))} required />
              </label>
              <label className="block">
                <span className={labelClassName}>City</span>
                <input className={inputClassName} value={coachForm.city} onChange={(event) => setCoachForm((current) => ({ ...current, city: event.target.value }))} />
              </label>
              <label className="block md:col-span-2">
                <span className={labelClassName}>Specializations</span>
                <input className={inputClassName} value={coachForm.specializations} onChange={(event) => setCoachForm((current) => ({ ...current, specializations: event.target.value }))} placeholder="Leadership development, team effectiveness" />
              </label>
              <label className="block md:col-span-2">
                <span className={labelClassName}>Languages</span>
                <input className={inputClassName} value={coachForm.languages} onChange={(event) => setCoachForm((current) => ({ ...current, languages: event.target.value }))} placeholder="English, French" />
              </label>
            </div>
            <label className="block">
              <span className={labelClassName}>Bio</span>
              <textarea className={`${inputClassName} min-h-32`} value={coachForm.bio} onChange={(event) => setCoachForm((current) => ({ ...current, bio: event.target.value }))} />
            </label>
            {coachError ? <p className="text-sm text-red-600">{coachError}</p> : null}
            {coachSuccess ? <p className="text-sm text-emerald-700">{coachSuccess}</p> : null}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={creatingCoach}>{creatingCoach ? 'Creating coach...' : 'Create coach'}</Button>
              <Link href={`/portal/chapter/${chapter.slug}/coaches`} className={buttonClassName()}>
                Manage coach profiles
              </Link>
            </div>
          </form>

          <div className="mt-6 space-y-3">
            {coaches.slice(0, 5).map((coach) => (
              <div key={coach.id} className="rounded-[1.25rem] border border-slate-200 p-4">
                <p className="font-semibold text-brand-navy">{coach.first_name} {coach.last_name}</p>
                <p className="mt-1 text-sm text-slate-600">{coach.certification_level} • {coach.city || coach.country}</p>
              </div>
            ))}
            {coaches.length === 0 ? <p className="text-sm text-slate-600">No coaches have been created for this chapter yet.</p> : null}
          </div>
        </Panel>
      </div>
    </div>
  );
}
