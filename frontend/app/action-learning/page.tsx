import { ContentPage } from '@/components/sections/ContentPage';
import { getGlobalPageContent } from '@/lib/server-data';

export default async function ActionLearningPage() {
  const page = await getGlobalPageContent('action-learning');

  return (
    <ContentPage
      eyebrow={page?.title || 'Action Learning'}
      title={page?.heroHeading || 'A disciplined process for solving real problems while learning'}
      intro={
        page?.introContent ||
        'Across the WIAL global and Nigeria sites, Action Learning is described as a new way of thinking, doing business, and interacting in teams.'
      }
      sections={[
        {
          title: 'What it is',
          body: 'Action Learning tackles important real-world problems through insightful questioning, reflective listening, careful clarification, and action. Teams learn as they work on real issues rather than simulated exercises.'
        },
        {
          title: 'Why it matters',
          body: 'WIAL presents the method as a way to improve business performance, team effectiveness, leadership development, engagement, and organizational learning.'
        },
        {
          title: 'Who it is for',
          body: 'The approach is relevant for HR leaders, trainers, coaches, managers, and organizations that want better collaboration, stronger problem solving, and more effective leadership development.'
        },
        {
          title: 'How WIAL supports it',
          body: 'WIAL offers services in broad solution areas, chapter-led programming, coach certification, and a global network of certified professionals who can facilitate Action Learning experiences.'
        }
      ]}
      cta={{
        title: 'See how Action Learning shows up across the network',
        description: 'Explore coaches, certification pathways, and local chapter activity built around the same methodology.',
        primary: { label: 'Find a coach', href: '/coaches' },
        secondary: { label: 'View events', href: '/events' }
      }}
    />
  );
}
