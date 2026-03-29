export type PortalRole = 'admin' | 'chapter-leader' | 'coach';

export const mockSession = {
  isAuthenticated: true,
  user: {
    id: 'usr_001',
    name: 'Humza Ahmed',
    email: 'humza@wial.org',
    role: 'admin' as PortalRole,
    chapterSlug: 'nigeria'
  }
};

export const adminOverview = {
  chapters: 3,
  activeCoaches: 48,
  upcomingEvents: 12,
  pendingApprovals: 6,
  pageUpdates: 4,
  chapterLeaders: 7
};

export const globalPages = [
  { slug: 'home', title: 'Home page', status: 'Published', lastUpdated: 'March 27, 2026' },
  { slug: 'about', title: 'About WIAL', status: 'Published', lastUpdated: 'March 25, 2026' },
  { slug: 'certification', title: 'Certification', status: 'Published', lastUpdated: 'March 22, 2026' },
  { slug: 'contact', title: 'Contact', status: 'Draft changes', lastUpdated: 'March 28, 2026' }
];

export const users = [
  { id: 'usr_001', name: 'Humza Ahmed', role: 'Admin', chapter: 'Global', status: 'Active' },
  { id: 'usr_002', name: 'Adaeze Okafor', role: 'Chapter Leader', chapter: 'Nigeria', status: 'Active' },
  { id: 'usr_003', name: 'Jordan Blake', role: 'Coach', chapter: 'USA', status: 'Active' },
  { id: 'usr_004', name: 'Ngozi Eze', role: 'Coach', chapter: 'Nigeria', status: 'Pending approval' }
];

export const coachAccount = {
  profile: {
    name: 'Ngozi Eze',
    email: 'ngozi.eze@example.com',
    chapter: 'Nigeria',
    certification: 'CALC',
    location: 'Port Harcourt, Nigeria',
    specialties: ['Emerging leaders', 'Team effectiveness', 'Facilitated reflection'],
    bio: 'Facilitates Action Learning experiences that improve communication, accountability, and performance.'
  },
  certification: {
    currentLevel: 'Certified Action Learning Coach (CALC)',
    renewalDue: 'January 15, 2027',
    continuingEducationCredits: 14,
    requiredCredits: 24,
    status: 'In good standing'
  }
};
