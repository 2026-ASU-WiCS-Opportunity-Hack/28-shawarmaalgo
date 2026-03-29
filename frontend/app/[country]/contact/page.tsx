import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getChapter } from "@/lib/server-data";

export default async function CountryContactPage({ params }: { params: { country: string } }) {
  const country = await getChapter(params.country);
  if (!country) notFound();

  return (
    <PageShell>
      <SectionHeading eyebrow="Chapter contact" title={`Contact ${country.name}`} description="Use the local chapter contact route for chapter-specific inquiries, event questions, and chapter participation." />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-xl font-semibold text-brand-navy dark:text-white">Local information</h3>
          <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">Email: {country.contact.email}</p>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">Phone: {country.contact.phone}</p>
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">Location: {country.contact.city}</p>
          {country.contact.website ? <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">Website: {country.contact.website}</p> : null}
        </section>
        <section className="rounded-[1.5rem] border border-slate-200 bg-brand-sand p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold text-brand-navy dark:text-white">Send a chapter inquiry</h3>
          <form className="mt-4 space-y-4">
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" placeholder="Your name" />
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" placeholder="Your email" />
            <textarea className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" placeholder="How can this chapter help?" />
            <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink">Send inquiry</button>
          </form>
        </section>
      </div>
    </PageShell>
  );
}
