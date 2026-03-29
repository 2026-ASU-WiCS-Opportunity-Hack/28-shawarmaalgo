import { ContentPage } from '@/components/sections/ContentPage';
import { getGlobalPageContent } from '@/lib/server-data';

export default async function ActionLearningPage() {
  const page = await getGlobalPageContent('action-learning');

  return (
    <ContentPage
      eyebrow={page?.title || 'Action Learning'}
      title={page?.heroHeading || 'A disciplined way to solve real problems while developing people and teams'}
      intro={
        page?.introContent ||
        'WIAL explains Action Learning as a process built on questioning, reflection, listening, and action that helps individuals, teams, and organizations work on urgent and important challenges.'
      }
      sections={[
        {
          title: 'What it is',
          body: 'WIAL describes Action Learning as a way of thinking, doing business, and interacting in teams. People work on real problems rather than simulations, using questions and reflection to move toward action.'
        },
        {
          title: 'How it works',
          body: 'The Foundations of Action Learning program introduces the six components of Action Learning and the two ground rules that shape a disciplined team-learning process.'
        },
        {
          title: 'Who it helps',
          body: 'WIAL presents the method as useful for individuals, teams, and organizations, including potential coaches, organizational champions, sponsors, and leaders who want stronger collaboration and better problem solving.'
        },
        {
          title: 'Why it matters',
          body: 'Across WIAL’s materials, Action Learning is tied to leadership development, team effectiveness, learning organizations, and practical business impact through real-time work on urgent challenges.'
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
