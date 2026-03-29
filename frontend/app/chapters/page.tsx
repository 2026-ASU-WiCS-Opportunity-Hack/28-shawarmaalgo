import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { chapterBenefits } from '@/data/content';
import { getChapters } from '@/lib/server-data';

export const revalidate = 3600;

export default async function ChaptersPage() {
  const countries = await getChapters();

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Chapters"
        title="WIAL chapters around the world"
        description="WIAL chapters help people connect Action Learning to local relationships, regional programming, and chapter-based coach visibility while staying connected to the wider global organization."
      />

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        {chapterBenefits.map((benefit) => (
          <div key={benefit} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-700 shadow-soft">
            {benefit}
          </div>
        ))}
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        {countries.map((country) => (
          <article key={country.slug} className="rounded-[1.5rem] border border-slate-200 p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal">{country.contact.city}</p>
            <h3 className="mt-2 text-2xl font-semibold text-brand-navy">{country.name}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-700">{country.overview}</p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
              <Link href={`/${country.slug}`} className="text-brand-navy hover:text-brand-teal">
                Overview →
              </Link>
              <Link href={`/${country.slug}/coaches`} className="text-brand-navy hover:text-brand-teal">
                Coaches →
              </Link>
              <Link href={`/${country.slug}/events`} className="text-brand-navy hover:text-brand-teal">
                Events →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
