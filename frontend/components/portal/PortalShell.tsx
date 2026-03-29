import type { ReactNode } from 'react';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';

export function PortalShell({
  eyebrow,
  title,
  description,
  chapterSlug,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  chapterSlug?: string | null;
  children: ReactNode;
}) {
  const sections = [
    {
      title: 'Admin',
      links: [
        { label: 'Overview', href: '/portal/admin' },
        { label: 'Chapters', href: '/portal/admin/chapters' },
        { label: 'Global pages', href: '/portal/admin/pages' },
        { label: 'Users', href: '/portal/admin/users' }
      ]
    },
    {
      title: 'Chapter leader',
      links: [
        { label: 'Workspace', href: '/portal/chapter' },
        ...(chapterSlug
          ? [
              { label: 'Content', href: `/portal/chapter/${chapterSlug}/content` },
              { label: 'Team', href: `/portal/chapter/${chapterSlug}/team` },
              { label: 'Coaches', href: `/portal/chapter/${chapterSlug}/coaches` },
              { label: 'Events', href: `/portal/chapter/${chapterSlug}/events` },
              { label: 'Resources', href: `/portal/chapter/${chapterSlug}/resources` },
              { label: 'Contact', href: `/portal/chapter/${chapterSlug}/contact` }
            ]
          : [])
      ]
    },
    {
      title: 'Coach',
      links: [{ label: 'My account', href: '/portal/coach' }]
    }
  ];

  return (
    <div className="container-shell py-10 sm:py-12">
      <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-teal">Portal</p>
          <h2 className="mt-2 text-xl font-semibold text-brand-navy">Management console</h2>
          <div className="mt-6 space-y-6">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-brand-navy">{section.title}</h3>
                <div className="mt-2 grid gap-1">
                  {section.links.map((link) => (
                    <Link key={link.href} href={link.href} className="rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-brand-sand hover:text-brand-navy">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <LogoutButton fullWidth className="mt-6" />
        </aside>
        <section>
          <div className="rounded-[1.75rem] bg-brand-navy px-6 py-8 text-white shadow-soft sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">{eyebrow}</p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-100 sm:text-base">{description}</p>
              </div>
            </div>
          </div>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </div>
  );
}
