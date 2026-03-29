import { PageShell } from '@/components/layout/PageShell';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InfoCard } from '@/components/cards/InfoCard';
import { RichContent } from '@/components/content/RichContent';
import { buttonClassName } from '@/components/ui/button';
import { getGlobalPageContent, getGlobalResources } from '@/lib/server-data';

const GLOBAL_CHAPTER_DUES_URL = 'https://buy.stripe.com/test_4gM3co8HN6vqa4AaMy2cg02';
const GLOBAL_COACH_DUES_URL = 'https://buy.stripe.com/test_14A4gs0bh8DyekQ5se2cg00';

export default async function ResourcesPage() {
  const [resources, page] = await Promise.all([getGlobalResources(), getGlobalPageContent('resources')]);

  return (
    <PageShell>
      <SectionHeading
        eyebrow={page?.title || 'Resources'}
        title={page?.heroHeading || 'Programs, learning materials, and coach-development resources'}
        description={
          page?.introContent ||
          'WIAL points visitors to certification information, WIAL Talk, directory search, and other learning materials that help people explore Action Learning and connect with the community.'
        }
      />
      {page?.heroImageUrl ? (
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950">
          <img src={page.heroImageUrl} alt={page.title} className="max-h-[28rem] w-full object-cover" />
        </div>
      ) : null}
      {page?.bodyContent ? <RichContent content={page.bodyContent} className="mt-8" /> : null}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {resources.map((resource) => (
          <InfoCard key={resource.title} title={resource.title}>
            <p className="font-medium text-brand-teal">{resource.type}</p>
            <p>{resource.summary}</p>
            {resource.url ? (
              <a href={resource.url} className="mt-4 inline-flex text-sm font-semibold text-brand-navy hover:text-brand-teal dark:text-slate-100 dark:hover:text-brand-gold">
                Visit resource →
              </a>
            ) : null}
          </InfoCard>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <a href={GLOBAL_CHAPTER_DUES_URL} target="_blank" rel="noreferrer" className={buttonClassName()}>
          Pay Global Chapter Dues
        </a>
        <a href={GLOBAL_COACH_DUES_URL} target="_blank" rel="noreferrer" className={buttonClassName()}>
          Pay Global Coach Dues
        </a>
      </div>
    </PageShell>
  );
}
