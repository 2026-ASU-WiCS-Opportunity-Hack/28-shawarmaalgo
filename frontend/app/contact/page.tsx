import { PageShell } from '@/components/layout/PageShell';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/data/site';
import { getGlobalPageContent } from '@/lib/server-data';

export const revalidate = 3600;

export default async function ContactPage() {
  const page = await getGlobalPageContent('contact');

  return (
    <PageShell>
      <SectionHeading
        eyebrow={page?.title || 'Contact'}
        title={page?.heroHeading || 'Get in touch with WIAL'}
        description={
          page?.introContent ||
          'Connect with the World Institute for Action Learning for chapter inquiries, Action Learning questions, certification information, and general organizational contact.'
        }
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-xl font-semibold text-brand-navy dark:text-white">Global contact</h3>
          <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">Email: {site.contact.email}</p>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">Address: {site.contact.address}</p>
        </section>
        <section className="rounded-[1.5rem] border border-slate-200 bg-brand-sand p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold text-brand-navy dark:text-white">Message WIAL</h3>
          <form className="mt-4 space-y-4">
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" placeholder="Your name" />
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" placeholder="Your email" />
            <textarea className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" placeholder="How can we help?" />
            <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink">Send message</button>
          </form>
        </section>
      </div>
    </PageShell>
  );
}
