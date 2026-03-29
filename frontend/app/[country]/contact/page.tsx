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
        <section className="rounded-[1.5rem] border border-slate-200 p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-brand-navy">Local information</h3>
          <p className="mt-4 text-sm leading-7 text-slate-700">Email: {country.contact.email}</p>
          <p className="text-sm leading-7 text-slate-700">Phone: {country.contact.phone}</p>
          <p className="text-sm leading-7 text-slate-700">Location: {country.contact.city}</p>
        </section>
        <section className="rounded-[1.5rem] border border-slate-200 bg-brand-sand p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-brand-navy">Send a chapter inquiry</h3>
          <form className="mt-4 space-y-4">
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Your name" />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Your email" />
            <textarea className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="How can this chapter help?" />
            <button className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-ink">Send inquiry</button>
          </form>
        </section>
      </div>
    </PageShell>
  );
}
