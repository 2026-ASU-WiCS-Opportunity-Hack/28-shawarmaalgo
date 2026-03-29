import { ContentPage } from '@/components/sections/ContentPage';
import { getGlobalPageContent } from '@/lib/server-data';

export const revalidate = 3600;

export default async function CertificationPage() {
  const page = await getGlobalPageContent('certification');

  return (
    <ContentPage
      eyebrow={page?.title || 'Certification'}
      title={page?.heroHeading || 'Certification and Action Learning guidance for coaches, sponsors, and chapter communities'}
      intro={
        page?.introContent ||
        'WIAL brings Action Learning methodology and coach certification into one pathway, from understanding the foundations to progressing through CALC, PALC, SALC, and MALC.'
      }
      sections={[
        {
          title: 'What Action Learning is',
          body: 'WIAL describes Action Learning as a disciplined process built around urgent, real problems, thoughtful questions, reflection, listening, and action that develops people while helping teams make progress.'
        },
        {
          title: 'Foundations first',
          body: 'The Foundations of Action Learning experience introduces the core components and ground rules of the method for potential coaches, sponsors, organizational champions, and leaders exploring how to use it well.'
        },
        {
          title: 'A structured certification pathway',
          body: 'Certification gives coaches a clear progression in capability, experience, and contribution while keeping practice aligned with WIAL standards across chapters and the broader network.'
        },
        {
          title: 'Four certification levels',
          body: 'The pathway includes Certified Action Learning Coach (CALC), Professional Action Learning Coach (PALC), Senior Action Learning Coach (SALC), and Master Action Learning Coach (MALC).'
        },
        {
          title: 'Progressive experience and contribution',
          body: 'WIAL positions each level as building on workshop participation, observed coaching, documented practice, continuing development, and meaningful contribution to the Action Learning community.'
        },
        {
          title: 'Professional visibility through the network',
          body: 'Certification supports public coach visibility, local chapter engagement, and clearer trust signals for organizations looking for qualified Action Learning coaches and related programming.'
        }
      ]}
      cta={{
        title: 'Explore certification and connect with the network',
        description: 'Browse coaches, find a chapter, or sign in to manage profiles and chapter activity across the WIAL platform.',
        primary: { label: 'Browse coaches', href: '/coaches' },
        secondary: { label: 'Sign in', href: '/login' }
      }}
    />
  );
}
