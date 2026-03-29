'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { api } from '@/lib/api';
import { AUTH_COOKIE_NAME, ROLE_COOKIE_NAME } from '@/lib/auth-cookies';
import { getRoleDestination } from '@/lib/auth-routing';

type LoginFormProps = {
  isLoggedIn: boolean;
  portalHref: string | null;
};

const roles = [
  {
    title: 'Global admin',
    body: 'Manage shared pages, create and configure chapters, assign chapter leaders, and oversee users across the network.',
    href: '/portal/admin'
  },
  {
    title: 'Chapter leader',
    body: 'Update chapter content online, manage chapter coaches, publish resources, and maintain chapter event information.',
    href: '/portal/chapter'
  },
  {
    title: 'Coach',
    body: 'Maintain your public profile, review certification details, and manage your directory presence.',
    href: '/portal/coach'
  }
];

export default function LoginForm({ isLoggedIn, portalHref }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.login({ email, password });
      const destination = getRoleDestination(response.user.role) || '/portal';

      document.cookie = `${AUTH_COOKIE_NAME}=${response.token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      document.cookie = `${ROLE_COOKIE_NAME}=${response.user.role}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Account access"
        title={isLoggedIn ? 'You are signed in to the WIAL platform' : 'Log in to the WIAL platform'}
        description={
          isLoggedIn
            ? 'Open your portal to manage WIAL content and access, or log out when you are finished.'
            : 'Use your WIAL account to access the global admin console, chapter leader tools, or your coach profile and certification information.'
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          {isLoggedIn ? (
            <>
              <h2 className="text-2xl font-semibold text-brand-navy">You are already logged in</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                Use the portal button below to continue to your workspace. When you are done, you can log out from here or from inside the portal.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button href={portalHref || '/portal'} fullWidth>
                  Portal
                </Button>
                <LogoutButton fullWidth />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-brand-navy">Welcome back</h2>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                  <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="you@wial.org" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                  <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Enter your password" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-600">
                    <input type="checkbox" /> Keep me signed in
                  </label>
                  <Link href="/contact" className="font-medium text-brand-navy hover:text-brand-teal">Need help?</Link>
                </div>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <Button type="submit" disabled={loading} fullWidth>
                  {loading ? 'Logging in...' : 'Log in'}
                </Button>
              </form>
            </>
          )}
        </section>

        <section className="rounded-[1.75rem] bg-brand-sand p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-brand-navy">Role-based access</h2>
          <div className="mt-6 space-y-4">
            {roles.map((role) => (
              <article key={role.title} className="rounded-[1.25rem] border border-white bg-white p-5 shadow-soft">
                <h3 className="text-lg font-semibold text-brand-navy">{role.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{role.body}</p>
                {isLoggedIn ? (
                  <Link href={role.href} className="mt-4 inline-flex text-sm font-semibold text-brand-navy hover:text-brand-teal">
                    Open {role.title} console →
                  </Link>
                ) : (
                  <p className="mt-4 text-sm font-medium text-slate-500">Log in to view console links.</p>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
