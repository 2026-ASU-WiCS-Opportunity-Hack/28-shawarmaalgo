import { ContentPage } from '@/components/sections/ContentPage';
import { getGlobalPageContent } from '@/lib/server-data';

export const revalidate = 3600;

export default async function CertificationPage() {
  const page = await getGlobalPageContent('certification');

  return (
    <ContentPage
      eyebrow={page?.title || 'Certification'}
      title={page?.heroHeading || 'A clear development path for WIAL Action Learning coaches'}
      intro={
        page?.introContent ||
        'WIAL’s certification journey spans Foundations of Action Learning and the CALC, PALC, SALC, and MALC levels, giving coaches a structured path for practice, contribution, and growth.'
      }
      sections={[
        {
          title: 'Foundations first',
          body: 'WIAL’s Foundations of Action Learning session is designed for potential coaches, sponsors, and organizational champions who want a deeper grounding in the methodology.'
        },
        {
          title: 'Four certification levels',
          body: 'The pathway includes Certified Action Learning Coach (CALC), Professional Action Learning Coach (PALC), Senior Action Learning Coach (SALC), and Master Action Learning Coach (MALC).'
        },
        {
          title: 'Progressive experience',
          body: 'WIAL describes each level as building on workshop participation, coaching practice, documented experience, contribution to the community, and observed capability.'
        },
        {
          title: 'Professional visibility',
          body: 'Certification connects coaches to the wider WIAL network, including chapter activity and public visibility through coach-directory experiences and chapter pages.'
        }
      ]}
      cta={{
        title: 'Explore certification and coach development',
        description: 'Use the public site to understand the pathway, discover coaches, and connect with a chapter for local programming and events.',
        primary: { label: 'Sign in', href: '/login' },
        secondary: { label: 'Browse coaches', href: '/coaches' }
      }}
    />
  );
}
