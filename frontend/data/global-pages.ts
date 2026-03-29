export type GlobalPageDefault = {
  slug: string;
  title: string;
  heroHeading: string;
  introContent: string;
  status: string;
};

export const globalPageDefaults: GlobalPageDefault[] = [
  {
    slug: 'home',
    title: 'World Institute for Action Learning',
    heroHeading: 'The global home for Action Learning, certification, and coach discovery',
    introContent:
      'WIAL presents itself as the world’s leading certifying body for Action Learning, connecting chapters, certified coaches, and organizations using Action Learning to solve real problems.',
    status: 'Published'
  },
  {
    slug: 'about',
    title: 'About WIAL',
    heroHeading: 'A global Action Learning organization active across six continents',
    introContent:
      'WIAL describes its community as a global network of coaches, affiliates, partners, and chapter leaders brought together by a shared commitment to Action Learning.',
    status: 'Published'
  },
  {
    slug: 'certification',
    title: 'Certification',
    heroHeading: 'Certification and Action Learning guidance for coaches, sponsors, and chapter communities',
    introContent:
      'WIAL brings Action Learning methodology and coach certification into one pathway, from understanding the foundations to progressing through CALC, PALC, SALC, and MALC.',
    status: 'Published'
  },
  {
    slug: 'resources',
    title: 'Resources',
    heroHeading: 'Programs, learning materials, and coach-development resources',
    introContent:
      'WIAL points visitors to certification information, WIAL Talk, directory search, and other learning materials that help people explore Action Learning and connect with the community.',
    status: 'Published'
  },
  {
    slug: 'contact',
    title: 'Contact',
    heroHeading: 'Connect with WIAL',
    introContent:
      'Reach WIAL for certification questions, chapter development, Action Learning programming, and general organizational inquiries.',
    status: 'Published'
  }
];

export function getGlobalPageDefault(slug: string) {
  return globalPageDefaults.find((page) => page.slug === slug) || null;
}
