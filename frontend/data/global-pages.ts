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
    heroHeading: 'Developing leaders and organizations through Action Learning',
    introContent:
      'WIAL advances Action Learning worldwide through certification, coaching, chapter development, and practical support for organizations solving real challenges.',
    status: 'Published'
  },
  {
    slug: 'about',
    title: 'About WIAL',
    heroHeading: 'A global nonprofit network advancing Action Learning',
    introContent:
      "WIAL describes itself as the world's leading certifying body for Action Learning and a rapidly growing international nonprofit supported by affiliates around the world.",
    status: 'Published'
  },
  {
    slug: 'action-learning',
    title: 'Action Learning',
    heroHeading: 'A disciplined process for solving real problems while learning',
    introContent:
      'Across the WIAL global and Nigeria sites, Action Learning is described as a new way of thinking, doing business, and interacting in teams.',
    status: 'Published'
  },
  {
    slug: 'certification',
    title: 'Certification',
    heroHeading: 'A four-level certification pathway for Action Learning coaches',
    introContent:
      'WIAL explains that organizations increasingly want Action Learning programs led by trained coaches and offers four certification levels with increasing education, coaching practice, and contribution requirements.',
    status: 'Published'
  },
  {
    slug: 'resources',
    title: 'Resources',
    heroHeading: 'Library, articles, and chapter-ready materials',
    introContent:
      "WIAL's global site points visitors toward its library, WIAL Talk content, endorsed products, and educational materials. This route gives those materials a clean home in the new platform.",
    status: 'Published'
  },
  {
    slug: 'contact',
    title: 'Contact',
    heroHeading: 'Get in touch with WIAL',
    introContent:
      'Connect with the World Institute for Action Learning for chapter inquiries, Action Learning questions, certification information, and general organizational contact.',
    status: 'Published'
  }
];

export function getGlobalPageDefault(slug: string) {
  return globalPageDefaults.find((page) => page.slug === slug) || null;
}
