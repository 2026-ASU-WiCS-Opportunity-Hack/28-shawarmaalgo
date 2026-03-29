export type GlobalPageDefault = {
  slug: string;
  title: string;
  heroHeading: string;
  introContent: string;
  bodyContent: string;
  heroImageUrl?: string;
  status: string;
};

export const globalPageDefaults: GlobalPageDefault[] = [
  {
    slug: 'home',
    title: 'World Institute for Action Learning',
    heroHeading: 'The global home for Action Learning, certification, and coach discovery',
    introContent:
      'WIAL presents itself as the world’s leading certifying body for Action Learning, connecting chapters, certified coaches, and organizations using Action Learning to solve real problems.',
    bodyContent: `## A connected global network

WIAL brings together chapters, certified coaches, partners, and organizations that use Action Learning to solve real problems while developing leaders and teams.

## What visitors can do here

- Explore official chapter pages
- Find visible Action Learning coaches
- Discover upcoming events and programming
- Access certification and learning resources`,
    status: 'Published'
  },
  {
    slug: 'about',
    title: 'About WIAL',
    heroHeading: 'A global Action Learning organization active across six continents',
    introContent:
      'WIAL describes its community as a global network of coaches, affiliates, partners, and chapter leaders brought together by a shared commitment to Action Learning.',
    bodyContent: `## WIAL as an organization

The World Institute for Action Learning serves as a global home for Action Learning standards, coach development, and chapter collaboration.

## A shared mission

WIAL supports leaders, teams, and organizations that want practical learning experiences tied to real work, thoughtful questions, reflection, and action.

## Global reach

WIAL chapters and coaches help make Action Learning accessible across regions, industries, and languages while staying connected to one international network.`,
    status: 'Published'
  },
  {
    slug: 'certification',
    title: 'Certification',
    heroHeading: 'Certification and Action Learning guidance for coaches, sponsors, and chapter communities',
    introContent:
      'WIAL brings Action Learning methodology and coach certification into one pathway, from understanding the foundations to progressing through CALC, PALC, SALC, and MALC.',
    bodyContent: `## Why certification matters

Certification helps coaches demonstrate practice, preparation, and alignment with WIAL standards.

## The pathway

- CALC: Certified Action Learning Coach
- PALC: Professional Action Learning Coach
- SALC: Senior Action Learning Coach
- MALC: Master Action Learning Coach

## Learning and development

The certification journey is designed to support both people new to Action Learning and experienced practitioners who want to deepen their contribution to the field.`,
    status: 'Published'
  },
  {
    slug: 'resources',
    title: 'Resources',
    heroHeading: 'Programs, learning materials, and coach-development resources',
    introContent:
      'WIAL points visitors to certification information, WIAL Talk, directory search, and other learning materials that help people explore Action Learning and connect with the community.',
    bodyContent: `## Explore learning resources

Use this page to highlight official resources, certification information, chapter materials, and learning opportunities across the WIAL network.

## Common uses

- Point visitors to certification details
- Share recommended learning materials
- Highlight chapter-created resources
- Direct people to programs and public links`,
    status: 'Published'
  },
  {
    slug: 'contact',
    title: 'Contact',
    heroHeading: 'Connect with WIAL',
    introContent:
      'Reach WIAL for certification questions, chapter development, Action Learning programming, and general organizational inquiries.',
    bodyContent: '',
    status: 'Published'
  }
];

export function getGlobalPageDefault(slug: string) {
  return globalPageDefaults.find((page) => page.slug === slug) || null;
}
