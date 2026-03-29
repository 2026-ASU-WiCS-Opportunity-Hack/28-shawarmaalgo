export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  token?: string;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  page_size: number;
  total: number;
};

export type BackendUser = {
  id: string;
  email: string;
  role: 'super_admin' | 'chapter_lead' | 'coach' | 'content_creator' | string;
  chapter_id?: string | null;
  chapter_name?: string | null;
  created_at: string;
  updated_at: string;
};

export type BackendChapter = {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string;
  description?: string | null;
  description_local?: string | null;
  primary_language: string;
  supported_languages: string[];
  timezone: string;
  currency: string;
  contact_email: string;
  contact_phone?: string | null;
  contact_city?: string | null;
  website_url?: string | null;
  logo_url?: string | null;
  hero_image_url?: string | null;
  is_active: boolean;
  founded_year?: number | null;
  member_count?: number | null;
  created_at: string;
  updated_at: string;
};

export type BackendCoach = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  profile_image_url?: string | null;
  bio?: string | null;
  specializations: string[];
  languages: string[];
  country: string;
  city?: string | null;
  chapter_id?: string | null;
  chapter_name?: string | null;
  certification_level: string;
  certification_date: string;
  is_active: boolean;
  linkedin_url?: string | null;
  website_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type BackendEvent = {
  id: string;
  title: string;
  title_local?: string | null;
  description?: string | null;
  description_local?: string | null;
  event_type: string;
  start_date: string;
  end_date?: string | null;
  timezone: string;
  location_type: string;
  venue_name?: string | null;
  venue_address?: string | null;
  online_meeting_url?: string | null;
  chapter_id: string;
  chapter_name?: string | null;
  max_attendees?: number | null;
  current_attendees: number;
  price_amount?: number | null;
  price_currency?: string | null;
  is_free: boolean;
  registration_deadline?: string | null;
  status: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type BackendTeamMember = {
  id: string;
  chapter_id: string;
  name: string;
  role: string;
  blurb: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BackendResource = {
  id: string;
  chapter_id?: string | null;
  title: string;
  type: string;
  summary: string;
  url?: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};


export type BackendGlobalPage = {
  id: string;
  slug: string;
  title: string;
  hero_heading: string;
  intro_content: string;
  body_content: string;
  hero_image_url?: string | null;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BackendTestimonial = {
  id: string;
  author_name: string;
  author_title: string;
  author_company?: string | null;
  author_image_url?: string | null;
  content: string;
  rating?: number | null;
  chapter_id?: string | null;
  program_id?: string | null;
  created_at: string;
  updated_at: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: BackendUser;
};

export type MeResponse = {
  user: BackendUser;
  chapter?: BackendChapter | null;
  coach?: BackendCoach | null;
};

export type PortalOverviewResponse = {
  user: BackendUser;
  chapter: BackendChapter;
  stats: {
    coach_count: number;
    event_count: number;
  };
  recent_coaches: BackendCoach[];
  recent_events: BackendEvent[];
};

export type AdminPortalOverviewResponse = {
  chapters: number;
  active_coaches: number;
  upcoming_events: number;
  chapter_leaders: number;
};

export type ChapterListQuery = {
  page?: number;
  page_size?: number;
  region?: string;
  language?: string;
};

export type ChapterCreatePayload = {
  name: string;
  slug: string;
  country: string;
  region: string;
  description?: string;
  description_local?: string;
  primary_language: string;
  supported_languages: string[];
  timezone: string;
  currency: string;
  contact_email: string;
  contact_phone?: string;
  contact_city?: string;
  website_url?: string;
  logo_url?: string;
  hero_image_url?: string;
  is_active: boolean;
  founded_year?: number;
  member_count?: number;
};

export type ChapterUpdatePayload = ChapterCreatePayload;

export type CoachListQuery = {
  page?: number;
  page_size?: number;
  chapter_id?: string;
  certification_level?: string;
  language?: string;
  specialization?: string;
};

export type EventListQuery = {
  page?: number;
  page_size?: number;
  chapter_id?: string;
  event_type?: string;
};

export type UserListQuery = {
  chapter_id?: string;
};

export type TeamMemberListQuery = {
  chapter_id?: string;
};

export type ResourceListQuery = {
  chapter_id?: string;
};

export type TestimonialListQuery = {
  chapter_id?: string;
  program_id?: string;
};

export type UserPatchPayload = {
  email?: string;
  password?: string;
  role?: string;
  chapter_id?: string;
};

export type CoachPatchPayload = Partial<{
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_image_url: string;
  bio: string;
  specializations: string[];
  languages: string[];
  country: string;
  city: string;
  chapter_id: string;
  certification_level: string;
  certification_date: string;
  is_active: boolean;
  linkedin_url: string;
  website_url: string;
}>;

export type EventPatchPayload = Partial<{
  title: string;
  title_local: string;
  description: string;
  description_local: string;
  event_type: string;
  start_date: string;
  end_date: string;
  timezone: string;
  location_type: string;
  venue_name: string;
  venue_address: string;
  online_meeting_url: string;
  chapter_id: string;
  max_attendees: number;
  price_amount: number;
  price_currency: string;
  is_free: boolean;
  registration_deadline: string;
  status: string;
  image_url: string;
}>;

export type TeamMemberCreatePayload = {
  chapter_id: string;
  name: string;
  role: string;
  blurb: string;
  sort_order?: number;
};

export type TeamMemberPatchPayload = Partial<TeamMemberCreatePayload>;

export type ResourceCreatePayload = {
  chapter_id?: string;
  title: string;
  type: string;
  summary: string;
  url?: string;
  sort_order?: number;
};

export type ResourcePatchPayload = Partial<ResourceCreatePayload>;

export type TestimonialCreatePayload = {
  author_name: string;
  author_title: string;
  author_company?: string;
  author_image_url?: string;
  content: string;
  rating?: number;
  chapter_id?: string;
  program_id?: string;
};

export type TestimonialPatchPayload = Partial<TestimonialCreatePayload>;

export type AICoachSearchResponse = {
  data: BackendCoach[];
  total: number;
  note: string;
};

export type AIGenerateChapterPayload = {
  name: string;
  country: string;
};

export type AIGenerateChapterResponse = {
  description: string;
  description_local: string;
  suggested_region: string;
  primary_language: string;
  timezone: string;
};

export type CheckoutSessionPayload = {
  program_id: string;
  email: string;
};

export type CheckoutSessionResponse = {
  checkout_url: string;
  session_id: string;
};

export type ImageUploadResponse = {
  url: string;
  key: string;
  content_type: string;
  size: number;
};

function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    return (
      process.env.INTERNAL_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:8080/api/v1'
    );
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
}

export const API_BASE_URL = getApiBaseUrl();

function buildQueryString(query?: ApiRequestOptions['query']) {
  if (!query) return '';

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    params.set(key, String(value));
  }

  const search = params.toString();
  return search ? `?${search}` : '';
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, query, body, headers, ...init } = options;
  const response = await fetch(`${API_BASE_URL}${path}${buildQueryString(query)}`, {
    ...init,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store'
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload?.error) message = payload.error;
    } catch {
      // ignore JSON parse failures for non-JSON error bodies
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function uploadFile<T>(path: string, file: File, token: string): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
    cache: 'no-store'
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload?.error) message = payload.error;
    } catch {
      // ignore JSON parse failures for non-JSON error bodies
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const api = {
  health: async () => {
    const healthUrl = API_BASE_URL.endsWith('/api/v1')
      ? API_BASE_URL.slice(0, -'/api/v1'.length) + '/health'
      : `${API_BASE_URL}/health`;
    const response = await fetch(healthUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    return response.json() as Promise<{ status: string }>;
  },

  login: (payload: LoginPayload) => request<AuthResponse>('/auth/login', { method: 'POST', body: payload }),
  getMe: (token: string) => request<MeResponse>('/me', { token }),
  patchMyCoach: (payload: CoachPatchPayload, token: string) =>
    request<BackendCoach>('/me/coach', { method: 'PATCH', body: payload, token }),
  createUser: (
    payload: { email: string; password: string; role: string; chapter_id: string },
    token: string
  ) => request<BackendUser>('/users', { method: 'POST', body: payload, token }),
  listUsers: (token: string, query?: UserListQuery) => request<{ data: BackendUser[] }>('/users', { token, query }),
  getUser: (id: string, token: string) => request<BackendUser>(`/users/${id}`, { token }),
  patchUser: (id: string, payload: UserPatchPayload, token: string) =>
    request<BackendUser>(`/users/${id}`, { method: 'PATCH', body: payload, token }),
  deleteUser: (id: string, token: string) => request<void>(`/users/${id}`, { method: 'DELETE', token }),

  listChapters: (query?: ChapterListQuery) => request<PaginatedResponse<BackendChapter>>('/chapters', { query }),
  getChapter: (id: string) => request<BackendChapter>(`/chapters/${id}`),
  createChapter: (payload: ChapterCreatePayload, token: string) =>
    request<BackendChapter>('/chapters', { method: 'POST', body: payload, token }),
  updateChapter: (id: string, payload: ChapterUpdatePayload, token: string) =>
    request<BackendChapter>(`/chapters/${id}`, { method: 'PUT', body: payload, token }),
  patchChapter: (id: string, payload: unknown, token: string) => request<BackendChapter>(`/chapters/${id}`, { method: 'PATCH', body: payload, token }),
  patchChapterContent: (id: string, payload: unknown, token: string) =>
    request<BackendChapter>(`/chapters/${id}/content`, { method: 'PATCH', body: payload, token }),
  deleteChapter: (id: string, token: string) => request<void>(`/chapters/${id}`, { method: 'DELETE', token }),

  listCoaches: (query?: CoachListQuery) => request<PaginatedResponse<BackendCoach>>('/coaches', { query }),
  getCoach: (id: string) => request<BackendCoach>(`/coaches/${id}`),
  createCoach: (payload: unknown, token: string) => request<BackendCoach>('/coaches', { method: 'POST', body: payload, token }),
  patchCoach: (id: string, payload: CoachPatchPayload, token: string) =>
    request<BackendCoach>(`/coaches/${id}`, { method: 'PATCH', body: payload, token }),
  deleteCoach: (id: string, token: string) => request<void>(`/coaches/${id}`, { method: 'DELETE', token }),

  listEvents: (query?: EventListQuery) => request<PaginatedResponse<BackendEvent>>('/events', { query }),
  createEvent: (payload: unknown, token: string) => request<BackendEvent>('/events', { method: 'POST', body: payload, token }),
  patchEvent: (id: string, payload: EventPatchPayload, token: string) =>
    request<BackendEvent>(`/events/${id}`, { method: 'PATCH', body: payload, token }),
  deleteEvent: (id: string, token: string) => request<void>(`/events/${id}`, { method: 'DELETE', token }),

  listTeamMembers: (query?: TeamMemberListQuery) => request<{ data: BackendTeamMember[] }>('/team-members', { query }),
  getTeamMember: (id: string) => request<BackendTeamMember>(`/team-members/${id}`),
  createTeamMember: (payload: TeamMemberCreatePayload, token: string) =>
    request<BackendTeamMember>('/team-members', { method: 'POST', body: payload, token }),
  patchTeamMember: (id: string, payload: TeamMemberPatchPayload, token: string) =>
    request<BackendTeamMember>(`/team-members/${id}`, { method: 'PATCH', body: payload, token }),
  deleteTeamMember: (id: string, token: string) => request<void>(`/team-members/${id}`, { method: 'DELETE', token }),

  listResources: (query?: ResourceListQuery) => request<{ data: BackendResource[] }>('/resources', { query }),
  getResource: (id: string) => request<BackendResource>(`/resources/${id}`),
  createResource: (payload: ResourceCreatePayload, token: string) =>
    request<BackendResource>('/resources', { method: 'POST', body: payload, token }),
  patchResource: (id: string, payload: ResourcePatchPayload, token: string) =>
    request<BackendResource>(`/resources/${id}`, { method: 'PATCH', body: payload, token }),
  deleteResource: (id: string, token: string) => request<void>(`/resources/${id}`, { method: 'DELETE', token }),

  listTestimonials: (query?: TestimonialListQuery) =>
    request<{ data: BackendTestimonial[] }>('/testimonials', { query }),
  getTestimonial: (id: string) => request<BackendTestimonial>(`/testimonials/${id}`),
  createTestimonial: (payload: TestimonialCreatePayload, token: string) =>
    request<BackendTestimonial>('/testimonials', { method: 'POST', body: payload, token }),
  patchTestimonial: (id: string, payload: TestimonialPatchPayload, token: string) =>
    request<BackendTestimonial>(`/testimonials/${id}`, { method: 'PATCH', body: payload, token }),
  deleteTestimonial: (id: string, token: string) => request<void>(`/testimonials/${id}`, { method: 'DELETE', token }),

  getPortalOverview: (token: string, chapterId?: string) =>
    request<PortalOverviewResponse | AdminPortalOverviewResponse>('/portal/overview', { token, query: { chapter_id: chapterId } }),
  getPortalChapter: (token: string, chapterId?: string) =>
    request<BackendChapter>('/portal/chapter', { token, query: { chapter_id: chapterId } }),


  listGlobalPages: () => request<{ data: BackendGlobalPage[] }>('/global-pages'),
  getGlobalPage: (slug: string) => request<BackendGlobalPage>(`/global-pages/${slug}`),
  patchGlobalPage: (
    slug: string,
    payload: Partial<Pick<BackendGlobalPage, 'title' | 'hero_heading' | 'intro_content' | 'body_content' | 'hero_image_url' | 'status'>>,
    token: string
  ) => request<BackendGlobalPage>(`/global-pages/${slug}`, { method: 'PATCH', body: payload, token }),
  uploadImage: (file: File, token: string) => uploadFile<ImageUploadResponse>('/uploads/images', file, token),

  coachSearch: (query: string) => request<AICoachSearchResponse>('/ai/coach-search', { query: { query } }),
  generateChapter: (payload: AIGenerateChapterPayload) =>
    request<AIGenerateChapterResponse>('/ai/generate-chapter', { method: 'POST', body: payload }),

  createCheckoutSession: (payload: CheckoutSessionPayload) =>
    request<CheckoutSessionResponse>('/payments/create-session', { method: 'POST', body: payload })
};
