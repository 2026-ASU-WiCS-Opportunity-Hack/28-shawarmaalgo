import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/sections/Hero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeStats, featuredBenefits, homeHighlights } from "@/data/content";
import { InfoCard } from "@/components/cards/InfoCard";
import { EventCard } from "@/components/cards/EventCard";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { getChapters, getGlobalEvents, getGlobalResources } from "@/lib/server-data";

export const revalidate = 3600;

export default async function HomePage() {
  const countries = await getChapters();
  const globalEvents = await getGlobalEvents();
  const resources = await getGlobalResources();

  return (
    <PageShell>
      <Hero
        eyebrow="World Institute for Action Learning"
        title="Developing leaders and organizations through Action Learning"
        description="WIAL advances Action Learning worldwide through certification, coaching, chapter development, and practical support for organizations solving real challenges."
        primaryCta={{ label: "Explore chapters", href: "/chapters" }}
        secondaryCta={{ label: "Find a coach", href: "/coaches" }}
      />

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
          description="WIAL presents Action Learning as a disciplined process built on questioning, reflection, listening, and action in service of real organizational challenges."
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
          description="The global site stays authoritative while chapter leaders manage local coaches, events, resources, and chapter contact details in dedicated content areas."
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
            <article key={country.slug} className="rounded-[1.5rem] border border-slate-200 p-6 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal">{country.hero.eyebrow}</p>
              <h3 className="mt-3 text-2xl font-semibold text-brand-navy">{country.name}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{country.overview}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
                <Link href={`/${country.slug}`} className="text-brand-navy hover:text-brand-teal">
                  Visit chapter →
                </Link>
                <Link href={`/${country.slug}/coaches`} className="text-brand-navy hover:text-brand-teal">
                  Local coaches →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="Events" title="Programming at both the global and chapter level" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {globalEvents.map((event) => (
            <EventCard key={event.title} event={event} />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="Resources" title="Certification, articles, guides, and chapter-ready content" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <InfoCard key={resource.title} title={resource.title}>
              <p className="font-medium text-brand-teal">{resource.type}</p>
              <p>{resource.summary}</p>
            </InfoCard>
          ))}
        </div>
      </section>

      <div className="mt-20">
        <CtaBlock
          title="Explore chapters, coaches, and certification pathways"
          description="WIAL connects Action Learning practice, coach development, and chapter activity in one globally aligned experience."
          primary={{ label: "Sign in", href: "/login" }}
          secondary={{ label: "Explore chapters", href: "/chapters" }}
        />
      </div>
    </PageShell>
  );
}
