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
  createUser: (
    payload: { email: string; password: string; role: string; chapter_id: string },
    token: string
  ) => request<BackendUser>('/users', { method: 'POST', body: payload, token }),

  listChapters: (query?: { page?: number; page_size?: number; country?: string; region?: string; is_active?: boolean }) =>
    request<PaginatedResponse<BackendChapter>>('/chapters', { query }),
  getChapter: (id: string) => request<BackendChapter>(`/chapters/${id}`),
  createChapter: (payload: unknown, token: string) => request<BackendChapter>('/chapters', { method: 'POST', body: payload, token }),
  updateChapter: (id: string, payload: unknown, token: string) => request<BackendChapter>(`/chapters/${id}`, { method: 'PUT', body: payload, token }),
  patchChapter: (id: string, payload: unknown, token: string) => request<BackendChapter>(`/chapters/${id}`, { method: 'PATCH', body: payload, token }),
  patchChapterContent: (id: string, payload: unknown, token: string) =>
    request<BackendChapter>(`/chapters/${id}/content`, { method: 'PATCH', body: payload, token }),
  deleteChapter: (id: string, token: string) => request<void>(`/chapters/${id}`, { method: 'DELETE', token }),

  listCoaches: (query?: {
    page?: number;
    page_size?: number;
    chapter_id?: string;
    certification_level?: string;
    language?: string;
    specialization?: string;
  }) => request<PaginatedResponse<BackendCoach>>('/coaches', { query }),
  getCoach: (id: string) => request<BackendCoach>(`/coaches/${id}`),
  createCoach: (payload: unknown, token: string) => request<BackendCoach>('/coaches', { method: 'POST', body: payload, token }),

  listEvents: (query?: { page?: number; page_size?: number; chapter_id?: string; event_type?: string }) =>
    request<PaginatedResponse<BackendEvent>>('/events', { query }),
  createEvent: (payload: unknown, token: string) => request<BackendEvent>('/events', { method: 'POST', body: payload, token }),

  getPortalOverview: (token: string, chapterId?: string) =>
    request<PortalOverviewResponse>('/portal/overview', { token, query: { chapter_id: chapterId } }),
  getPortalChapter: (token: string, chapterId?: string) =>
    request<BackendChapter>('/portal/chapter', { token, query: { chapter_id: chapterId } }),

  coachSearch: (query: string) => request<{ query: string; results: BackendCoach[] }>('/ai/coach-search', { query: { query } }),
  generateChapter: (payload: { country: string; region?: string; primary_language?: string }) =>
    request<Record<string, unknown>>('/ai/generate-chapter', { method: 'POST', body: payload }),

  createCheckoutSession: (payload: { price_id?: string; success_url?: string; cancel_url?: string; quantity?: number }) =>
    request<{ url: string; session_id: string }>('/payments/create-session', { method: 'POST', body: payload })
};
