import { ContentPage } from '@/components/sections/ContentPage';
import { getGlobalPageContent } from '@/lib/server-data';

export default async function AboutPage() {
  const page = await getGlobalPageContent('about');

  return (
    <ContentPage
      eyebrow={page?.title || 'About WIAL'}
      title={page?.heroHeading || 'A global Action Learning organization active across six continents'}
      intro={
        page?.introContent ||
        'WIAL describes its community as a global network of coaches, affiliates, partners, and chapter leaders brought together by a shared commitment to Action Learning.'
      }
      heroImageUrl={page?.heroImageUrl}
      bodyContent={page?.bodyContent}
      sections={[
        {
          title: 'Who WIAL is',
          body: 'The World Institute for Action Learning positions itself as the world’s leading certifying body for Action Learning, supporting coach development, chapter growth, and organizational application of the methodology.'
        },
        {
          title: 'A global community',
          body: 'WIAL says its members span six continents and many countries, bringing together varied industries, languages, and perspectives through a shared passion for Action Learning.'
        },
        {
          title: 'What the network includes',
          body: 'The broader WIAL ecosystem includes certified coaches, affiliates, partners, chapters, and organizations looking for practical ways to develop leaders, teams, and learning cultures.'
        },
        {
          title: 'Why organizations engage WIAL',
          body: 'WIAL connects Action Learning with breakthrough problem solving, high-performing teams, leadership development, learning organizations, and coach certification.'
        }
      ]}
      cta={{
        title: 'Explore the WIAL network',
        description: 'Move from the global story into certification, coach search, and chapter-level experiences.',
        primary: { label: 'View chapters', href: '/chapters' },
        secondary: { label: 'Explore certification', href: '/certification' }
      }}
    />
  );
}
