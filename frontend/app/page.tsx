import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Hero } from '@/components/sections/Hero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { homeStats, featuredBenefits, homeHighlights } from '@/data/content';
import { InfoCard } from '@/components/cards/InfoCard';
import { EventCard } from '@/components/cards/EventCard';
import { CtaBlock } from '@/components/sections/CtaBlock';
import { EmptyState } from '@/components/content/EmptyState';
import { RichContent } from '@/components/content/RichContent';
import { getChapters, getGlobalEvents, getGlobalPageContent, getGlobalResources } from '@/lib/server-data';

export const revalidate = 3600;

export default async function HomePage() {
  const [countries, globalEvents, resources, page] = await Promise.all([
    getChapters(),
    getGlobalEvents(),
    getGlobalResources(),
    getGlobalPageContent('home')
  ]);

  return (
    <PageShell>
      <Hero
        eyebrow={page?.title || 'World Institute for Action Learning'}
        title={page?.heroHeading || 'The global home for Action Learning, certification, and coach discovery'}
        description={
          page?.introContent ||
          'WIAL presents itself as the world’s leading certifying body for Action Learning, connecting chapters, certified coaches, and organizations using Action Learning to solve real problems.'
        }
        primaryCta={{ label: 'Explore chapters', href: '/chapters' }}
        secondaryCta={{ label: 'Find a coach', href: '/coaches' }}
      />

      {page?.heroImageUrl ? (
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950">
          <img src={page.heroImageUrl} alt={page.title} className="max-h-[28rem] w-full object-cover" />
        </div>
      ) : null}
      {page?.bodyContent ? <RichContent content={page.bodyContent} className="mt-8" /> : null}

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {homeStats.map((stat) => (
          <InfoCard key={stat.label} title={stat.value}>
            <p>{stat.label}</p>
          </InfoCard>
        ))}
      </section>

      <section className="mt-20">
        <SectionHeading
          eyebrow="Action Learning"
          title="A practical way to solve important problems while learning together"
          description="WIAL describes Action Learning as a way of thinking, doing business, and interacting in teams that helps people work on urgent and important challenges through questioning, reflection, listening, and action."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {homeHighlights.map((item) => (
            <InfoCard key={item.title} title={item.title}>
              <p>{item.body}</p>
            </InfoCard>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading
          eyebrow="Why WIAL"
          title="One shared platform for the global organization and every chapter"
          description="The global site remains the authoritative home for WIAL information while chapter leaders manage local coaches, events, resources, and contact details in dedicated chapter workspaces."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {featuredBenefits.map((item) => (
            <InfoCard key={item.title} title={item.title}>
              <p>{item.body}</p>
            </InfoCard>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading
          eyebrow="Chapters"
          title="Local chapter pages within one WIAL experience"
          description="Each chapter can publish local coaches, upcoming events, resources, and contact details while using the same shared global structure."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {countries.map((country) => (
            <article key={country.slug} className="rounded-[1.5rem] border border-slate-200 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal">{country.hero.eyebrow}</p>
              <h3 className="mt-3 text-2xl font-semibold text-brand-navy dark:text-white">{country.name}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">{country.overview}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
                <Link href={`/${country.slug}`} className="text-brand-navy hover:text-brand-teal dark:text-slate-100">
                  Visit chapter →
                </Link>
                <Link href={`/${country.slug}/coaches`} className="text-brand-navy hover:text-brand-teal dark:text-slate-100">
                  Local coaches →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="Events" title="Programming at both the global and chapter level" description="From introductory sessions to certification-related programming, WIAL pages can showcase both global and chapter activity in one place." />
        {globalEvents.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {globalEvents.map((event) => (
              <EventCard key={event.title} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState className="mt-8" title="No events at this time" description="Check back soon for upcoming WIAL and chapter programming." />
        )}
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="Resources" title="Certification, articles, guides, and WIAL learning materials" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <InfoCard key={resource.title} title={resource.title}>
              <p className="font-medium text-brand-teal">{resource.type}</p>
              <p>{resource.summary}</p>
              {'url' in resource && resource.url ? (
                <a href={resource.url} className="mt-4 inline-flex text-sm font-semibold text-brand-navy hover:text-brand-teal">
                  Visit resource →
                </a>
              ) : null}
            </InfoCard>
          ))}
        </div>
      </section>

      <div className="mt-20">
        <CtaBlock
          title="Explore chapters, coaches, and certification pathways"
          description="WIAL connects Action Learning practice, coach development, and chapter activity in one globally aligned experience."
          primary={{ label: 'Sign in', href: '/login' }}
          secondary={{ label: 'Explore chapters', href: '/chapters' }}
        />
      </div>
    </PageShell>
  );
}
