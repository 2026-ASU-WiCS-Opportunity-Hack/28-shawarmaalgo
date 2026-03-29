import { countries, getCountryBySlug, type Coach as UICoach, type CountryPageData } from '@/data/countries';
import { adminOverview, coachAccount, globalPages, mockSession, users } from '@/data/portal';
import { resources, globalEvents } from '@/data/content';
import {
  api,
  type AdminPortalOverviewResponse,
  type BackendChapter,
  type BackendCoach,
  type BackendEvent,
  type BackendResource,
  type BackendTeamMember,
  type BackendTestimonial,
  type BackendUser
} from '@/lib/api';
import { getServerAuthToken } from '@/lib/auth';

async function safeFetch<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await loader();
  } catch {
    return fallback;
  }
}

function formatDate(value?: string | null) {
  if (!value) return 'Date to be announced';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date to be announced';
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}

function mapCoachToUI(coach: BackendCoach): UICoach {
  return {
    name: `${coach.first_name} ${coach.last_name}`.trim(),
    certification: (coach.certification_level || 'CALC') as UICoach['certification'],
    location: [coach.city, coach.country].filter(Boolean).join(', ') || coach.country,
    focus: coach.specializations.join(', ') || 'Action Learning coaching',
    bio: coach.bio || 'Certified WIAL coach.'
  };
}

function mapEventToUI(event: BackendEvent) {
  const location =
    event.location_type === 'online'
      ? 'Virtual'
      : event.venue_name || event.venue_address || event.chapter_name || 'Location to be announced';

  return {
    title: event.title,
    date: formatDate(event.start_date),
    location,
    summary: event.description || `${event.event_type} event${event.chapter_name ? ` from ${event.chapter_name}` : ''}.`
  };
}

function mapTeamMemberToUI(member: BackendTeamMember) {
  return {
    name: member.name,
    role: member.role,
    blurb: member.blurb
  };
}

function mapResourceToUI(resource: BackendResource) {
  return {
    title: resource.title,
    type: resource.type,
    summary: resource.summary
  };
}

function mapTestimonialToUI(testimonial: BackendTestimonial) {
  return {
    quote: testimonial.content,
    name: testimonial.author_name,
    role: [testimonial.author_title, testimonial.author_company].filter(Boolean).join(', ') || testimonial.author_title
  };
}

function mapUserToUI(user: BackendUser) {
  return {
    id: user.id,
    name: user.email,
    role: user.role.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    chapter: user.chapter_name || 'Global',
    status: 'Active'
  };
}

function mapChapterToCountryPage(chapter: BackendChapter, fallback?: CountryPageData): CountryPageData {
  return {
    slug: chapter.slug,
    name: chapter.name,
    shortName: fallback?.shortName || chapter.country,
    hero: {
      eyebrow: 'Official WIAL chapter',
      title: fallback?.hero.title || `${chapter.name} chapter`,
      description:
        chapter.description ||
        fallback?.hero.description ||
        `Explore coaching, chapter events, and local WIAL information for ${chapter.country}.`
    },
    overview:
      chapter.description ||
      fallback?.overview ||
      `${chapter.name} is part of the WIAL network serving ${chapter.country}.`,
    contact: {
      email: chapter.contact_email,
      phone: chapter.contact_phone || fallback?.contact.phone || 'Contact chapter directly',
      city: chapter.contact_city || fallback?.contact.city || chapter.country
    },
    team: fallback?.team || [],
    coaches: fallback?.coaches || [],
    events: fallback?.events || [],
    resources: fallback?.resources || [],
    testimonials: fallback?.testimonials || []
  };
}

async function getChapterRecord(slug: string) {
  const chapterList = await safeFetch(async () => (await api.listChapters({ page_size: 100 })).data, [] as BackendChapter[]);
  return chapterList.find((item) => item.slug === slug);
}

async function loadChapterPageData(chapter: BackendChapter, fallback?: CountryPageData) {
  return safeFetch(async () => {
    const [teamResponse, resourceResponse, testimonialResponse] = await Promise.all([
      api.listTeamMembers({ chapter_id: chapter.id }),
      api.listResources({ chapter_id: chapter.id }),
      api.listTestimonials({ chapter_id: chapter.id })
    ]);

    const page = mapChapterToCountryPage(chapter, fallback);
    return {
      ...page,
      team: teamResponse.data.length > 0 ? teamResponse.data.map(mapTeamMemberToUI) : page.team,
      resources: resourceResponse.data.length > 0 ? resourceResponse.data.map(mapResourceToUI) : page.resources,
      testimonials:
        testimonialResponse.data.length > 0 ? testimonialResponse.data.map(mapTestimonialToUI) : page.testimonials
    };
  }, mapChapterToCountryPage(chapter, fallback));
}

function mapSessionFromMe(me: Awaited<ReturnType<typeof api.getMe>>) {
  return {
    isAuthenticated: true,
    user: {
      id: me.user.id,
      name: me.user.email,
      email: me.user.email,
      role: me.user.role,
      chapterSlug: me.chapter?.slug || null
    }
  };
}

function buildFallbackPortalWorkspace() {
  const fallbackSlug = mockSession.user.chapterSlug;
  const fallbackChapter = (fallbackSlug && getCountryBySlug(fallbackSlug)) || countries[0];

  return {
    session: mockSession,
    chapter: fallbackChapter,
    stats: {
      coachCount: fallbackChapter?.coaches.length || 0,
      eventCount: fallbackChapter?.events.length || 0
    },
    recentCoaches: fallbackChapter?.coaches.slice(0, 5) || [],
    recentEvents: fallbackChapter?.events.slice(0, 5) || []
  };
}

function isAdminPortalOverviewResponse(
  overview: Awaited<ReturnType<typeof api.getPortalOverview>>
): overview is AdminPortalOverviewResponse {
  return 'chapters' in overview;
}

function isChapterPortalOverviewResponse(
  overview: Awaited<ReturnType<typeof api.getPortalOverview>>
): overview is Exclude<Awaited<ReturnType<typeof api.getPortalOverview>>, AdminPortalOverviewResponse> {
  return 'stats' in overview;
}

export async function getChapters() {
  return safeFetch(async () => {
    const response = await api.listChapters({ page_size: 100 });
    return response.data.map((chapter) => mapChapterToCountryPage(chapter, getCountryBySlug(chapter.slug)));
  }, countries);
}

export async function getChapter(slug: string) {
  const fallback = getCountryBySlug(slug);
  const chapter = await getChapterRecord(slug);
  if (!chapter) return fallback;
  return loadChapterPageData(chapter, fallback);
}

export async function getCountryCoaches(slug: string) {
  const chapter = await getChapterRecord(slug);
  if (!chapter) return getCountryBySlug(slug)?.coaches || [];

  return safeFetch(async () => {
    const response = await api.listCoaches({ page_size: 100, chapter_id: chapter.id });
    return response.data.map(mapCoachToUI);
  }, getCountryBySlug(slug)?.coaches || []);
}

export async function getCoachDirectory() {
  return safeFetch(async () => {
    const response = await api.listCoaches({ page_size: 100 });
    return response.data.map((coach) => ({ ...mapCoachToUI(coach), country: coach.chapter_name || coach.country }));
  }, countries.flatMap((country) => country.coaches.map((coach) => ({ ...coach, country: country.shortName }))));
}

export async function getCountryEvents(slug: string) {
  const chapter = await getChapterRecord(slug);
  if (!chapter) return getCountryBySlug(slug)?.events || [];

  return safeFetch(async () => {
    const response = await api.listEvents({ page_size: 100, chapter_id: chapter.id });
    return response.data.map(mapEventToUI);
  }, getCountryBySlug(slug)?.events || []);
}

export async function getGlobalEvents() {
  return safeFetch(async () => {
    const response = await api.listEvents({ page_size: 100 });
    return response.data.map(mapEventToUI);
  }, globalEvents);
}

export async function getPortalSession() {
  const token = getServerAuthToken();
  if (!token) return mockSession;

  return safeFetch(async () => mapSessionFromMe(await api.getMe(token)), mockSession);
}

export async function getPortalChapterWorkspace() {
  const token = getServerAuthToken();
  const fallback = buildFallbackPortalWorkspace();

  if (!token) return fallback;

  return safeFetch(async () => {
    const me = await api.getMe(token);
    const chapterId = me.user.role === 'super_admin' ? me.chapter?.id : undefined;

    if (me.user.role === 'super_admin' && !chapterId) {
      throw new Error('chapter_id is required');
    }

    const [chapterResponse, overview] = await Promise.all([
      api.getPortalChapter(token, chapterId),
      api.getPortalOverview(token, chapterId)
    ]);

    if (!isChapterPortalOverviewResponse(overview)) {
      throw new Error('expected chapter portal overview');
    }

    return {
      session: mapSessionFromMe(me),
      chapter: mapChapterToCountryPage(chapterResponse, getCountryBySlug(chapterResponse.slug)),
      stats: {
        coachCount: overview.stats.coach_count,
        eventCount: overview.stats.event_count
      },
      recentCoaches: overview.recent_coaches.map(mapCoachToUI),
      recentEvents: overview.recent_events.map(mapEventToUI)
    };
  }, fallback);
}

export async function getAdminOverview() {
  const token = getServerAuthToken();
  if (!token) return adminOverview;

  return safeFetch(async () => {
    const me = await api.getMe(token);
    if (me.user.role !== 'super_admin') {
      return adminOverview;
    }

    const overview = await api.getPortalOverview(token);
    if (!isAdminPortalOverviewResponse(overview)) {
      throw new Error('expected admin portal overview');
    }

    return {
      chapters: overview.chapters,
      activeCoaches: overview.active_coaches,
      upcomingEvents: overview.upcoming_events,
      chapterLeaders: overview.chapter_leaders
    };
  }, adminOverview);
}

export async function getGlobalPages() {
  return globalPages;
}

export async function getUsers() {
  const token = getServerAuthToken();
  if (!token) return users;

  return safeFetch(async () => (await api.listUsers(token)).data.map(mapUserToUI), users);
}

export async function getCoachAccount() {
  const token = getServerAuthToken();
  if (!token) return coachAccount;

  return safeFetch(async () => {
    const me = await api.getMe(token);
    return {
      profile: {
        name: me.user.email,
        email: me.user.email,
        chapter: me.chapter?.name || 'Unassigned',
        certification: 'Coach',
        location: me.chapter?.country || 'N/A',
        specialties: [],
        bio: 'Profile fields can be extended when backend coach profile endpoints are added.'
      },
      certification: coachAccount.certification
    };
  }, coachAccount);
}

export async function getGlobalResources() {
  return safeFetch(async () => (await api.listResources()).data.map(mapResourceToUI), resources);
}
